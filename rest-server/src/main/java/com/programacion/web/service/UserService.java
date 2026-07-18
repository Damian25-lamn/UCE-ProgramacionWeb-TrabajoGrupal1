package com.programacion.web.service;

import com.programacion.web.modelo.User;
import com.programacion.web.repository.UserRepository;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;

import java.util.Optional;

public class UserService implements HttpService {

    private final UserRepository repository;

    public UserService(DbClient dbClient){
        this.repository=new UserRepository(dbClient);
    }

    @Override
    public void routing(HttpRules rules) {
        rules.get("/", this::findAll);
        rules.get("/{id}", this::findById);
        rules.post("/", this::insert);
        rules.put("/{id}", this::update);
        rules.delete("/{id}", this::delete);
    }

    // GET /users
    private void findAll(ServerRequest request, ServerResponse response) {
        response.send(repository.findAll());
    }

    // GET /users/{id}
    private void findById(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Optional<User> user = repository.findById(id);

        if (user.isPresent()) {
            response.send(user.get());
        } else {
            response.status(Status.NOT_FOUND_404).send();
        }
    }

    // POST /users
    private void insert(ServerRequest request, ServerResponse response) {
        User user = request.content().as(User.class);
        Integer id = repository.insert(user);
        user.setId(id);
        response.status(Status.CREATED_201).send(user);
    }

    // PUT /users/{id}
    private void update(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        User user = request.content().as(User.class);
        long rows = repository.update(id, user);

        if (rows == 0) {
            response.status(Status.NOT_FOUND_404).send();
        } else {
            response.status(Status.NO_CONTENT_204).send();
        }
    }

    // DELETE /users/{id}
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