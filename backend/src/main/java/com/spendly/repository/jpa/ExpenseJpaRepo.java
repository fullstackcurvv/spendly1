package com.spendly.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseJpaRepo extends JpaRepository<ExpenseJpaEntity, Long> {
    @Query("SELECT e FROM ExpenseJpaEntity e WHERE e.user.id = :userId")
    List<ExpenseJpaEntity> findByUserId(@Param("userId") Long userId);
}
