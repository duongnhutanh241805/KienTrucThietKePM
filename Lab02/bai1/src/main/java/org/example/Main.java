package org.example;

import org.example.usermanagement.User;
import org.example.usermanagement.UserFactory;
import org.example.usermanagement.UserManager;

public class Main {
    public static void main(String[] args) {
        // Lấy instance duy nhất của UserManager
        UserManager userManager = UserManager.getInstance();

        // Tạo người dùng thông qua UserFactory
        User user1 = UserFactory.createUser("Admin", "Alice");
        User user2 = UserFactory.createUser("Member", "Bob");
        User user3 = UserFactory.createUser("Guest", "Charlie");

        // Thêm người dùng vào UserManager
        userManager.addUser(user1);
        userManager.addUser(user2);
        userManager.addUser(user3);

        // Hiển thị danh sách người dùng
        System.out.println(userManager.listUsers());

        // Kiểm tra vai trò của từng người dùng
        for (User user : userManager.users) {
            System.out.println(user.getName() + " is a " + user.getRole());
        }
    }
}