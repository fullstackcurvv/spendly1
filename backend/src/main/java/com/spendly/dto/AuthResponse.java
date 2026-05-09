package com.spendly.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {}
