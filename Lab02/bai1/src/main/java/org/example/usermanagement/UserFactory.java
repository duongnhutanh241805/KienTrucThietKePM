package org.example.usermanagement;

public class UserFactory {
    public static User createUser(String role, String name) {
        switch (role) {
            case "Admin":
                return new Admin(name);
            case "Guest":
                return new Guest(name);
            case "Member":
                return new Member(name);
            default:
                throw new IllegalArgumentException("Unsupported role: " + role);
        }
    }
}