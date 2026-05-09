package com.spendly.repository.mongodb;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

interface ExpenseMongoRepo extends MongoRepository<ExpenseMongoDocument, String> {
    List<ExpenseMongoDocument> findByUserId(String userId);
}
