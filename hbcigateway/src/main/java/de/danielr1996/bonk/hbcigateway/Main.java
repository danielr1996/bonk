package de.danielr1996.bonk.hbcigateway;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.danielr1996.bonk.hbcigateway.hbci.HBCIClient;
import lombok.Builder;
import lombok.Data;
import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.kapott.hbci.GV_Result.GVRKUms;

import java.util.List;

public class Main {
    public static void main(String[] args) throws Exception {
        IMqttClient subscriber = new MqttClient(System.getenv("BONK_MQTT_URL"),System.getenv("BONK_MQTT_URL"));
        subscriber.connect();
        System.out.println("Connect to mqtt at "+System.getenv("BONK_MQTT_URL"));
        subscriber.subscribe("statementrequest", ((topic, message) -> {
            StatementRequest sr = new ObjectMapper().readValue(message.getPayload(),StatementRequest.class);
            System.out.println("<= "+sr);
            HBCIClient client = new HBCIClient(sr.getBlz(), sr.getAccount(),sr.getNumber(), sr.getPin(),sr.getBic(),sr.getIban(),sr.getId());
            List<GVRKUms.UmsLine> statements = client.getStatements();
            StatementResponse sres = StatementResponse.builder().id(sr.getId()).statements(statements).build();
            System.out.println("=> "+sres);
            MqttMessage mqttMessage = new MqttMessage(new ObjectMapper().writeValueAsBytes(sres));
            mqttMessage.setQos(2);
            subscriber.publish("statementresponse",mqttMessage);
        }));
    }

    @Data
    public static class StatementRequest {
        String id;
        String blz;
        String account;
        String pin;
        String number;
        String bic;
        String iban;
    }

    @Data
    @Builder
    public static class StatementResponse {
        String id;
        List<GVRKUms.UmsLine> statements;
    }
}
