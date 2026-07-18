package com.luminarymom.api.Agent;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class QuoteBatchParserTest {

    @Test
    void parses_plainJsonArray() {
        String raw = """
                [
                  {"text": "You are enough", "author": "Luminary Mom", "type": "in-house", "sourceHint": ""},
                  {"text": "The wound is where the light enters", "author": "Rumi", "type": "known", "sourceHint": "Rumi - high"}
                ]
                """;

        List<GeneratedQuote> result = QuoteBatchParser.parse(raw);

        assertThat(result).hasSize(2);
        assertThat(result.get(0).author()).isEqualTo("Luminary Mom");
        assertThat(result.get(1).type()).isEqualTo("known");
    }

    @Test
    void parses_arrayWrappedInMarkdownFencesAndProse() {
        String raw = """
                Here are your quotes:
                ```json
                [{"text": "Breathe", "author": "Unknown", "type": "unknown", "sourceHint": ""}]
                ```
                Hope these help!
                """;

        List<GeneratedQuote> result = QuoteBatchParser.parse(raw);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).text()).isEqualTo("Breathe");
    }

    @Test
    void returnsEmpty_forBlankOrNonJson() {
        assertThat(QuoteBatchParser.parse(null)).isEmpty();
        assertThat(QuoteBatchParser.parse("")).isEmpty();
        assertThat(QuoteBatchParser.parse("no json here")).isEmpty();
    }
}
