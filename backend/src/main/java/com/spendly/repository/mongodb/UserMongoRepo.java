package com.spendly.repository.mongodb;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

interface UserMongoRepo extends MongoRepository<UserMongoDocument, String> {
    Optional<UserMongoDocument> findByEmail(String email);
    boolean existsByEmail(String email);
}
