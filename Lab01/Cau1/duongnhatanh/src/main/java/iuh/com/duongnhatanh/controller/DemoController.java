package iuh.com.duongnhatanh.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DemoController {

    @GetMapping("/api/profile")
    public String getProfile(@AuthenticationPrincipal Jwt jwt) {
        // Lấy thông tin từ 'sub' hoặc các 'claims' khác trong JWT
        return "Xin chào, " + jwt.getSubject() + ". Email của bạn là: " + jwt.getClaim("email");
    }
}
