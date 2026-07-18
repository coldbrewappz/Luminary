package com.luminarymom.api.Agent;

import java.util.List;

// Abstraction over the LLM call so the agent service can be unit-tested without a live API.
public interface QuoteGenerator {
    List<GeneratedQuote> generate(String prompt);
}
