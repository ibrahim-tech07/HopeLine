package com.example.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure()
				.directory("C:/Users/ibrah/OneDrive/Desktop/Authentication/HopeLine/backend/backend/backend")
				.load();

		System.out.println("SPRING_MAIL_HOST: " + dotenv.get("SPRING_MAIL_HOST"));
		SpringApplication.run(BackendApplication.class, args);
	}

}
