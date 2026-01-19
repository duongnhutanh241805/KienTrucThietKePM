package org.example.usermanagement;

public class Member extends User {
    public Member(String name) {
        super(name);
    }

    @Override
    public String getRole() {
        return "Member";
    }
}
