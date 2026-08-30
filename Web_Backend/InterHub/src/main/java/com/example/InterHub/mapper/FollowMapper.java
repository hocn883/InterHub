package com.example.InterHub.mapper;

import com.example.InterHub.dto.response.FollowResponse;
import com.example.InterHub.entity.Follow;
import org.mapstruct.Mapper;

@Mapper(
        componentModel = "spring",
        uses = {
                UserMapper.class,
        }
)
public interface FollowMapper {

    FollowResponse toResponse(Follow follow);
}