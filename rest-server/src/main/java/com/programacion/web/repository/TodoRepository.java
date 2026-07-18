package com.programacion.web.repository;

import com.programacion.web.mapper.TodoMapper;
import com.programacion.web.modelo.Todo;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;
import java.util.List;
import java.util.Optional;

public class TodoRepository {
    private final DbClient dbClient;

    public TodoRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    // GET /api/todos
    public List<Todo> findAll() {
        return dbClient.execute()
                .query("SELECT id, user_id, title, completed FROM todos")
                .map(TodoMapper::mapRow)
                .toList();
    }

    // GET /api/todos/{id}
    public Optional<Todo> findById(Integer id) {
        return dbClient.execute()
                .get("SELECT id, user_id, title, completed FROM todos WHERE id = ?", id)
                .map(TodoMapper::mapRow);
    }

    // POST /api/todos
    public Integer insert(Todo todo) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO todos (user_id, title, completed)
                    VALUES (?, ?, ?)
                    RETURNING id
                    """,
                        todo.getUserId(),
                        todo.getTitle(),
                        todo.isCompleted())
                .orElseThrow(() -> new RuntimeException("No se pudo insertar la tarea"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    // PUT /api/todos/{id}
    public long update(Integer id, Todo todo) {
        return dbClient.execute()
                .dml("""
                    UPDATE todos
                    SET user_id = ?,
                        title = ?,
                        completed = ?
                    WHERE id = ?
                    """,
                        todo.getUserId(),
                        todo.getTitle(),
                        todo.isCompleted(),
                        id);
    }

    // DELETE /api/todos/{id}
    public long delete(Integer id) {
        return dbClient.execute()
                .dml("DELETE FROM todos WHERE id = ?", id);
    }
}