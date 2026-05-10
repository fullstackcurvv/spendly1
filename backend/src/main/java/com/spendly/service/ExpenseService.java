package com.spendly.service;

import com.spendly.dto.CategorySummary;
import com.spendly.dto.ExpenseRequest;
import com.spendly.dto.ExpenseResponse;
import com.spendly.model.ExpenseCategory;

import java.util.List;

public interface ExpenseService {
    List<ExpenseResponse> getExpenses(String userId, ExpenseCategory category);
    ExpenseResponse createExpense(String userId, ExpenseRequest req);
    ExpenseResponse updateExpense(String userId, String id, ExpenseRequest req);
    void deleteExpense(String userId, String id);
    List<CategorySummary> getSummary(String userId);
}
