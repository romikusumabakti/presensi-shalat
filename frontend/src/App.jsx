import { Link, Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <header className="p-4 flex gap-8 shadow-md">
        <Link to="/" className="font-bold text-xl">
          Getch
        </Link>
        <nav className="flex gap-4">
          <Link to="/">Beranda</Link>
          <Link to="/prayer">Presensi Shalat</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>
      <Outlet />
      <footer className="border-t border-gray-300 p-2 text-center">
        &copy; 2024 Getch
      </footer>
    </>
  );
}
