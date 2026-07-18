package com.programacion.web.mapper;

import com.programacion.web.modelo.Todo;
import io.helidon.dbclient.DbRow;

public class TodoMapper {
    public static Todo mapRow(DbRow row) {
        return new Todo(
                row.column("id").as(Integer.class).get(),
                row.column("user_id").as(Integer.class).get(),
                row.column("title").as(String.class).get(),
                row.column("completed").as(Boolean.class).get()
        );
    }
}