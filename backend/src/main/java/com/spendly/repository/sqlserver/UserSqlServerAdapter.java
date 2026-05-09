package com.spendly.repository.sqlserver;

import com.spendly.model.User;
import com.spendly.repository.UserRepository;
import com.spendly.repository.jpa.UserJpaEntity;
import com.spendly.repository.jpa.UserJpaRepo;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Profile("sqlserver")
public class UserSqlServerAdapter implements UserRepository {

    private final UserJpaRepo jpaRepo;

    public UserSqlServerAdapter(UserJpaRepo jpaRepo) {
        this.jpaRepo = jpaRepo;
    }

    @Override
    public User save(User user) {
        return toDomain(jpaRepo.save(toEntity(user)));
    }

    @Override
    public Optional<User> findById(String id) {
        return jpaRepo.findById(Long.parseLong(id)).map(this::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpaRepo.findByEmail(email).map(this::toDomain);
    }

    @Override
    public List<User> findAll() {
        return jpaRepo.findAll().stream().map(this::toDomain).toList();
    }

    @Override
    public void deleteById(String id) {
        jpaRepo.deleteById(Long.parseLong(id));
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepo.existsByEmail(email);
    }

    private UserJpaEntity toEntity(User user) {
        UserJpaEntity entity = new UserJpaEntity();
        if (user.id() != null && !user.id().isBlank()) {
            entity.setId(Long.parseLong(user.id()));
        }
        entity.setName(user.name());
        entity.setEmail(user.email());
        entity.setPasswordHash(user.passwordHash());
        entity.setCreatedAt(user.createdAt() != null ? user.createdAt() : LocalDateTime.now().toString());
        return entity;
    }

    private User toDomain(UserJpaEntity entity) {
        return new User(
                String.valueOf(entity.getId()),
                entity.getName(),
                entity.getEmail(),
                entity.getPasswordHash(),
                entity.getCreatedAt()
        );
    }
}
