package com.spendly.service;

import com.spendly.dto.CategorySummary;
import com.spendly.dto.ExpenseRequest;
import com.spendly.dto.ExpenseResponse;
import com.spendly.exception.ExpenseNotFoundException;
import com.spendly.model.Expense;
import com.spendly.model.ExpenseCategory;
import com.spendly.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;

    public ExpenseServiceImpl(ExpenseRepository expenseRepository) {
        this.expenseRepository = expenseRepository;
    }

    @Override
    public List<ExpenseResponse> getExpenses(String userId, ExpenseCategory category) {
        List<Expense> expenses = expenseRepository.findByUserId(userId);
        if (category != null) {
            expenses = expenses.stream()
                    .filter(e -> e.category() == category)
                    .toList();
        }
        return expenses.stream().map(ExpenseResponse::from).toList();
    }

    @Override
    public ExpenseResponse createExpense(String userId, ExpenseRequest req) {
        Expense expense = new Expense(
                null, userId, req.amount(), req.category(),
                req.date(), req.description(), LocalDateTime.now().toString()
        );
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    @Override
    public ExpenseResponse updateExpense(String userId, String id, ExpenseRequest req) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(ExpenseNotFoundException::new);
        if (!expense.userId().equals(userId)) throw new ExpenseNotFoundException();
        Expense updated = new Expense(
                expense.id(), userId, req.amount(), req.category(),
                req.date(), req.description(), expense.createdAt()
        );
        return ExpenseResponse.from(expenseRepository.save(updated));
    }

    @Override
    public void deleteExpense(String userId, String id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(ExpenseNotFoundException::new);
        if (!expense.userId().equals(userId)) throw new ExpenseNotFoundException();
        expenseRepository.deleteById(id);
    }

    @Override
    public List<CategorySummary> getSummary(String userId) {
        return expenseRepository.findByUserId(userId).stream()
                .collect(Collectors.groupingBy(
                        e -> e.category().name(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::amount, BigDecimal::add)
                ))
                .entrySet().stream()
                .map(entry -> new CategorySummary(entry.getKey(), entry.getValue()))
                .toList();
    }
}
