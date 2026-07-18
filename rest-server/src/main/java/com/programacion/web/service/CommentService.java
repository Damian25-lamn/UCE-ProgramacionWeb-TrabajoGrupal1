package com.programacion.web.service;

import com.programacion.web.modelo.Comment;
import com.programacion.web.repository.CommentRepository;
import com.programacion.web.repository.PostRepository;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import java.util.Optional;

public class CommentService implements HttpService {

    private final CommentRepository repository;
    private final PostRepository postRepository;

    public CommentService(DbClient dbClient) {
        this.repository = new CommentRepository(dbClient);
        this.postRepository = new PostRepository(dbClient);
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
        Optional<Comment> comment = repository.findById(id);
        if (comment.isPresent()) {
            response.send(comment.get());
        } else {
            response.status(Status.NOT_FOUND_404).send();
        }
    }

    private void insert(ServerRequest request, ServerResponse response) {
        Comment comment = request.content().as(Comment.class);

        if (postRepository.findById(comment.getPostId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("postId no existe"));
            return;
        }

        Integer id = repository.insert(comment);
        comment.setId(id);
        response.status(Status.CREATED_201).send(comment);
    }

    private void update(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Comment comment = request.content().as(Comment.class);

        if (postRepository.findById(comment.getPostId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("postId no existe"));
            return;
        }

        long rows = repository.update(id, comment);
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
