package io.mosip.residentapp;

public class IntentData {
    private String qrData = "";
    private Boolean isIntendData = false;
    private static final IntentData ourInstance = new IntentData();
    public static IntentData getInstance() {
        return ourInstance;
    }
    private IntentData() {
    }

    public Boolean getIntendData() {
        return isIntendData;
    }

    public void setIntendData(Boolean intendData) {
        isIntendData = intendData;
    }

    public String getQrData() {
        return qrData;
    }

    public void setQrData(String qrData) {
        this.qrData = qrData;
    }

}