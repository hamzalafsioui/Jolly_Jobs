import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";
function App() {
  return (
    <div className="min-h-screen bg-bg-gray p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-heading font-bold text-jolly-purple mb-4">
          Jolly Jobs
        </h1>
        <h2 className="text-2xl font-heading text-jolly-deep-purple mb-6">
          Find your next tech adventure
        </h2>

        <div className="bg-card-white p-6 rounded-card shadow-card">
          <p className="text-text-secondary font-body">
            Your platform for Jobs
          </p>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="bg-jolly-purple text-white px-6 py-3 rounded-button hover:bg-jolly-deep-purple transition-colors">
            Bouton Primary
          </button>
          <button className="bg-jolly-teal text-white px-6 py-3 rounded-button hover:bg-jolly-teal/90 transition-colors">
            Bouton Secondary
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-success/10 border border-success/30 p-4 rounded-lg">
            <p className="text-success font-semibold">Success</p>
          </div>
          <div className="bg-warning/10 border border-warning/30 p-4 rounded-lg">
            <p className="text-warning font-semibold">Warning</p>
          </div>
          <div className="bg-danger/10 border border-danger/30 p-4 rounded-lg">
            <p className="text-danger font-semibold">Danger</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
