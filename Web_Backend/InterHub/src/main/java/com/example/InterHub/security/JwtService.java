package com.example.InterHub.security;

import com.example.InterHub.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    @Value("${jwt.refresh-expiration}")
    private long refreshExpiration;

    public String generateToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId",user.getId())
                .claim("role",user.getRole().name())
                .claim("type","ACCESS")
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()+expiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }
    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .claim("userId",user.getId())
                .claim("type","REFRESH")
                .issuedAt(new Date())
                .expiration(
                        new Date(
                                System.currentTimeMillis()+refreshExpiration
                        )
                )
                .signWith(getSigningKey())
                .compact();
    }
    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }
    public String extractTokenType(String token) {
        return extractAllClaims(token)
                .get("type",String.class);
    }
    public boolean isTokenValid(
            String token,
            UserDetails userDetails
    ) {
        String username=extractUsername(token);
        String type=extractTokenType(token);
        return username.equals(userDetails.getUsername())
                && "ACCESS".equals(type)
                && !isTokenExpired(token);
    }
    public boolean isRefreshTokenValid(
            String token,
            UserDetails userDetails
    ) {
        try{
            String username=extractUsername(token);
            String type=extractTokenType(token);

            System.out.println("REFRESH USERNAME TOKEN: "+username);
            System.out.println("REFRESH USERNAME USERDETAILS: "+userDetails.getUsername());
            System.out.println("REFRESH TYPE: "+type);
            System.out.println("REFRESH EXPIRED: "+isTokenExpired(token));

            return username.equals(userDetails.getUsername())
                    && "REFRESH".equals(type)
                    && !isTokenExpired(token);
        }catch(Exception exception){
            System.out.println("REFRESH VALIDATE ERROR: "+exception.getMessage());
            return false;
        }
    }
    private boolean isTokenExpired(String token) {
        return extractAllClaims(token)
                .getExpiration()
                .before(new Date());
    }
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    private SecretKey getSigningKey() {
        byte[] keyBytes=
                Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}