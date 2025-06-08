import { useFormObject } from '../../customHooks/useFormObject.jsx';
import { X, Mail, Lock } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import { useState } from 'react';

export default function Login({ modalBaseClasses, isLogin, animateOut, handleClose, switchModal }) {
  const [form, setFormField] = useFormObject({
    email: '',
    password: '',
  });

  const { signIn } = useAuth();
  const [error, setError] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError('Completá todos los campos para continuar.');
      return;
    }

    try {
      await signIn(form.email, form.password);
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className={`
        ${modalBaseClasses}
        transition-all duration-300
        bg-[#0f172a] p-6 rounded-2xl shadow-[0_0_20px_#00f0ff33]
        ${isLogin
          ? animateOut
            ? 'translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'}
          bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-white shadow-xl p-6 rounded-2xl w-full max-w-md mx-auto space-y-5
      `}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#00f0ff]">Iniciar sesión</h2>
        <button type="button" onClick={handleClose} aria-label="Cerrar" className='cursor-pointer'>
          <X className="text-[#00f0ff] hover:scale-110 transition" />
        </button>
      </div>

      {error && (
        <p className="mb-4 text-xl text-red-500 font-medium text-center">{error}</p>
      )}

      {/* Email */}
      <label className="flex items-center gap-3 bg-[#1e293b] border border-cyan-700 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 transition">
        <Mail className="text-[#00f0ff]" />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setFormField('email', e.target.value)}
          placeholder="Correo electrónico"
          className="w-full bg-transparent text-cyan-100 placeholder-cyan-400 focus:outline-none"
          required
        />
      </label>

      {/* Contraseña */}
      <label className="flex items-center gap-3 bg-[#1e293b] border border-cyan-700 px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 transition">
        <Lock className="text-[#00f0ff]" />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setFormField('password', e.target.value)}
          placeholder="Contraseña"
          className="w-full bg-transparent text-cyan-100 placeholder-cyan-400 focus:outline-none"
          required
        />
      </label>

      <button
        type="submit"
        className="w-[400px] cursor-pointer h-[42px] bg-gradient-to-r from-[#00f0ff] to-[#00c9ff] text-[#0f172a] hover:opacity-90 transition font-bold rounded-xl mb-4 shadow-md"
      >
        Iniciar sesión
      </button>

      <div className="flex justify-center items-center gap-2 mt-2">
        <span className="text-[#94a3b8] text-sm">¿No tenés cuenta?</span>
        <span
          className="text-[#00f0ff] font-semibold underline cursor-pointer hover:brightness-125 transition"
          onClick={switchModal}
        >
          Registrate
        </span>
      </div>
    </form>
  );
}
