package de.danielr1996.bonk.hbcigateway.hbci;

import lombok.Data;

@Data
public class StatementRequest {
    String id;
    String blz;
    String account;
    String pin;
    String number;
    String bic;
    String iban;
}
