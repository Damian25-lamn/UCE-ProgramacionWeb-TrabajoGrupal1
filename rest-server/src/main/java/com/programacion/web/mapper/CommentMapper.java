package com.programacion.web.mapper;

import com.programacion.web.modelo.Comment;
import io.helidon.dbclient.DbRow;

public class CommentMapper {
    public static Comment mapRow(DbRow row) {
        return new Comment(
                row.column("id").as(Integer.class).get(),
                row.column("post_id").as(Integer.class).get(),
                row.column("name").as(String.class).get(),
                row.column("email").as(String.class).get(),
                row.column("body").as(String.class).get()
        );
    }
}