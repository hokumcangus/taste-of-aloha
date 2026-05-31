import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../store/slices/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const { token, status, error, user } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("customer@tasteofaloha.dev");
  const [password, setPassword] = useState("password123");
  const [role, setRole] = useState("CUSTOMER");

  if (token && user) {
    return <Navigate to={`/dashboard/${user.role.toLowerCase()}`} replace />;
  }

  const submit = async (event) => {
    event.preventDefault();
    await dispatch(login({ email, password, role }));
  };

  return (
    <section className="container mx-auto max-w-lg p-6">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <p className="text-sm text-gray-600 mb-4">
        Set <code>ALLOW_DEV_AUTH_BOOTSTRAP=true</code> in backend env for first-time demo user
        creation.
      </p>
      <form onSubmit={submit} className="space-y-3 bg-white shadow rounded p-4">
        <input
          className="w-full border rounded p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <input
          className="w-full border rounded p-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <select
          className="w-full border rounded p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="ADMIN">Admin</option>
          <option value="KITCHEN">Kitchen</option>
          <option value="DRIVER">Driver</option>
        </select>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white rounded p-2 disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Signing in..." : "Sign in"}
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </section>
  );
}
