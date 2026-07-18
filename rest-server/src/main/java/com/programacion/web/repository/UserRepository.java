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

    //GET /api/users
    public List<User> findAll() {
        return dbClient.execute()
                .query("""
                    SELECT id, name, username, email, phone, website, 
                           address_street, address_suite, address_city, address_zipcode, 
                           geo_lat, geo_lng, company_name, company_catch_phrase, company_bs 
                    FROM users
                    """)
                .map(UserMapper::mapRow)
                .toList();
    }

    //GET /api/users/{id}
    public Optional<User> findById(Integer id) {
        return dbClient.execute()
                .get("""
                    SELECT id, name, username, email, phone, website, 
                           address_street, address_suite, address_city, address_zipcode, 
                           geo_lat, geo_lng, company_name, company_catch_phrase, company_bs 
                    FROM users WHERE id = ?
                    """,
                        id
                )
                .map(UserMapper::mapRow);
    }

    //POST /api/users
    public Integer insert(User user) {
        DbRow row = dbClient.execute()
                .get("""
                    INSERT INTO users
                    (name, username, email, phone, website, 
                     address_street, address_suite, address_city, address_zipcode, 
                     geo_lat, geo_lng, company_name, company_catch_phrase, company_bs)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    RETURNING id
                    """,
                        user.getName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getWebsite(),
                        user.getAddress().getStreet(),
                        user.getAddress().getSuite(),
                        user.getAddress().getCity(),
                        user.getAddress().getZipcode(),
                        user.getAddress().getGeo().getLat(),
                        user.getAddress().getGeo().getLng(),
                        user.getCompany().getName(),
                        user.getCompany().getCatchPhrase(),
                        user.getCompany().getBs())
                .orElseThrow(() ->
                        new RuntimeException("No se pudo insertar el usuario"));

        return row.column("id")
                .as(Integer.class)
                .get();
    }

    //PUT /api/users/{id}
    public long update(Integer id, User user) {
        return dbClient.execute()
                .dml("""
                    UPDATE users
                    SET name = ?, username = ?, email = ?, phone = ?, website = ?,
                        address_street = ?, address_suite = ?, address_city = ?, address_zipcode = ?,
                        geo_lat = ?, geo_lng = ?, company_name = ?, company_catch_phrase = ?, company_bs = ?
                    WHERE id = ?
                    """,
                        user.getName(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getPhone(),
                        user.getWebsite(),
                        user.getAddress().getStreet(),
                        user.getAddress().getSuite(),
                        user.getAddress().getCity(),
                        user.getAddress().getZipcode(),
                        user.getAddress().getGeo().getLat(),
                        user.getAddress().getGeo().getLng(),
                        user.getCompany().getName(),
                        user.getCompany().getCatchPhrase(),
                        user.getCompany().getBs(),
                        id);
    }

    //DELETE /api/users/{id}
    public long delete(Integer id) {
        return dbClient.execute()
                .dml("DELETE FROM users WHERE id = ?", id);
    }
}
