package com.programacion.web.repository;

import com.programacion.web.mapper.PostMapper;
import com.programacion.web.modelo.Post;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class PostRepository {
    private final DbClient dbClient;

    public PostRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    // 1. OBTENER TODOS (GET /api/posts)
    public List<Post> findAll() {
        return dbClient.execute()
                .query("SELECT id, user_id, title, body FROM posts")
                .map(PostMapper::mapRow)
                .toList();
    }

    // 2. BUSCAR POR ID (GET /api/posts/{id})
    public Optional<Post> findById(Integer id) {
        return dbClient.execute()
                .get("SELECT id, user_id, title, body FROM posts WHERE id = ?", id)
                .map(PostMapper::mapRow);
    }

    // 3. INSERTAR (POST /api/posts)
    public Integer insert(Post post) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO posts (user_id, title, body)
                    VALUES (?, ?, ?)
                    RETURNING id
                    """,
                        post.getUserId(),
                        post.getTitle(),
                        post.getBody())
                .orElseThrow(() -> new RuntimeException("No se pudo insertar el post"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    // 4. ACTUALIZAR (PUT /api/posts/{id})
    public long update(Integer id, Post post) {
        return dbClient.execute()
                .dml("""
                    UPDATE posts
                    SET user_id = ?,
                        title = ?,
                        body = ?
                    WHERE id = ?
                    """,
                        post.getUserId(),
                        post.getTitle(),
                        post.getBody(),
                        id);

    }

    // 5. ELIMINAR (DELETE /api/posts/{id})
    public long delete(Integer id) {
        return dbClient.execute()
                .dml("DELETE FROM posts WHERE id = ?", id);
    }
}
