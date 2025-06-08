import { useState } from 'react'
import { supabase } from '../lib/supabase' 
import { useAuth } from '../hooks/useAuth' 

export default function CrearMemoria({mensaje,setMensaje}) {
  const { user } = useAuth()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleCrearMemoria = async () => {
    if (!title || !content) {
      setMensaje('Por favor completa todos los campos.')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('memories').insert({
      title,
      content,
      is_public: isPublic,
      user_id: user.id,
    })

    if (error) {
      setMensaje('Error al guardar la memoria.')
    } else {
      setMensaje('Memoria guardada con éxito.')
      setTitle('')
      setContent('')
      setIsPublic(false)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6 rounded-2xl bg-gradient-to-br from-[#0f172a] to-[#1e293b] shadow-2xl text-white space-y-4 mt-6 border border-[#334155]">
      <h2 className="text-2xl font-semibold text-cyan-400 tracking-wide">Crear nueva memoria</h2>

      <input
        type="text"
        placeholder="Título"
        className="w-full p-3 bg-[#1e293b] border border-cyan-700 rounded-xl text-white placeholder:text-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={title}
        onChange={(e) => {setTitle(e.target.value);setMensaje('')}}
      />

      <textarea
        rows="5"
        placeholder="Contenido de la memoria..."
        className="w-full p-3 bg-[#1e293b] border border-cyan-700 rounded-xl text-white placeholder:text-cyan-300 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500"
        value={content}
        onChange={(e) => {setContent(e.target.value);setMensaje('')}}
      />

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => {setIsPublic(e.target.checked);setMensaje('')}}
          className="accent-cyan-500 scale-125"
        />
        <span className="text-cyan-300">Hacer pública esta memoria</span>
      </label>

      <button
        onClick={handleCrearMemoria}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-colors duration-200 text-[#0f172a] font-bold text-lg shadow-md"
      >
        {loading ? 'Guardando...' : 'Guardar Memoria'}
      </button>

      {mensaje && (
        <p className="text-center text-xl text-cyan-300 mt-2">{mensaje}</p>
      )}
    </div>
  )
}
