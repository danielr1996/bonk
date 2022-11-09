package de.danielr1996.bonk.hbcigateway.hbci;

import org.kapott.hbci.GV.HBCIJob;
import org.kapott.hbci.GV_Result.GVRKUms;
import org.kapott.hbci.manager.HBCIHandler;
import org.kapott.hbci.manager.HBCIUtils;
import org.kapott.hbci.manager.HBCIVersion;
import org.kapott.hbci.status.HBCIExecStatus;

import java.util.List;
import java.util.Properties;

public class HBCIClient {
    private final String BLZ;
    private final String ACCOUNTNUMBER;

    private final String NUMBER;
    private final String PIN;

    private final String BIC;

    private final String IBAN;

    private final String COUNTRY = "DE";

    private final String REQUESTID;

    public HBCIClient(String blz, String accountnumber, String number, String pin, String bic, String iban, String requestId) {
        this.BLZ = blz;
        this.ACCOUNTNUMBER = accountnumber;
        this.NUMBER = number;
        this.PIN = pin;
        this.BIC = bic;
        this.IBAN = iban;
        this.REQUESTID = requestId;
        HBCIUtils.init(new Properties(), new HBCICallback(blz, accountnumber, pin, requestId));
        HBCIUtils.setParam("client.passport.default", "PinTan"); // Legt als Verfahren PIN/TAN fest.
    }

    public List<GVRKUms.UmsLine> getStatements() throws Exception {
        try (InMemoryPinTanPassport pp = new InMemoryPinTanPassport(); ClosableHBCIHandlerWrapper hh = new ClosableHBCIHandlerWrapper(new HBCIHandler(HBCIVersion.HBCI_300.getId(), pp))) {
            pp.setCountry(this.COUNTRY);
            pp.setHost(HBCIUtils.getBankInfo(this.BLZ).getPinTanAddress());
            pp.setPort(443);
            pp.setFilterType("Base64");
            HBCIJob umsatzJob = hh.getHandle().newJob("KUmsAllCamt");
            umsatzJob.setParam("my.bic", BIC);
            umsatzJob.setParam("my.iban", IBAN);
            umsatzJob.addToQueue();
            HBCIExecStatus status = hh.getHandle().execute();
            if (!status.isOK()) {
                System.err.println(status);
                System.exit(1);
            }
            GVRKUms result = (GVRKUms) umsatzJob.getJobResult();
            if (!result.isOK()) {
                System.err.println(result);
                System.exit(1);
            }
            return result.getFlatData();
        }
    }
}
