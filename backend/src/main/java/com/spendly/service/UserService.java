package com.spendly.service;

import com.spendly.dto.AuthResponse;
import com.spendly.dto.LoginRequest;
import com.spendly.dto.RegisterRequest;

public interface UserService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
}
