import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import { useLogin } from "@/hooks/useLogin.js";
import { useAuthContext } from "@/hooks/useAuthContext";
import heroBackground from "@/components/homepage/herobackground.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect based on user role
      switch (user.role) {
        case "customer":
          navigate("/customer");
          break;
        case "store_owner":
          navigate("/store-dashboard");
          break;
        case "super_admin":
          navigate("/admin");
          break;
        default:
          navigate("/");
      }
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };

  return (
    <div
      className="flex items-center justify-center h-screen overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${heroBackground})`,
        height: "100vh",
      }}
    >
      <div className="w-full max-w-sm bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label>Email</Label>
            <Input
              required
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <Input
              required
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
          <Button disabled={isLoading}>Log in</Button>
          {error && (
            <div className="text-red-500 mt-4 flex items-center justify-center">
              {error}
            </div>
          )}
        </form>
        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Link
            to="/register-non-user"
            className="block w-full py-2 px-4 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-md transition-colors duration-200"
          >
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
