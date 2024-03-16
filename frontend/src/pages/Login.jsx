export default function Login() {
  function handleSubmit(e) {
    e.preventDefault();
    fetch(`${import.meta.env.VITE_API_BASE_URL}/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "romi",
        password: "1234",
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        console.log(data.token);
      });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Nama pengguna</label>
        <input id="username" type="text" />
      </div>
      <div>
        <label htmlFor="password">Kata sandi</label>
        <input id="password" type="password" />
      </div>
      <button>Login</button>
    </form>
  );
}
