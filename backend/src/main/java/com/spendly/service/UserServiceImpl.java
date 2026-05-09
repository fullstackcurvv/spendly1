package com.spendly.service;

import com.spendly.dto.AuthResponse;
import com.spendly.dto.RegisterRequest;
import com.spendly.dto.UserResponse;
import com.spendly.exception.EmailAlreadyExistsException;
import com.spendly.model.User;
import com.spendly.repository.UserRepository;
import com.spendly.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public UserServiceImpl(UserRepository userRepository,
                           BCryptPasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    public AuthResponse register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.email())) {
            throw new EmailAlreadyExistsException(req.email());
        }

        String passwordHash = passwordEncoder.encode(req.password());
        User user = new User(null, req.name(), req.email(), passwordHash, LocalDateTime.now().toString());
        User saved = userRepository.save(user);

        String token = jwtUtil.generateToken(saved.id());
        UserResponse userResponse = UserResponse.from(saved);
        return new AuthResponse(token, userResponse);
    }
}
