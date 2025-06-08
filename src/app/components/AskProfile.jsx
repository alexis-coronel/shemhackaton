"use client";

import { useState } from "react";

export default function AskProfile({ user }) {
  const [targetNick, setTargetNick] = useState("");
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!user) {
      setResponse("Debes iniciar sesión primero.");
      return;
    }

    setLoading(true);
    setResponse(null);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetNick, question, userId: user.id }),
    });

    const data = await res.json();

    if (!res.ok) {
      setResponse(data.error || "Error desconocido");
    } else {
      setResponse(data.answer);
    }

    setLoading(false);
  }

  return (
    <div>
      <h2>Pregunta a un perfil</h2>
      <input
        placeholder="Nick del usuario"
        value={targetNick}
        onChange={(e) => setTargetNick(e.target.value)}
      />
      <textarea
        placeholder="Tu pregunta..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={handleAsk} disabled={loading || !question || !targetNick}>
        {loading ? "Consultando..." : "Preguntar"}
      </button>
      {response && (
        <div>
          <h3>Respuesta:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
