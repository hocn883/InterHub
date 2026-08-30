package com.example.InterHub.scheduler;

import com.example.InterHub.entity.Application;
import com.example.InterHub.enums.ApplicationStatus;
import com.example.InterHub.repository.ApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ApplicationScheduler {

    private final ApplicationRepository applicationRepository;

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void completeFinishedApplications() {

        LocalDate today = LocalDate.now();

        List<Application> applications =
                applicationRepository
                        .findByStatusAndJob_EndDateLessThanEqual(
                                ApplicationStatus.APPROVED,
                                today
                        );

        for (Application application : applications) {
            application.setStatus(
                    ApplicationStatus.COMPLETED
            );
        }
    }
}