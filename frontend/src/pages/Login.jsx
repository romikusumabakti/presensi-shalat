import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";
import { Loader } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          const message = await response.text();
          alert(message);
          setIsLoading(false);
        }
      })
      .then((data) => {
        localStorage.setItem("token", data.token);
        console.log(data.token);
        navigate("/");
        setIsLoggedIn(true);
        setIsLoading(false);
      });
  }

  if (isLoading) {
    return <Loader2 className="animate-spin text-blue-500" />;
  } else {
    if (isLoggedIn) {
      return "Login berhasil.";
    } else {
      return (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Nama pengguna</label>
            <input
              id="username"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Kata sandi</label>
            <input
              id="password"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button>Login</button>
        </form>
      );
    }
  }
}
