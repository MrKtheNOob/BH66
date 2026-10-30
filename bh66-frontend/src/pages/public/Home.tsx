import Button from "../../components/ui/Button";
import hero from "../../assets/hero4.jpg";
import Navbar from "../../components/layout/Navbar";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      {/* HERO FULL SCREEN */}
      <section className="relative h-screen flex items-center px-10">
        <Navbar />

        {/* IMAGE BACKGROUND */}
        <img
          src={hero}
          alt="fashion"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/70"></div>

        {/* CONTENT */}
        <div className="relative z-10 max-w-xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            L’élégance <br />
            <span className="text-yellow-500">sur mesure</span>
          </h1>

          <p className="text-gray-300">
            Des vêtements conçus avec précision pour un style unique et raffiné.
          </p>

          <div className="flex gap-4">
            <Button>Voir les modèles</Button>

            <button className="border border-yellow-500 text-yellow-500 px-5 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition">
              Prendre mes mesures
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-8 px-10 py-16 bg-black">
        <div className="text-center space-y-3">
          <h3 className="text-yellow-500 font-semibold">Sur mesure</h3>
          <p className="text-gray-400 text-sm">
            Adapté parfaitement à votre morphologie.
          </p>
        </div>

        <div className="text-center space-y-3">
          <h3 className="text-yellow-500 font-semibold">Qualité premium</h3>
          <p className="text-gray-400 text-sm">
            Des tissus sélectionnés avec exigence.
          </p>
        </div>

        <div className="text-center space-y-3">
          <h3 className="text-yellow-500 font-semibold">Livraison rapide</h3>
          <p className="text-gray-400 text-sm">
            Partout, dans les meilleurs délais.
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-semibold">Prêt à créer votre tenue ?</h2>

        <Button>Commencer</Button>
      </section>
    </div>
  );
}
