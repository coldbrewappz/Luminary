package com.luminarymom.api.Agent;

import com.anthropic.client.AnthropicClient;
import com.anthropic.client.okhttp.AnthropicOkHttpClient;
import com.anthropic.models.messages.Message;
import com.anthropic.models.messages.MessageCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.List;

// Calls Claude via the official Anthropic Java SDK and parses the response into
// quote candidates. Only wired in when the agent is enabled.
@Component
@ConditionalOnProperty(name = "quote.agent.enabled", havingValue = "true")
public class AnthropicQuoteClient implements QuoteGenerator {

    private final String apiKey;
    private final String model;
    private final long maxTokens;

    public AnthropicQuoteClient(
            @Value("${anthropic.api.key:}") String apiKey,
            @Value("${anthropic.api.model:claude-opus-4-8}") String model,
            @Value("${anthropic.api.max-tokens:8000}") long maxTokens) {
        this.apiKey = apiKey;
        this.model = model;
        this.maxTokens = maxTokens;
    }

    @Override
    public List<GeneratedQuote> generate(String prompt) {
        AnthropicClient client = AnthropicOkHttpClient.builder()
                .apiKey(apiKey)
                .build();

        MessageCreateParams params = MessageCreateParams.builder()
                .model(model)
                .maxTokens(maxTokens)
                .addUserMessage(prompt)
                .build();

        Message response = client.messages().create(params);

        String text = response.content().stream()
                .flatMap(block -> block.text().stream())
                .map(t -> t.text())
                .reduce("", (a, b) -> a + b);

        return QuoteBatchParser.parse(text);
    }
}
