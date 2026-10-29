'use client';

// Desativa a validação estrita de navegação instantânea para esta rota dinâmica
//export const instant = false;


import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [autenticado, setAutenticado] = useState(false);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<{ nome: string; usuario: string } | null>(null);

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (isLoginPage) {
      setAutenticado(true);
      return;
    }

    const usuarioSalvo = localStorage.getItem('digi_user');
    if (!usuarioSalvo) {
      router.replace('/login');
    } else {
      setUsuarioLogado(JSON.parse(usuarioSalvo));
      setAutenticado(true);
    }
  }, [pathname, isLoginPage, router]);

  const handleSair = () => {
    localStorage.removeItem('digi_user');
    router.replace('/login');
  };

  if (isLoginPage) {
    return (
      <html lang="pt-BR">
        <body className="bg-slate-900 text-slate-800 antialiased">{children}</body>
      </html>
    );
  }

  if (!autenticado) {
    return (
      <html lang="pt-BR">
        <body className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
          <p className="animate-pulse">A verificar acesso...</p>
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-800 select-none overflow-hidden">
        
        {/* TOPO FIXO */}
        <header className="bg-slate-800 text-slate-200 text-xs px-3 md:px-4 py-2 flex justify-between items-center border-b border-slate-700 z-30 shrink-0 h-10">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={() => setMenuMobileAberto(true)}
              className="block md:hidden p-1 text-slate-200 hover:text-white bg-slate-700 rounded"
              aria-label="Abrir Menu"
            >
              <Menu className="w-5 h-5 text-sky-400" />
            </button>
            <span className="font-semibold text-sky-400">Digi</span>
            <span className="text-slate-400 hidden sm:inline">|</span>
            <span className="truncate font-medium">Sistema Digi - Módulo Web v02</span>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="text-slate-300 text-[11px] md:text-xs">
              <span className="hidden sm:inline">Usuário: </span>
              <strong className="text-white">{usuarioLogado ? usuarioLogado.usuario : 'Admin'}</strong>
            </div>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <div className="text-slate-400 hidden sm:block">
              <span>Versão: 02 21102026</span>
            </div>
            <button 
              type="button"
              onClick={handleSair}
              className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors flex items-center gap-1 font-medium text-xs shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </header>

        {/* ÁREA CENTRAL: SIDEBAR FIXA + CENTRO DINÂMICO */}
        <div className="flex flex-1 relative overflow-hidden h-[calc(100vh-2.5rem)]">
          <Sidebar 
            isOpen={menuMobileAberto} 
            onClose={() => setMenuMobileAberto(false)} 
          />

          <main className="flex-1 flex flex-col overflow-y-auto bg-slate-100 p-2 md:p-3 relative">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}