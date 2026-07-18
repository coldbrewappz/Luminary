package com.luminarymom.api.Agent;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// One quote candidate as returned by the model.
// type: "in-house" | "known" | "unknown"
@JsonIgnoreProperties(ignoreUnknown = true)
public record GeneratedQuote(String text, String author, String type, String sourceHint) {}
