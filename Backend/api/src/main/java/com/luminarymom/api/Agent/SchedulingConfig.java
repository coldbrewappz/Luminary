package com.luminarymom.api.Agent;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

// Turns on Spring's scheduler only when the agent is enabled, so tests and any
// deployment with the agent off don't start scheduling infrastructure.
@Configuration
@EnableScheduling
@ConditionalOnProperty(name = "quote.agent.enabled", havingValue = "true")
public class SchedulingConfig {
}
