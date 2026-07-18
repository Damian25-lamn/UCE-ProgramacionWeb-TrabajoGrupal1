package com.programacion.web.mapper;

import com.programacion.web.modelo.Address;
import com.programacion.web.modelo.Company;
import com.programacion.web.modelo.Geo;
import com.programacion.web.modelo.User;
import io.helidon.dbclient.DbRow;

public class UserMapper {
    public static User mapRow(DbRow row) {
        Geo geo = new Geo(
                row.column("geo_lat").as(String.class).orElse(""),
                row.column("geo_lng").as(String.class).orElse("")
        );

        Address address = new Address(
                row.column("address_street").as(String.class).orElse(""),
                row.column("address_suite").as(String.class).orElse(""),
                row.column("address_city").as(String.class).orElse(""),
                row.column("address_zipcode").as(String.class).orElse(""),
                geo
        );

        Company company = new Company(
                row.column("company_name").as(String.class).orElse(""),
                row.column("company_catch_phrase").as(String.class).orElse(""),
                row.column("company_bs").as(String.class).orElse("")
        );

        return new User(
                row.column("id").as(Integer.class).get(),
                row.column("name").as(String.class).get(),
                row.column("username").as(String.class).get(),
                row.column("email").as(String.class).get(),
                row.column("phone").as(String.class).orElse(""),
                row.column("website").as(String.class).orElse(""),
                address,
                company
        );
    }

}
