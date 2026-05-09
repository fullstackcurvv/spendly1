package com.spendly.model;

public record User(
        String id,
        String name,
        String email,
        String passwordHash,
        String createdAt
) {}
