package com.programacion.web.mapper;

import com.programacion.web.modelo.Album;
import io.helidon.dbclient.DbRow;

public class AlbumMapper {
    public static Album mapRow(DbRow row) {
        return new Album(
                row.column("id").as(Integer.class).get(),
                row.column("user_id").as(Integer.class).get(), // FK mapeada de la BD
                row.column("title").as(String.class).get()
        );
    }
}