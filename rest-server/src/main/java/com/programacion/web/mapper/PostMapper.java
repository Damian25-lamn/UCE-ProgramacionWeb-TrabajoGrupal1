package com.programacion.web.mapper;

import com.programacion.web.modelo.Post;
import io.helidon.dbclient.DbRow;

public class PostMapper {
    public static Post mapRow(DbRow row) {
        return new Post(
                row.column("id").as(Integer.class).get(),
                row.column("user_id").as(Integer.class).get(), // FK mapeada de la BD[cite: 1]
                row.column("title").as(String.class).get(),
                row.column("body").as(String.class).get()
        );
    }
}