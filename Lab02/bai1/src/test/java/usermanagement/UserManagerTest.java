package usermanagement;

import static org.junit.Assert.*;

import org.example.usermanagement.Admin;
import org.example.usermanagement.User;
import org.example.usermanagement.UserManager;
import org.junit.Test;
public class UserManagerTest {

    @Test
    public void testSingleton() {
        UserManager manager1 = UserManager.getInstance();
        UserManager manager2 = UserManager.getInstance();
        assertSame(manager1, manager2);  // Kiểm tra xem hai manager có phải là cùng một instance không
    }

    @Test
    public void testAddUser() {
        UserManager manager = UserManager.getInstance();
        User user = new Admin("Alice");
        manager.addUser(user);
        assertTrue(manager.listUsers().contains("Alice"));  // Kiểm tra xem người dùng đã được thêm chưa
    }

    @Test
    public void testRemoveUser() {
        UserManager manager = UserManager.getInstance();
        User user = new Admin("Alice");
        manager.addUser(user);
        manager.removeUser(user);
        assertFalse(manager.listUsers().contains("Alice"));  // Kiểm tra xem người dùng đã bị xóa chưa
    }
}
