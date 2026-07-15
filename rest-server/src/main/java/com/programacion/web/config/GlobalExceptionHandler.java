package com.programacion.web.config;

import com.programacion.web.service.ErrorResponse;
import io.helidon.http.Status;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class GlobalExceptionHandler {
    public static void handle(ServerRequest request, ServerResponse response, Throwable throwable) {
        // Log del error real en la consola del servidor para poder depurar
        System.err.println("Excepción capturada por el manejador global: " + throwable.getMessage());
        throwable.printStackTrace();

        // 1. Errores de entrada inválida -> HTTP 400
        if (throwable instanceof NumberFormatException || throwable instanceof IllegalArgumentException) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("Entrada inválida o formato incorrecto: " + throwable.getMessage()));
        }
        // 2. Errores de persistencia o conexión a la Base de Datos -> HTTP 500
        else {
            response.status(Status.INTERNAL_SERVER_ERROR_500)
                    .send(new ErrorResponse("Fallo en la persistencia o error interno del servidor: " + throwable.getMessage()));
        }
    }
}
