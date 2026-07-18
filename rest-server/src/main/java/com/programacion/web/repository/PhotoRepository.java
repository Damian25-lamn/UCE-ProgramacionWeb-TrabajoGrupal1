package com.programacion.web.repository;

import com.programacion.web.mapper.PhotoMapper;
import com.programacion.web.modelo.Photo;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import java.util.List;
import java.util.Optional;

public class PhotoRepository {
    private final DbClient dbClient;

    public PhotoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    // GET /api/photos
    public List<Photo> findAll() {
        return dbClient.execute()
                .query("SELECT id, album_id, title, url, thumbnail_url FROM photos")
                .map(PhotoMapper::mapRow)
                .toList();
    }

    // GET /api/photos/{id}
    public Optional<Photo> findById(Integer id) {
        return dbClient.execute()
                .get("SELECT id, album_id, title, url, thumbnail_url FROM photos WHERE id = ?", id)
                .map(PhotoMapper::mapRow);
    }

    // POST /api/photos
    public Integer insert(Photo photo) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO photos (album_id, title, url, thumbnail_url)
                    VALUES (?, ?, ?, ?)
                    RETURNING id
                    """,
                        photo.getAlbumId(),
                        photo.getTitle(),
                        photo.getUrl(),
                        photo.getThumbnailUrl())
                .orElseThrow(() -> new RuntimeException("No se pudo insertar la foto"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    // PUT /api/photos/{id}
    public long update(Integer id, Photo photo) {
        return dbClient.execute()
                .dml("""
                    UPDATE photos
                    SET album_id = ?,
                        title = ?,
                        url = ?,
                        thumbnail_url = ?
                    WHERE id = ?
                    """,
                        photo.getAlbumId(),
                        photo.getTitle(),
                        photo.getUrl(),
                        photo.getThumbnailUrl(),
                        id);
    }

    // DELETE /api/photos/{id}
    public long delete(Integer id) {
        return dbClient.execute()
                .dml("DELETE FROM photos WHERE id = ?", id);
    }
}