package de.danielr1996.bonk.hbcigateway.hbci;

import org.kapott.hbci.manager.HBCIHandler;

public class ClosableHBCIHandlerWrapper implements AutoCloseable{
    HBCIHandler handle;

    public ClosableHBCIHandlerWrapper(HBCIHandler handle){
        this.handle = handle;
    }

    public HBCIHandler getHandle(){
        return this.handle;
    }

    @Override
    public void close() throws Exception {
        handle.close();
    }
}
