package com.spendly.service;

import com.spendly.dto.AuthResponse;
import com.spendly.dto.ChangePasswordRequest;
import com.spendly.dto.LoginRequest;
import com.spendly.dto.RegisterRequest;
import com.spendly.dto.UpdateNameRequest;
import com.spendly.dto.UserResponse;

public interface UserService {
    AuthResponse register(RegisterRequest req);
    AuthResponse login(LoginRequest req);
    UserResponse getProfile(String userId);
    UserResponse updateName(String userId, UpdateNameRequest req);
    void changePassword(String userId, ChangePasswordRequest req);
}
