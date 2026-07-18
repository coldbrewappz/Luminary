package com.luminarymom.api.Agent;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

// Parses the model's response text into quote candidates. Tolerant of markdown
// code fences and surrounding prose: it extracts the outermost JSON array.
public final class QuoteBatchParser {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private QuoteBatchParser() {}

    public static List<GeneratedQuote> parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return List.of();
        }
        int start = raw.indexOf('[');
        int end = raw.lastIndexOf(']');
        if (start < 0 || end <= start) {
            return List.of();
        }
        String json = raw.substring(start, end + 1);
        try {
            return MAPPER.readValue(json, new TypeReference<List<GeneratedQuote>>() {});
        } catch (Exception e) {
            return List.of();
        }
    }
}
