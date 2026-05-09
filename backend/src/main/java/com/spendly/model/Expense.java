package com.spendly.model;

import java.math.BigDecimal;

public record Expense(
        String id,
        String userId,
        BigDecimal amount,
        ExpenseCategory category,
        String date,
        String description,
        String createdAt
) {}
