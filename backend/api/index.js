import express from "express";
import cors from "cors";
import { connection } from "../db.js";

const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Hello world
app.get("/api/v1", async (_req, res) => {
  res.send("Selamat datang di Sistem Presensi Shalat!");
});

// Get all students
app.get("/api/v1/students", async (_req, res) => {
  const result = await connection.query("SELECT * FROM students");
  res.json(result);
});

// Add student
app.post("/api/v1/students", async (req, res) => {
  const result = await connection.query(
    "INSERT INTO students VALUES (NULL, ?, ?, FALSE) RETURNING *",
    [req.body.name, req.body.generation]
  );
  res.json({
    student: result[0],
    message: "Mahasiswa berhasil ditambahkan.",
  });
});

// Get student by ID
app.get("/api/v1/students/:id", async (req, res) => {
  const result = await connection.query("SELECT * FROM students WHERE id = ?", [
    req.params.id,
  ]);
  res.json(result[0]);
});

// Edit student by ID
app.put("/api/v1/students/:id", async (req, res) => {
  await connection.execute(
    "UPDATE students SET name = ?, generation = ? WHERE id = ?",
    [req.body.name, req.body.generation, req.params.id]
  );
  res.send("Mahasiswa berhasil diedit.");
});

// Set present by ID
app.put("/api/v1/students/:id/present", async (req, res) => {
  await connection.execute("UPDATE students SET present = ? WHERE id = ?", [
    req.body.present,
    req.params.id,
  ]);
  res.json(req.body.present);
});

// Delete student by ID
app.delete("/api/v1/students/:id", async (req, res) => {
  await connection.execute("DELETE FROM students WHERE id = ?", [
    req.params.id,
  ]);
  res.send("Mahasiswa berhasil dihapus.");
});

app.listen(3000, () => console.log("Server berhasil dijalankan."));
