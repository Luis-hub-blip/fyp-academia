'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Shield, 
  AlertCircle, 
  Sparkles, 
  Sun, 
  Moon, 
  Sunrise, 
  X,
  GraduationCap,
  Layers,
  ArrowRight,
  TrendingUp,
  Check
} from 'lucide-react';
import { TurmaEdu, TurmaPeriodo, MatriculaSolicitacao, Aluno, Professor, UserRole } from '../types';
import { isAuthorizedSiteEditor } from '../utils/editorPermissions';

interface GerirTurmasSectionProps {
  currentUser: string;
  currentRole?: UserRole;
  turmas: TurmaEdu[];
  onUpdateTurmas: (turmas: TurmaEdu[]) => void;
  matriculaSolicitacoes: MatriculaSolicitacao[];
  onUpdateMatriculas?: (matriculas: MatriculaSolicitacao[]) => void;
  alunos: Aluno[];
  onUpdateAlunos?: (alunos: Aluno[]) => void;
  professores?: Professor[];
}

export const GerirTurmasSection: React.FC<GerirTurmasSectionProps> = ({
  currentUser,
  turmas,
  onUpdateTurmas,
  matriculaSolicitacoes,
  onUpdateMatriculas,
  alunos,
  onUpdateAlunos,
}) => {
  const isAuthorized = isAuthorizedSiteEditor(currentUser);

  // Sub-navigation: 'criar' (1-CRIAR TURMAS) or 'existentes' (2-TURMAS EXISTENTES)
  const [subAba, setSubAba] = useState<'criar' | 'existentes'>('criar');

  // Courses list
  const cursosDisponiveis = [
    { id: 'Inglês', nome: 'Inglês', prefix: 'FYP INGLES' },
    { id: 'Francês', nome: 'Francês', prefix: 'FYP FRANCES' },
    { id: 'Informática', nome: 'Informática', prefix: 'FYP INFORMATICA' },
    { id: 'Secretariado Executivo & Gestão de Documentos', nome: 'Secretariado Executivo', prefix: 'FYP SECRETARIADO' },
    { id: 'Contabilidade Informatizada & Gestão Financeira', nome: 'Contabilidade Informatizada', prefix: 'FYP CONTABILIDADE' },
    { id: 'Design Gráfico & Multimédia', nome: 'Design Gráfico', prefix: 'FYP DESIGN' },
    { id: 'Redes de Computadores & Cibersegurança', nome: 'Redes de Computadores', prefix: 'FYP REDES' },
    { id: 'Atendimento ao Cliente & Vendas', nome: 'Atendimento ao Cliente', prefix: 'FYP ATENDIMENTO' },
  ];

  // 1-CRIAR TURMAS form state
  const [cursoSelecionado, setCursoSelecionado] = useState<string>('Inglês');
  const [alunosSelecionados, setAlunosSelecionados] = useState<string[]>([]);
  const [nomeTurmaSelecionado, setNomeTurmaSelecionado] = useState<string>('FYP INGLES 01');
  const [periodoSelecionado, setPeriodoSelecionado] = useState<TurmaPeriodo>('Manhã');
  const [mensagemSucesso, setMensagemSucesso] = useState<string | null>(null);

  // Edit Turma Modal state
  const [turmaEmEdicao, setTurmaEmEdicao] = useState<TurmaEdu | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editPeriodo, setEditPeriodo] = useState<TurmaPeriodo>('Manhã');
  const [editAlunos, setEditAlunos] = useState<string[]>([]);

  // Filter for existing turmas
  const [filtroStatus, setFiltroStatus] = useState<'todas' | 'em_andamento' | 'concluido'>('todas');
  const [buscaTurma, setBuscaTurma] = useState('');

  // Helper to get prefix for current course
  const currentPrefix = cursosDisponiveis.find(c => c.id === cursoSelecionado)?.prefix || 
    `FYP ${cursoSelecionado.toUpperCase().replace(/\s+/g, '')}`;

  // Generate 01 to 10 class names for the chosen course
  const classNamesOptions = Array.from({ length: 10 }, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `${currentPrefix} ${num}`;
  });

  // When course changes, reset or update selected class name
  const handleSelectCurso = (cursoId: string) => {
    setCursoSelecionado(cursoId);
    setAlunosSelecionados([]);
    const prefix = cursosDisponiveis.find(c => c.id === cursoId)?.prefix || 
      `FYP ${cursoId.toUpperCase().replace(/\s+/g, '')}`;
    
    // Pick the first available name (01 to 10) not yet in turmas
    const firstAvailable = Array.from({ length: 10 }, (_, i) => {
      const num = String(i + 1).padStart(2, '0');
      return `${prefix} ${num}`;
    }).find(name => !turmas.some(t => t.nome === name)) || `${prefix} 01`;

    setNomeTurmaSelecionado(firstAvailable);
  };

  // Filter candidates from "Dar o Primeiro Passo" matching this course
  const candidatosPrimeiroPasso = matriculaSolicitacoes.filter((m) => {
    const cursoM = m.curso.toLowerCase().trim();
    const cursoC = cursoSelecionado.toLowerCase().trim();
    return cursoM.includes(cursoC) || cursoC.includes(cursoM);
  });

  // Existing students who can enroll in this course
  const alunosExistentes = alunos.filter((a) => {
    // Show students not yet enrolled in this specific selected class
    return true;
  });

  // Toggle selection with strict 10-student limit
  const handleToggleAluno = (nome: string) => {
    if (alunosSelecionados.includes(nome)) {
      setAlunosSelecionados(alunosSelecionados.filter(n => n !== nome));
    } else {
      if (alunosSelecionados.length >= 10) {
        alert('Limite máximo de 10 alunos por turma atingido!');
        return;
      }
      setAlunosSelecionados([...alunosSelecionados, nome]);
    }
  };

  // Create new turma
  const handleCriarTurma = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthorized) {
      alert('Acesso restrito aos administradores autorizados.');
      return;
    }

    if (!cursoSelecionado) {
      alert('Por favor, selecione um curso.');
      return;
    }

    if (alunosSelecionados.length === 0) {
      alert('Por favor, selecione pelo menos 1 aluno para a turma (limite de até 10).');
      return;
    }

    if (alunosSelecionados.length > 10) {
      alert('O limite máximo de alunos por turma é de 10 alunos.');
      return;
    }

    if (!nomeTurmaSelecionado) {
      alert('Por favor, selecione o nome da turma.');
      return;
    }

    // Check if turma name already exists
    if (turmas.some(t => t.nome.toLowerCase() === nomeTurmaSelecionado.toLowerCase())) {
      alert(`A turma "${nomeTurmaSelecionado}" já existe! Escolha outra numeração entre 01 e 10.`);
      return;
    }

    const novaTurma: TurmaEdu = {
      id: `turma-${Date.now()}`,
      nome: nomeTurmaSelecionado,
      curso: cursoSelecionado,
      periodo: periodoSelecionado,
      alunosNomes: [...alunosSelecionados],
      status: 'em_andamento',
      dataCriacao: new Date().toLocaleDateString('pt-PT'),
      professorResponsavel: currentUser,
      sala: periodoSelecionado === 'Noite' ? 'Sala Especial Noturna' : 'Sala de Aulas FYP+C'
    };

    const updatedTurmas = [novaTurma, ...turmas];
    onUpdateTurmas(updatedTurmas);

    // Update students in Aluno list if they were from "Dar o Primeiro Passo"
    const novosAlunos: Aluno[] = [...alunos];
    let newId = alunos.length > 0 ? Math.max(...alunos.map(a => a.id)) + 1 : 1;

    alunosSelecionados.forEach((nome) => {
      const existingAluno = novosAlunos.find(a => a.nome.toLowerCase() === nome.toLowerCase());
      if (existingAluno) {
        // Update existing student with this turma and course
        existingAluno.turma = novaTurma.nome;
        existingAluno.curso = novaTurma.curso;
      } else {
        // Candidate from "Dar o Primeiro Passo"
        const cand = matriculaSolicitacoes.find(m => m.nome.toLowerCase() === nome.toLowerCase());
        novosAlunos.push({
          id: newId++,
          nome,
          curso: novaTurma.curso,
          turma: novaTurma.nome,
          propina: '15.000 Kz',
          estado: 'pago',
          dividas: 'Nenhuma',
          score: 100,
          progress: 5,
          corrections: 0,
          likes: 0,
          nivel: cand ? cand.nivel : 'A1 / Inicial',
          presencas: 1,
          faltas: 0,
          notas: [14],
          status: 'ativo'
        });
      }
    });

    onUpdateAlunos(novosAlunos);

    // Mark corresponding matriculaSolicitacoes as approved
    const updatedMatriculas = matriculaSolicitacoes.map(m => {
      if (alunosSelecionados.some(nome => nome.toLowerCase() === m.nome.toLowerCase())) {
        return { ...m, status: 'aprovada' as const };
      }
      return m;
    });
    onUpdateMatriculas(updatedMatriculas);

    setMensagemSucesso(`Turma "${novaTurma.nome}" criada com sucesso com ${alunosSelecionados.length} alunos no período da ${novaTurma.periodo}!`);
    setAlunosSelecionados([]);
    setSubAba('existentes');

    setTimeout(() => {
      setMensagemSucesso(null);
    }, 6000);
  };

  // Toggle Concluído for a Turma -> Updates EduSystem ERP stats
  const handleToggleConcluido = (turmaId: string) => {
    if (!isAuthorized) {
      alert('Acesso restrito aos administradores autorizados.');
      return;
    }

    const turma = turmas.find(t => t.id === turmaId);
    if (!turma) return;

    const novoStatus: 'em_andamento' | 'concluido' = turma.status === 'concluido' ? 'em_andamento' : 'concluido';
    const updatedTurmas: TurmaEdu[] = turmas.map(t => {
      if (t.id === turmaId) {
        return {
          ...t,
          status: novoStatus,
          dataConclusao: novoStatus === 'concluido' ? new Date().toLocaleDateString('pt-PT') : undefined
        };
      }
      return t;
    });

    onUpdateTurmas(updatedTurmas);

    // When marked Concluído, also update enrolled students' progress to 100% and status to 'concluido'
    if (novoStatus === 'concluido') {
      const updatedAlunos = alunos.map(a => {
        if (turma.alunosNomes.includes(a.nome) || a.turma === turma.nome) {
          return {
            ...a,
            progress: 100,
            status: 'concluido'
          };
        }
        return a;
      });
      onUpdateAlunos(updatedAlunos);
    } else {
      // Reverting to em_andamento
      const updatedAlunos = alunos.map(a => {
        if (turma.alunosNomes.includes(a.nome) || a.turma === turma.nome) {
          return {
            ...a,
            progress: Math.min(a.progress, 85),
            status: 'ativo'
          };
        }
        return a;
      });
      onUpdateAlunos(updatedAlunos);
    }

    setMensagemSucesso(
      novoStatus === 'concluido'
        ? `🎓 Turma "${turma.nome}" marcada como CONCLUÍDA! Os indicadores e gráficos do EduSystem ERP foram atualizados.`
        : `Turma "${turma.nome}" reaberta para status "Em Andamento". Indicadores do ERP recalculados.`
    );

    setTimeout(() => {
      setMensagemSucesso(null);
    }, 6000);
  };

  // Open edit modal
  const handleOpenEditModal = (turma: TurmaEdu) => {
    setTurmaEmEdicao(turma);
    setEditNome(turma.nome);
    setEditPeriodo(turma.periodo);
    setEditAlunos([...turma.alunosNomes]);
  };

  // Save edit modal
  const handleSaveEditTurma = () => {
    if (!turmaEmEdicao) return;

    if (editAlunos.length === 0) {
      alert('A turma deve ter pelo menos 1 aluno.');
      return;
    }

    if (editAlunos.length > 10) {
      alert('O limite de seleção é de até 10 alunos por turma.');
      return;
    }

    const updatedTurmas = turmas.map(t => {
      if (t.id === turmaEmEdicao.id) {
        return {
          ...t,
          nome: editNome,
          periodo: editPeriodo,
          alunosNomes: [...editAlunos]
        };
      }
      return t;
    });

    onUpdateTurmas(updatedTurmas);
    setTurmaEmEdicao(null);
    setMensagemSucesso(`Turma "${editNome}" atualizada com sucesso!`);

    setTimeout(() => {
      setMensagemSucesso(null);
    }, 4000);
  };

  // Delete Turma
  const handleDeleteTurma = (turmaId: string, turmaNome: string) => {
    if (!window.confirm(`Tem a certeza que deseja remover a turma "${turmaNome}"?`)) return;

    const updated = turmas.filter(t => t.id !== turmaId);
    onUpdateTurmas(updated);
    setMensagemSucesso(`Turma "${turmaNome}" removida.`);
    setTimeout(() => {
      setMensagemSucesso(null);
    }, 4000);
  };

  // Statistics
  const totalTurmas = turmas.length;
  const turmasAtivas = turmas.filter(t => t.status === 'em_andamento').length;
  const turmasConcluidas = turmas.filter(t => t.status === 'concluido').length;
  const taxaConclusao = totalTurmas > 0 ? Math.round((turmasConcluidas / totalTurmas) * 100) : 0;

  // Filtered turmas list
  const turmasFiltradas = turmas.filter(t => {
    if (filtroStatus !== 'todas' && t.status !== filtroStatus) return false;
    if (buscaTurma.trim()) {
      const q = buscaTurma.toLowerCase();
      const matchNome = t.nome.toLowerCase().includes(q);
      const matchCurso = t.curso.toLowerCase().includes(q);
      const matchAluno = t.alunosNomes.some(al => al.toLowerCase().includes(q));
      return matchNome || matchCurso || matchAluno;
    }
    return true;
  });

  if (!isAuthorized) {
    return (
      <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
        <div className="flex items-center gap-2 font-bold text-base">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <span>Acesso Administrativo Restrito</span>
        </div>
        <p className="text-xs sm:text-sm">
          A funcionalidade <strong>3-GERIR TURMAS</strong> está autorizada exclusivamente para os administradores: <strong>Lázaro Luis</strong>, <strong>Francisco Faztudo</strong> e <strong>Maria Victoria</strong>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                Exclusivo: Lázaro, Francisco, Maria Victoria
              </span>
              <span className="text-xs text-blue-200">EduSystem ERP 2026</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-cyan-400" />
              <span>3-GERIR TURMAS</span>
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/80 max-w-2xl">
              Crie turmas limitadas a 10 alunos matriculados a partir do <em>&quot;Dar o Primeiro Passo&quot;</em> e gira o encerramento com impacto em tempo real nos gráficos do ERP.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/15">
            <div className="text-center px-3 py-1">
              <div className="text-lg font-black text-cyan-300">{turmasAtivas}</div>
              <div className="text-[10px] uppercase font-semibold text-blue-200">Ativas</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center px-3 py-1">
              <div className="text-lg font-black text-emerald-300">{turmasConcluidas}</div>
              <div className="text-[10px] uppercase font-semibold text-blue-200">Concluídas</div>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="text-center px-3 py-1">
              <div className="text-lg font-black text-amber-300">{taxaConclusao}%</div>
              <div className="text-[10px] uppercase font-semibold text-blue-200">Conclusão</div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {mensagemSucesso && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 flex items-center gap-3 shadow-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs sm:text-sm font-medium">{mensagemSucesso}</div>
        </div>
      )}

      {/* Sub-tabs Selection: 1-CRIAR TURMAS vs 2TURMAS EXISTENTE- */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
        <button
          id="btn-subaba-criar-turmas"
          type="button"
          onClick={() => setSubAba('criar')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            subAba === 'criar'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>1-CRIAR TURMAS</span>
        </button>

        <button
          id="btn-subaba-turmas-existentes"
          type="button"
          onClick={() => setSubAba('existentes')}
          className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            subAba === 'existentes'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-700 hover:bg-white/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>2TURMAS EXISTENTE-</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
            subAba === 'existentes' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-800'
          }`}>
            {turmas.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1-CRIAR TURMAS SECTION                                    */}
      {/* ========================================================= */}
      {subAba === 'criar' && (
        <form onSubmit={handleCriarTurma} className="space-y-6">
          
          {/* STEP 1: BOTÃO CURSOS */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-100 text-blue-700 font-black text-xs flex items-center justify-center">
                  1
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Selecionar Curso da Academia</h3>
                  <p className="text-[11px] text-slate-500">
                    Selecione o curso para listar os inscritos da área <em>&quot;Dar o Primeiro Passo&quot;</em> e alunos existentes.
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                Curso: {cursoSelecionado}
              </span>
            </div>

            {/* Courses selector pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {cursosDisponiveis.map((c) => {
                const isSelected = cursoSelecionado === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectCurso(c.id)}
                    className={`p-3 rounded-2xl text-left border transition-all text-xs font-bold flex flex-col justify-between gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-500/30'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <BookOpen className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-blue-500'}`} />
                      {isSelected && <Check className="w-3.5 h-3.5 text-cyan-300" />}
                    </div>
                    <span className="line-clamp-2">{c.nome}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* STEP 2: LISTAGEM DE NOMES (DAR O PRIMEIRO PASSO + ALUNOS EXISTENTES) COM LIMITE DE 10 */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                  2
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Selecionar Alunos (Limite: até 10 alunos por turma)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Inscritos do <em>&quot;Dar o Primeiro Passo&quot;</em> e alunos existentes que queiram matricular-se neste curso.
                  </p>
                </div>
              </div>

              {/* Real-time selection counter */}
              <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-2 border ${
                alunosSelecionados.length === 10
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : alunosSelecionados.length > 0
                  ? 'bg-blue-100 text-blue-900 border-blue-300'
                  : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                <Users className="w-3.5 h-3.5" />
                <span>{alunosSelecionados.length} / 10 Selecionados</span>
                {alunosSelecionados.length === 10 && (
                  <span className="text-[10px] bg-amber-500 text-white px-1.5 py-0.2 rounded-md font-extrabold">Lotação Máxima</span>
                )}
              </div>
            </div>

            {/* Grid of Candidates from "Dar o Primeiro Passo" */}
            <div className="space-y-4">
              <div>
                <div className="text-xs font-bold text-blue-900 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Inscrições Recentes de &quot;Dar o Primeiro Passo&quot; ({cursoSelecionado})</span>
                </div>

                {candidatosPrimeiroPasso.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                    Nenhuma inscrição pendente no formulário público para {cursoSelecionado}. Pode selecionar alunos da lista existente abaixo.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {candidatosPrimeiroPasso.map((cand) => {
                      const isSelected = alunosSelecionados.includes(cand.nome);
                      return (
                        <div
                          key={cand.id}
                          onClick={() => handleToggleAluno(cand.nome)}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by container click
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900">{cand.nome}</div>
                              <div className="text-[11px] text-slate-500">
                                Contacto: {cand.contacto} • Nível: {cand.nivel}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            Novo Candidato
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Grid of Existing Students from Academia */}
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Alunos Já Existentes na FYP+C (Opção de Nova Matrícula)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {alunosExistentes.map((aluno) => {
                    const isSelected = alunosSelecionados.includes(aluno.nome);
                    return (
                      <div
                        key={aluno.id}
                        onClick={() => handleToggleAluno(aluno.nome)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-400 ring-2 ring-indigo-500/20 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="text-xs font-bold text-slate-900">{aluno.nome}</div>
                            <div className="text-[11px] text-slate-500">
                              Atual: {aluno.curso} ({aluno.turma})
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          Aluno Ativo
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 3 & STEP 4: NOME DA TURMA (ORDEM 01 ATÉ 10) & PERÍODO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* STEP 3: NOME DA TURMA (01 ATÉ 10) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                  3
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Selecionar Nome da Turma</h3>
                  <p className="text-[11px] text-slate-500">
                    Formato sequencial institucional: <strong>{currentPrefix} 01</strong> até <strong>10</strong>
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Nome Oficial da Turma:</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {classNamesOptions.map((nomeOpcao) => {
                    const isSelected = nomeTurmaSelecionado === nomeOpcao;
                    const alreadyExists = turmas.some(t => t.nome.toLowerCase() === nomeOpcao.toLowerCase());

                    return (
                      <button
                        key={nomeOpcao}
                        type="button"
                        onClick={() => setNomeTurmaSelecionado(nomeOpcao)}
                        className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-purple-600 text-white border-purple-700 shadow-sm font-bold'
                            : alreadyExists
                            ? 'bg-amber-50/70 border-amber-200 text-amber-900'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
                        }`}
                      >
                        <span className="text-[11px] font-black">{nomeOpcao.split(' ').pop()}</span>
                        <span className="text-[9px] opacity-80 truncate w-full text-center">
                          {alreadyExists ? '(Já criada)' : 'Disponível'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-3 p-3 rounded-2xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs">
                  <span className="text-purple-900 font-medium">Turma Escolhida:</span>
                  <strong className="font-mono text-purple-950 font-bold">{nomeTurmaSelecionado}</strong>
                </div>
              </div>
            </div>

            {/* STEP 4: PERÍODO (MANHÃ, TARDE, NOITE) */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 font-black text-xs flex items-center justify-center">
                  4
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Selecionar Período</h3>
                  <p className="text-[11px] text-slate-500">
                    Defina o turno letivo da turma: Manhã, Tarde ou Noite.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[
                  { id: 'Manhã', label: 'Manhã', icon: Sunrise, hor: '08:00 - 12:00' },
                  { id: 'Tarde', label: 'Tarde', icon: Sun, hor: '13:30 - 17:30' },
                  { id: 'Noite', label: 'Noite', icon: Moon, hor: '18:00 - 21:00' },
                ].map((item) => {
                  const isSelected = periodoSelecionado === item.id;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPeriodoSelecionado(item.id as TurmaPeriodo)}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center gap-2 ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-500 to-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-400/30 font-bold'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <div className="text-xs font-bold">{item.label}</div>
                        <div className={`text-[10px] ${isSelected ? 'text-amber-100' : 'text-slate-400'}`}>
                          {item.hor}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                <span>Turno Selecionado:</span>
                <strong>{periodoSelecionado}</strong>
              </div>
            </div>

          </div>

          {/* SUBMIT BUTTON */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="text-xs text-slate-400">Resumo da Nova Turma:</div>
              <div className="text-base sm:text-lg font-bold text-cyan-300">
                {nomeTurmaSelecionado} • {cursoSelecionado} • {periodoSelecionado}
              </div>
              <div className="text-xs text-slate-300">
                Alunos matriculados: <strong>{alunosSelecionados.length}</strong> / 10 alunos
              </div>
            </div>

            <button
              id="btn-confirmar-criar-turma"
              type="submit"
              disabled={alunosSelecionados.length === 0}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Salvar & Criar Turma</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>

        </form>
      )}

      {/* ========================================================= */}
      {/* 2-TURMAS EXISTENTES SECTION                               */}
      {/* ========================================================= */}
      {subAba === 'existentes' && (
        <div className="space-y-6">
          
          {/* Controls Bar */}
          <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Status Filter buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setFiltroStatus('todas')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filtroStatus === 'todas' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Todas ({turmas.length})
              </button>
              <button
                type="button"
                onClick={() => setFiltroStatus('em_andamento')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filtroStatus === 'em_andamento' ? 'bg-white text-blue-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Em Andamento ({turmasAtivas})
              </button>
              <button
                type="button"
                onClick={() => setFiltroStatus('concluido')}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filtroStatus === 'concluido' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Concluídas ({turmasConcluidas})
              </button>
            </div>

            {/* Search and Save Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 flex-1 sm:max-w-md justify-end">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={buscaTurma}
                  onChange={(e) => setBuscaTurma(e.target.value)}
                  placeholder="Pesquisar turma ou aluno..."
                  className="w-full text-xs p-2.5 pl-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                id="btn-salvar-turmas-erp"
                onClick={() => {
                  onUpdateTurmas([...turmas]);
                  setMensagemSucesso('As informações das turmas e gráficos do EduSystem ERP foram salvas com sucesso!');
                  setTimeout(() => setMensagemSucesso(null), 4000);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all whitespace-nowrap"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Salvar Turmas</span>
              </button>
            </div>
          </div>

          {/* Turmas Cards Grid */}
          {turmasFiltradas.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
              <Users className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-800 text-sm">Nenhuma turma encontrada</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Não há turmas correspondentes ao filtro atual. Clique em &quot;1-CRIAR TURMAS&quot; para abrir a sua primeira turma institucional.
              </p>
              <button
                onClick={() => setSubAba('criar')}
                className="mt-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Turma Agora</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {turmasFiltradas.map((t) => {
                const isConcluido = t.status === 'concluido';
                const PeriodoIcon = t.periodo === 'Manhã' ? Sunrise : t.periodo === 'Tarde' ? Sun : Moon;

                return (
                  <div
                    key={t.id}
                    className={`rounded-3xl border transition-all p-5 space-y-4 shadow-sm relative overflow-hidden ${
                      isConcluido
                        ? 'bg-gradient-to-br from-emerald-50/70 via-teal-50/50 to-white border-emerald-300 ring-1 ring-emerald-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Top status bar indicator */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-mono">
                            {t.nome}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                            {t.curso}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span className="flex items-center gap-1 font-medium text-slate-700">
                            <PeriodoIcon className="w-3.5 h-3.5 text-amber-500" />
                            <span>{t.periodo}</span>
                          </span>
                          <span>•</span>
                          <span>Criada em: {t.dataCriacao}</span>
                          {t.dataConclusao && (
                            <>
                              <span>•</span>
                              <span className="text-emerald-700 font-semibold">Concluída em: {t.dataConclusao}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Clique para Curso Concluído & Status Badge */}
                      <div className="flex items-center gap-2 shrink-0">
                        <label
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            isConcluido
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                          }`}
                          title="Clique para marcar o curso como concluído e atualizar os gráficos do ERP"
                        >
                          <input
                            type="checkbox"
                            checked={isConcluido}
                            onChange={() => handleToggleConcluido(t.id)}
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                          />
                          <span>{isConcluido ? 'Concluído' : 'Clique Concluído'}</span>
                        </label>

                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold hidden sm:flex items-center gap-1 shrink-0 ${
                          isConcluido
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-blue-100 text-blue-900 border border-blue-200'
                        }`}>
                          {isConcluido ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Concluído</span>
                            </>
                          ) : (
                            <>
                              <Clock className="w-3.5 h-3.5 text-blue-600" />
                              <span>Em Andamento</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Students List Box */}
                    <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-500" />
                          <span>Alunos Matriculados ({t.alunosNomes.length} / 10)</span>
                        </span>
                        <span className="text-[11px] font-semibold text-slate-500">
                          {Math.round((t.alunosNomes.length / 10) * 100)}% ocupação
                        </span>
                      </div>

                      {/* Student Chips */}
                      <div className="flex flex-wrap gap-1.5">
                        {t.alunosNomes.map((alunoNome, idx) => (
                          <span
                            key={idx}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold flex items-center gap-1.5 border ${
                              isConcluido
                                ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950'
                                : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[9px] font-bold flex items-center justify-center">
                              {alunoNome.substring(0, 1).toUpperCase()}
                            </span>
                            <span>{alunoNome}</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Operational Actions */}
                    <div className="pt-1 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                      {/* TOGGLE CONCLUÍDO (ALTERA INFORMAÇÕES E GRÁFICOS DO ERP) */}
                      <button
                        type="button"
                        onClick={() => handleToggleConcluido(t.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                          isConcluido
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white ring-2 ring-emerald-500/20'
                        }`}
                        title="Altera imediatamente os indicadores e gráficos do EduSystem ERP"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isConcluido ? 'Reabrir Turma' : 'Marcar Curso Concluído'}</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {/* EDIT BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(t)}
                          className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          type="button"
                          onClick={() => handleDeleteTurma(t.id, t.nome)}
                          className="p-2 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors"
                          title="Remover turma"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* ERP Integration Notice */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex items-start gap-3 text-xs text-blue-900">
            <TrendingUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Integração com EduSystem ERP:</strong> A marcação de turmas como <em>&quot;Concluído&quot;</em> recalcula em tempo real a taxa de sucesso acadêmico, o relatório gerencial tático (MIS), o simulador de retenção (DSS) e a visão executiva da diretoria (ESS).
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL DE EDIÇÃO DE TURMA                                  */}
      {/* ========================================================= */}
      {turmaEmEdicao && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setTurmaEmEdicao(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="text-xs font-bold text-blue-600 uppercase tracking-wider">Edição de Turma</div>
              <h3 className="text-lg font-bold text-slate-900">Editar {turmaEmEdicao.nome}</h3>
              <p className="text-xs text-slate-500">Curso: {turmaEmEdicao.curso}</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nome da Turma:</label>
                <input
                  type="text"
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Período:</label>
                <select
                  value={editPeriodo}
                  onChange={(e) => setEditPeriodo(e.target.value as TurmaPeriodo)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Manhã">Manhã</option>
                  <option value="Tarde">Tarde</option>
                  <option value="Noite">Noite</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Alunos Matriculados ({editAlunos.length} / 10):
                  </label>
                  <span className="text-[11px] text-slate-500">Limite: até 10</span>
                </div>

                <div className="space-y-1.5 max-h-48 overflow-y-auto p-2 bg-slate-50 rounded-2xl border border-slate-200">
                  {alunos.map((aluno) => {
                    const isChecked = editAlunos.includes(aluno.nome);
                    return (
                      <label
                        key={aluno.id}
                        className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs cursor-pointer hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setEditAlunos(editAlunos.filter(n => n !== aluno.nome));
                              } else {
                                if (editAlunos.length >= 10) {
                                  alert('Limite máximo de 10 alunos por turma!');
                                  return;
                                }
                                setEditAlunos([...editAlunos, aluno.nome]);
                              }
                            }}
                            className="rounded text-blue-600"
                          />
                          <span className="font-semibold text-slate-800">{aluno.nome}</span>
                        </div>
                        <span className="text-[10px] text-slate-400">{aluno.curso}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setTurmaEmEdicao(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveEditTurma}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
