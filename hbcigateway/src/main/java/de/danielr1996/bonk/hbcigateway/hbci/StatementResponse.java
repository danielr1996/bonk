package de.danielr1996.bonk.hbcigateway.hbci;

import lombok.Builder;
import lombok.Data;
import org.kapott.hbci.GV_Result.GVRKUms;

import java.util.List;

@Data
@Builder
public class StatementResponse {
    String id;
    List<GVRKUms.UmsLine> statements;
}
