import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "./components/Button";
import { useState } from "react";
import StudentButton from "./components/StudentButton";
import { Plus } from "lucide-react";
import { useEffect } from "react";

export default function App() {
  const date = new Date();
  const [students, setStudents] = useState([]);
  const [editStudent, setEditStudent] = useState();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/students`)
      .then((response) => response.json())
      .then((students) => setStudents(students));
  }, []);

  function handleClick(student) {
    fetch(
      `${import.meta.env.VITE_API_BASE_URL}/v1/students/${student.id}/present`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          present: !student.present,
        }),
      }
    )
      .then((response) => response.json())
      .then((present) => {
        setStudents(
          students.map((s) =>
            s.id === student.id
              ? {
                  ...s,
                  present,
                }
              : s
          )
        );
      });
  }

  function handleDelete(student) {
    if (confirm("Apakah Anda yakin ingin menghapus mahasiswa ini?")) {
      fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/students/${student.id}`, {
        method: "DELETE",
      })
        .then((response) => response.text())
        .then((message) => {
          setStudents(students.filter((s) => s.id !== student.id));
          alert(message);
        });
    }
  }

  function handleEdit(student) {
    setEditStudent(student);
  }

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const sortedStudents = students.toSorted(
    (a, b) => a.generation - b.generation
  );

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between items-center shadow-lg p-1">
        <Button>
          <ChevronLeft />
        </Button>
        Dzuhur,{" "}
        {date.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        <Button>
          <ChevronRight />
        </Button>
      </header>
      <main className="overflow-y-auto grow flex divide-x divide-gray-400 [&>*]:flex-1 [&>*]:flex [&>*]:flex-col [&>*]:divide-y [&>*]:divide-gray-400">
        <div>
          <strong className="text-center p-1">Belum hadir</strong>
          <div className="overflow-y-auto flex flex-col gap-1 p-1">
            {sortedStudents
              .filter((student) => !student.present)
              .map((student) => (
                <StudentButton
                  key={student.id}
                  student={student}
                  onClick={handleClick}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
          </div>
        </div>
        <div>
          <strong className="text-center p-1">Hadir</strong>
          <div className="overflow-y-auto flex flex-col gap-1 p-1">
            {sortedStudents
              .filter((student) => student.present)
              .map((student) => (
                <StudentButton
                  key={student.id}
                  student={student}
                  onClick={handleClick}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              ))}
          </div>
        </div>
      </main>
      <footer className="border-t border-gray-400 p-1 flex gap-1">
        <Button onClick={() => setEditStudent({ present: false })}>
          <Plus />
          Tambah
        </Button>
        <input placeholder="Cari" className="grow" />
      </footer>
      {editStudent && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
          <form className="bg-white p-8 rounded flex flex-col gap-4">
            <h1 className="text-xl">
              {editStudent.id ? "Edit" : "Tambah"} mahasiswa
            </h1>
            <div className="flex flex-col">
              <label htmlFor="name">Nama</label>
              <input
                id="name"
                type="text"
                value={editStudent.name}
                onChange={(e) =>
                  setEditStudent({ ...editStudent, name: e.target.value })
                }
                autoFocus
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="generation">Angkatan</label>
              <input
                id="generation"
                type="number"
                value={editStudent.generation}
                onChange={(e) =>
                  setEditStudent({
                    ...editStudent,
                    generation: parseInt(e.target.value),
                  })
                }
              />
            </div>
            <div className="flex justify-between">
              <Button onClick={() => setEditStudent()}>Batal</Button>
              <Button
                onClick={() => {
                  if (editStudent.id) {
                    // kalo edit
                    fetch(
                      `http://localhost:3000/api/v1/students/${editStudent.id}`,
                      {
                        method: "PUT",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(editStudent),
                      }
                    )
                      .then((response) => response.text())
                      .then((message) => {
                        setStudents(
                          students.map((s) =>
                            s.id === editStudent.id ? editStudent : s
                          )
                        ); // memodifikasi mahasiswa yang ID-nya sesuai
                        alert(message);
                      });
                  } else {
                    // kalo tambah
                    fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/students`, {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(editStudent),
                    })
                      .then((response) => response.json())
                      .then((data) => {
                        setStudents([...students, data.student]); // membuat objek mahasiswa baru dan menggabungkannya ke array
                        alert(data.message);
                      });
                  }
                  setEditStudent();
                }}
              >
                Simpan
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
