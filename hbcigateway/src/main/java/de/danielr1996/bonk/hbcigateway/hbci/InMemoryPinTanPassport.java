package de.danielr1996.bonk.hbcigateway.hbci;

import org.kapott.hbci.callback.HBCICallback;
import org.kapott.hbci.exceptions.HBCI_Exception;
import org.kapott.hbci.manager.*;
import org.kapott.hbci.passport.AbstractPinTanPassport;

import java.util.Properties;
import java.util.StringTokenizer;

public class InMemoryPinTanPassport extends AbstractPinTanPassport implements AutoCloseable{
    public InMemoryPinTanPassport() {
        super(null);
        String header = "client.passport.PinTan.";
        setCertFile(HBCIUtils.getParam(header + "certfile"));
        setCheckCert(HBCIUtils.getParam(header + "checkcert", "1").equals("1"));
        setProxy(HBCIUtils.getParam(header + "proxy", ""));
        setProxyUser(HBCIUtils.getParam(header + "proxyuser", ""));
        setProxyPass(HBCIUtils.getParam(header + "proxypass", ""));

        boolean init = HBCIUtils.getParam(header + "init", "1").equals("1");
        if (init) {
            this.read();
            if (askForMissingData(true, true, true, true, true, true, true))
                saveChanges();
        }
    }

    protected void read() {
    }

    @Override
    public void saveChanges() {
    }

