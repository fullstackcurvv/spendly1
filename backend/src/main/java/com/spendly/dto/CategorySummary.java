package com.spendly.dto;

import java.math.BigDecimal;

public record CategorySummary(
        String category,
        BigDecimal total
) {}
