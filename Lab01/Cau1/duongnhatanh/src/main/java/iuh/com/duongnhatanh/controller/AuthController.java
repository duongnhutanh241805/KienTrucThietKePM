package iuh.com.duongnhatanh.controller;

import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtEncoder encoder;
    // Giả lập Database lưu User
    private static final Map<String, String> userDb = new HashMap<>();

    public AuthController(JwtEncoder encoder) {
        this.encoder = encoder;
    }

    @PostMapping("/register")
    public String register(@RequestBody Map<String, String> user) {
        userDb.put(user.get("username"), user.get("password"));
        return "Đăng ký thành công cho: " + user.get("username");
    }

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> user) {
        String username = user.get("username");
        String password = user.get("password");

        if (userDb.containsKey(username) && userDb.get(username).equals(password)) {
            Instant now = Instant.now();

            // Tạo payload cho JWT (Claims)
            JwtClaimsSet claims = JwtClaimsSet.builder()
                    .issuer("self")
                    .issuedAt(now)
                    .expiresAt(now.plusSeconds(3600))
                    .subject(username)
                    .claim("email", username + "@iuh.edu.vn")
                    .claim("scope", "ROLE_USER")
                    .build();

            String token = this.encoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();

            Map<String, String> response = new HashMap<>();
            response.put("access_token", token);
            return response;
        }
        throw new RuntimeException("Sai tên đăng nhập hoặc mật khẩu");
    }
}