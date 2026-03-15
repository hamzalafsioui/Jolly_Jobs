import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./App.css";

function App() {
  const [backendData, setBackendData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/test-connection")
      .then((res) => {
        if (!res.ok) throw new Error("Backend not reachable");
        return res.json();
      })
      .then((data) => setBackendData(data))
      .catch((err) => setError(err.message));
  }, []);

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
          
          <div className="mt-4 p-4 rounded-lg bg-jolly-purple/5 border border-jolly-purple/20">
            <h3 className="text-lg font-semibold text-jolly-purple mb-2">Backend Status:</h3>
            {backendData ? (
              <div className="text-sm font-body">
                <p><span className="font-bold">Message:</span> {backendData.message}</p>
                <p><span className="font-bold">Database:</span> {backendData.database}</p>
              </div>
            ) : error ? (
              <p className="text-danger text-sm font-body">Error: {error}</p>
            ) : (
              <p className="text-text-secondary text-sm font-body italic">Fetching backend data...</p>
            )}
          </div>
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
