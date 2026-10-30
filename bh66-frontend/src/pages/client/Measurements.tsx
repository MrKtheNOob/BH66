import { useState, useEffect, useRef, type ChangeEvent, type RefObject } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, X, Sparkles, CheckCircle, AlertCircle,
  Loader, Scan, Ruler, Image, Camera, Info,
} from "lucide-react";
import api from "../../services/api";
import type { Measurement, MeasurementPayload } from "../../types/models";

const FIELDS: { name: keyof MeasurementPayload; label: string }[] = [
  { name: "epaules",        label: "Épaules" },
  { name: "cou",            label: "Cou" },
  { name: "poitrine",       label: "Poitrine" },
  { name: "manche",         label: "Longueur manche" },
  { name: "longueur_boubou", label: "Longueur boubou" },
  { name: "ceinture",       label: "Ceinture" },
  { name: "tour_fesse",     label: "Tour de fesse" },
  { name: "cuisse",         label: "Cuisse" },
  { name: "fond",           label: "Fond" },
];

type PhotoType = "profile" | "face" | "full";

const photoConfig: {
  type: PhotoType;
  label: string;
  description: string;
}[] = [
  { type: "profile", label: "Photo de profil",  description: "Prenez-vous de côté" },
  { type: "face",    label: "Photo de face",     description: "Tenez-vous droit, face à l'appareil" },
  { type: "full",    label: "Pleine hauteur",    description: "Reculez pour être visible en entier" },
];

type AnalysisStatus = "idle" | "uploading" | "analyzing" | "completed" | "error";

