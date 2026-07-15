-- Insertar un Usuario inicial
INSERT INTO users (id, name, username, email, phone, website) 
VALUES (1, 'Anthony Minda', 'anthonyminda', 'anthony@mail.com', '0999999999', 'github.com/anthony');

-- Insertar una Publicación
INSERT INTO posts (id, user_id, title, body) 
VALUES (1, 1, 'Mi Primer Post en Helidon', 'Este es el cuerpo del post para probar la persistencia con DbClient.');

-- Insertar un Comentario
INSERT INTO comments (id, post_id, name, email, body) 
VALUES (1, 1, 'Santiago Villarreal', 'santiago@mail.com', '¡Excelente inicio de proyecto!');

-- Insertar un Álbum
INSERT INTO albums (id, user_id, title) 
VALUES (1, 1, 'Fotos del Proyecto');

-- Insertar una Foto asignada al Álbum
INSERT INTO photos (id, album_id, title, url, thumbnail_url) 
VALUES (1, 1, 'Arquitectura Helidon', 'http://ejemplo.com/foto.png', 'http://ejemplo.com/thumb.png');

-- Insertar una Tarea pendiente
INSERT INTO todos (id, user_id, title, completed) 
VALUES (1, 1, 'Migrar capa de persistencia a DbClient', false);

-- Ajustar los generadores de secuencia para evitar choques en los POSTs futuros
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('posts_id_seq', (SELECT MAX(id) FROM posts));
SELECT setval('comments_id_seq', (SELECT MAX(id) FROM comments));
SELECT setval('albums_id_seq', (SELECT MAX(id) FROM albums));
SELECT setval('photos_id_seq', (SELECT MAX(id) FROM photos));
SELECT setval('todos_id_seq', (SELECT MAX(id) FROM todos));