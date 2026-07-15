package com.programacion.web.service;

import com.programacion.web.modelo.Todo;
import com.programacion.web.repository.TodoRepository;
import com.programacion.web.repository.UserRepository;
import io.helidon.dbclient.DbClient;
import io.helidon.http.Status;
import io.helidon.webserver.http.HttpRules;
import io.helidon.webserver.http.HttpService;
import io.helidon.webserver.http.ServerRequest;
import io.helidon.webserver.http.ServerResponse;
import java.util.Optional;

public class TodoService implements HttpService {

    private final TodoRepository repository;
    private final UserRepository userRepository; // Para validar FK

    public TodoService(DbClient dbClient) {
        this.repository = new TodoRepository(dbClient);
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
        Optional<Todo> todo = repository.findById(id);
        if (todo.isPresent()) {
            response.send(todo.get());
        } else {
            response.status(Status.NOT_FOUND_404).send();
        }
    }

    private void insert(ServerRequest request, ServerResponse response) {
        Todo todo = request.content().as(Todo.class);

        // Validación de FK: userId debe existir
        if (userRepository.findById(todo.getUserId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("userId no existe"));
            return;
        }

        Integer id = repository.insert(todo);
        todo.setId(id);
        response.status(Status.CREATED_201).send(todo);
    }

    private void update(ServerRequest request, ServerResponse response) {
        Integer id = Integer.parseInt(request.path().pathParameters().get("id"));
        Todo todo = request.content().as(Todo.class);

        // Validación de FK: userId debe existir
        if (userRepository.findById(todo.getUserId()).isEmpty()) {
            response.status(Status.BAD_REQUEST_400)
                    .send(new ErrorResponse("userId no existe"));
            return;
        }

        long rows = repository.update(id, todo);
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