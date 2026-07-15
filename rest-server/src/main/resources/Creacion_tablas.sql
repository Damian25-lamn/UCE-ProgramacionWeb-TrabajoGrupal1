-- 1. Tabla de Usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    website VARCHAR(255)
);

-- 2. Tabla de Publicaciones (Relación: User 1 -> N Post)
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    CONSTRAINT fk_posts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabla de Comentarios (Relación: Post 1 -> N Comment)
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    CONSTRAINT fk_comments_post FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 4. Tabla de Álbumes (Relación: User 1 -> N Album)
CREATE TABLE albums (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    CONSTRAINT fk_albums_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Tabla de Fotos (Relación: Album 1 -> N Photo)
CREATE TABLE photos (
    id SERIAL PRIMARY KEY,
    album_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500) NOT NULL,
    CONSTRAINT fk_photos_album FOREIGN KEY (album_id) REFERENCES albums(id) ON DELETE CASCADE
);

-- 6. Tabla de Tareas/Todos (Relación: User 1 -> N Todo)
CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT fk_todos_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);