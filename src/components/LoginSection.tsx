'use client';

import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  ArrowLeft, 
  ShieldCheck, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Building2,
  Server
} from 'lucide-react';

interface LoginSectionProps {
  onLogin: (identifier: string, pass: string) => boolean;
  onBackToPublic: () => void;
}

export const LoginSection: React.FC<LoginSectionProps> = ({ onLogin, onBackToPublic }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier.trim()) {
      setError('Por favor, introduza o seu nome de utilizador ou e-mail.');
      return;
    }

    if (!password) {
      setError('Por favor, introduza a sua palavra-passe.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const success = onLogin(identifier.trim(), password);
      setIsLoading(false);
      if (!success) {
        setError('Credenciais incorretas ou conta não autorizada. Verifique os dados e tente novamente.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 relative overflow-hidden select-none font-sans">
      
      {/* Ambient Cyber / Institutional Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(30,58,138,0.35),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Dedicated Portal Top Bar */}
      <header className="relative z-20 border-b border-slate-800/80 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-slate-900 p-1 border border-blue-500/40 flex items-center justify-center shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="FYP+C Logo" className="w-full h-full object-contain filter drop-shadow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">
                FYP<span className="text-amber-400">+</span>C
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                EduSystem ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ambiente de Autenticação Segura</p>
          </div>
        </div>

        {/* Back to Public Portal Button */}
        <button
          id="btn-voltar-portal-publico"
          onClick={onBackToPublic}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600 transition-all shadow-sm group"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-0.5 transition-transform" />
          <span>Voltar ao Portal Público</span>
        </button>
      </header>

      {/* Main Login Workspace */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          
          {/* Main Authentication Box */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/50 backdrop-blur-xl">
            
            {/* Header / Security Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-cyan-500/20 border border-blue-500/30 text-cyan-400 mb-3 shadow-inner">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Acesso ao Sistema
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Introduza as suas credenciais institucionais para iniciar sessão
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Identifier / Username or Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Utilizador ou E-mail Institucional
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-input-identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="Insira o seu utilizador ou e-mail"
                    autoComplete="username"
                    className="w-full text-sm pl-10 pr-4 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Palavra-passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowHelpModal(true)}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    id="login-input-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Insira a sua palavra-passe"
                    autoComplete="current-password"
                    className="w-full text-sm pl-10 pr-10 py-3 rounded-xl bg-slate-950/70 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                    title={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500/20 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400">Manter sessão ativa neste dispositivo</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                id="login-btn-submit"
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-900/40 hover:shadow-blue-800/60 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>A verificar credenciais...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-cyan-300" />
                    <span>Entrar no Sistema</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Notice Footnote */}
            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ligação Criptografada SSL/TLS • Acesso Restrito e Auditado</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Este ambiente é reservado a membros e alunos autorizados da Academia FYP+C e EduSystem ERP.
              </p>
            </div>

          </div>

          {/* Quick Help & Support Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowHelpModal(true)}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Dúvidas ou problemas de acesso? Obter suporte</span>
            </button>
          </div>

        </div>
      </main>

      {/* Dedicated Portal Minimal Footer */}
      <footer className="relative z-20 border-t border-slate-800/80 bg-slate-950/80 py-3 px-4 text-center text-[11px] text-slate-500">
        <p>© 2026 FYP+C - Gestão Dinâmica & EduSystem ERP. Todos os direitos reservados.</p>
      </footer>

      {/* Support / Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-left">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                Suporte de Acesso
              </h3>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Fechar
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-300">
              <p>
                Se é colaborador, professor ou estudante da FYP+C e esqueceu a sua palavra-passe ou não possui credenciais, por favor contacte:
              </p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="font-semibold text-cyan-300">Secretaria & Direção Pedagógica:</div>
                <div className="text-slate-400">+244 923 000 000 / 924 111 222</div>
                <div className="text-slate-400">suporte@fypc.ao</div>
              </div>
              <p className="text-[11px] text-slate-500">
                A recuperação de acesso exige confirmação presencial ou validação pelo canal oficial registado.
              </p>
            </div>
            <button
              onClick={() => setShowHelpModal(false)}
              className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
            >
              Compreendido
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
