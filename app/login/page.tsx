'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const router = useRouter();

  // Garante que os campos iniciam sempre limpos/vazios ao carregar a página
  useEffect(() => {
    setUsuario('');
    setSenha('');
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erro ao efetuar login.');
      }

      // ➔ ADICIONADO: Verifica se o usuário está inativo (id_status diferente de 1)
      if (data.user && data.user.id_status !== 1) {
        throw new Error('Acesso negado: Este usuário está inativado.');
      }

      // Salva no localStorage para uso na aplicação
      localStorage.setItem('digi_user', JSON.stringify(data.user)); 

      // ➔ Salva um cookie simples para checagem de rota
      document.cookie = `digi_user=${JSON.stringify(data.user)}; path=/; max-age=86400`; // Válido por 24 horas

      // Redireciona para a página inicial após o sucesso
      router.push('/');

    } catch (err: any) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Sistema Digi Web v02</h1>
          <p className="text-sm text-slate-500 mt-1">Insira as suas credenciais para entrar</p>
        </div>

        {erro && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Usuário</label>
            <input
              type="text"
              required
              autoComplete="off" // <--- Evita que o navegador jogue o usuário salvo à força
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="Ex: adm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Senha</label>
            <input
              type="password"
              required
              autoComplete="new-password" // <--- Diz ao navegador para não autocompletar a senha salva antiga
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={carregando}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {carregando ? 'A entrar...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}