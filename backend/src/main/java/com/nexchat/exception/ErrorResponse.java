package com.nexchat.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.time.LocalDateTime;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;
    private Map<String,String> errors;

    public int getStatus() { return status; }
    public void setStatus(int v) { this.status=v; }
    public String getMessage() { return message; }
    public void setMessage(String v) { this.message=v; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime v) { this.timestamp=v; }
    public Map<String,String> getErrors() { return errors; }
    public void setErrors(Map<String,String> v) { this.errors=v; }

    public static Builder builder() { return new Builder(); }
    public static class Builder {
        private final ErrorResponse r = new ErrorResponse();
        public Builder status(int v) { r.status=v; return this; }
        public Builder message(String v) { r.message=v; return this; }
        public Builder timestamp(LocalDateTime v) { r.timestamp=v; return this; }
        public Builder errors(Map<String,String> v) { r.errors=v; return this; }
        public ErrorResponse build() { return r; }
    }
}
