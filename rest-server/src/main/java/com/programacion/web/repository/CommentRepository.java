package com.programacion.web.repository;

import com.programacion.web.mapper.CommentMapper;
import com.programacion.web.modelo.Comment;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import java.util.List;
import java.util.Optional;

public class CommentRepository {
    private final DbClient dbClient;

    public CommentRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    // 1. OBTENER TODOS (GET /api/comments)
    public List<Comment> findAll() {
        return dbClient.execute()
                .query("SELECT id, post_id, name, email, body FROM comments")
                .map(CommentMapper::mapRow)
                .toList();
    }

    // 2. BUSCAR POR ID (GET /api/comments/{id})
    public Optional<Comment> findById(Integer id) {
        return dbClient.execute()
                .get("SELECT id, post_id, name, email, body FROM comments WHERE id = ?", id)
                .map(CommentMapper::mapRow);
    }

    // 3. INSERTAR (POST /api/comments)
    public Integer insert(Comment comment) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO comments (post_id, name, email, body)
                    VALUES (?, ?, ?, ?)
                    RETURNING id
                    """,
                        comment.getPostId(),
                        comment.getName(),
                        comment.getEmail(),
                        comment.getBody())
                .orElseThrow(() -> new RuntimeException("No se pudo insertar el comentario"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    // 4. ACTUALIZAR (PUT /api/comments/{id})
    public long update(Integer id, Comment comment) {
        return dbClient.execute()
                .dml("""
                    UPDATE comments
                    SET post_id = ?,
                        name = ?,
                        email = ?,
                        body = ?
                    WHERE id = ?
                    """,
                        comment.getPostId(),
                        comment.getName(),
                        comment.getEmail(),
                        comment.getBody(),
                        id);
    }

    // 5. ELIMINAR (DELETE /api/comments/{id})
    public long delete(Integer id) {
        return dbClient.execute()
                .dml("DELETE FROM comments WHERE id = ?", id);
    }
}