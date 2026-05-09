package com.spendly.repository.mongodb;

import com.spendly.model.User;
import com.spendly.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Profile("mongodb")
public class UserMongoAdapter implements UserRepository {

    private final UserMongoRepo mongoRepo;

    public UserMongoAdapter(UserMongoRepo mongoRepo) {
        this.mongoRepo = mongoRepo;
    }

    @Override
    public User save(User user) {
        return toDomain(mongoRepo.save(toDocument(user)));
    }

    @Override
    public Optional<User> findById(String id) {
        return mongoRepo.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return mongoRepo.findByEmail(email).map(this::toDomain);
    }

    @Override
    public List<User> findAll() {
        return mongoRepo.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public void deleteById(String id) {
        mongoRepo.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return mongoRepo.existsByEmail(email);
    }

    private UserMongoDocument toDocument(User user) {
        UserMongoDocument doc = new UserMongoDocument();
        doc.setId(user.id());
        doc.setName(user.name());
        doc.setEmail(user.email());
        doc.setPasswordHash(user.passwordHash());
        doc.setCreatedAt(user.createdAt() != null ? user.createdAt() : LocalDateTime.now().toString());
        return doc;
    }

    private User toDomain(UserMongoDocument doc) {
        return new User(doc.getId(), doc.getName(), doc.getEmail(), doc.getPasswordHash(), doc.getCreatedAt());
    }
}
