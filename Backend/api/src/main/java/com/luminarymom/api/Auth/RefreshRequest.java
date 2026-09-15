package com.luminarymom.api.Auth;

/** JSON body for POST /api/auth/refresh: { "refreshToken": "..." }. */
public class RefreshRequest {

    private String refreshToken;

    public RefreshRequest() {}

    public String getRefreshToken() { return refreshToken; }
    public void setRefreshToken(String refreshToken) { this.refreshToken = refreshToken; }

}
