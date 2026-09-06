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
import org.mapstruct.Mapping;

@Mapper(componentModel="spring")
public interface UserMapper {

    StudentResponse toStudentResponse(Student student);
    @Mapping(source = "companyName", target = "companyName")
    @Mapping(source = "taxCode", target = "taxCode")
    @Mapping(source = "status", target = "status")
    @Mapping(source = "avatarUrl", target = "avatarUrl")
    @Mapping(source="phone",target ="phone")
    @Mapping(source="email",target="email")
    @Mapping(source = "gender", target="gender")
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
