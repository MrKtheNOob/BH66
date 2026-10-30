import { useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import logo from "../../assets/logo-bh66-removebg.png";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { register, login } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
  });
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
      await register({
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      // this is highly brittle but lets roll with it
      await login({ email: form.email, password: form.password });
    } catch {
      setError("Impossible de créer le compte.");
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
          <h2 className="text-xl font-semibold">Créer un compte</h2>
          <p className="text-gray-500 text-sm">Rejoignez BH66</p>
        </div>

        {/* FORM */}
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            name="username"
            placeholder="Username"
            variant="light"
            value={form.username}
            onChange={onChange}
            autoComplete="username"
          />
          <Input
            name="email"
            placeholder="Email"
            variant="light"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />
          <Input
            name="phone"
            placeholder="Téléphone"
            variant="light"
            value={form.phone}
            onChange={onChange}
            autoComplete="tel"
          />
          <Input
            name="password"
            type="password"
            placeholder="Mot de passe"
            variant="light"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button fullWidth type="submit">
            {loading ? "Création..." : "Créer un compte"}
          </Button>
        </form>
        <form className="space-y-4" onSubmit={onSubmit}>
          <Input
            name="username"
            placeholder="Username"
            variant="light"
            value={form.username}
            onChange={onChange}
            autoComplete="username"
          />
          <Input
            name="email"
            placeholder="Email"
            variant="light"
            value={form.email}
            onChange={onChange}
            autoComplete="email"
          />
          <Input
            name="phone"
            placeholder="Téléphone"
            variant="light"
            value={form.phone}
            onChange={onChange}
            autoComplete="tel"
          />
          <Input
            name="password"
            type="password"
            placeholder="Mot de passe"
            variant="light"
            value={form.password}
            onChange={onChange}
            autoComplete="new-password"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button fullWidth type="submit">
            {loading ? "Création..." : "Créer un compte"}
          </Button>
        </form>

        {/* LINK */}
        <p className="text-sm text-center text-gray-500">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-yellow-500">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
