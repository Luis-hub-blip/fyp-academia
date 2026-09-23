'use client';

import React, { useState } from 'react';
import { X, Lock, User, Phone, BookOpen, Send, Sparkles, KeyRound, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (username: string, pass: string) => boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = onLogin(username.trim(), password);
    if (!success) {
      setError('Credenciais incorretas ou utilizador não autorizado.');
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-blue-600/20 text-cyan-400 border border-blue-500/30 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white">Acesso ao Sistema</h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Entre na sua conta institucional da Academia FYP+C & EduSystem ERP
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/70 text-red-200 text-xs font-medium border border-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Nome de Utilizador ou E-mail:</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Insira o seu nome de utilizador ou e-mail"
                className="w-full text-sm pl-10 pr-3.5 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Palavra-passe:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Insira a sua palavra-passe"
                className="w-full text-sm pl-10 pr-10 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/30 transition-colors flex items-center justify-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-cyan-300" />
            <span>Entrar no Sistema</span>
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-500">
            Ambiente Seguro • Acesso Exclusivo a Membros e Alunos Autorizados
          </p>
        </div>

      </div>
    </div>
  );
};

interface PublicRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse: string;
  onSubmitRegistration: (data: { nome: string; contacto: string; curso: string; nivel: string }) => void;
}

export const PublicRegistrationModal: React.FC<PublicRegistrationModalProps> = ({
  isOpen,
  onClose,
  defaultCourse,
  onSubmitRegistration,
}) => {
  const [nome, setNome] = useState('');
  const [contacto, setContacto] = useState('');
  const [curso, setCurso] = useState(defaultCourse || 'Informática');
  const [nivel, setNivel] = useState('A1');
  const [enviado, setEnviado] = useState(false);

  React.useEffect(() => {
    if (defaultCourse) setCurso(defaultCourse);
  }, [defaultCourse]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitRegistration({
      nome,
      contacto,
      curso,
      nivel: ['Inglês', 'Francês'].includes(curso) ? nivel : 'Geral / Prático',
    });
    setEnviado(true);
    setTimeout(() => {
      setEnviado(false);
      onClose();
      setNome('');
      setContacto('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Dar o Primeiro Passo</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Preencha a sua pré-inscrição e receba contacto direto da nossa secretaria.
          </p>
        </div>

        {enviado ? (
          <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="text-base font-bold text-emerald-800">Solicitação Enviada com Sucesso!</h4>
            <p className="text-xs text-emerald-700">
              A direção da FYP+C recebeu os seus dados e entrará em contacto muito em breve.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Ana Manuel Santos"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contacto / WhatsApp:</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="Ex: 923 000 111"
                  className="w-full text-sm pl-10 pr-3.5 py-3 rounded-xl border border-slate-300 text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Curso Pretendido:</label>
                <select
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                >
                  <option value="Informática">Informática</option>
                  <option value="Inglês">Inglês</option>
                  <option value="Francês">Francês</option>
                  <option value="Cabeleireiro">Cabeleireiro</option>
                  <option value="Pastelaria">Pastelaria</option>
                </select>
              </div>

              {['Inglês', 'Francês'].includes(curso) && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Nível Estimado:</label>
                  <select
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-slate-300 text-slate-900 bg-white"
                  >
                    <option value="A1">A1 (Iniciante)</option>
                    <option value="A2">A2 (Básico)</option>
                    <option value="B1">B1 (Intermédio)</option>
                    <option value="B2">B2 (Intermédio Superior)</option>
                    <option value="C1">C1 (Avançado)</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Confirmar Pré-Inscrição</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

interface SolicitarServicoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
  onSubmit: (data: { nome: string; empresa: string; contacto: string; email: string; servico: string; descricao: string }) => void;
}

export const SolicitarServicoModal: React.FC<SolicitarServicoModalProps> = ({
  isOpen,
  onClose,
  defaultService,
  onSubmit,
}) => {
  const [nome, setNome] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [contacto, setContacto] = useState('');
  const [email, setEmail] = useState('');
  const [servico, setServico] = useState(defaultService || 'Aplicações Web e Mobile');
  const [descricao, setDescricao] = useState('');
  const [concluido, setConcluido] = useState(false);

  React.useEffect(() => {
    if (defaultService) setServico(defaultService);
  }, [defaultService]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nome, empresa, contacto, email, servico, descricao });
    setConcluido(true);
    setTimeout(() => {
      setConcluido(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Solicitar Serviços FYP+C Tec</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Partilhe as necessidades do seu projeto para prepararmos uma proposta técnica sob medida.
          </p>
        </div>

        {concluido ? (
          <div className="p-6 text-center space-y-2 bg-emerald-50 rounded-2xl border border-emerald-200">
            <h4 className="text-base font-bold text-emerald-800">Proposta Solicitada com Sucesso!</h4>
            <p className="text-xs text-emerald-700">
              A equipa técnica da FYP+C entrará em contacto dentro de 24 horas úteis.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">O seu Nome:</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Carlos Vieira"
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Empresa / Negócio:</label>
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  placeholder="Ex: Tech Angola Lda"
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Telemóvel / WhatsApp:</label>
                <input
                  type="text"
                  value={contacto}
                  onChange={(e) => setContacto(e.target.value)}
                  placeholder="Ex: 924 000 000"
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@empresa.ao"
                  className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Área de Serviço:</label>
              <select
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900 bg-white"
              >
                <option value="Aplicações Web e Mobile">Aplicações Web e Mobile</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Inteligência Artificial & Dados">Inteligência Artificial & Dados</option>
                <option value="Multimédia & Produção Audiovisual">Multimédia & Produção Audiovisual</option>
                <option value="Marketing Digital & Crescimento">Marketing Digital & Crescimento</option>
                <option value="Consultoria & Segurança da Informação">Consultoria & Segurança da Informação</option>
                <option value="Sistemas Empresariais (ERP / CRM)">Sistemas Empresariais (ERP / CRM)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descreva o seu projeto:</label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={3}
                placeholder="Objetivos do projeto, prazos previstos..."
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Enviar Pedido de Proposta</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: string;
  onSavePassword: (newPass: string) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSavePassword,
}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 4) {
      setMsg('A palavra-passe deve ter pelo menos 4 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setMsg('As palavras-passe não coincidem.');
      return;
    }
    onSavePassword(newPassword);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <KeyRound className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Alterar Palavra-passe</h3>
          <p className="text-xs text-slate-500">Utilizador: {currentUser}</p>
        </div>

        {msg && <div className="mb-3 text-xs text-red-600 font-medium">{msg}</div>}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Nova Palavra-passe:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Confirmar Palavra-passe:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 text-slate-900"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors mt-2"
          >
            Guardar Nova Palavra-passe
          </button>
        </form>
      </div>
    </div>
  );
};
