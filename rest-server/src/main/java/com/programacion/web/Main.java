package com.programacion.web;

import com.programacion.web.config.GlobalExceptionHandler;
import com.programacion.web.service.*;
import io.helidon.config.Config;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Method;
import io.helidon.http.Status;
import io.helidon.webserver.WebServer;
import io.helidon.webserver.http.HttpRouting;

//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.
public class Main {
    public static void main(String[] args) {

        // 1. Cargar la configuración desde application.yaml
        Config config = Config.create();

        // 2. Inicializar el DbClient
        DbClient dbClient = DbClient.builder(config.get("db")).build();

        // 3. Levantar el WebServer con CORS habilitado
        WebServer server = WebServer.builder()
                .config(config.get("server"))
                .routing(routing -> configureRouting(routing, dbClient))
                .build()
                .start();

        System.out.println("Servidor Helidon SE corriendo en: http://localhost:" + server.port());
    }

    private static void configureRouting(HttpRouting.Builder routing, DbClient dbClient) {
        // Registramos el filtro global usando addFilter en Helidon SE 4
        routing.addFilter((chain, req, res) -> {
            res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // Origen de Vite
            res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Content-Type");

            // Verificamos si es una petición preflight (OPTIONS)
            if (req.prologue().method().equals(Method.OPTIONS)) {
                res.status(Status.NO_CONTENT_204).send(); // Responde 204 sin contenido
            } else {
                chain.proceed(); // Permite continuar hacia los endpoints reales (GET, POST, etc.)
            }
        });

        // 2. REGISTRAR EL MANEJADOR GLOBAL DE EXCEPCIONES
        // Esto atrapará cualquier excepción (Throwable) que ocurra en los endpoints y llamará a nuestro handler
        routing.error(Throwable.class, GlobalExceptionHandler::handle);

        // 3. Registro de tus servicios CRUD
        routing.register("/api/users", new UserService(dbClient));
        routing.register("/api/posts", new PostService(dbClient));
        routing.register("/api/comments", new CommentService(dbClient));
        routing.register("/api/albums", new AlbumService(dbClient));
        routing.register("/api/photos", new PhotoService(dbClient));
        routing.register("/api/todos", new TodoService(dbClient));
    }
}