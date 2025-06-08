import { useFormObject } from '../../customHooks/useFormObject.jsx'
import { X, Mail, Lock, User } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth.js'
import { useState } from 'react'

export default function Register({ modalBaseClasses, isLogin, animateOut, handleClose, switchModal }) {
  const [form, setFormField] = useFormObject({
    email: '',
    password: '',
    full_name: '',
    nick: ''
  })

  const [error, setError] = useState(null)
  const { signUp } = useAuth()

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError(null)

    const { email, password, full_name, nick } = form

    if (!email || !password || !full_name || !nick) {
      setError('Todos los campos son obligatorios.')
      return
    }

    if (!validateEmail(email)) {
      setError('El email no tiene un formato válido.')
      return
    }

    try {
      await signUp(email, password, nick, full_name)
    } catch (err) {
      setError(err.message || 'Ocurrió un error al registrarte.')
    }
  }

  return (
    <form
      onSubmit={handleSignUp}
      className={`
        ${modalBaseClasses}
        transition-all duration-300 ease-in-out transform
        ${!isLogin ? (animateOut ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100') : 'translate-x-full opacity-0'}
        bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-xl p-6 rounded-2xl w-full max-w-md mx-auto space-y-5
      `}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-cyan-400">Registro</h2>
        <button type="button" onClick={handleClose} className='cursor-pointer'>
          <X className="text-cyan-400 hover:text-cyan-300 transition-colors" />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-400 text-red-300 text-sm px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <InputField
          icon={<User className="text-cyan-300" />}
          placeholder="Nick"
          value={form.nick}
          onChange={(e) => setFormField('nick', e.target.value)}
        />
        <InputField
          icon={<Mail className="text-cyan-300" />}
          placeholder="Email"
          value={form.email}
          onChange={(e) => setFormField('email', e.target.value)}
          type="email"
        />
        <InputField
          icon={<Lock className="text-cyan-300" />}
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setFormField('password', e.target.value)}
          type="password"
        />
        <InputField
          icon={<User className="text-cyan-300" />}
          placeholder="Nombre completo"
          value={form.full_name}
          onChange={(e) => setFormField('full_name', e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full cursor-pointer bg-cyan-500 hover:bg-cyan-400 transition-colors duration-200 text-[#0f172a] font-bold py-2 rounded-xl shadow-md"
      >
        Registrarse
      </button>

      <div className="text-sm text-center text-cyan-200 mt-4">
        ¿Ya tienes cuenta?
        <span
          onClick={switchModal}
          className="ml-1 font-semibold underline cursor-pointer text-cyan-400 hover:text-cyan-300"
        >
          Inicia sesión
        </span>
      </div>
    </form>
  )
}

function InputField({ icon, placeholder, value, onChange, type = 'text' }) {
  return (
    <label className="flex items-center gap-3 bg-[#1e293b] border border-cyan-700 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 transition">
      {icon}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-transparent text-cyan-100 placeholder-cyan-400 focus:outline-none"
      />
    </label>
  )
}
