'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Wallet, 
  UserCheck, 
  Stethoscope, 
  Calculator, 
  Wrench, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  User,
  Lock,
  Building,
  Award,
  UserCog,
  Building2,
  BadgePercent,
  Calendar,
  ClipboardList,
  FolderTree,
  CreditCard,
  Printer,
  Headphones,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Controla os menus principais abertos (agora suporta múltiplos itens)
  const [menusAbertos, setMenusAbertos] = useState<string[]>(() => {
    const iniciais: string[] = [];
    if (pathname.startsWith('/usuarios')) iniciais.push('admin');
    if (pathname.startsWith('/pacientes')) iniciais.push('clinica');
    return iniciais;
  });

  // Controla os submenus abertos individualmente
  const [subMenusAbertos, setSubMenusAbertos] = useState<string[]>([]);

  // Mantém o menu da categoria aberta automaticamente ao navegar
  useEffect(() => {
    if (pathname.startsWith('/usuarios') && !menusAbertos.includes('admin')) {
      setMenusAbertos(prev => [...prev, 'admin']);
    } else if (pathname.startsWith('/pacientes') && !menusAbertos.includes('clinica')) {
      setMenusAbertos(prev => [...prev, 'clinica']);
    }
  }, [pathname]);

  // Alterna o menu principal (permite abrir vários ao mesmo tempo)
  const toggleMenu = (menuName: string) => {
    setMenusAbertos(prev => 
      prev.includes(menuName) 
        ? prev.filter(m => m !== menuName) // Fecha se já estiver aberto
        : [...prev, menuName]              // Abre se estiver fechado (mantém os outros)
    );
  };

  // Alterna o submenu individualmente
  const toggleSubMenu = (subMenuName: string) => {
    setSubMenusAbertos(prev =>
      prev.includes(subMenuName)
        ? prev.filter(s => s !== subMenuName)
        : [...prev, subMenuName]
    );
  };

  const handleNavegar = (href: string) => {
    if (onClose) onClose();
    router.push(href);
  };

  return (
    <>
      {/* Máscara de fundo escuro para fechar o menu no celular ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed md:static top-0 left-0 h-full md:h-auto z-50 md:z-20
          w-64 bg-white border-r border-slate-200 shadow-lg md:shadow-sm p-3 
          flex flex-col space-y-1 shrink-0 select-none overflow-y-auto
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Menu para Celular */}
        <div className="flex items-center justify-between md:hidden pb-2 mb-1 border-b border-slate-200">
          <span className="font-bold text-slate-800 text-sm">Menu Digi</span>
          <button 
            onClick={onClose}
            className="p-1 text-slate-500 hover:text-slate-800 rounded bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-[11px] font-bold text-slate-400 uppercase px-3 py-1 tracking-wider">
          Navegação
        </div>

        {/* MENU: Administrador */}
        <div className="relative">
          <button 
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${menusAbertos.includes('admin') ? 'bg-slate-100 text-blue-600' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => toggleMenu('admin')}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Admin</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menusAbertos.includes('admin') ? 'rotate-180' : ''}`} />
          </button>

          {menusAbertos.includes('admin') && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-100 pl-2 text-sm">
              <button 
                type="button" 
                onClick={() => handleNavegar('/usuarios')}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2.5 ${pathname === '/usuarios' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>Cadastro Usuários</span>
              </button>               

              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Cadastro Permissões</span>
              </button>
            </div>
          )}
        </div>

        {/* MENU: Digi Clínica */}
        <div className="relative">
          <button 
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${menusAbertos.includes('clinica') ? 'bg-slate-100 text-emerald-600' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => toggleMenu('clinica')}
          >
            <div className="flex items-center gap-2.5">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Digi Clínica</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menusAbertos.includes('clinica') ? 'rotate-180' : ''}`} />
          </button>

          {menusAbertos.includes('clinica') && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-emerald-100 pl-2 text-sm">
              <div className="relative">
                <button 
                  type="button" 
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex justify-between items-center"
                  onClick={() => toggleSubMenu('clinica_basicos')}
                >
                  <div className="flex items-center gap-2.5">
                    <Building className="w-4 h-4 text-sky-600" />
                    <span>Cadastros Básicos</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${subMenusAbertos.includes('clinica_basicos') ? 'rotate-90' : ''}`} />
                </button>

                {subMenusAbertos.includes('clinica_basicos') && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-2 text-xs">
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>Clinica</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <UserCog className="w-3.5 h-3.5 text-slate-500" />
                      <span>Sócio/Coordenador</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span>Especialidades</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>Profissional</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Especialidade Clínica</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Award className="w-3.5 h-3.5 text-slate-500" />
                      <span>Especialidade Profissional</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <BadgePercent className="w-3.5 h-3.5 text-slate-500" />
                      <span>Valor Base e Repasse</span>
                    </button>
                  </div>
                )}
              </div>

              <button 
                type="button" 
                onClick={() => handleNavegar('/pacientes')}
                className={`w-full text-left px-3 py-2 rounded flex items-center gap-2.5 ${pathname === '/pacientes' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:bg-slate-100 text-slate-700'}`}
              >
                <User className="w-4 h-4 text-blue-500" />
                <span>Cadastro Pacientes</span>
              </button>                

              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Fechamento Mensal</span>
              </button>
              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2.5">
                <ClipboardList className="w-4 h-4 text-indigo-600" />
                <span>Cadastro Atendimentos</span>
              </button>
            </div>
          )}
        </div>

        {/* MENU: Digi Conta */}
        <div className="relative">
          <button 
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${menusAbertos.includes('conta') ? 'bg-slate-100 text-amber-600' : 'text-slate-700 hover:bg-slate-100'}`}
            onClick={() => toggleMenu('conta')}
          >
            <div className="flex items-center gap-2.5">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Digi Conta</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${menusAbertos.includes('conta') ? 'rotate-180' : ''}`} />
          </button>

          {menusAbertos.includes('conta') && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-amber-100 pl-2 text-sm">
              <div className="relative">
                <button 
                  type="button" 
                  className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex justify-between items-center"
                  onClick={() => toggleSubMenu('conta_basicos')}
                >
                  <div className="flex items-center gap-2.5">
                    <FolderTree className="w-4 h-4 text-blue-600" />
                    <span>Cadastros Básicos</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-slate-400 transition-transform ${subMenusAbertos.includes('conta_basicos') ? 'rotate-90' : ''}`} />
                </button>

                {subMenusAbertos.includes('conta_basicos') && (
                  <div className="ml-3 mt-1 space-y-1 border-l border-slate-200 pl-2 text-xs">
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Conta Corrente</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <FolderTree className="w-3.5 h-3.5 text-amber-600" />
                      <span>Grupos de Conta</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Contas</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Wallet className="w-3.5 h-3.5 text-purple-600" />
                      <span>Origem Pagamento</span>
                    </button>
                    <button type="button" className="w-full text-left px-2.5 py-1.5 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-sky-600" />
                      <span>Ano</span>
                    </button>
                  </div>
                )}
              </div>

              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2.5 font-medium text-amber-800">
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Lançar Contas</span>
              </button>
            </div>
          )}
        </div>

        <div className="h-[1px] bg-slate-200 my-2" />

        {/* MENU: Utilitários */}
        <div className="relative">
          <button 
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${menusAbertos.includes('utilitarios') ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => toggleMenu('utilitarios')}
          >
            <div className="flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5" />
              <span>Utilitários</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menusAbertos.includes('utilitarios') ? 'rotate-180' : ''}`} />
          </button>

          {menusAbertos.includes('utilitarios') && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-2 text-xs">
              <button 
                type="button" 
                onClick={() => {
                  if (onClose) onClose();
                  window.print();
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2"
              >
                <Printer className="w-3.5 h-3.5 text-slate-600" />
                <span>Configura Impressora</span>
              </button>
            </div>
          )}
        </div>

        {/* MENU: Ajuda */}
        <div className="relative">
          <button 
            type="button"
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${menusAbertos.includes('ajuda') ? 'bg-slate-100 text-slate-800' : 'text-slate-600 hover:bg-slate-100'}`}
            onClick={() => toggleMenu('ajuda')}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ajuda</span>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${menusAbertos.includes('ajuda') ? 'rotate-180' : ''}`} />
          </button>

          {menusAbertos.includes('ajuda') && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-2 text-xs">
              <button type="button" className="w-full text-left px-3 py-2 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-amber-600" />
                <span>Suporte Técnico</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}