export default function Measurements() {
  const navigate = useNavigate();
  const profileInputRef = useRef<HTMLInputElement>(null);
  const faceInputRef    = useRef<HTMLInputElement>(null);
  const fullInputRef    = useRef<HTMLInputElement>(null);

  const inputRefs: Record<PhotoType, RefObject<HTMLInputElement | null>> = {
    profile: profileInputRef,
    face:    faceInputRef,
    full:    fullInputRef,
  };

  const [form, setForm] = useState<MeasurementPayload>({
    epaules: 0, cou: 0, poitrine: 0, manche: 0,
    longueur_boubou: 0, ceinture: 0, tour_fesse: 0,
    cuisse: 0, fond: 0,
  });

  const [photos, setPhotos] = useState<Record<PhotoType, File | null>>({
    profile: null, face: null, full: null,
  });
  const [previews, setPreviews] = useState<Record<PhotoType, string | null>>({
    profile: null, face: null, full: null,
  });

  const [height, setHeight]             = useState<number>(0);
  const [loading, setLoading]           = useState(false);
  const [existing, setExisting]         = useState<Measurement | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>("idle");
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisMessage, setAnalysisMessage]   = useState("");
  const [detectedFields, setDetectedFields]     = useState<Set<string>>(new Set());

  useEffect(() => {
    api
      .get<Measurement>("measurements/me")
      .then((res) => {
        setExisting(res.data);
        setForm({
          epaules:         res.data.epaules,
          cou:             res.data.cou,
          poitrine:        res.data.poitrine,
          manche:          res.data.manche,
          longueur_boubou: res.data.longueur_boubou,
          ceinture:        res.data.ceinture,
          tour_fesse:      res.data.tour_fesse,
          cuisse:          res.data.cuisse,
          fond:            res.data.fond,
        });
      })
      .catch(() => {});
  }, []);

  const handlePhotoSelect = (type: PhotoType) => (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviews((prev) => ({ ...prev, [type]: url }));
    setPhotos((prev) => ({ ...prev, [type]: file }));
    setAnalysisStatus("idle");
    setDetectedFields(new Set());
  };

  const removePhoto = (type: PhotoType) => {
    setPhotos((prev) => ({ ...prev, [type]: null }));
    setPreviews((prev) => {
      if (prev[type]) URL.revokeObjectURL(prev[type]!);
      return { ...prev, [type]: null };
    });
    setAnalysisStatus("idle");
    setDetectedFields(new Set());
  };

  const allPhotosReady = photos.profile && photos.face && photos.full && height > 0;

  const simulateProgress = () => {
    setAnalysisProgress(0);
    const interval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 90) { clearInterval(interval); return 90; }
        return prev + Math.random() * 15;
      });
    }, 500);
    return interval;
  };

  const handleAnalyze = async () => {
    if (!allPhotosReady) {
      alert("Veuillez ajouter les 3 photos et votre hauteur.");
      return;
    }
    setAnalysisStatus("uploading");
    setAnalysisMessage("Envoi des photos...");
    const progressInterval = simulateProgress();
    try {
      const formData = new FormData();
      formData.append("photo_profile", photos.profile!);
      formData.append("photo_face",    photos.face!);
      formData.append("photo_full",    photos.full!);
      formData.append("height",        String(height));
      setAnalysisStatus("analyzing");
      setAnalysisMessage("Analyse par l'IA en cours...");
      const { data } = await api.post<MeasurementPayload>("measurements/analyze", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      clearInterval(progressInterval);
      setAnalysisProgress(100);
      const detected = new Set<string>();
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "number" && value > 0) detected.add(key);
      });
      setDetectedFields(detected);
      setForm(data);
      setAnalysisStatus("completed");
      setAnalysisMessage(`${detected.size} mesures détectées avec succès !`);
      setTimeout(() => {
        setAnalysisStatus("idle");
        setAnalysisMessage("");
        setAnalysisProgress(0);
      }, 3000);
    } catch {
      clearInterval(progressInterval);
      setAnalysisStatus("error");
      setAnalysisMessage("Erreur lors de l'analyse. Veuillez réessayer.");
      setAnalysisProgress(0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: Number(e.target.value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (existing) {
        await api.put(`measurements/${existing.id}`, form);
      } else {
        await api.post("measurements", form);
      }
      navigate("/client");
    } catch {
      alert("Erreur lors de l'enregistrement");
    } finally {
      setLoading(false);
    }
  };

  const photosCount = Object.values(photos).filter(Boolean).length;

  return (
    <>
    <div className="min-h-screen bg-gray-50 pb-28 md:pb-10">
      <div className="max-w-xl mx-auto px-4 pt-5 sm:pt-0 w-full">

        {/* ── Titre ── */}
        <div className="mb-6">
          <h1 className="text-[20px] sm:text-2xl font-bold text-gray-900">
            Prendre mes mesures
          </h1>
          <p className="text-[13px] text-gray-400 mt-1">
            Ajoutez 3 photos et votre hauteur pour une analyse automatique par IA.
          </p>
        </div>

        {/* ══════════════════════════════════
            SECTION PHOTOS
        ══════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-4">
          {/* Header section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Camera size={15} className="text-yellow-500" />
              <p className="text-[13px] font-semibold text-gray-900">Photos pour analyse IA</p>
            </div>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
              photosCount === 3
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-400"
            }`}>
              {photosCount}/3
            </span>
          </div>

          {/* Photo rows */}
          <div className="space-y-2">
            {photoConfig.map(({ type, label, description }) => (
              <div key={type}>
                {previews[type] ? (
                  /* Preview */
                  <div className="relative rounded-xl overflow-hidden border border-gray-100">
                    <img
                      src={previews[type]!}
                      alt={label}
                      className="w-full h-36 sm:h-40 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
                    <div className="absolute top-2.5 left-3 flex items-center gap-2">
                      <CheckCircle size={13} className="text-green-400" />
                      <span className="text-white text-[12px] font-medium">{label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePhoto(type)}
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
                    >
                      <X size={12} className="text-white" />
                    </button>
                  </div>
                ) : (
                  /* Upload row */
                  <button
                    type="button"
                    onClick={() => inputRefs[type].current?.click()}
                    className="w-full flex items-center gap-3 px-3.5 py-3 border border-dashed border-gray-200 rounded-xl hover:border-yellow-400 hover:bg-yellow-50/40 transition-all group"
                  >
                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <Image size={16} className="text-gray-400 group-hover:text-yellow-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-[13px] font-medium text-gray-800">{label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
                    </div>
                    <Upload size={14} className="text-gray-300 group-hover:text-yellow-500 flex-shrink-0 transition-colors" />
                  </button>
                )}
                <input
                  ref={inputRefs[type]}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoSelect(type)}
                  className="hidden"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            HAUTEUR
        ══════════════════════════════════ */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Ruler size={15} className="text-yellow-500" />
            <p className="text-[13px] font-semibold text-gray-900">Votre hauteur</p>
          </div>

          {/* Input row — même style que les champs mesures */}
          <div className="flex items-center gap-0 border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all">
            <input
              name="height"
              type="number"
              placeholder="Ex: 170"
              value={height === 0 ? "" : String(height)}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="flex-1 px-4 py-2.5 text-[13px] text-gray-900 placeholder-gray-300 outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <div className="px-3 py-2.5 bg-gray-50 border-l border-gray-200 text-[12px] font-medium text-gray-500 whitespace-nowrap">
              {height > 0 ? `${Math.floor(height / 100)}m ${String(height % 100).padStart(2, "0")}` : "cm"}
            </div>
          </div>
          <p className="text-[11px] text-gray-400 mt-2 flex items-center gap-1">
            <Info size={10} />
            Entrez votre hauteur en centimètres · Ex : 170 cm = 1m 70
          </p>
        </div>

        {/* ══════════════════════════════════
            BOUTON ANALYSER
        ══════════════════════════════════ */}
        <div className="mb-4">
          {analysisStatus !== "uploading" && analysisStatus !== "analyzing" ? (
            <button
              type="button"
              onClick={handleAnalyze}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                allPhotosReady
                  ? "bg-gray-900 hover:bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
            >
              <Sparkles size={15} />
              Analyser les photos
            </button>
          ) : (
            <div className="w-full py-3 rounded-xl bg-yellow-50 text-yellow-700 text-[13px] font-medium text-center flex items-center justify-center gap-2 border border-yellow-100">
              <Loader size={14} className="animate-spin" />
              {analysisMessage}
            </div>
          )}

          {/* Indicateurs */}
          <div className="flex justify-center gap-4 mt-2.5">
            {[
              { label: "Profil", ok: !!photos.profile },
              { label: "Face",   ok: !!photos.face },
              { label: "Hauteur", ok: !!photos.full },
              { label: "Taille",  ok: height > 0 },
            ].map(({ label, ok }) => (
              <span key={label} className={`flex items-center gap-1 text-[10px] font-medium ${ok ? "text-green-600" : "text-gray-300"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-green-500" : "bg-gray-200"}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════
            BARRE DE PROGRESSION
        ══════════════════════════════════ */}
        {(analysisStatus === "uploading" || analysisStatus === "analyzing" || analysisStatus === "completed" || analysisStatus === "error") && (
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-2.5 mb-2.5">
              {analysisStatus === "uploading"  && <Loader size={15} className="text-yellow-500 animate-spin" />}
              {analysisStatus === "analyzing"  && <Sparkles size={15} className="text-yellow-500 animate-pulse" />}
              {analysisStatus === "completed"  && <CheckCircle size={15} className="text-green-500" />}
              {analysisStatus === "error"      && <AlertCircle size={15} className="text-red-500" />}
              <span className="text-[12px] font-medium text-gray-700">{analysisMessage}</span>
            </div>

            {(analysisStatus === "uploading" || analysisStatus === "analyzing") && (
              <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                  style={{ width: `${analysisProgress}%` }}
                />
              </div>
            )}
            {analysisStatus === "completed" && (
              <div className="w-full bg-green-100 rounded-full h-1.5">
                <div className="h-full bg-green-500 rounded-full w-full" />
              </div>
            )}
            {analysisStatus === "error" && (
              <button type="button" onClick={handleAnalyze} className="text-[12px] text-yellow-600 hover:text-yellow-700 font-medium">
                Réessayer →
              </button>
            )}
          </div>
        )}

        {/* ══════════════════════════════════
            FORMULAIRE MESURES
            Style maquette : label + input + "cm"
        ══════════════════════════════════ */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-5">
            {/* Header */}
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scan size={15} className="text-yellow-500" />
                <p className="text-[13px] font-semibold text-gray-900">
                  Mesures
                </p>
              </div>
              {analysisStatus === "completed" && (
                <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle size={11} />
                  Détectées par IA
                </span>
              )}
            </div>

            {/* Champs — label + input sur la même ligne, badge cm intégré */}
            <div className="divide-y divide-gray-50">
              {FIELDS.map(({ name, label }) => {
                const isDetected = detectedFields.has(name);
                return (
                  <div
                    key={name}
                    className={`flex items-center justify-between gap-2 px-4 py-3 transition-colors ${
                      isDetected ? "bg-green-50/40" : "hover:bg-gray-50/60"
                    }`}
                  >
                    {/* Label — largeur fixe min, texte qui ne dépasse pas */}
                    <label
                      htmlFor={name}
                      className="text-[13px] text-gray-600 font-medium shrink-0 min-w-0 max-w-[45%] truncate"
                    >
                      {label}
                      {isDetected && (
                        <span className="ml-1 text-[10px] text-green-500">✨</span>
                      )}
                    </label>

                    {/* Input + cm */}
                    <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-yellow-400 focus-within:border-yellow-400 transition-all bg-white w-36 sm:w-44 shrink-0">
                      <input
                        id={name}
                        name={name}
                        type="number"
                        placeholder="—"
                        value={form[name] === 0 ? "" : String(form[name])}
                        onChange={handleChange}
                        className="w-full px-3 py-2 text-[13px] text-gray-900 placeholder-gray-300 outline-none bg-transparent text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="px-2.5 py-2 bg-gray-50 border-l border-gray-100 text-[11px] font-medium text-gray-400 shrink-0">
                        cm
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bouton desktop uniquement — inline */}
          <div className="hidden md:block mt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-sm font-semibold py-3.5 rounded-2xl transition-colors"
            >
              {loading ? "Enregistrement..." : existing ? "Mettre à jour les mesures" : "Enregistrer les mesures"}
            </button>
          </div>
        </form>

      </div>
    </div>

    {/* Bouton mobile — fixed hors de tout overflow */}
    <div className="fixed bottom-16 left-0 right-0 z-40 px-4 py-2 md:hidden">
      <button
        type="button"
        onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
        disabled={loading}
        className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white text-[13px] font-semibold py-3.5 rounded-2xl transition-colors"
      >
        {loading ? "Enregistrement..." : existing ? "Mettre à jour les mesures" : "Enregistrer les mesures"}
      </button>
    </div>
    </>
  );
}