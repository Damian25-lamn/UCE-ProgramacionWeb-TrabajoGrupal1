package com.programacion.web;

import com.programacion.web.config.GlobalExceptionHandler;
import com.programacion.web.service.*;
import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Method;
import io.helidon.http.Status;
import io.helidon.webserver.WebServer;
import io.helidon.webserver.http.HttpRouting;

public class Main {
    public static void main(String[] args) {

        //Cargar la configuración desde application.yaml
        Config config = Config.create();

        //Inicializar DbClient
        DbClient dbClient = DbClient.builder(config.get("db")).build();

        //Levantar el WebServer con CORS habilitado
        WebServer server = WebServer.builder()
                .config(config.get("server"))
                .routing(routing -> configureRouting(routing, dbClient))
                .build()
                .start();

        System.out.println("Servidor Helidon SE corriendo en: http://localhost:" + server.port());
    }

    private static void configureRouting(HttpRouting.Builder routing, DbClient dbClient) {
        //Registrar el filtro global usando addFilter en Helidon SE 4
        routing.addFilter((chain, req, res) -> {
            res.header("Access-Control-Allow-Origin", "http://localhost:5173");
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type");

            //Verificar si es una petición preflight
            if (req.prologue().method().equals(Method.OPTIONS)) {
                res.status(Status.NO_CONTENT_204).send(); //Responde 204
            } else {
                chain.proceed();
            }
        });

        //El Manejador Global de Excepciones atrapará cualquier excepción que ocurra en los endpoints y llamará al handler
        routing.error(Throwable.class, GlobalExceptionHandler::handle);

        //Registro de servicios CRUD
        routing.register("/api/users", new UserService(dbClient));
        routing.register("/api/posts", new PostService(dbClient));
        routing.register("/api/comments", new CommentService(dbClient));
        routing.register("/api/albums", new AlbumService(dbClient));
        routing.register("/api/photos", new PhotoService(dbClient));
        routing.register("/api/todos", new TodoService(dbClient));
    }
}