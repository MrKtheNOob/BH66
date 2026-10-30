import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, CreditCard, Ruler,
  Bell, LogOut, ChevronRight, Settings,
} from "lucide-react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";
import api from "../../services/api";

type UserProfile = {
  username: string;
  email: string;
  phone: string;
};

const sections = [
  { icon: User,       label: "Informations personnelles", id: "infos" },
  { icon: MapPin,     label: "Mes adresses",              id: "addresses" },
  { icon: CreditCard, label: "Mes méthodes de paiement", id: "payment" },
  { icon: Ruler,      label: "Mes mesures",               id: "measurements" },
  { icon: Bell,       label: "Notifications",             id: "notifications" },
];

export default function Profil() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [form, setForm] = useState<UserProfile>({
    username: user?.username || "",
    email:    user?.email    || "",
    phone:    user?.phone    || "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("users/me", form);
      setActiveSection(null);
    } catch {
      alert("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-0 pt-5 sm:pt-0 space-y-3">

        {/* ── En-tête profil ── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Avatar */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-stone-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <User size={26} className="text-stone-500" />
              </div>
              {/* Infos */}
              <div className="min-w-0">
                <p className="text-[15px] sm:text-base font-bold text-gray-900 truncate">
                  {user?.username || "Utilisateur"}
                </p>
                <p className="text-[12px] sm:text-[13px] text-gray-400 truncate mt-0.5">
                  {user?.email || "email@exemple.com"}
                </p>
              </div>
            </div>
            {/* Icône settings */}
            <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 hover:bg-gray-200 transition-colors">
              <Settings size={14} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* ── Section active : Informations personnelles ── */}
        {activeSection === "infos" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-4">
              Informations personnelles
            </h2>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Nom complet</label>
                <Input name="username" placeholder="Votre nom" variant="light" icon={<User size={14} />} value={form.username} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Email</label>
                <Input name="email" type="email" placeholder="exemple@mail.com" variant="light" icon={<Mail size={14} />} value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-[12px] font-medium text-gray-500 mb-1">Téléphone</label>
                <Input name="phone" type="tel" placeholder="+221 70 123 45 67" variant="light" icon={<Phone size={14} />} value={form.phone} onChange={handleChange} />
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-500 text-[12px] font-medium hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <Button type="submit" className="flex-1 bg-gray-900 text-white text-[12px] font-semibold py-2.5 rounded-xl">
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* ── Placeholders autres sections ── */}
        {activeSection === "addresses" && (
          <PlaceholderSection icon={MapPin} label="Gestion des adresses à venir" onBack={() => setActiveSection(null)} />
        )}
        {activeSection === "payment" && (
          <PlaceholderSection icon={CreditCard} label="Méthodes de paiement à venir" onBack={() => setActiveSection(null)} />
        )}
        {activeSection === "measurements" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Ruler size={20} className="text-gray-400" />
            </div>
            <p className="text-[13px] text-gray-500 mb-4">Consultez et gérez vos mesures enregistrées.</p>
            <button
              onClick={() => navigate("/client/mesures")}
              className="w-full bg-gray-900 text-white text-[13px] font-semibold py-3 rounded-xl mb-2 hover:bg-gray-800 transition-colors"
            >
              Voir mes mesures
            </button>
            <button onClick={() => setActiveSection(null)} className="text-[12px] text-gray-400 hover:text-gray-600">
              ← Retour
            </button>
          </div>
        )}
        {activeSection === "notifications" && (
          <PlaceholderSection icon={Bell} label="Préférences de notification à venir" onBack={() => setActiveSection(null)} />
        )}

        {/* ── Liste des sections ── */}
        {activeSection === null && (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {sections.map(({ icon: Icon, label, id }, index) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center justify-between px-4 sm:px-5 py-3.5 hover:bg-gray-50 active:bg-gray-100 transition-colors ${
                  index < sections.length - 1 ? "border-b border-gray-50" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className="text-gray-500" />
                  </div>
                  <span className="text-[13px] sm:text-sm font-medium text-gray-800">{label}</span>
                </div>
                <ChevronRight size={15} className="text-gray-300 flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* ── Déconnexion ── */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-100 bg-white text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors text-[13px] sm:text-sm font-medium"
        >
          <LogOut size={15} />
          Déconnexion
        </button>

      </div>
    </div>
  );
}

/* ── Composant helper placeholder ── */
function PlaceholderSection({
  icon: Icon,
  label,
  onBack,
}: {
  icon: React.ElementType;
  label: string;
  onBack: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <Icon size={20} className="text-gray-400" />
      </div>
      <p className="text-[13px] text-gray-400 mb-4">{label}</p>
      <button onClick={onBack} className="text-[12px] text-yellow-600 font-medium hover:text-yellow-700">
        ← Retour
      </button>
    </div>
  );
}