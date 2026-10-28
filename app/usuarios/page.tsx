'use client';

// Desativa a validação estrita de navegação instantânea para esta rota dinâmica
//export const instant = false;


import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X 
} from 'lucide-react';

interface Usuario {
  id_usuario: number;
  nome: string;
  primeiro_nome: string;
  email: string;
  fone: string;
  usuario: string;
  data_nascimento: string;
  tipo_descricao?: string;
  status_descricao?: string;
  id_status: number;
  id_tipo_usuario: number;
}

export default function CadastroUsuarioPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [selecionado, setSelecionado] = useState<Usuario | null>(null);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [novoModo, setNovoModo] = useState(false);

  const [form, setForm] = useState({
    nome: '',
    primeiro_nome: '',
    email: '',
    fone: '',
    usuario: '',
    senha: '',
    id_status: 1,
    id_tipo_usuario: 1,
    data_nascimento: '',
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsuarios(data);
        if (data.length > 0 && !selecionado) {
          selecionarUsuario(data[0]);
        }
      }
    } catch (err) {
      console.error('Erro ao carregar:', err);
    }
  };

  const selecionarUsuario = (user: Usuario) => {
    setSelecionado(user);
    setForm({
      nome: user.nome || '',
      primeiro_nome: user.primeiro_nome || '',
      email: user.email || '',
      fone: user.fone || '',
      usuario: user.usuario || '',
      senha: '***',
      id_status: user.id_status !== undefined ? user.id_status : 1,
      id_tipo_usuario: user.id_tipo_usuario || 1,
      data_nascimento: user.data_nascimento ? user.data_nascimento.split('T')[0] : '',
    });
    setModoEdicao(false);
    setNovoModo(false);
  };

  const handleConfirmar = async () => {
    try {
      const metodo = novoModo ? 'POST' : 'PUT';
      const payload = novoModo ? form : { ...form, id_usuario: selecionado?.id_usuario };

      const res = await fetch('/api/usuarios', {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        alert(novoModo ? 'Usuário cadastrado com sucesso!' : 'Usuário atualizado com sucesso!');
        setModoEdicao(false);
        setNovoModo(false);
        carregarUsuarios();
      } else {
        alert('Erro ao salvar: ' + (data.error || 'Erro desconhecido'));
      }
    } catch (err) {
      console.error('Erro ao salvar:', err);
      alert('Erro de conexão ao salvar.');
    }
  };

  const handleExcluir = async () => {
    if (!selecionado) return;

    const confirmacao = window.confirm(`Deseja realmente excluir o usuário "${selecionado.nome}"?`);
    if (!confirmacao) return;

    try {
      const res = await fetch(`/api/usuarios?id=${selecionado.id_usuario}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        alert('Usuário excluído com sucesso!');
        carregarUsuarios();
      } else {
        alert('Erro ao excluir: ' + (data.error || ''));
      }
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro de conexão ao excluir o usuário.');
    }
  };

  const obterDescricaoTipo = (user: Usuario) => {
    if (user.tipo_descricao) return user.tipo_descricao;
    switch (user.id_tipo_usuario) {
      case 1: return 'ADMINISTRADOR';
      case 2: return 'COORDENADOR';
      case 3: return 'PROFISSIONAL';
      case 4: return 'SECRETARIA';
      default: return 'OUTRO';
    }
  };

  const usuariosFiltrados = usuarios.filter(u => 
    u.nome?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    u.primeiro_nome?.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
    u.usuario?.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  return (
    <div className="w-full space-y-3 md:space-y-4">
      
      {/* Barra de Pesquisa */}
      <div className="bg-amber-100 p-2 md:p-2.5 rounded border border-amber-300 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 md:gap-3 flex-1">
          <span className="text-[11px] md:text-xs font-bold text-amber-900 uppercase">Pesquisa</span>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 text-slate-400" size={15} />
            <input 
              type="text"
              value={termoPesquisa}
              onChange={(e) => setTermoPesquisa(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-white border border-slate-300 rounded text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 text-slate-800"
              placeholder="Pesquisar por nome ou usuário..."
            />
          </div>
        </div>
        <button 
          onClick={() => router.push('/')}
          className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold px-3 py-1 rounded text-xs border border-yellow-500 shadow-sm flex items-center justify-center gap-1"
        >
          <X size={15} />
          <span>Fechar</span>
        </button>
      </div>

      {/* Grid de Usuários */}
      <div className="bg-white border border-slate-300 rounded shadow-sm overflow-hidden">
        <div className="bg-slate-700 text-white px-3 py-1.5 text-xs font-semibold flex justify-between items-center">
          <span>Usuários</span>
          <span>{usuariosFiltrados.length} registro(s)</span>
        </div>
        <div className="overflow-x-auto max-h-48 overflow-y-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[600px]">
            <thead className="bg-slate-200 text-slate-700 sticky top-0 border-b border-slate-300">
              <tr>
                <th className="p-2 border-r border-slate-300">Nome</th>
                <th className="p-2 border-r border-slate-300">Primeiro Nome</th>
                <th className="p-2 border-r border-slate-300">Status</th>
                <th className="p-2 border-r border-slate-300">E-mail</th>
                <th className="p-2 border-r border-slate-300">Fone</th>
                <th className="p-2 border-r border-slate-300">Data Nascimento</th>
                <th className="p-2">Tipo Usuário</th>
              </tr>
            </thead>
            <tbody>
              {usuariosFiltrados.map((user) => (
                <tr 
                  key={user.id_usuario}
                  onClick={() => selecionarUsuario(user)}
                  className={`cursor-pointer border-b border-slate-200 hover:bg-sky-50 ${selecionado?.id_usuario === user.id_usuario ? 'bg-sky-100 font-medium' : ''}`}
                >
                  <td className="p-2 border-r border-slate-200">{user.nome}</td>
                  <td className="p-2 border-r border-slate-200">{user.primeiro_nome}</td>
                  <td className="p-2 border-r border-slate-200">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${user.id_status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {user.id_status === 1 ? 'ATIVO' : 'INATIVO'}
                    </span>
                  </td>
                  <td className="p-2 border-r border-slate-200">{user.email}</td>
                  <td className="p-2 border-r border-slate-200">{user.fone}</td>
                  <td className="p-2 border-r border-slate-200">{user.data_nascimento ? new Date(user.data_nascimento).toLocaleDateString() : ''}</td>
                  <td className="p-2">{obterDescricaoTipo(user)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex flex-wrap items-center gap-1.5 md:gap-2 bg-white p-2 border border-slate-300 rounded shadow-sm">
        <button 
          onClick={() => { setNovoModo(true); setModoEdicao(true); setForm({ nome: '', primeiro_nome: '', email: '', fone: '', usuario: '', senha: '', id_status: 1, id_tipo_usuario: 1, data_nascimento: '' }); }}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-sm"
        >
          <Plus size={14} className="text-red-600" /> Incluir
        </button>
        <button 
          onClick={() => setModoEdicao(true)}
          disabled={!selecionado || modoEdicao}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-sm disabled:opacity-50"
        >
          <Edit size={14} className="text-amber-600" /> Alterar
        </button>
        <button 
          onClick={handleExcluir}
          disabled={!selecionado || modoEdicao}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-sm disabled:opacity-50"
        >
          <Trash2 size={14} className="text-red-600" /> Excluir
        </button>
        <div className="h-4 w-[1px] bg-slate-300 mx-0.5 hidden sm:block" />
        <button 
          onClick={handleConfirmar}
          disabled={!modoEdicao}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-sm disabled:opacity-50"
        >
          <Check size={14} className="text-emerald-600" /> Confirmar
        </button>
        <button 
          onClick={() => { if (selecionado) selecionarUsuario(selecionado); setModoEdicao(false); setNovoModo(false); }}
          disabled={!modoEdicao}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded text-xs font-medium text-slate-700 shadow-sm disabled:opacity-50"
        >
          <X size={14} className="text-slate-500" /> Cancelar
        </button>
      </div>

      {/* Formulário de Detalhes Inferior */}
      <div className={`border rounded shadow-sm p-3 md:p-4 space-y-3 text-xs transition-colors duration-200 ${modoEdicao ? 'bg-amber-50/70 border-amber-400' : 'bg-white border-slate-300'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div className="sm:col-span-2 md:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input 
              type="text" 
              disabled={!modoEdicao}
              value={form.nome} 
              onChange={e => setForm({...form, nome: e.target.value})}
              className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-50 text-slate-800" 
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Nome Abreviado</label>
            <input 
              type="text" 
              disabled={!modoEdicao}
              value={form.primeiro_nome} 
              onChange={e => setForm({...form, primeiro_nome: e.target.value})}
              className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-50 text-slate-800" 
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Status</label>
            <select 
              disabled={!modoEdicao}
              value={form.id_status}
              onChange={e => setForm({...form, id_status: Number(e.target.value)})}
              className="w-full p-1.5 border border-slate-300 rounded bg-emerald-500 text-white font-bold disabled:opacity-80"
            >
              <option value={1}>ATIVO</option>
              <option value={0}>INATIVO</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Tipo de Usuário</label>
            <select 
              disabled={!modoEdicao}
              value={form.id_tipo_usuario}
              onChange={e => setForm({...form, id_tipo_usuario: Number(e.target.value)})}
              className="w-full p-1.5 border border-slate-300 rounded bg-yellow-300 text-slate-900 font-bold disabled:opacity-80"
            >
              <option value={1}>ADMINISTRADOR</option>
              <option value={2}>COORDENADOR</option>
              <option value={3}>PROFISSIONAL</option>
              <option value={4}>SECRETARIA</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">E-mail</label>
            <input 
              type="text" 
              disabled={!modoEdicao}
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-50 text-slate-800" 
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Fone</label>
            <input 
              type="text" 
              disabled={!modoEdicao}
              value={form.fone}
              onChange={e => setForm({...form, fone: e.target.value})}
              className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-50 text-slate-800" 
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Usuário</label>
            <input 
              type="text" 
              disabled={!modoEdicao}
              value={form.usuario}
              onChange={e => setForm({...form, usuario: e.target.value})}
              className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-50 text-slate-800" 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-slate-700">Senha</label>
              {modoEdicao && <span className="text-blue-600 hover:underline cursor-pointer text-[10px]">Alterar</span>}
            </div>
            <input 
              type="password" 
              disabled={!modoEdicao}
              value={form.senha}
              onChange={e => setForm({...form, senha: e.target.value})}
              className="w-full p-1.5 border border-slate-300 rounded bg-white disabled:bg-slate-50 text-slate-800" 
            />
          </div>
        </div>
      </div>
    </div>
  );
}