'use client';

import React, { useState } from 'react';
import { 
  CursoCronograma, 
  CronogramaUnidade, 
  CronogramaTopico, 
  CronogramaStatus, 
  UserRole, 
  Aluno, 
  Professor 
} from '../types';
import { isAuthorizedSiteEditor } from '../utils/editorPermissions';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Lock, 
  Play, 
  BookOpen, 
  AlertTriangle, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Users, 
  GraduationCap, 
  Sparkles, 
  CheckSquare, 
  FileText, 
  Info,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface CourseScheduleSectionProps {
  currentUser: string;
  currentRole: UserRole;
  cronogramas: CursoCronograma[];
  onUpdateCronogramas: (updated: CursoCronograma[]) => void;
  alunos: Aluno[];
  professores: Professor[];
}

export const CourseScheduleSection: React.FC<CourseScheduleSectionProps> = ({
  currentUser,
  currentRole,
  cronogramas,
  onUpdateCronogramas,
  alunos,
  professores,
}) => {
  // Authorization flags
  const canManageGrelha = isAuthorizedSiteEditor(currentUser);
  const isTeacher = currentRole === 'teacher' || professores.some(p => p.nome.toLowerCase() === currentUser.toLowerCase()) || canManageGrelha;
  
  // Find if current user is student
  const studentData = alunos.find(a => a.nome.toLowerCase() === currentUser.toLowerCase());
  const isStudent = currentRole === 'student' || !!studentData;

  // Filter cronogramas for student
  // STRICT REQUIREMENT: "LEMBRANDO QUE O ALUNO DE UM CURSO DIFERENTE NÃO DEVE RECEBER A NOTIFICAÇÃO DE OUTROS CURSOS EM QUE NÃO ESTÁ INSCRITO"
  const visibleCronogramas = React.useMemo(() => {
    if (isStudent && studentData) {
      const match = cronogramas.filter(c => 
        c.curso.toLowerCase() === studentData.curso.toLowerCase() &&
        (!studentData.turma || c.turma.toLowerCase() === studentData.turma.toLowerCase() || c.turma.toLowerCase().includes(studentData.turma.toLowerCase()))
      );
      // Fallback by curso if specific turma not found
      if (match.length > 0) return match;
      return cronogramas.filter(c => c.curso.toLowerCase() === studentData.curso.toLowerCase());
    }
    return cronogramas;
  }, [cronogramas, isStudent, studentData]);

  // Selected schedule ID
  const [selectedCronogramaId, setSelectedCronogramaId] = useState<string>(() => {
    if (visibleCronogramas.length > 0) return visibleCronogramas[0].id;
    return cronogramas[0]?.id || '';
  });

  // Keep selected ID valid if visible list changes
  React.useEffect(() => {
    if (!visibleCronogramas.some(c => c.id === selectedCronogramaId)) {
      if (visibleCronogramas.length > 0) {
        setSelectedCronogramaId(visibleCronogramas[0].id);
      }
    }
  }, [visibleCronogramas, selectedCronogramaId]);

  const activeCronograma = cronogramas.find(c => c.id === selectedCronogramaId) || visibleCronogramas[0];

  // Collapsed units
  const [collapsedUnits, setCollapsedUnits] = useState<Record<string, boolean>>({});

  // Modals state for authorized managers (Lázaro, Francisco, Maria Victoria)
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [newCursoName, setNewCursoName] = useState('Informática');
  const [newTurmaName, setNewTurmaName] = useState('Turma INF-T2');
  const [newProfResponsavel, setNewProfResponsavel] = useState('Lázaro Luis');

  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [newUnitTitle, setNewUnitTitle] = useState('');
  const [newUnitDesc, setNewUnitDesc] = useState('');

  const [isAddTopicModalOpen, setIsAddTopicModalOpen] = useState(false);
  const [targetUnitId, setTargetUnitId] = useState<string>('');
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [newTopicSumario, setNewTopicSumario] = useState('');
  const [newTopicHoras, setNewTopicHoras] = useState(4);
  const [newTopicDataPrevista, setNewTopicDataPrevista] = useState('');

  // Teacher Checklist Note Modal
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [topicToConfirm, setTopicToConfirm] = useState<{ unitId: string; topic: CronogramaTopico; nextStatus: CronogramaStatus } | null>(null);
  const [teacherNotes, setTeacherNotes] = useState('');

  const toggleUnitCollapse = (unitId: string) => {
    setCollapsedUnits(prev => ({ ...prev, [unitId]: !prev[unitId] }));
  };

  // Metrics calculation for the active cronograma
  const metrics = React.useMemo(() => {
    if (!activeCronograma) {
      return { total: 0, concluidos: 0, emCurso: 0, trancados: 0, pct: 0, hasAtraso: false, atrasoCount: 0 };
    }
    let total = 0;
    let concluidos = 0;
    let emCurso = 0;
    let trancados = 0;
    let atrasoCount = 0;

    const todayStr = new Date().toISOString().split('T')[0];

    activeCronograma.unidades.forEach(u => {
      u.topicos.forEach(t => {
        total++;
        if (t.status === 'concluido') concluidos++;
        else if (t.status === 'em_curso') {
          emCurso++;
          if (t.dataPrevista && t.dataPrevista < todayStr) atrasoCount++;
        } else {
          trancados++;
          if (t.dataPrevista && t.dataPrevista < todayStr) atrasoCount++;
        }
      });
    });

    const pct = total > 0 ? Math.round((concluidos / total) * 100) : 0;
    return {
      total,
      concluidos,
      emCurso,
      trancados,
      pct,
      hasAtraso: atrasoCount > 0,
      atrasoCount
    };
  }, [activeCronograma]);

  // Handler to update a topic's status via teacher checklist
  const handleConfirmTopicStatus = (unitId: string, topicId: string, nextStatus: CronogramaStatus, note?: string) => {
    if (!activeCronograma) return;
    const nowStr = new Date().toLocaleDateString('pt-PT') + ' ' + new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' });

    const updatedCronogramas = cronogramas.map(c => {
      if (c.id !== activeCronograma.id) return c;
      const updatedUnidades = c.unidades.map(u => {
        if (u.id !== unitId) return u;
        const updatedTopicos = u.topicos.map(t => {
          if (t.id !== topicId) return t;
          return {
            ...t,
            status: nextStatus,
            confirmadoPor: nextStatus === 'concluido' ? (currentUser || 'Professor') : t.confirmadoPor,
            dataConfirmacao: nextStatus === 'concluido' ? nowStr : t.dataConfirmacao,
            dataConclusao: nextStatus === 'concluido' ? new Date().toLocaleDateString('pt-PT') : t.dataConclusao,
            observacoesProfessor: note !== undefined ? note : t.observacoesProfessor
          };
        });

        // Determine unit status
        const allDone = updatedTopicos.every(t => t.status === 'concluido');
        const anyActive = updatedTopicos.some(t => t.status === 'em_curso');
        const unitStatus: CronogramaStatus = allDone ? 'concluido' : anyActive ? 'em_curso' : 'trancado';

        return {
          ...u,
          status: unitStatus,
          topicos: updatedTopicos
        };
      });

      return {
        ...c,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-PT'),
        unidades: updatedUnidades
      };
    });

    onUpdateCronogramas(updatedCronogramas);
  };

  // Handler for authorized managers to add a unit
  const handleAddUnit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCronograma || !newUnitTitle.trim()) return;

    const newUnit: CronogramaUnidade = {
      id: 'u-' + Date.now(),
      numero: activeCronograma.unidades.length + 1,
      titulo: newUnitTitle.trim(),
      descricao: newUnitDesc.trim(),
      status: 'trancado',
      topicos: []
    };

    const updated = cronogramas.map(c => {
      if (c.id !== activeCronograma.id) return c;
      return {
        ...c,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-PT'),
        unidades: [...c.unidades, newUnit]
      };
    });

    onUpdateCronogramas(updated);
    setNewUnitTitle('');
    setNewUnitDesc('');
    setIsAddUnitModalOpen(false);
  };

  // Handler for authorized managers to add a topic
  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCronograma || !targetUnitId || !newTopicTitle.trim()) return;

    const updated = cronogramas.map(c => {
      if (c.id !== activeCronograma.id) return c;
      const updatedUnidades = c.unidades.map(u => {
        if (u.id !== targetUnitId) return u;
        const newTopic: CronogramaTopico = {
          id: 'top-' + Date.now(),
          numero: u.topicos.length + 1,
          titulo: newTopicTitle.trim(),
          sumario: newTopicSumario.trim(),
          duracaoHoras: Number(newTopicHoras) || 4,
          dataPrevista: newTopicDataPrevista || undefined,
          status: 'trancado'
        };
        return {
          ...u,
          topicos: [...u.topicos, newTopic]
        };
      });
      return {
        ...c,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-PT'),
        unidades: updatedUnidades
      };
    });

    onUpdateCronogramas(updated);
    setNewTopicTitle('');
    setNewTopicSumario('');
    setNewTopicHoras(4);
    setNewTopicDataPrevista('');
    setIsAddTopicModalOpen(false);
  };

  // Handler for creating a new schedule
  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const newSchedule: CursoCronograma = {
      id: 'crono-' + Date.now(),
      curso: newCursoName,
      turma: newTurmaName,
      professorResponsavel: newProfResponsavel,
      criadoPor: currentUser,
      dataCriacao: new Date().toLocaleDateString('pt-PT'),
      ultimaAtualizacao: new Date().toLocaleDateString('pt-PT'),
      unidades: [
        {
          id: 'u-init-' + Date.now(),
          numero: 1,
          titulo: 'Módulo 1 — Introdução Geral e Diagnóstico',
          descricao: 'Fundamentos básicos e plano de competências.',
          status: 'em_curso',
          topicos: [
            {
              id: 'top-init-1',
              numero: 1,
              titulo: 'Apresentação do Programa e Metodologia Prática FYP+C',
              sumario: 'Introdução às ferramentas, regras pedagógicas e expectativas do curso.',
              duracaoHoras: 4,
              status: 'em_curso',
              dataPrevista: new Date().toLocaleDateString('pt-PT')
            }
          ]
        }
      ]
    };

    const updated = [newSchedule, ...cronogramas];
    onUpdateCronogramas(updated);
    setSelectedCronogramaId(newSchedule.id);
    setIsNewScheduleModalOpen(false);
  };

  // Delete unit (exclusive to managers)
  const handleDeleteUnit = (unitId: string) => {
    if (!activeCronograma || !confirm('Tem a certeza que deseja remover esta unidade e todos os seus tópicos?')) return;
    const updated = cronogramas.map(c => {
      if (c.id !== activeCronograma.id) return c;
      return {
        ...c,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-PT'),
        unidades: c.unidades.filter(u => u.id !== unitId)
      };
    });
    onUpdateCronogramas(updated);
  };

  // Delete topic (exclusive to managers)
  const handleDeleteTopic = (unitId: string, topicId: string) => {
    if (!activeCronograma || !confirm('Tem a certeza que deseja remover este sumário do cronograma?')) return;
    const updated = cronogramas.map(c => {
      if (c.id !== activeCronograma.id) return c;
      return {
        ...c,
        ultimaAtualizacao: new Date().toLocaleDateString('pt-PT'),
        unidades: c.unidades.map(u => {
          if (u.id !== unitId) return u;
          return {
            ...u,
            topicos: u.topicos.filter(t => t.id !== topicId)
          };
        })
      };
    });
    onUpdateCronogramas(updated);
  };

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER & CONTEXT ================= */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-900/60 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Calendar className="w-48 h-48 text-cyan-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>EduSystem ERP • Gestão Pedagógica em Tempo Real</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Cronograma Curricular & Plano de Lições
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {isStudent ? (
                <>
                  Acompanhamento oficial da sua turma (<strong className="text-cyan-300">{studentData?.curso} — {studentData?.turma}</strong>). 
                  Consulte em tempo real os sumários concluídos, a aula em lecionação e os tópicos seguintes.
                </>
              ) : (
                <>
                  Grelha curricular oficial gerida pela diretoria pedagógica (<strong>Lázaro Luis, Francisco Faztudo e Maria Victoria</strong>) 
                  e validada pelo corpo docente através de checklist de lecionação.
                </>
              )}
            </p>
          </div>

          {/* Action Buttons for Directors */}
          {canManageGrelha && (
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                id="btn-novo-cronograma"
                onClick={() => setIsNewScheduleModalOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span>Nova Grelha de Curso</span>
              </button>
            </div>
          )}
        </div>

        {/* Course/Turma Selector (Only for Directors & Teachers; Students are strictly isolated to their own course!) */}
        {!isStudent ? (
          <div className="mt-6 pt-5 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <span>Selecione a Grelha do Curso / Turma:</span>
              <div className="flex flex-wrap gap-2">
                {visibleCronogramas.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCronogramaId(c.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedCronogramaId === c.id
                        ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{c.curso} ({c.turma})</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Grelhas aprovadas pela Diretoria Pedagógica</span>
            </div>
          </div>
        ) : (
          <div className="mt-4 pt-3 border-t border-indigo-900/40 flex items-center justify-between text-xs text-cyan-300 font-semibold">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Estudante Registado: <strong>{currentUser}</strong> ({studentData?.turma})</span>
            </div>
            <span className="text-[11px] text-slate-400">Canal exclusivo do formando</span>
          </div>
        )}
      </div>

      {/* ================= ERP REAL-TIME IMPACT BAR ================= */}
      {activeCronograma && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Progress Metric */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Taxa de Cumprimento</span>
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{metrics.pct}%</span>
              <span className="text-xs text-slate-500 font-medium">do plano curricular</span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full transition-all duration-500"
                style={{ width: `${metrics.pct}%` }}
              />
            </div>
          </div>

          {/* Lessons Done */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Sumários Concluídos</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">{metrics.concluidos}</span>
              <span className="text-xs text-slate-500 font-medium">de {metrics.total} lições totais</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Validados pelo corpo docente na checklist
            </p>
          </div>

          {/* Active Lesson */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
              <span>Aula em Lecionação</span>
              <Play className="w-4 h-4 text-indigo-600 animate-pulse" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-indigo-600">{metrics.emCurso}</span>
              <span className="text-xs text-slate-500 font-medium">sumário em estudo</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Unidade ativa acompanhada pelos alunos
            </p>
          </div>

          {/* ERP Pedagogical Status */}
          <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between ${
            metrics.hasAtraso 
              ? 'bg-amber-50 border-amber-200 text-amber-900' 
              : 'bg-emerald-50 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
              <span>Impacto EduSystem ERP</span>
              {metrics.hasAtraso ? (
                <AlertTriangle className="w-4 h-4 text-amber-600" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              )}
            </div>
            <div>
              <div className="text-sm font-bold">
                {metrics.hasAtraso ? 'Alerta de Atraso Pedagógico' : 'Ritmo Ideal • Sucesso Curricular'}
              </div>
              <p className="text-[11px] mt-1 leading-snug opacity-80">
                {metrics.hasAtraso 
                  ? `${metrics.atrasoCount} sumário(s) necessitam de aceleração ou aula extra.` 
                  : 'Cronograma rigorosamente em dia com o plano acadêmico 2026.'}
              </p>
            </div>
            <div className="text-[10px] font-bold uppercase tracking-wider pt-2 border-t border-black/10 mt-2">
              {metrics.hasAtraso ? 'Influência: Monitorizar no MIS' : 'Influência: Risco Mínimo no DSS'}
            </div>
          </div>

        </div>
      )}

      {/* ================= SCHEDULE DETAILS & UNITS TIMELINE ================= */}
      {activeCronograma ? (
        <div className="space-y-6">
          
          {/* Header of Active Schedule */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {activeCronograma.curso} — {activeCronograma.turma}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-100 text-blue-800">
                  {activeCronograma.unidades.length} Módulos
                </span>
              </div>
              <div className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>Professor Responsável: <strong className="text-slate-800">{activeCronograma.professorResponsavel || 'Direção Pedagógica'}</strong></span>
                <span>Inserido por: <strong className="text-slate-800">{activeCronograma.criadoPor}</strong></span>
                <span>Última revisão: {activeCronograma.ultimaAtualizacao}</span>
              </div>
            </div>

            {/* Quick Actions for Directors */}
            {canManageGrelha && (
              <div className="flex items-center gap-2">
                <button
                  id="btn-adicionar-unidade"
                  onClick={() => setIsAddUnitModalOpen(true)}
                  className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Módulo / Unidade</span>
                </button>
              </div>
            )}
          </div>

          {/* Units List */}
          <div className="space-y-4">
            {activeCronograma.unidades.map((unidade) => {
              const isCollapsed = collapsedUnits[unidade.id];
              const completedInUnit = unidade.topicos.filter(t => t.status === 'concluido').length;
              const isUnitFullyDone = unidade.topicos.length > 0 && completedInUnit === unidade.topicos.length;
              const isUnitCurrent = unidade.topicos.some(t => t.status === 'em_curso');

              return (
                <div 
                  key={unidade.id}
                  className={`bg-white rounded-2xl border transition-all shadow-sm overflow-hidden ${
                    isUnitFullyDone 
                      ? 'border-emerald-200 bg-emerald-50/20' 
                      : isUnitCurrent 
                      ? 'border-indigo-300 ring-1 ring-indigo-200' 
                      : 'border-slate-200'
                  }`}
                >
                  {/* Unit Bar Header */}
                  <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 border-b border-slate-100">
                    <div 
                      className="flex items-center gap-3 cursor-pointer flex-1"
                      onClick={() => toggleUnitCollapse(unidade.id)}
                    >
                      <button className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors">
                        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      <div className="flex items-center gap-2.5">
                        <span className={`w-8 h-8 rounded-xl font-black text-xs flex items-center justify-center shadow-inner ${
                          isUnitFullyDone 
                            ? 'bg-emerald-500 text-white' 
                            : isUnitCurrent 
                            ? 'bg-indigo-600 text-white animate-pulse' 
                            : 'bg-slate-200 text-slate-700'
                        }`}>
                          {unidade.numero}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900">
                              {unidade.titulo}
                            </h3>
                            {isUnitFullyDone && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Módulo Concluído</span>
                              </span>
                            )}
                            {isUnitCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1 animate-pulse">
                                <Play className="w-3 h-3 text-indigo-600" />
                                <span>Módulo em Curso</span>
                              </span>
                            )}
                          </div>
                          {unidade.descricao && (
                            <p className="text-xs text-slate-500 mt-0.5">{unidade.descricao}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right side stats & manager buttons */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-500 font-medium px-2 py-1 rounded-lg bg-white border border-slate-200">
                        {completedInUnit} de {unidade.topicos.length} sumários dados
                      </span>

                      {canManageGrelha && (
                        <>
                          <button
                            onClick={() => {
                              setTargetUnitId(unidade.id);
                              setIsAddTopicModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold flex items-center gap-1 transition-colors"
                            title="Adicionar sumário a esta unidade"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline text-[11px]">Sumário</span>
                          </button>

                          <button
                            onClick={() => handleDeleteUnit(unidade.id)}
                            className="p-1.5 rounded-lg hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                            title="Remover Unidade"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Topics Checklist & Visual Status (Visible if not collapsed) */}
                  {!isCollapsed && (
                    <div className="p-4 sm:p-6 space-y-3">
                      {unidade.topicos.length === 0 ? (
                        <div className="text-center py-6 text-xs text-slate-400 italic">
                          Nenhum sumário registado nesta unidade ainda.
                          {canManageGrelha && ' Clique em "+ Sumário" acima para inserir o primeiro tópico.'}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {unidade.topicos.map((topico) => {
                            const isDone = topico.status === 'concluido';
                            const isCurrent = topico.status === 'em_curso';
                            const isLocked = topico.status === 'trancado';

                            return (
                              <div
                                key={topico.id}
                                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                                  isDone
                                    ? 'bg-emerald-50/40 border-emerald-200'
                                    : isCurrent
                                    ? 'bg-blue-50/60 border-blue-300 ring-2 ring-blue-400/30 shadow-md'
                                    : 'bg-slate-50/60 border-slate-200/80 opacity-75'
                                }`}
                              >
                                {/* Left: Number, Status icon, Title, Sumário */}
                                <div className="flex items-start gap-3 flex-1">
                                  
                                  {/* Visual Signal as strictly demanded by user */}
                                  <div className="mt-0.5 shrink-0">
                                    {isDone && (
                                      <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30" title="Sumário Concluído">
                                        <CheckCircle2 className="w-5 h-5" />
                                      </div>
                                    )}
                                    {isCurrent && (
                                      <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/40 animate-pulse" title="Em Curso (Aula Atual)">
                                        <BookOpen className="w-4 h-4" />
                                      </div>
                                    )}
                                    {isLocked && (
                                      <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-500 flex items-center justify-center border border-slate-300" title="Trancado (Aguarde os sumários anteriores)">
                                        <Lock className="w-4 h-4 text-slate-600" />
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span className="text-xs font-mono font-bold text-slate-400">
                                        Lição #{topico.numero}
                                      </span>
                                      
                                      {/* Status Badges */}
                                      {isDone && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                                          <CheckCircle2 className="w-3 h-3" />
                                          <span>Concluído</span>
                                        </span>
                                      )}
                                      {isCurrent && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-600 text-white shadow-sm flex items-center gap-1 animate-pulse">
                                          <Play className="w-3 h-3 fill-current" />
                                          <span>Em Curso • Sumário Atual</span>
                                        </span>
                                      )}
                                      {isLocked && (
                                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200 text-slate-600 flex items-center gap-1 border border-slate-300">
                                          <Lock className="w-3 h-3 text-slate-500" />
                                          <span>Trancado</span>
                                        </span>
                                      )}

                                      {topico.duracaoHoras && (
                                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {topico.duracaoHoras}h letivas
                                        </span>
                                      )}
                                    </div>

                                    <h4 className={`text-sm sm:text-base font-bold ${
                                      isDone ? 'text-slate-900' : isCurrent ? 'text-blue-950 font-extrabold' : 'text-slate-600'
                                    }`}>
                                      {topico.titulo}
                                    </h4>

                                    <p className="text-xs text-slate-600 leading-relaxed">
                                      {topico.sumario}
                                    </p>

                                    {/* Observation / Confirmation footprint */}
                                    {isDone && topico.confirmadoPor && (
                                      <div className="pt-1 text-[11px] text-emerald-700 flex flex-wrap items-center gap-x-3 gap-y-1">
                                        <span className="flex items-center gap-1">
                                          <ShieldCheck className="w-3.5 h-3.5" />
                                          Lecionado e Confirmado por: <strong>{topico.confirmadoPor}</strong>
                                        </span>
                                        {topico.dataConfirmacao && (
                                          <span>Data: {topico.dataConfirmacao}</span>
                                        )}
                                      </div>
                                    )}

                                    {topico.observacoesProfessor && (
                                      <div className="p-2 rounded-xl bg-white/80 border border-slate-200 text-[11px] text-slate-700 mt-1.5 flex items-start gap-1.5">
                                        <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                                        <span><strong>Nota Pedagógica:</strong> {topico.observacoesProfessor}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* Right: Professor Checklist Confirmation Controls */}
                                <div className="flex flex-wrap items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200/80">
                                  
                                  {/* Checklist confirmation button for TEACHERS & DIRECTORS */}
                                  {(isTeacher || canManageGrelha) && (
                                    <div className="flex items-center gap-1.5">
                                      {/* If not done, show Mark as Done */}
                                      {!isDone && (
                                        <button
                                          onClick={() => {
                                            setTopicToConfirm({ unitId: unidade.id, topic: topico, nextStatus: 'concluido' });
                                            setTeacherNotes(topico.observacoesProfessor || '');
                                            setIsChecklistModalOpen(true);
                                          }}
                                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-sm transition-all hover:scale-105"
                                          title="Confirmar que este sumário foi lecionado"
                                        >
                                          <CheckCircle2 className="w-3.5 h-3.5" />
                                          <span>Marcar Concluído</span>
                                        </button>
                                      )}

                                      {/* Toggle Em Curso */}
                                      {!isCurrent && (
                                        <button
                                          onClick={() => {
                                            setTopicToConfirm({ unitId: unidade.id, topic: topico, nextStatus: 'em_curso' });
                                            setTeacherNotes(topico.observacoesProfessor || '');
                                            setIsChecklistModalOpen(true);
                                          }}
                                          className="px-2.5 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 font-semibold text-xs flex items-center gap-1 transition-colors"
                                          title="Definir este sumário como a aula atual"
                                        >
                                          <Play className="w-3 h-3" />
                                          <span>Em Curso</span>
                                        </button>
                                      )}

                                      {/* Lock back if needed */}
                                      {!isLocked && (
                                        <button
                                          onClick={() => handleConfirmTopicStatus(unidade.id, topico.id, 'trancado')}
                                          className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
                                          title="Voltar a Trancar sumário"
                                        >
                                          <Lock className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>
                                  )}

                                  {/* Delete topic (Managers only) */}
                                  {canManageGrelha && (
                                    <button
                                      onClick={() => handleDeleteTopic(unidade.id, topico.id)}
                                      className="p-1.5 rounded-xl hover:bg-red-100 text-slate-400 hover:text-red-600 transition-colors"
                                      title="Eliminar Sumário da Grelha"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  )}

                                  {/* If Student: purely visual indicator */}
                                  {isStudent && (
                                    <div className="text-right">
                                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                                        isDone 
                                          ? 'bg-emerald-100 text-emerald-800' 
                                          : isCurrent 
                                          ? 'bg-blue-100 text-blue-800 animate-pulse' 
                                          : 'bg-slate-100 text-slate-500'
                                      }`}>
                                        {isDone ? 'Atingido' : isCurrent ? 'Estudo Ativo' : 'Aguarde'}
                                      </span>
                                    </div>
                                  )}

                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">Nenhum Cronograma Encontrado</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Não existem planos de curso atribuídos para este perfil no momento.
          </p>
        </div>
      )}

      {/* ================= MODAL: CRIAR NOVA GRELHA (LÁZARO, FRANCISCO, MARIA VICTORIA) ================= */}
      {isNewScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold">Criar Nova Grelha Curricular</h3>
                  <p className="text-xs text-slate-500">Exclusivo Diretoria Pedagógica</p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewScheduleModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSchedule} className="py-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Curso:</label>
                <select
                  value={newCursoName}
                  onChange={(e) => setNewCursoName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="Informática">Informática</option>
                  <option value="Inglês">Inglês</option>
                  <option value="Francês">Francês</option>
                  <option value="Cabeleireiro">Cabeleireiro</option>
                  <option value="Pastelaria">Pastelaria</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Identificador da Turma:</label>
                <input
                  type="text"
                  value={newTurmaName}
                  onChange={(e) => setNewTurmaName(e.target.value)}
                  placeholder="Ex: Turma INF-T2, Turma ING-Sábado"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Professor Responsável:</label>
                <select
                  value={newProfResponsavel}
                  onChange={(e) => setNewProfResponsavel(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  {professores.map((p, idx) => (
                    <option key={idx} value={p.nome}>{p.nome} ({p.curso})</option>
                  ))}
                  <option value="Lázaro Luis">Lázaro Luis (Direção Pedagógica)</option>
                  <option value="Francisco Faztudo">Francisco Faztudo (Direção Geral)</option>
                  <option value="Maria Victoria">Maria Victoria (Direção)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewScheduleModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-md"
                >
                  Criar Grelha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADICIONAR UNIDADE ================= */}
      {isAddUnitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold">Adicionar Módulo / Unidade</h3>
              <button 
                onClick={() => setIsAddUnitModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUnit} className="py-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título do Módulo / Unidade:</label>
                <input
                  type="text"
                  value={newUnitTitle}
                  onChange={(e) => setNewUnitTitle(e.target.value)}
                  placeholder="Ex: Módulo 3 — Redes e Cibersegurança"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Breve Descrição do Objetivo:</label>
                <textarea
                  value={newUnitDesc}
                  onChange={(e) => setNewUnitDesc(e.target.value)}
                  placeholder="Competências que o formando irá adquirir nesta unidade..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUnitModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-md"
                >
                  Guardar Unidade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADICIONAR TÓPICO / SUMÁRIO ================= */}
      {isAddTopicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold">Adicionar Sumário / Lição</h3>
              <button 
                onClick={() => setIsAddTopicModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTopic} className="py-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Título da Lição / Sumário:</label>
                <input
                  type="text"
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  placeholder="Ex: Fórmulas PROCV e Tabelas Dinâmicas no Excel"
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Conteúdo Detalhado do Sumário:</label>
                <textarea
                  value={newTopicSumario}
                  onChange={(e) => setNewTopicSumario(e.target.value)}
                  placeholder="Tópicos práticos, exercícios a resolver e matérias teóricas..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Carga Horária (h):</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={newTopicHoras}
                    onChange={(e) => setNewTopicHoras(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Data Prevista:</label>
                  <input
                    type="date"
                    value={newTopicDataPrevista}
                    onChange={(e) => setNewTopicDataPrevista(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTopicModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors shadow-md"
                >
                  Adicionar Tópico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: PROFESSOR CHECKLIST CONFIRMATION ================= */}
      {isChecklistModalOpen && topicToConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold">Checklist do Professor</h3>
              </div>
              <button 
                onClick={() => setIsChecklistModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="font-bold text-slate-900 text-sm">{topicToConfirm.topic.titulo}</div>
                <div className="text-slate-500 text-xs mt-0.5">{topicToConfirm.topic.sumario}</div>
                <div className="mt-2 text-[11px] font-semibold text-blue-600">
                  Novo Estado: <span className="uppercase font-bold">{topicToConfirm.nextStatus}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observações de Lecionação / Registo Pedagógico:
                </label>
                <textarea
                  value={teacherNotes}
                  onChange={(e) => setTeacherNotes(e.target.value)}
                  placeholder="Ex: Turma com excelente domínio prático. Todos os exercícios foram concluídos..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                />
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-[11px] text-blue-800 leading-tight">
                ℹ️ Esta confirmação será carimbada com o seu utilizador (<strong>{currentUser}</strong>) e transmitida em tempo real aos alunos inscritos nesta turma.
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsChecklistModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleConfirmTopicStatus(
                      topicToConfirm.unitId,
                      topicToConfirm.topic.id,
                      topicToConfirm.nextStatus,
                      teacherNotes
                    );
                    setIsChecklistModalOpen(false);
                  }}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors shadow-md flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Checklist</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
