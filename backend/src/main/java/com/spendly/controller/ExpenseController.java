package com.spendly.controller;

import com.spendly.dto.CategorySummary;
import com.spendly.dto.ExpenseRequest;
import com.spendly.dto.ExpenseResponse;
import com.spendly.model.ExpenseCategory;
import com.spendly.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/expenses")
public class ExpenseController {

    private final ExpenseService expenseService;

    public ExpenseController(ExpenseService expenseService) {
        this.expenseService = expenseService;
    }

    @GetMapping
    public List<ExpenseResponse> getExpenses(
            @RequestParam(required = false) ExpenseCategory category,
            Authentication auth) {
        return expenseService.getExpenses((String) auth.getPrincipal(), category);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ExpenseResponse createExpense(@Valid @RequestBody ExpenseRequest req, Authentication auth) {
        return expenseService.createExpense((String) auth.getPrincipal(), req);
    }

    @PatchMapping("/{id}")
    public ExpenseResponse updateExpense(@PathVariable String id,
                                         @Valid @RequestBody ExpenseRequest req,
                                         Authentication auth) {
        return expenseService.updateExpense((String) auth.getPrincipal(), id, req);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteExpense(@PathVariable String id, Authentication auth) {
        expenseService.deleteExpense((String) auth.getPrincipal(), id);
    }

    @GetMapping("/summary")
    public List<CategorySummary> getSummary(Authentication auth) {
        return expenseService.getSummary((String) auth.getPrincipal());
    }
}
