package com.example.InterHub.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final CustomUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException,IOException {

        String authorizationHeader=
                request.getHeader("Authorization");

        if(
                authorizationHeader==null||
                        !authorizationHeader.startsWith("Bearer ")
        ){
            filterChain.doFilter(request,response);
            return;
        }

        String token=
                authorizationHeader.substring(7);

        String username;

        try{
            username=jwtService.extractUsername(token);
        }catch(Exception exception){
            response.setStatus(
                    HttpServletResponse.SC_UNAUTHORIZED
            );
            return;
        }

        if(
                username!=null&&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()==null
        ){
            UserDetails userDetails=
                    userDetailsService
                            .loadUserByUsername(username);

            if(
                    jwtService.isTokenValid(
                            token,
                            userDetails
                    )
            ){
                UsernamePasswordAuthenticationToken authentication=
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }else{
                response.setStatus(
                        HttpServletResponse.SC_UNAUTHORIZED
                );
                return;
            }
        }

        filterChain.doFilter(request,response);
    }
}