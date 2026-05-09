package com.spendly.config;

import com.spendly.model.Expense;
import com.spendly.model.ExpenseCategory;
import com.spendly.model.User;
import com.spendly.repository.ExpenseRepository;
import com.spendly.repository.UserRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataSeeder(UserRepository userRepository, ExpenseRepository expenseRepository) {
        this.userRepository = userRepository;
        this.expenseRepository = expenseRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (userRepository.existsByEmail("demo@spendly.com")) {
            return;
        }

        String now = LocalDateTime.now().toString();
        User demo = userRepository.save(new User(
                null, "Demo User", "demo@spendly.com",
                passwordEncoder.encode("demo1234"), now
        ));

        List<Expense> expenses = List.of(
                new Expense(null, demo.id(), new BigDecimal("12.50"), ExpenseCategory.FOOD,          "2025-05-01", "Lunch at cafe",          now),
                new Expense(null, demo.id(), new BigDecimal("45.00"), ExpenseCategory.TRANSPORT,     "2025-05-02", "Monthly bus pass",        now),
                new Expense(null, demo.id(), new BigDecimal("120.00"), ExpenseCategory.BILLS,        "2025-05-03", "Electricity bill",        now),
                new Expense(null, demo.id(), new BigDecimal("30.00"), ExpenseCategory.HEALTH,        "2025-05-04", "Pharmacy",                now),
                new Expense(null, demo.id(), new BigDecimal("15.00"), ExpenseCategory.ENTERTAINMENT, "2025-05-05", "Netflix subscription",    now),
                new Expense(null, demo.id(), new BigDecimal("89.99"), ExpenseCategory.SHOPPING,      "2025-05-06", "Clothes",                 now),
                new Expense(null, demo.id(), new BigDecimal("8.50"),  ExpenseCategory.FOOD,          "2025-05-07", "Coffee and snacks",       now),
                new Expense(null, demo.id(), new BigDecimal("25.00"), ExpenseCategory.OTHER,         "2025-05-08", "Miscellaneous",           now)
        );
        expenses.forEach(expenseRepository::save);
    }
}
