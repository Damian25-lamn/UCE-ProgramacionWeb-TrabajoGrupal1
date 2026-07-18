package com.programacion.web.service;

import com.programacion.web.modelo.Post;
import com.programacion.web.repository.PostRepository;
import com.programacion.web.repository.UserRepository;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import java.util.Optional;

public class PostService implements HttpService {

    private final PostRepository repository;
    private final UserRepository userRepository;

    public PostService(DbClient dbClient) {
        this.repository = new PostRepository(dbClient);
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
        Optional<Post> post = repository.findById(id);
        if (post.isPresent()) {
            response.send(post.get());
        } else {
            response.status(Status.NOT_FOUND_404).send();
        }
    }

    private void insert(ServerRequest request, ServerResponse response) {
        Post post = request.content().as(Post.class);

        if (userRepository.findById(post.getUserId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("userId no existe"));
            return;
        }

        Integer id = repository.insert(post);
        post.setId(id);
        response.status(Status.CREATED_201).send(post);
    }

    private void update(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Post post = request.content().as(Post.class);

        if (userRepository.findById(post.getUserId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("userId no existe"));
            return;
        }

        long rows = repository.update(id, post);
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