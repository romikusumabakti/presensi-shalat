import express from "express";
import cors from "cors";
import { pool } from "../db.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json()); // bawaan framework

app.use(
  cors({
    origin: ["http://localhost:5173", "https://presensi-shalat.vercel.app"],
  })
); // pihak ketiga

app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    next();
  } else {
    res.send('URL tidak valid (URL harus diawali "/api").');
  }
}); // buatan sendiri

// Login
app.post("/api/v1/login", async (req, res) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    req.body.username,
  ]);
  if (result.rows.length > 0) {
    const user = result.rows[0];
    if (await argon2.verify(user.password, req.body.password)) {
      const token = jwt.sign(user, process.env.SECRET_KEY);
      res.send({
        token,
        message: "Login berhasil.",
      });
    } else {
      res.status(401);
      res.send("Kata sandi salah.");
    }
  } else {
    res.status(404);
    res.send(
      `Pengguna dengan nama pengguna ${req.body.username} tidak ditemukan.`
    );
  }
});

// Register
app.post("/api/v1/register", async (req, res) => {
  const hash = await argon2.hash(req.body.password);
  await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [
    req.body.username,
    hash,
  ]);
  res.send("Pendaftaran berhasil.");
});

// Middleware otentikasi
app.use((req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    if (authorization.startsWith("Bearer ")) {
      const token = authorization.split(" ")[1];
      try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
      } catch (error) {
        res.send("Token tidak valid.");
      }
    } else {
      res.send('Otorisasi tidak valid (harus "Bearer").');
    }
  } else {
    res.send("Anda belum login (tidak ada otorisasi).");
  }
});

// Welcome
app.get("/api/v1", async (req, res) => {
  res.send(`Selamat datang ${req.user.username} di Sistem Presensi Shalat!`);
});

// Get all students
app.get("/api/v1/students", async (_req, res) => {
  const result = await pool.query("SELECT * FROM students");
  res.json(result.rows);
});

// Add student
app.post("/api/v1/students", async (req, res) => {
  const result = await pool.query(
    "INSERT INTO students (name, generation) VALUES ($1, $2) RETURNING *",
    [req.body.name, req.body.generation]
  );
  res.json({
    student: result.rows[0],
    message: "Mahasiswa berhasil ditambahkan.",
  });
});

// Get student by ID
app.get("/api/v1/students/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM students WHERE id = $1", [
    req.params.id,
  ]);
  res.json(result.rows[0]);
});

// Edit student by ID
app.put("/api/v1/students/:id", async (req, res) => {
  await pool.query(
    "UPDATE students SET name = $1, generation = $2 WHERE id = $3",
    [req.body.name, req.body.generation, req.params.id]
  );
  res.send("Mahasiswa berhasil diedit.");
});

// Set present by ID
app.put("/api/v1/students/:id/present", async (req, res) => {
  await pool.query("UPDATE students SET present = $1 WHERE id = $2", [
    req.body.present,
    req.params.id,
  ]);
  res.json(req.body.present);
});

// Delete student by ID
app.delete("/api/v1/students/:id", async (req, res) => {
  await pool.query("DELETE FROM students WHERE id = $1", [req.params.id]);
  res.send("Mahasiswa berhasil dihapus.");
});

app.listen(3000, () => console.log("Server berhasil dijalankan."));
