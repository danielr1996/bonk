package de.danielr1996.bonk.hbcigateway.hbci;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.kapott.hbci.callback.AbstractHBCICallback;
import org.kapott.hbci.passport.HBCIPassport;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CountDownLatch;

public class HBCICallback extends AbstractHBCICallback {
    private final String BLZ;
    private final String ACCOUNTNUMBER;
    private final String PIN;
    private final String REQUESTID;

    public HBCICallback(String blz, String accountnumber, String pin, String requestid){
        this.BLZ = blz;
        this.ACCOUNTNUMBER = accountnumber;
        this.PIN = pin;
        this.REQUESTID = requestid;
    }

    public void callback(HBCIPassport passport, int reason, String msg, int datatype, StringBuffer retData) {
        switch (reason) {
            case NEED_PASSPHRASE_LOAD, NEED_PASSPHRASE_SAVE, NEED_PT_PIN ->
                    retData.replace(0, retData.length(), PIN);
            case NEED_BLZ -> retData.replace(0, retData.length(), BLZ);
            case NEED_USERID, NEED_CUSTOMERID -> retData.replace(0, retData.length(), ACCOUNTNUMBER);
            case NEED_PT_SECMECH -> retData.replace(0, retData.length(), "code");
            case NEED_PT_TANMEDIA -> retData.replace(0, retData.length(), retData.toString());
            case NEED_PT_TAN -> {
                try {
                    IMqttClient publisher = new MqttClient(System.getenv("BONK_MQTT_URL"),System.getenv("BONK_MQTT_ID"));
                    publisher.connect();
                    TanRequest tanRequest = TanRequest.builder().id(this.REQUESTID).build();
                    System.out.println("=> "+tanRequest);
                    MqttMessage mqttMessage = new MqttMessage(new ObjectMapper().writeValueAsBytes(tanRequest));
                    mqttMessage.setQos(2);
                    publisher.publish("tanrequest",mqttMessage);
                    CountDownLatch waitForCompletion = new CountDownLatch(1);
                    Map<String,String> map = new HashMap<>();
                    publisher.subscribe("tanresponse",((topic, message) -> {
                        TanResponse response = new ObjectMapper().readValue(message.getPayload(), TanResponse.class);
                        System.out.println("<= "+response);
                        if(response.getId().equals(this.REQUESTID)){
                            map.put("tan",response.getTan());
                            waitForCompletion.countDown();
                        }
                    }));
                    waitForCompletion.await();
                    publisher.disconnect();
                    publisher.close();
                    retData.replace(0, retData.length(), map.get("tan"));
                } catch (MqttException | InterruptedException | JsonProcessingException e) {
                    throw new RuntimeException(e);
                }

            }
            case HAVE_ERROR -> System.err.println(msg);
            case NEED_PT_PHOTOTAN, NEED_PT_QRTAN -> throw new UnsupportedOperationException();
        }
    }
    @Override
    public void status(HBCIPassport passport, int statusTag, Object[] o) {
    }
    @Override
    public void log(String msg, int level, Date date, StackTraceElement trace) {
        System.out.println(msg);
    }
}
