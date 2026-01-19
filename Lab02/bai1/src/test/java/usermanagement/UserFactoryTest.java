package usermanagement;

import static org.junit.Assert.*;

import org.example.usermanagement.Admin;
import org.example.usermanagement.Guest;
import org.example.usermanagement.User;
import org.example.usermanagement.UserFactory;
import org.junit.Test;

public class UserFactoryTest {

    @Test
    public void testCreateAdmin() {
        User user = UserFactory.createUser("Admin", "Alice");
        assertTrue(user instanceof Admin);
        assertEquals(user.getName(), "Alice");
    }

    @Test
    public void testCreateGuest() {
        User user = UserFactory.createUser("Guest", "Bob");
        assertTrue(user instanceof Guest);
        assertEquals(user.getName(), "Bob");
    }

    @Test
    public void testInvalidRole() {
        try {
            User user = UserFactory.createUser("InvalidRole", "Charlie");
            fail("Exception should be thrown for unsupported role");
        } catch (IllegalArgumentException e) {
            assertEquals(e.getMessage(), "Unsupported role: InvalidRole");
        }
    }
}