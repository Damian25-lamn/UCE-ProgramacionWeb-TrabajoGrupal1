package com.programacion.web.config;

import com.programacion.web.service.ErrorResponse;
import io.helidon.http.Status;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

public class GlobalExceptionHandler {
    public static void handle(ServerRequest request, ServerResponse response, Throwable throwable) {
        //Log del error real en la consola del servidor para poder depurar
        System.err.println("Excepción capturada por el manejador global: " + throwable.getMessage());
        throwable.printStackTrace();

        //Errores de formato numérico en IDs
        if (throwable instanceof NumberFormatException) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("El ID debe ser numérico"));
        }
        //Errores de JSON malformado enviado por el frontend
        else if (throwable instanceof IllegalArgumentException || throwable.getClass().getName().contains("json")) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("Formato JSON inválido o campos incorrectos"));
        }
        //Fallos de persistencia
        else {
            response.status(Status.INTERNAL_SERVER_ERROR_500)
                    .send(new ErrorResponse("Error interno del servidor o fallo de persistencia"));
        }
    }
}
