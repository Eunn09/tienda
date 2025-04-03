const express = require("express");
const cors = require("cors"); // Importa cors
const app = express();
const PORT = process.env.PORT || 3001;
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'toto_jk9514Th99',
  database: 'tienda'
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conexión segura con la base de datos establecida");
});

const corsOptions = {
  origin: "https://janineriveradanielasanchezserna-drab-kappa.vercel.app", // Permitir solo tu dominio de frontend
  methods: ["GET", "POST", "OPTIONS"], // Métodos permitidos
  allowedHeaders: ["Content-Type"], // Encabezados permitidos
  credentials: true,  // Si necesitas enviar cookies o autenticación
};

app.use(cors(corsOptions));  // Aplicar los encabezados de CORS a todas las rutas

// Middleware para parsear JSON
app.use(express.json());


// Ruta para iniciar sesión
app.post("/api/login", (req, res) => {
  const { email, contrasena } = req.body;

  // Verificar si el email y la contraseña coinciden en la base de datos
  db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, results) => {
    if (err) return res.status(500).send({ error: "Error al verificar el usuario", details: err });
    
    if (results.length === 0) {
      return res.status(404).send({ error: "Usuario no encontrado" });
    }

    // Aquí compararías la contraseña, por ahora lo hacemos de manera simple
    if (results[0].contrasena !== contrasena) {
      return res.status(401).send({ error: "Contraseña incorrecta" });
    }

    // Si la contraseña es correcta, responder con un mensaje de éxito o un token
    // En este caso solo devolvemos el id del usuario como ejemplo
    res.json({
      message: "Inicio de sesión exitoso",
      userId: results[0].id,
      userName: results[0].nombre
    });
  });
});


// Ruta para obtener todos los usuarios
app.get("/api/usuarios", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).send({ error: "Error al obtener usuarios", details: err });
    res.json(results);
  });
});

app.post("/api/usuarios", (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)",
    [nombre, email, contrasena, rol],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error al crear el usuario", details: err });
      res.status(201).json({ message: "Usuario creado exitosamente", id: results.insertId });
    }
  );
});

app.delete("/api/usuarios/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send({ error: "Error al eliminar usuario", details: err });
    if (results.affectedRows === 0) return res.status(404).send({ error: "Usuario no encontrado" });
    res.send({ message: "Usuario eliminado exitosamente" });
  });
});

// Rutas para la gestión de productos
app.get("/api/productos", (req, res) => {
  db.query("SELECT * FROM productos", (err, results) => {
    if (err) return res.status(500).send({ error: "Error al obtener productos", details: err });
    res.json(results);
  });
});

app.get("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM productos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send({ error: "Error al obtener producto", details: err });
    if (results.length === 0) return res.status(404).send({ error: "Producto no encontrado" });
    res.json(results[0]);
  });
});

app.post("/api/productos", (req, res) => {
  const { nombre, descripcion, precio, stock } = req.body;
  db.query(
    "INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)",
    [nombre, descripcion, precio, stock],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error al agregar producto", details: err });
      res.status(201).json({ message: "Producto agregado exitosamente", id: results.insertId });
    }
  );
});

app.put("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;
  db.query(
    "UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?",
    [nombre, descripcion, precio, stock, id],
    (err, results) => {
      if (err) return res.status(500).json({ error: "Error al actualizar producto", details: err });
      if (results.affectedRows === 0) return res.status(404).send({ error: "Producto no encontrado" });
      res.json({ message: "Producto actualizado exitosamente" });
    }
  );
});

app.delete("/api/productos/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM productos WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).send({ error: "Error al eliminar producto", details: err });
    if (results.affectedRows === 0) return res.status(404).send({ error: "Producto no encontrado" });
    res.send({ message: "Producto eliminado exitosamente" });
  });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});