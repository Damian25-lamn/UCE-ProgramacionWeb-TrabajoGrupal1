package com.programacion.web.mapper;

import com.programacion.web.modelo.User;
import io.helidon.dbclient.DbRow;

public class UserMapper {
    public static User mapRow(DbRow row) {
        return new User(
                row.column("id").as(Integer.class).get(),
                row.column("name").as(String.class).get(),
                row.column("username").as(String.class).get(),
                row.column("email").as(String.class).get(),
                row.column("phone").as(String.class).get(),
                row.column("website").as(String.class).get()
        );
    }

}
