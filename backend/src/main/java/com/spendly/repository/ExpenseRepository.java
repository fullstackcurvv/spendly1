package com.spendly.repository;

import com.spendly.model.Expense;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository {
    Expense save(Expense expense);
    Optional<Expense> findById(String id);
    List<Expense> findByUserId(String userId);
    void deleteById(String id);
}
