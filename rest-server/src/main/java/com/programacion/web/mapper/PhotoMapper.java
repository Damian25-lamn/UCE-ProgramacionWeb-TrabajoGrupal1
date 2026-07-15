package com.programacion.web.mapper;

import com.programacion.web.modelo.Photo;
import io.helidon.dbclient.DbRow;

public class PhotoMapper {
    public static Photo mapRow(DbRow row) {
        return new Photo(
                row.column("id").as(Integer.class).get(),
                row.column("album_id").as(Integer.class).get(), // FK mapeada de la BD[cite: 1]
                row.column("title").as(String.class).get(),
                row.column("url").as(String.class).get(),
                row.column("thumbnail_url").as(String.class).get()
        );
    }
}