package com.spendly.dto;

import com.spendly.model.User;

public record UserResponse(
        String id,
        String name,
        String email,
        String createdAt
) {
    public static UserResponse from(User user) {
        return new UserResponse(user.id(), user.name(), user.email(), user.createdAt());
    }
}
