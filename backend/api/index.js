import express from "express";
import cors from "cors";
import { pool } from "../db.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://presensi-shalat.vercel.app",
  })
);

// Hello world
app.get("/api/v1", async (_req, res) => {
  res.send("Selamat datang di Sistem Presensi Shalat!");
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
