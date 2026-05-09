package com.spendly.repository.postgresql;

import com.spendly.model.Expense;
import com.spendly.repository.ExpenseRepository;
import com.spendly.repository.jpa.ExpenseJpaEntity;
import com.spendly.repository.jpa.ExpenseJpaRepo;
import com.spendly.repository.jpa.UserJpaEntity;
import com.spendly.repository.jpa.UserJpaRepo;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Profile("postgresql")
public class ExpensePostgresAdapter implements ExpenseRepository {

    private final ExpenseJpaRepo expenseJpaRepo;
    private final UserJpaRepo userJpaRepo;

    public ExpensePostgresAdapter(ExpenseJpaRepo expenseJpaRepo, UserJpaRepo userJpaRepo) {
        this.expenseJpaRepo = expenseJpaRepo;
        this.userJpaRepo = userJpaRepo;
    }

    @Override
    public Expense save(Expense expense) {
        UserJpaEntity user = userJpaRepo.findById(Long.parseLong(expense.userId()))
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + expense.userId()));
        return toDomain(expenseJpaRepo.save(toEntity(expense, user)));
    }

    @Override
    public Optional<Expense> findById(String id) {
        return expenseJpaRepo.findById(Long.parseLong(id)).map(this::toDomain);
    }

    @Override
    public List<Expense> findByUserId(String userId) {
        return expenseJpaRepo.findByUserId(Long.parseLong(userId))
                .stream().map(this::toDomain).toList();
    }

    @Override
    public void deleteById(String id) {
        expenseJpaRepo.deleteById(Long.parseLong(id));
    }

    private ExpenseJpaEntity toEntity(Expense expense, UserJpaEntity user) {
        ExpenseJpaEntity entity = new ExpenseJpaEntity();
        if (expense.id() != null && !expense.id().isBlank()) {
            entity.setId(Long.parseLong(expense.id()));
        }
        entity.setUser(user);
        entity.setAmount(expense.amount());
        entity.setCategory(expense.category());
        entity.setDate(expense.date());
        entity.setDescription(expense.description());
        entity.setCreatedAt(expense.createdAt() != null ? expense.createdAt() : LocalDateTime.now().toString());
        return entity;
    }

    private Expense toDomain(ExpenseJpaEntity entity) {
        return new Expense(
                String.valueOf(entity.getId()),
                String.valueOf(entity.getUser().getId()),
                entity.getAmount(),
                entity.getCategory(),
                entity.getDate(),
                entity.getDescription(),
                entity.getCreatedAt()
        );
    }
}
