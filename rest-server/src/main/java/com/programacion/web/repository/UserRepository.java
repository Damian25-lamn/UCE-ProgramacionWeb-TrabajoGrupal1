package com.programacion.web.repository;

import com.programacion.web.mapper.UserMapper;
import com.programacion.web.modelo.User;
import io.helidon.dbclient.DbClient;
import io.helidon.dbclient.DbRow;

import java.util.List;
import java.util.Optional;

public class UserRepository {
    private final DbClient dbClient;

    public UserRepository(DbClient dbClient) {
        this.dbClient = dbClient;
    }

    // 1. OBTENER TODOS LOS USUARIOS (GET /api/users)
    public List<User> findAll() {

        return dbClient.execute()
                .query("SELECT id, name, username, email, phone, website FROM users")
                .map(UserMapper::mapRow)
                .toList();

    }

    // 2. BUSCAR POR ID (GET /api/users/{id})
    public Optional<User> findById(Integer id) {
        return dbClient.execute()
                .get("SELECT id, name, username, email, phone, website FROM users WHERE id = ?",
                        id
                )
                .map(UserMapper::mapRow);
    }

    // 3. INSERTAR UN NUEVO REGISTRO (POST /api/users)
    public Integer insert(User user) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO users
                    (name, username, email, phone, website)
                    VALUES (?, ?, ?, ?, ?)
                    RETURNING id
                    """,
                        user.getName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getWebsite())
                .orElseThrow(() ->
                        new RuntimeException("No se pudo insertar el usuario"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    // 4. ACTUALIZAR UN REGISTRO EXISTENTE (PUT /api/users/{id})
    // Retorna el número de filas afectadas (debe ser 1 si el ID existía)
    public long update(Integer id, User user) {
        return dbClient.execute()
                .dml("""
                    UPDATE users
                    SET name = ?,
                        username = ?,
                        email = ?,
                        phone = ?,
                        website = ?
                    WHERE id = ?
                    """,
                        user.getName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getWebsite(),
                        id);
    }

    // 5. ELIMINAR UN REGISTRO (DELETE /api/users/{id})
    public long delete(Integer id) {
        return dbClient.execute()
                .dml(
                        "DELETE FROM users WHERE id = ?",
                        id
                );
    }
}
