import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function CrearPregunta({setPreguntaRespondida}) {
  const { user } = useAuth()
  const [question, setQuestion] = useState('')
  const [targetInput, setTargetInput] = useState('')
  const [targetNick, setTargetNick] = useState('')
  const [targetResults, setTargetResults] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  
  useEffect(() => {
    const buscarUsuarios = async () => {
      if (targetInput.length < 2) {
        setTargetResults([])
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('nick, full_name')
        .or(`nick.ilike.%${targetInput}%,full_name.ilike.%${targetInput}%`)
        .limit(3)
      if (!error) setTargetResults(data)
    }

    buscarUsuarios()
  }, [targetInput])

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setTargetNick(user.nick)
    setTargetInput(`${user.nick} ${user.full_name?'('+user.full_name+')':''}`)
    setTargetResults([])
  }

  const handleAsk = async () => {
    if (!user) {
      setResponse("Debes iniciar sesión primero.")
      return
    }

    if (!question || !targetNick) {
      setResponse("Faltan campos por completar.")
      return
    }

    setLoading(true)
    setResponse(null)

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetNick,
        question,
        userId: user.id,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setResponse(data.error || "Error desconocido")
    } else {
      setResponse(data.answer)
      setPreguntaRespondida(true)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] shadow-2xl text-white space-y-4 mt-6 border border-[#334155]">
      <h2 className="text-2xl font-semibold text-cyan-400 tracking-wide">Hacer una pregunta</h2>

      <textarea
        rows="3"
        placeholder="Escribí tu pregunta..."
        className="w-full p-3 bg-[#1e293b] border border-cyan-700 rounded-xl text-white placeholder:text-cyan-300 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div className="relative">
        <input
          type="text"
          placeholder="Buscar usuario por nick o nombre"
          className="w-full p-3 bg-[#1e293b] border border-cyan-700 rounded-xl text-white placeholder:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          value={targetInput}
          onChange={(e) => {
            setTargetInput(e.target.value)
            setSelectedUser(null)
          }}
        />

        {targetResults.length > 0 && (
          <div className="absolute z-10 bg-[#1e293b] border border-cyan-700 rounded-xl mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
            {targetResults.map((u) => (
              <div
                key={u.nick}
                onClick={() => handleSelectUser(u)}
                className="p-2 hover:bg-cyan-700 hover:text-[#0f172a] cursor-pointer"
              >
                {u.nick} <span className="text-cyan-300">{u.full_name?'('+u.full_name+')':''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="text-sm text-cyan-300">
          Seleccionado: <strong>{selectedUser.nick}</strong> {selectedUser.full_name?'('+selectedUser.full_name+')':''}
        </div>
      )}

      <button
        onClick={handleAsk}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-colors duration-200 text-[#0f172a] font-bold text-lg shadow-md"
      >
        {loading ? 'Enviando...' : 'Preguntar'}
      </button>

      {response && (
        <div className="mt-3 bg-[#0f172a] border border-cyan-800 rounded-lg p-3 text-cyan-300 text-sm">
          {response}
        </div>
      )}
    </div>
  )
}
