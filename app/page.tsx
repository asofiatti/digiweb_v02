'use client';

// Desativa a validação estrita de navegação instantânea para esta rota dinâmica
//export const instant = false;

import React from 'react';

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg border border-slate-200 h-full">
      <div className="flex flex-col items-center text-center space-y-3">
        <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-red-600 select-none drop-shadow-sm">
          ST
        </h1>
        
        <h2 className="text-base sm:text-lg font-extrabold tracking-widest text-slate-700 uppercase">
          Corretora de Seguros
        </h2>

        <p className="text-xs text-slate-400 pt-4">
          Selecione uma opção no menu lateral para carregar o módulo desejado.
        </p>
      </div>
    </div>
  );
}