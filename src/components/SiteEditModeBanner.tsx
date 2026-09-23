'use client';

import React from 'react';
import { ShieldCheck, Plus, Check, BookOpen, Cpu, MessageSquare } from 'lucide-react';

interface SiteEditModeBannerProps {
  currentUser: string | null;
  isEditMode?: boolean;
  canEdit?: boolean;
  currentTab?: string;
  onNavigate?: (tab: any) => void;
  onOpenAddCourse?: () => void;
  onOpenAddService?: () => void;
  onOpenAddTestimonial?: () => void;
  onToggleEditMode: () => void;
}

export const SiteEditModeBanner: React.FC<SiteEditModeBannerProps> = ({
  currentUser,
  isEditMode = true,
  canEdit = true,
  currentTab,
  onNavigate,
  onOpenAddCourse,
  onOpenAddService,
  onOpenAddTestimonial,
  onToggleEditMode,
}) => {
  if (!isEditMode) return null;
  return (
    <div className="sticky top-16 z-30 bg-gradient-to-r from-amber-600 via-amber-700 to-yellow-600 text-white px-4 py-2.5 shadow-lg border-b border-amber-500 animate-fadeIn">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Status indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-white shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-bold flex items-center gap-2">
              <span>Modo de Edição Ativo • Gestão de Conteúdos</span>
              <span className="bg-black/30 text-amber-200 text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-extrabold border border-amber-400/30">
                {currentUser}
              </span>
            </div>
            <div className="text-[11px] text-amber-100 hidden sm:block">
              Pode atualizar informações do Início, FYP+C Tec e adicionar novos cursos e serviços.
            </div>
          </div>
        </div>

        {/* Quick Add buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenAddCourse}
            className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105 border border-amber-300/40"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>+ Novo Curso</span>
          </button>

          <button
            onClick={onOpenAddService}
            className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105 border border-amber-300/40"
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>+ Novo Serviço Tec</span>
          </button>

          <button
            onClick={onOpenAddTestimonial}
            className="px-3 py-1.5 rounded-lg bg-black/30 hover:bg-black/40 text-white font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-105 border border-amber-300/40 hidden lg:flex"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>+ Testemunho</span>
          </button>

          <button
            onClick={onToggleEditMode}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-amber-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all hover:scale-105"
          >
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Concluir Edição</span>
          </button>
        </div>

      </div>
    </div>
  );
};
