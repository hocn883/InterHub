package com.example.InterHub;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableAsync
public class InterHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(InterHubApplication.class, args);
	}

}
