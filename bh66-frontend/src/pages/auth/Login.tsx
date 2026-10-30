import { useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import logo from "../../assets/logo-bh66-removebg.png";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email: form.email, password: form.password });
    } catch {
      setError("Identifiants invalides.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 space-y-5">
        {/* LOGO */}
        <div className="flex flex-col items-center gap-2">
          <img src={logo} alt="logo" className="w-40" />
        </div>

        {/* TITLE */}
        <div className="text-center">
          <h2 className="text-xl font-semibold">Bienvenue</h2>
          <p className="text-gray-500 text-sm">Connectez-vous à votre compte</p>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            
            placeholder="Email"
            variant="light"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />
          <Input
            
            type="password"
            placeholder="Mot de passe"
            variant="light"
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button fullWidth type="submit">
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>

        {/* LINK */}
        <p className="text-sm text-center text-gray-500">
          Pas de compte ?{" "}
          <Link to="/register" className="text-yellow-500">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
