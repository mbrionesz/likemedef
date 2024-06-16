-- Crear la tabla posts si no existe
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  titulo VARCHAR(25),
  img VARCHAR(1000),
  descripcion VARCHAR(255),
  likes INT
);


-- Para ver la tabla con los datos colocados en front de los posts, ir a la app psql shell, iniciar con respectivas
-- credenciales, puerto y contraseña, seleccionar la db creada /c likeme y select * from posts;