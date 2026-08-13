package com.example.InterHub.mapper;

import com.example.InterHub.dto.response.EmployerResponse;
import com.example.InterHub.dto.response.LecturerResponse;
import com.example.InterHub.dto.response.StudentResponse;
import com.example.InterHub.dto.response.UserResponse;
import com.example.InterHub.entity.Employer;
import com.example.InterHub.entity.Lecturer;
import com.example.InterHub.entity.Student;
import com.example.InterHub.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel="spring")
public interface UserMapper {

    StudentResponse toStudentResponse(Student student);

    EmployerResponse toEmployerResponse(Employer employer);

    LecturerResponse toLecturerResponse(Lecturer lecturer);
    default UserResponse toResponse(User user) {

        if (user instanceof Student student) {
            return toStudentResponse(student);
        }

        if (user instanceof Employer employer) {
            return toEmployerResponse(employer);
        }

        if (user instanceof Lecturer lecturer) {
            return toLecturerResponse(lecturer);
        }

        throw new IllegalArgumentException("Unknown user type");
    }

}
