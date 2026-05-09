package com.spendly.repository.mongodb;

import com.spendly.model.Expense;
import com.spendly.repository.ExpenseRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Profile("mongodb")
public class ExpenseMongoAdapter implements ExpenseRepository {

    private final ExpenseMongoRepo mongoRepo;

    public ExpenseMongoAdapter(ExpenseMongoRepo mongoRepo) {
        this.mongoRepo = mongoRepo;
    }

    @Override
    public Expense save(Expense expense) {
        return toDomain(mongoRepo.save(toDocument(expense)));
    }

    @Override
    public Optional<Expense> findById(String id) {
        return mongoRepo.findById(id).map(this::toDomain);
    }

    @Override
    public List<Expense> findByUserId(String userId) {
        return mongoRepo.findByUserId(userId).stream().map(this::toDomain).toList();
    }

    @Override
    public void deleteById(String id) {
        mongoRepo.deleteById(id);
    }

    private ExpenseMongoDocument toDocument(Expense expense) {
        ExpenseMongoDocument doc = new ExpenseMongoDocument();
        doc.setId(expense.id());
        doc.setUserId(expense.userId());
        doc.setAmount(expense.amount());
        doc.setCategory(expense.category());
        doc.setDate(expense.date());
        doc.setDescription(expense.description());
        doc.setCreatedAt(expense.createdAt() != null ? expense.createdAt() : LocalDateTime.now().toString());
        return doc;
    }

    private Expense toDomain(ExpenseMongoDocument doc) {
        return new Expense(
                doc.getId(), doc.getUserId(), doc.getAmount(),
                doc.getCategory(), doc.getDate(), doc.getDescription(), doc.getCreatedAt()
        );
    }
}
