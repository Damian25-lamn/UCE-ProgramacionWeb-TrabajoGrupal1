package com.programacion.web.repository;

import com.programacion.web.mapper.AlbumMapper;
import com.programacion.web.modelo.Album;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import java.util.List;
import java.util.Optional;

public class AlbumRepository {
    private final DbClient dbClient;

    public AlbumRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    // GET /api/albums
    public List<Album> findAll() {
        return dbClient.execute()
                .query("SELECT id, user_id, title FROM albums")
                .map(AlbumMapper::mapRow)
                .toList();
    }

    // GET /api/albums/{id}
    public Optional<Album> findById(Integer id) {
        return dbClient.execute()
                .get("SELECT id, user_id, title FROM albums WHERE id = ?", id)
                .map(AlbumMapper::mapRow);
    }

    // POST /api/albums
    public Integer insert(Album album) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO albums (user_id, title)
                    VALUES (?, ?)
                    RETURNING id
                    """,
                        album.getUserId(),
                        album.getTitle())
                .orElseThrow(() -> new RuntimeException("No se pudo insertar el álbum"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    // PUT /api/albums/{id}
    public long update(Integer id, Album album) {
        return dbClient.execute()
                .dml("""
                    UPDATE albums
                    SET user_id = ?,
                        title = ?
                    WHERE id = ?
                    """,
                        album.getUserId(),
                        album.getTitle(),
                        id);
    }

    // DELETE /api/albums/{id}
    public long delete(Integer id) {
        return dbClient.execute().dml("DELETE FROM albums WHERE id = ?", id);
    }
}
