package com.spendly.dto;

import com.spendly.model.Expense;
import com.spendly.model.ExpenseCategory;

import java.math.BigDecimal;

public record ExpenseResponse(
        String id,
        String userId,
        BigDecimal amount,
        ExpenseCategory category,
        String date,
        String description,
        String createdAt
) {
    public static ExpenseResponse from(Expense e) {
        return new ExpenseResponse(e.id(), e.userId(), e.amount(),
                e.category(), e.date(), e.description(), e.createdAt());
    }
}
