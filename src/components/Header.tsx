'use client';

import React, { useState } from 'react';
import { UserRole } from '../types';
import { Shield, User, LogOut, KeyRound, Sparkles, PhoneCall, ChevronDown, Edit3, Sliders } from 'lucide-react';
import { isAuthorizedSiteEditor } from '../utils/editorPermissions';

interface HeaderProps {
  currentTab: 'inicio' | 'fypc-tec' | 'meu-perfil' | 'login';
  onTabChange: (tab: 'inicio' | 'fypc-tec' | 'meu-perfil' | 'login') => void;
  currentUser: string | null;
  currentRole: UserRole;
  userAvatar: string;
  onOpenLogin: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
  onOpenRegister: () => void;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  currentUser,
  currentRole,
  userAvatar,
  onOpenLogin,
  onLogout,
  onChangePassword,
  onOpenRegister,
  isEditMode = false,
  onToggleEditMode,
}) => {
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const canEditSite = isAuthorizedSiteEditor(currentUser);

  const getRoleBadge = () => {
    switch (currentRole) {
      case 'admin':
        return <span className="bg-amber-500/15 text-amber-500 text-xs px-2.5 py-0.5 rounded-full font-medium border border-amber-500/30">Administrador</span>;
      case 'teacher':
        return <span className="bg-blue-500/15 text-blue-500 text-xs px-2.5 py-0.5 rounded-full font-medium border border-blue-500/30">Professor</span>;
      case 'student':
        return <span className="bg-emerald-500/15 text-emerald-500 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-500/30">Aluno</span>;
      case 'socio':
        return <span className="bg-purple-500/15 text-purple-400 text-xs px-2.5 py-0.5 rounded-full font-medium border border-purple-500/30">Sócio Executivo</span>;
      default:
        return null;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-all shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-3.5 cursor-pointer group select-none"
            onClick={() => onTabChange('inicio')}
          >
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 p-1 border border-blue-500/30 shadow-md group-hover:border-blue-400 transition-all flex items-center justify-center overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo.png" 
                alt="FYP+C Logo" 
                className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform" 
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  FYP<span className="text-amber-400">+</span>C
                </span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                  Academia & Tec
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Gestão Dinâmica & Inovação</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1.5 sm:gap-2 bg-slate-950/70 p-1.5 rounded-2xl border border-slate-800">
            <button
              id="nav-tab-inicio"
              onClick={() => onTabChange('inicio')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                currentTab === 'inicio'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Início
            </button>

            <button
              id="nav-tab-fypc-tec"
              onClick={() => onTabChange('fypc-tec')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 relative ${
                currentTab === 'fypc-tec'
                  ? 'bg-gradient-to-r from-purple-700 to-indigo-700 text-white shadow-md shadow-purple-950'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping absolute top-2 right-2 hidden sm:block"></span>
              FYP+C Tec
            </button>

            {currentUser && (
              <button
                id="nav-tab-meu-perfil"
                onClick={() => onTabChange('meu-perfil')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentTab === 'meu-perfil'
                    ? 'bg-gradient-to-r from-amber-600 to-yellow-600 text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {currentRole === 'student' ? (
                  <User className="w-4 h-4 text-emerald-300" />
                ) : (
                  <Shield className="w-4 h-4 text-amber-300" />
                )}
                <span>Meu Perfil</span>
                {currentRole !== 'student' && (
                  <span className="hidden md:inline text-[11px] bg-slate-900/80 px-1.5 py-0.5 rounded text-amber-200">
                    EduSystem
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* User Controls / Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">

            {/* BOTÃO ADMINISTRAÇÃO — EXCLUSIVO PARA LÁZARO LUIS, FRANCISCO FAZTUDO E MARIA VICTORIA */}
            {canEditSite && (
              <div className="relative">
                <button
                  id="btn-administracao"
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 sm:gap-2 border ${
                    isEditMode
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 border-amber-300 shadow-md shadow-amber-500/30 ring-2 ring-amber-400/50 animate-pulse'
                      : 'bg-slate-800/90 text-amber-300 border-amber-500/40 hover:bg-slate-700 hover:text-amber-200 shadow-sm'
                  }`}
                  title="Painel de Administração da Diretoria"
                >
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span className="hidden xs:inline">Administração</span>
                  {isEditMode && (
                    <span className="text-[10px] bg-black/40 text-amber-100 px-1.5 py-0.2 rounded font-extrabold uppercase">
                      Edição ON
                    </span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAdminMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-slate-900/98 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl p-2 z-50 animate-fadeIn divide-y divide-slate-800">
                    <div className="px-3 py-2.5">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
                        Gestão Exclusiva da Diretoria
                      </div>
                      <div className="text-xs font-bold text-amber-400 truncate mt-0.5">
                        {currentUser}
                      </div>
                    </div>

                    <div className="py-1.5 space-y-1">
                      {/* BOTÃO EDITAR A PÁGINA INICIAL */}
                      <button
                        id="btn-editar-pagina-inicial"
                        onClick={() => {
                          if (onToggleEditMode) onToggleEditMode();
                          setIsAdminMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-xl transition-all flex items-center justify-between group ${
                          isEditMode 
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                            : 'hover:bg-slate-800/90 text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Edit3 className={`w-4 h-4 ${isEditMode ? 'text-amber-400' : 'text-cyan-400 group-hover:scale-110'} transition-transform`} />
                          <div>
                            <div className="text-xs sm:text-sm font-bold">Editar a página inicial</div>
                            <div className="text-[10px] text-slate-400">Ativa edição no Início e FYP+C Tec</div>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                          isEditMode 
                            ? 'bg-amber-400 text-slate-950 shadow-sm' 
                            : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-slate-950'
                        }`}>
                          {isEditMode ? 'Ativo' : 'Ativar'}
                        </span>
                      </button>

                      <button
                        onClick={() => {
                          onTabChange('meu-perfil');
                          setIsAdminMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-800 text-xs text-slate-300 hover:text-white flex items-center gap-2.5 transition-colors"
                      >
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        <span>Abrir Painel EduSystem ERP</span>
                      </button>
                    </div>

                    <div className="px-3 py-2 text-[10px] text-slate-400 leading-tight">
                      Disponível apenas para <strong>Lázaro Luis</strong>, <strong>Francisco Faztudo</strong> e <strong>Maria Victoria</strong>.
                    </div>
                  </div>
                )}
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center gap-3 bg-slate-800/70 border border-slate-700/80 py-1.5 px-3 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs overflow-hidden border border-slate-600 shadow-inner">
                  {userAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={userAvatar} alt={currentUser} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.substring(0, 2).toUpperCase()
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-100 truncate max-w-[130px]">{currentUser}</div>
                  <div className="flex items-center gap-1">{getRoleBadge()}</div>
                </div>
                <div className="flex items-center gap-1 border-l border-slate-700/80 pl-2">
                  <button
                    onClick={onChangePassword}
                    title="Alterar Palavra-passe"
                    className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                  >
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onLogout}
                    title="Terminar Sessão"
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenLogin}
                  className="px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4 text-cyan-400" />
                  <span>Login</span>
                </button>
                <button
                  onClick={onOpenRegister}
                  className="hidden sm:flex px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-900/40 transition-all items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                  <span>Dar o 1º Passo</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
