package com.programacion.web.service;

import com.programacion.web.modelo.Album;
import com.programacion.web.repository.AlbumRepository;
import com.programacion.web.repository.UserRepository;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import java.util.Optional;

public class AlbumService implements HttpService {

    private final AlbumRepository repository;
    private final UserRepository userRepository; // Para validar FK

    public AlbumService(DbClient dbClient) {
        this.repository = new AlbumRepository(dbClient);
        this.userRepository = new UserRepository(dbClient);
    }

    @Override
    public void routing(HttpRules rules) {
        rules.get("/", this::findAll);
        rules.get("/{id}", this::findById);
        rules.post("/", this::insert);
        rules.put("/{id}", this::update);
        rules.delete("/{id}", this::delete);
    }

    private void findAll(ServerRequest request, ServerResponse response) {
        response.send(repository.findAll());
    }

    private void findById(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Optional<Album> album = repository.findById(id);
        if (album.isPresent()) {
            response.send(album.get());
        } else {
            response.status(Status.NOT_FOUND_404).send();
        }
    }

    private void insert(ServerRequest request, ServerResponse response) {
        Album album = request.content().as(Album.class);

        // Validación de FK: userId debe existir
        if (userRepository.findById(album.getUserId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("userId no existe"));
            return;
        }

        Integer id = repository.insert(album);
        album.setId(id);
        response.status(Status.CREATED_201).send(album);
    }

    private void update(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Album album = request.content().as(Album.class);

        // Validación de FK: userId debe existir
        if (userRepository.findById(album.getUserId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("userId no existe"));
            return;
        }

        long rows = repository.update(id, album);
        if (rows == 0) {
            response.status(Status.NOT_FOUND_404).send();
        } else {
            response.status(Status.NO_CONTENT_204).send();
        }
    }

    private void delete(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        long rows = repository.delete(id);
        if (rows == 0) {
            response.status(Status.NOT_FOUND_404).send();
        } else {
            response.status(Status.NO_CONTENT_204).send();
        }
    }
}