    @Override
    public byte[] sign(byte[] data) {
        try {
            // TODO: wenn die eingegebene PIN falsch war, muss die irgendwie
            // resettet werden, damit wieder danach gefragt wird
            if (getPIN() == null) {
                StringBuffer s = new StringBuffer();

                HBCIUtilsInternal.getCallback().callback(this,
                        HBCICallback.NEED_PT_PIN,
                        HBCIUtilsInternal.getLocMsg("CALLB_NEED_PTPIN"),
                        HBCICallback.TYPE_SECRET,
                        s);
                if (s.length() == 0) {
                    throw new HBCI_Exception(HBCIUtilsInternal.getLocMsg("EXCMSG_PINZERO"));
                }
                setPIN(s.toString());
                LogFilter.getInstance().addSecretData(getPIN(), "X", LogFilter.FILTER_SECRETS);
            }

            String tan = "";

            // tan darf nur beim einschrittverfahren oder bei
            // PV=1 und passport.contains(challenge)           und tan-pflichtiger auftrag oder bei
            // PV=2 und passport.contains(challenge+reference) und HKTAN
            // ermittelt werden

            String pintanMethod = getCurrentTANMethod(false);

            if (pintanMethod.equals(TanMethod.ONESTEP.getId())) {
                // nur beim normalen einschritt-verfahren muss anhand der segment-
                // codes ermittelt werden, ob eine tan benötigt wird
                HBCIUtils.log("onestep method - checking GVs to decide whether or not we need a TAN", HBCIUtils.LOG_DEBUG);

                // segment-codes durchlaufen
                String codes = collectSegCodes(new String(data, "ISO-8859-1"));
                StringTokenizer tok = new StringTokenizer(codes, "|");

                while (tok.hasMoreTokens()) {
                    String code = tok.nextToken();
                    String info = getPinTanInfo(code);

                    if (info.equals("J")) {
                        // für dieses segment wird eine tan benötigt
                        HBCIUtils.log("the job with the code " + code + " needs a TAN", HBCIUtils.LOG_DEBUG);

                        if (tan.length() == 0) {
                            // noch keine tan bekannt --> callback

                            StringBuffer s = new StringBuffer();
                            try {
                                HBCIUtilsInternal.getCallback().callback(this,
                                        HBCICallback.NEED_PT_TAN,
                                        HBCIUtilsInternal.getLocMsg("CALLB_NEED_PTTAN"),
                                        HBCICallback.TYPE_TEXT,
                                        s);
                            } catch (HBCI_Exception e) {
                                throw e;
                            } catch (Exception e) {
                                throw new HBCI_Exception(e);
                            }
                            if (s.length() == 0) {
                                throw new HBCI_Exception(HBCIUtilsInternal.getLocMsg("EXCMSG_TANZERO"));
                            }
                            tan = s.toString();
                        } else {
                            HBCIUtils.log("there should be only one job that needs a TAN!", HBCIUtils.LOG_WARN);
                        }

                    } else if (info.equals("N")) {
                        HBCIUtils.log("the job with the code " + code + " does not need a TAN", HBCIUtils.LOG_DEBUG);

                    } else if (info.length() == 0) {
                        // TODO: ist das hier dann nicht ein A-Segment? In dem Fall
                        // wäre diese Warnung überflüssig
                        HBCIUtils.log("the job with the code " + code + " seems not to be allowed with PIN/TAN", HBCIUtils.LOG_WARN);
                    }
                }
            } else {

                HBCIUtils.log("twostep method - checking passport(challenge) to decide whether or not we need a TAN", HBCIUtils.LOG_DEBUG);
                Properties secmechInfo = getCurrentSecMechInfo();

                String haveSCA = (String) getPersistentData(KEY_PD_SCA);
                setPersistentData(KEY_PD_SCA, null);

                // gespeicherte challenge aus passport holen
                String challenge = (String) getPersistentData(KEY_PD_CHALLENGE);
                setPersistentData(KEY_PD_CHALLENGE, null);

                if (haveSCA != null) {
                    HBCIUtils.log("will not sign with a TAN, found status code 3076, no SCA required", HBCIUtils.LOG_DEBUG);
                } else if (challenge == null) // manche Banken senden auch "nochallenge" *facepalm*
                {
                    // es gibt noch keine challenge
                    HBCIUtils.log("will not sign with a TAN, because there is no challenge", HBCIUtils.LOG_DEBUG);
                } else {
                    HBCIUtils.log("found challenge in passport, so we ask for a TAN", HBCIUtils.LOG_DEBUG);

                    // willuhn 2011-05-27 Wir versuchen, den Flickercode zu ermitteln und zu parsen
                    String hhduc = (String) getPersistentData(KEY_PD_HHDUC);
                    setPersistentData(KEY_PD_HHDUC, null); // gleich wieder aus dem Passport loeschen

                    HHDVersion hhd = HHDVersion.find(secmechInfo);
                    HBCIUtils.log("detected HHD version: " + hhd, HBCIUtils.LOG_DEBUG);

                    final StringBuffer payload = new StringBuffer();
                    final String msg = secmechInfo.getProperty("name") + "\n" + secmechInfo.getProperty("inputinfo") + "\n\n" + challenge;

                    int callback = HBCICallback.NEED_PT_TAN;

                    // Um sicherzustellen, dass wird keinen falschen Callback ausloesen, weil wir die HHD-Version
                    // eventuell falsch erkannt haben, versuchen wir bei PhotoTAN und QR-Code zusaetzlich, die Daten
                    // zu parsen. Nur wenn sie korrekt geparst werden koennen, verwenden wir auch den spezifischen Callback
                    if (hhd.getType() == HHDVersion.Type.PHOTOTAN && (MatrixCode.tryParse(hhduc) != null)) {
                        // Bei PhotoTAN haengen wir ungeparst das HHDuc an. Das kann dann auf
                        // Anwendungsseite per MatrixCode geparst werden
                        payload.append(hhduc);
                        callback = HBCICallback.NEED_PT_PHOTOTAN;
                    } else if (hhd.getType() == HHDVersion.Type.QRCODE && (QRCode.tryParse(hhduc, msg) != null)) {
                        // Bei QR-Code haengen wir ungeparst das HHDuc an. Das kann dann auf
                        // Anwendungsseite per QRCode geparst werden
                        payload.append(hhduc);
                        callback = HBCICallback.NEED_PT_QRTAN;
                    } else {
                        FlickerCode flicker = FlickerCode.tryParse(hhd, challenge, hhduc);
                        if (flicker != null) {
                            // Bei chipTAN liefern wir den bereits geparsten und gerenderten Flickercode
                            payload.append(flicker.render());
                        }
                    }

                    // Callback durchfuehren
                    HBCIUtilsInternal.getCallback().callback(this, callback, msg, HBCICallback.TYPE_TEXT, payload);

                    setPersistentData("externalid", null); // External-ID aus Passport entfernen
                    if (payload == null || payload.length() == 0) {
                        throw new HBCI_Exception(HBCIUtilsInternal.getLocMsg("EXCMSG_TANZERO"));
                    }
                    tan = payload.toString();
                }
            }
            if (tan.length() != 0) {
                LogFilter.getInstance().addSecretData(tan, "X", LogFilter.FILTER_SECRETS);
            }

            return (getPIN() + "|" + tan).getBytes("ISO-8859-1");
        } catch (Exception ex) {
            throw new HBCI_Exception("*** signing failed", ex);
        }
    }

    public byte[][] encrypt(byte[] plainMsg) {
        try {
            int padLength = plainMsg[plainMsg.length - 1];
            byte[] encrypted = new String(plainMsg, 0, plainMsg.length - padLength, "ISO-8859-1").getBytes("ISO-8859-1");
            return new byte[][]{new byte[8], encrypted};
        } catch (Exception ex) {
            throw new HBCI_Exception("*** encrypting message failed", ex);
        }
    }

    public byte[] decrypt(byte[] cryptedKey, byte[] cryptedMsg) {
        try {
            return new String(new String(cryptedMsg, "ISO-8859-1") + '\001').getBytes("ISO-8859-1");
        } catch (Exception ex) {
            throw new HBCI_Exception("*** decrypting of message failed", ex);
        }
    }

    @Override
    public void resetPassphrase() {
    }

    @Override
    public boolean verify(byte[] data, byte[] sig) {
        return true;
    }

    @Override
    public byte[] hash(byte[] data) {
        return data;
    }
}
