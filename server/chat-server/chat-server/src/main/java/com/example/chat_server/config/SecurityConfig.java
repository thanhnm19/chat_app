package com.example.chat_server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf().disable() // tắt CSRF để test API POST dễ hơn
                .authorizeHttpRequests()
                .requestMatchers("/api/auth/**", "/ws/**").permitAll() // cho phép không cần login
                .anyRequest().permitAll()
                .and()
                .formLogin().disable()
                .httpBasic().disable();

        return http.build();
    }
}
