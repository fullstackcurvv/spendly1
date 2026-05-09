package com.spendly.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateNameRequest(
        @NotBlank(message = "Name is required")
        String name
) {}
