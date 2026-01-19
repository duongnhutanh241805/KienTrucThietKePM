package org.example.usermanagement;

public class Guest extends User {
    public Guest(String name) {
        super(name);
    }

    @Override
    public String getRole() {
        return "Guest";
    }
}