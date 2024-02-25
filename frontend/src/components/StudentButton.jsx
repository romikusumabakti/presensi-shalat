import { Trash2 } from "lucide-react";
import Button from "./Button";
import { Pencil } from "lucide-react";

export default function StudentButton({ student, onClick, onDelete, onEdit }) {
  return (
    <Button
      className={`relative flex flex-col gap-0 !text-black ${
        student.present
          ? "!bg-green-200 hover:!bg-green-300"
          : "!bg-red-200 hover:!bg-red-300"
      }`}
      onClick={() => onClick(student)}
    >
      <div>{student.name}</div>
      <div className="text-sm">Angkatan {student.generation}</div>
      <button
        className="absolute right-0 top-0 p-2"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(student);
        }}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <button
        className="absolute right-0 top-6 p-2"
        onClick={(e) => {
          e.stopPropagation();
          onEdit(student);
        }}
      >
        <Pencil className="w-4 h-4" />
      </button>
    </Button>
  );
}
