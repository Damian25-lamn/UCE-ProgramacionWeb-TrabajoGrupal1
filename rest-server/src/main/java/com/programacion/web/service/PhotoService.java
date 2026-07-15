package com.programacion.web.service;

import com.programacion.web.modelo.Photo;
import com.programacion.web.repository.AlbumRepository;
import com.programacion.web.repository.PhotoRepository;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import java.util.Optional;

public class PhotoService implements HttpService {

    private final PhotoRepository repository;
    private final AlbumRepository albumRepository; // Para validar FK

    public PhotoService(DbClient dbClient) {
        this.repository = new PhotoRepository(dbClient);
        this.albumRepository = new AlbumRepository(dbClient);
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
        Optional<Photo> photo = repository.findById(id);
        if (photo.isPresent()) {
            response.send(photo.get());
        } else {
            response.status(Status.NOT_FOUND_404).send();
        }
    }

    private void insert(ServerRequest request, ServerResponse response) {
        Photo photo = request.content().as(Photo.class);

        // Validación de FK: albumId debe existir
        if (albumRepository.findById(photo.getAlbumId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("albumId no existe"));
            return;
        }

        Integer id = repository.insert(photo);
        photo.setId(id);
        response.status(Status.CREATED_201).send(photo);
    }

    private void update(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Photo photo = request.content().as(Photo.class);

        // Validación de FK: albumId debe existir
        if (albumRepository.findById(photo.getAlbumId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("albumId no existe"));
            return;
        }

        long rows = repository.update(id, photo);
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