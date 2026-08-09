package co.icesi.TallerJPA.security;

import co.icesi.TallerJPA.model.Role;
import co.icesi.TallerJPA.model.User;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailCustomTest {

    @Test
    void getAuthoritiesReturnsRole() {

        Role role = new Role();
        role.setName("ADMIN");

        User user = new User();
        user.setEmail("admin@test.com");
        user.setPassword("1234");
        user.setRole(role);

        UserDetailCustom userDetails = new UserDetailCustom(user);

        assertEquals("admin@test.com", userDetails.getUsername());
        assertEquals("1234", userDetails.getPassword());

        assertEquals(1, userDetails.getAuthorities().size());
    }
}