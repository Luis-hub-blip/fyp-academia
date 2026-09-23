'use client';

import React, { useState } from 'react';
import { 
  UserRole, 
  Socio, 
  Professor, 
  Aluno, 
  AgendaTask, 
  CommunityQuestion, 
  MatriculaSolicitacao, 
  PromotionRequest, 
  RemovalRequest, 
  PartnerProfile,
  StudentClassTask,
  TpsRecord,
  CursoCronograma,
  PedagogicalMaterial,
  TurmaEdu,
  PrivilegioRequest
} from '../types';
import { initialCronogramas, initialPedagogicalMaterials, initialTurmasEdu } from '../data/initialData';
import { CourseScheduleSection } from './CourseScheduleSection';
import { PedagogicalMaterialSection } from './PedagogicalMaterialSection';
import { GerirTurmasSection } from './GerirTurmasSection';
import { 
  Calendar as CalendarIcon, 
  Users, 
  GraduationCap, 
  Briefcase, 
  Shield, 
  FileText, 
  TrendingUp, 
  PieChart, 
  BarChart2, 
  Database, 
  CheckCircle2, 
  Clock, 
  Plus, 
  MessageSquare, 
  BookOpen, 
  Award, 
  AlertCircle, 
  UserCheck, 
  ArrowLeft,
  Search,
  Check,
  X,
  Edit3,
  Sparkles,
  Calendar,
  LayoutDashboard,
  UserPlus,
  UserMinus,
  KeyRound,
  Crown
} from 'lucide-react';
import { isAuthorizedSiteEditor } from '../utils/editorPermissions';

interface ProfileEduSystemSectionProps {
  currentUser: string;
  currentRole: UserRole;
  currentProfile: PartnerProfile;
  onUpdateProfile: (data: Partial<PartnerProfile>) => void;
  socios: Socio[];
  professores: Professor[];
  alunos: Aluno[];
  agenda: AgendaTask[];
  community: CommunityQuestion[];
  matriculaSolicitacoes: MatriculaSolicitacao[];
  promotions: PromotionRequest[];
  removals: RemovalRequest[];
  privilegios?: PrivilegioRequest[];
  superAdmins: string[];
  erpFullAccess: string[];
  removalApprovers: string[];
  onAddAgendaTask: (task: Omit<AgendaTask, 'id'>) => void;
  onUpdateAgendaTaskStatus: (id: number, status: AgendaTask['status']) => void;
  onAddCommunityQuestion: (question: string) => void;
  onReplyCommunityQuestion: (questionId: number, replyText: string) => void;
  onApproveMatricula: (id: number) => void;
  onRejectMatricula: (id: number) => void;
  onAddSocio: (nome: string, cargo: string, pass: string) => void;
  onRequestPromotion: (nome: string, cargo: string, pass?: string) => void;
  onApprovePromotion: (id: number) => void;
  onRequestRemoval: (nome: string) => void;
  onApproveRemoval: (id: number) => void;
  onRequestPrivilegio?: (nome: string, categoria: 'socio' | 'professor', privilegio: string) => void;
  onApprovePrivilegio?: (id: number) => void;
  onUpdateAluno: (alunoId: number, updates: Partial<Aluno>) => void;
  onStartEditingSite?: () => void;
  isEditMode?: boolean;
  cronogramas?: CursoCronograma[];
  onUpdateCronogramas?: (updated: CursoCronograma[]) => void;
  materials?: PedagogicalMaterial[];
  onUpdateMaterials?: (updated: PedagogicalMaterial[]) => void;
  turmas?: TurmaEdu[];
  onUpdateTurmas?: (updated: TurmaEdu[]) => void;
  onUpdateMatriculas?: (updated: MatriculaSolicitacao[]) => void;
  onUpdateAlunos?: (updated: Aluno[]) => void;
}

export const ProfileEduSystemSection: React.FC<ProfileEduSystemSectionProps> = ({
  currentUser,
  currentRole,
  currentProfile,
  onUpdateProfile,
  socios,
  professores,
  alunos,
  agenda,
  community,
  matriculaSolicitacoes,
  promotions,
  removals,
  privilegios = [],
  superAdmins,
  erpFullAccess,
  removalApprovers,
  onAddAgendaTask,
  onUpdateAgendaTaskStatus,
  onAddCommunityQuestion,
  onReplyCommunityQuestion,
  onApproveMatricula,
  onRejectMatricula,
  onAddSocio,
  onRequestPromotion,
  onApprovePromotion,
  onRequestRemoval,
  onApproveRemoval,
  onRequestPrivilegio,
  onApprovePrivilegio,
  onUpdateAluno,
  onStartEditingSite,
  isEditMode = false,
  cronogramas: propCronogramas,
  onUpdateCronogramas: propOnUpdateCronogramas,
  materials: propMaterials,
  onUpdateMaterials: propOnUpdateMaterials,
  turmas: propTurmas,
  onUpdateTurmas: propOnUpdateTurmas,
  onUpdateMatriculas: propOnUpdateMatriculas,
  onUpdateAlunos: propOnUpdateAlunos,
}) => {
  // Navigation active section
  const cleanCurrentInitial = (currentUser || '').toLowerCase().replace(/[\u0300-\u036f]/g, '').trim();
  const isInitialStudent = currentRole === 'student' || (alunos && alunos.some((a) => a.nome.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrentInitial));
  const isInitialFundador = ['francisco faztudo', 'lazaro luis', 'maria victoria'].includes(cleanCurrentInitial);
  const isInitialAdmin = isInitialFundador || (superAdmins && superAdmins.some((sa) => sa.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrentInitial));

  const [activeSection, setActiveSection] = useState<string>(
    isInitialStudent ? 'cronograma' : isInitialAdmin ? 'consulta-geral' : 'erp-tps'
  );

  // Turmas state & updates (influences ERP in real-time)
  const [localTurmas, setLocalTurmas] = useState<TurmaEdu[]>(
    propTurmas || initialTurmasEdu
  );

  React.useEffect(() => {
    if (propTurmas) {
      setLocalTurmas(propTurmas);
    }
  }, [propTurmas]);

  const handleUpdateTurmas = (updated: TurmaEdu[]) => {
    setLocalTurmas(updated);
    if (propOnUpdateTurmas) {
      propOnUpdateTurmas(updated);
    }
    try {
      localStorage.setItem('fyp_turmas_edu', JSON.stringify(updated));
    } catch (e) {
      console.warn('Erro ao persistir turmas:', e);
    }
  };

  // Real-time Turmas ERP Metrics Summary
  const turmasSummary = React.useMemo(() => {
    const total = localTurmas.length;
    const concluidas = localTurmas.filter(t => t.status === 'concluido').length;
    const ativas = localTurmas.filter(t => t.status === 'em_andamento').length;
    const taxaConclusao = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    const totalAlunosFormados = localTurmas
      .filter(t => t.status === 'concluido')
      .reduce((acc, t) => acc + t.alunosNomes.length, 0);

    return {
      total,
      concluidas,
      ativas,
      taxaConclusao,
      totalAlunosFormados
    };
  }, [localTurmas]);

  // Cronogramas state & updates
  const [localCronogramas, setLocalCronogramas] = useState<CursoCronograma[]>(
    propCronogramas || initialCronogramas
  );

  React.useEffect(() => {
    if (propCronogramas) {
      setLocalCronogramas(propCronogramas);
    }
  }, [propCronogramas]);

  const handleUpdateCronogramas = (updated: CursoCronograma[]) => {
    setLocalCronogramas(updated);
    if (propOnUpdateCronogramas) {
      propOnUpdateCronogramas(updated);
    }
  };

  // Pedagogical Materials state & updates
  const [localMaterials, setLocalMaterials] = useState<PedagogicalMaterial[]>(
    propMaterials || initialPedagogicalMaterials
  );

  React.useEffect(() => {
    if (propMaterials) {
      setLocalMaterials(propMaterials);
    }
  }, [propMaterials]);

  const handleUpdateMaterials = (updated: PedagogicalMaterial[]) => {
    setLocalMaterials(updated);
    if (propOnUpdateMaterials) {
      propOnUpdateMaterials(updated);
    }
  };

  // Cronograma metrics calculated for real-time EduSystem ERP influence
  const cronogramaSummary = React.useMemo(() => {
    let totalTopicos = 0;
    let concluidos = 0;
    let emCurso = 0;
    let trancados = 0;
    const turmasAtrasadas: string[] = [];

    const todayStr = new Date().toISOString().split('T')[0];

    localCronogramas.forEach((c) => {
      let turmaTemAtraso = false;
      c.unidades.forEach((u) => {
        u.topicos.forEach((t) => {
          totalTopicos++;
          if (t.status === 'concluido') concluidos++;
          else if (t.status === 'em_curso') {
            emCurso++;
            if (t.dataPrevista && t.dataPrevista < todayStr) turmaTemAtraso = true;
          } else {
            trancados++;
            if (t.dataPrevista && t.dataPrevista < todayStr) turmaTemAtraso = true;
          }
        });
      });
      if (turmaTemAtraso) {
        turmasAtrasadas.push(`${c.curso} (${c.turma})`);
      }
    });

    const percentualCumprimento = totalTopicos > 0 ? Math.round((concluidos / totalTopicos) * 100) : 0;
    const temAtrasos = turmasAtrasadas.length > 0;

    return {
      totalTopicos,
      concluidos,
      emCurso,
      trancados,
      percentualCumprimento,
      temAtrasos,
      turmasAtrasadas,
    };
  }, [localCronogramas]);

  // Directory selected detail states
  const [selectedProf, setSelectedProf] = useState<Professor | null>(null);
  const [selectedAluno, setSelectedAluno] = useState<Aluno | null>(null);
  const [selectedSocio, setSelectedSocio] = useState<Socio | null>(null);

  // TPS State
  const [tpsRecords, setTpsRecords] = useState<TpsRecord[]>([
    { id: '1', dateTime: '16/07/2026 10:30', aluno: 'Manuel Diogo', curso: 'Inglês', nivel: 'B1', status: 'Presente', nota: 16 },
    { id: '2', dateTime: '16/07/2026 10:35', aluno: 'Helena Alburquerque', curso: 'Inglês', nivel: 'B2', status: 'Presente', nota: 18 },
    { id: '3', dateTime: '16/07/2026 11:00', aluno: 'Silo João', curso: 'Francês', nivel: 'A2', status: 'Presente', nota: 14 }
  ]);
  const [tpsAluno, setTpsAluno] = useState('Manuel Diogo');
  const [tpsCurso, setTpsCurso] = useState('Inglês');
  const [tpsNivel, setTpsNivel] = useState('A1');
  const [tpsStatus, setTpsStatus] = useState<'Presente' | 'Falta'>('Presente');
  const [tpsNota, setTpsNota] = useState<number>(15);

  // Agenda tab state
  const [agendaTab, setAgendaTab] = useState<'kanban' | 'calendario'>('kanban');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskResp, setTaskResp] = useState(currentUser);
  const [taskPriority, setTaskPriority] = useState<AgendaTask['priority']>('media');
  const [taskDate, setTaskDate] = useState('Sexta-feira');

  // Community state
  const [newQuestionText, setNewQuestionText] = useState('');
  const [replyInput, setReplyInput] = useState<Record<number, string>>({});

  // DSS simulation state
  const [dssSimulated, setDssSimulated] = useState(false);

  // Admin promote/add/privilegio state
  const [modoAdmin, setModoAdmin] = useState<'adicionar' | 'promover' | 'privilegio'>('adicionar');
  const [novoSocioNome, setNovoSocioNome] = useState('');
  const [novoSocioCargo, setNovoSocioCargo] = useState('');
  const [novoSocioSenha, setNovoSocioSenha] = useState('');
  const [promoCategoria, setPromoCategoria] = useState<'professor' | 'aluno' | 'socio' | ''>('');
  const [promoNome, setPromoNome] = useState('');
  const [promoCargo, setPromoCargo] = useState('');
  const [promoSenha, setPromoSenha] = useState('');

  // Atribuir Privilégio state
  const [privilegioCategoria, setPrivilegioCategoria] = useState<'professor' | 'socio'>('professor');
  const [privilegioNome, setPrivilegioNome] = useState('');
  const [privilegioTipo, setPrivilegioTipo] = useState<string>('Administradores');

  // Professor task state
  const [professorTasks, setProfessorTasks] = useState<StudentClassTask[]>([
    { id: 1, title: 'Ficha de Vocabulário - Lesson 4', turma: 'Turma ING-M1', deadline: '20 Julho', desc: 'Completar os exercícios 1 a 5 da página 24 do manual de inglês.', author: currentUser, date: '16 Jul' }
  ]);
  const [profTaskTitle, setProfTaskTitle] = useState('');
  const [profTaskClass, setProfTaskClass] = useState('Turma ING-M1');
  const [profTaskDeadline, setProfTaskDeadline] = useState('');
  const [profTaskDesc, setProfTaskDesc] = useState('');

  // Search filters
  const [searchQuery, setSearchQuery] = useState('');

  // Permissions check
  const cleanCurrent = (currentUser || '').toLowerCase().replace(/[\u0300-\u036f]/g, '').trim();

  // Os 3 administradores soberanos nativos
  const fundadoresQuorum = ['Francisco Faztudo', 'Lázaro Luis', 'Maria Victoria'];
  const isFounderAdmin = fundadoresQuorum.some(
    (f) => f.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrent
  );

  // Alunos: alunos nunca têm acesso a edusystem ou privilégios administrativos
  const isStudent = currentRole === 'student' || alunos.some(
    (a) => a.nome.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrent
  );

  // Administrador com plenos poderes (Lázaro, Francisco, Maria Victoria OU quem recebeu privilégio de Administrador aprovado)
  const isSuperAdmin = !isStudent && (
    isFounderAdmin || 
    superAdmins.some((sa) => sa.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrent)
  );

  const isAdmin = isSuperAdmin;

  // Acesso avançado ao ERP (DSS Módulo 4): apenas administradores ou quem recebeu o privilégio atribuído
  const hasErpFullAccess = !isStudent && (
    isAdmin || 
    erpFullAccess.some((ea) => ea.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrent)
  );

  // Aprovador de remoções e privilégios: restrito aos administradores soberanos ou promovidos
  const isApprover = !isStudent && (
    isAdmin || 
    removalApprovers.some((ra) => ra.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrent)
  );

  const canAssignPrivilege = isFounderAdmin || isAdmin;
  const isFounderApprover = canAssignPrivilege;

  // Professores (para atribuir tarefas pedagógicas)
  const isTeacher = !isStudent && (
    currentRole === 'teacher' || 
    isAdmin || 
    professores.some((p) => p.nome.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanCurrent)
  );

  // Guardião de rotas em tempo de execução
  React.useEffect(() => {
    if (isStudent) {
      const allowedStudentSections = ['cronograma', 'agenda', 'comunidade', 'material-prof', 'desempenho-busuu'];
      if (!allowedStudentSections.includes(activeSection)) {
        setActiveSection('cronograma');
      }
    } else if (!isAdmin) {
      const adminExclusiveSections = ['consulta-geral', 'administracao', 'gerir-turmas', 'erp-ess'];
      if (adminExclusiveSections.includes(activeSection)) {
        setActiveSection('erp-tps');
      }
      if (activeSection === 'erp-dss' && !hasErpFullAccess) {
        setActiveSection('erp-tps');
      }
    }
  }, [currentUser, isStudent, isAdmin, hasErpFullAccess, activeSection]);

  // Card de Acesso Restrito Institucional
  const renderAccessDenied = (
    title: string,
    message: string,
    returnSection: string = 'cronograma',
    returnText: string = 'Voltar ao Meu Cronograma'
  ) => (
    <div className="p-8 rounded-2xl bg-white border border-amber-200 shadow-sm text-center max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shadow-inner">
        <Shield className="w-8 h-8" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600 mt-2 leading-relaxed">{message}</p>
      </div>
      <button
        onClick={() => setActiveSection(returnSection)}
        className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-sm"
      >
        {returnText}
      </button>
    </div>
  );

  // Handlers
  const handleAddTps = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: TpsRecord = {
      id: String(Date.now()),
      dateTime: new Date().toLocaleDateString('pt-PT') + ' ' + new Date().toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }),
      aluno: tpsAluno,
      curso: tpsCurso,
      nivel: tpsNivel,
      status: tpsStatus,
      nota: Number(tpsNota),
    };
    setTpsRecords([newRecord, ...tpsRecords]);

    // Update the aluno's progress / score in real time
    const target = alunos.find((a) => a.nome === tpsAluno);
    if (target) {
      const addedScore = tpsStatus === 'Presente' ? 5 : 0;
      onUpdateAluno(target.id, {
        score: (target.score || 0) + addedScore,
        progress: Math.min(100, (target.progress || 50) + 2),
      });
    }
  };

  const handleCreateAgendaTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    onAddAgendaTask({
      title: taskTitle,
      responsible: taskResp,
      priority: taskPriority,
      date: taskDate,
      status: 'pendente',
    });
    setTaskTitle('');
    setShowAddTaskModal(false);
  };

  const handleCreateProfTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profTaskTitle.trim()) return;
    const newTask: StudentClassTask = {
      id: Date.now(),
      title: profTaskTitle,
      turma: profTaskClass,
      deadline: profTaskDeadline || 'Próxima Aula',
      desc: profTaskDesc,
      author: currentUser,
      date: new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }),
    };
    setProfessorTasks([newTask, ...professorTasks]);
    setProfTaskTitle('');
    setProfTaskDeadline('');
    setProfTaskDesc('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Breadcrumb & User Welcome Banner */}
      <div className="mb-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xl shadow-md overflow-hidden">
            {currentProfile.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={currentProfile.avatar} alt={currentUser} className="w-full h-full object-cover" />
            ) : (
              currentUser.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{currentUser}</h1>
              {isStudent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Aluno
                </span>
              )}
              {isAdmin && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                  Administrador
                </span>
              )}
              {!isStudent && !isAdmin && isTeacher && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase">
                  Professor
                </span>
              )}
              {!isStudent && !isAdmin && !isTeacher && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800 border border-purple-200 uppercase">
                  Sócio Executivo
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Email: {currentProfile.email || 'Não configurado'} • Tel: {currentProfile.phone || 'Não configurado'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
            {isStudent ? 'Portal do Aluno 2026' : 'Ambiente EduSystem 2026'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ================= OUTLOOK STYLE SIDEBAR ================= */}
        <aside className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-6">
          
          {/* Section Group: ERP EduSystem - EXCLUSIVO PROFESSORES, SÓCIOS E ADMINS (ALUNOS NÃO TÊM ACESSO) */}
          {!isStudent && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-blue-600" />
                <span>EduSystem ERP</span>
              </div>
              <div className="space-y-1">
                {/* 1. Presença & Aulas (TPS) - Professores, Sócios e Administradores */}
                <button
                  id="sidebar-btn-erp-tps"
                  onClick={() => setActiveSection('erp-tps')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'erp-tps'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span>1. Presença & Aulas (TPS)</span>
                </button>

                {/* 2. Matrículas / CRM - Professores, Sócios e Administradores */}
                <button
                  id="sidebar-btn-erp-crm"
                  onClick={() => setActiveSection('erp-crm')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'erp-crm'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-cyan-400" />
                  <span>2. Matrículas / CRM</span>
                </button>

                {/* 3. Relatório Turma (MIS) - Professores, Sócios e Administradores */}
                <button
                  id="sidebar-btn-erp-mis"
                  onClick={() => setActiveSection('erp-mis')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'erp-mis'
                      ? 'bg-blue-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  <span>3. Relatório Turma (MIS)</span>
                </button>

                {/* 4. Simulador Riscos (DSS) - Exclusivo Administradores ou quem recebeu privilégio de DSS */}
                {hasErpFullAccess && (
                  <button
                    id="sidebar-btn-erp-dss"
                    onClick={() => setActiveSection('erp-dss')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                      activeSection === 'erp-dss'
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                    <span>4. Simulador Riscos (DSS)</span>
                  </button>
                )}

                {/* 5. Diretoria (ESS) - Exclusivo Administradores com Quórum */}
                {isAdmin && (
                  <button
                    id="sidebar-btn-erp-ess"
                    onClick={() => setActiveSection('erp-ess')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                      activeSection === 'erp-ess'
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <PieChart className="w-4 h-4 text-purple-400" />
                    <span>5. Diretoria (ESS)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Section Group: Operações & Aulas / Área Acadêmica */}
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isStudent ? 'Área Acadêmica do Aluno' : 'Operações & Aulas'}</span>
            </div>
            <div className="space-y-1">
              {/* Cronograma do Curso */}
              <button
                id="sidebar-btn-cronograma"
                onClick={() => setActiveSection('cronograma')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2.5 ${
                  activeSection === 'cronograma'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-cyan-500" />
                  <span>Cronograma do Curso</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeSection === 'cronograma' ? 'bg-white/20 text-white' : 'bg-cyan-100 text-cyan-800'
                }`}>
                  Grelha
                </span>
              </button>

              <button
                onClick={() => setActiveSection('agenda')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                  activeSection === 'agenda'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>Calendário & Agenda</span>
              </button>

              <button
                onClick={() => setActiveSection('comunidade')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                  activeSection === 'comunidade'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4 text-pink-400" />
                <span>Espaço Comunidade</span>
              </button>

              {/* Material Pedagógico (Livros, Manuais & Áudios) */}
              <button
                id="sidebar-btn-material-pedagogico"
                onClick={() => setActiveSection('material-prof')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2.5 ${
                  activeSection === 'material-prof'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-blue-500" />
                  <span>Material Pedagógico</span>
                </div>
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                  activeSection === 'material-prof' ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-800'
                }`}>
                  Livros & Áudios
                </span>
              </button>

              {/* Atribuir Tarefa: Exclusivo para Professores e Administradores (não visível para alunos nem sócios comuns) */}
              {(isTeacher || isAdmin) && !isStudent && (
                <button
                  onClick={() => setActiveSection('tarefa-prof')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'tarefa-prof'
                      ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>Atribuir Tarefa</span>
                </button>
              )}

              {/* GERIR Turmas: Exclusivo para Administradores (Lázaro Luis, Francisco Faztudo, Maria Victoria ou promovidos) */}
              {isAdmin && !isStudent && (
                <button
                  id="sidebar-btn-gerir-turmas"
                  onClick={() => setActiveSection('gerir-turmas')}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2.5 ${
                    activeSection === 'gerir-turmas'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md'
                      : 'text-slate-700 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-cyan-500" />
                    <span>GERIR Turmas</span>
                  </div>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeSection === 'gerir-turmas' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    Novo
                  </span>
                </button>
              )}

              {/* Painel de Desempenho */}
              <button
                onClick={() => setActiveSection('desempenho-busuu')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                  activeSection === 'desempenho-busuu'
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Award className="w-4 h-4 text-emerald-400" />
                <span>Painel de Desempenho</span>
              </button>
            </div>
          </div>

          {/* Section Group: Diretório & Governança - EXCLUSIVO PROFESSORES, SÓCIOS E ADMINS (ALUNOS NÃO TÊM ACESSO) */}
          {!isStudent && (
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-purple-600" />
                <span>Diretório & Governança</span>
              </div>
              <div className="space-y-1">
                {/* Dashboard Geral: Exclusivo Administradores */}
                {isAdmin && (
                  <button
                    id="sidebar-btn-dashboard-geral"
                    onClick={() => setActiveSection('consulta-geral')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-2 ${
                      activeSection === 'consulta-geral'
                        ? 'bg-purple-700 text-white font-semibold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <LayoutDashboard className="w-4 h-4 text-purple-400 shrink-0" />
                      <span className="truncate">Dashboard Geral</span>
                    </div>
                    {(matriculaSolicitacoes.length > 0 || promotions.length > 0 || removals.length > 0 || (privilegios?.filter(p => p.status === 'pendente').length || 0) > 0) && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold shrink-0">
                        {matriculaSolicitacoes.length + promotions.length + removals.length + (privilegios?.filter(p => p.status === 'pendente').length || 0)}
                      </span>
                    )}
                  </button>
                )}

                {/* Professores - Consulta para equipe interna */}
                <button
                  onClick={() => { setSelectedProf(null); setActiveSection('professores'); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'professores'
                      ? 'bg-purple-700 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-blue-400" />
                  <span>Professores ({professores.length})</span>
                </button>

                {/* Alunos - Consulta para equipe interna */}
                <button
                  onClick={() => { setSelectedAluno(null); setActiveSection('alunos'); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'alunos'
                      ? 'bg-purple-700 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Alunos ({alunos.length})</span>
                </button>

                {/* Sócios - Consulta para equipe interna */}
                <button
                  onClick={() => { setSelectedSocio(null); setActiveSection('socios'); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                    activeSection === 'socios'
                      ? 'bg-purple-700 text-white font-semibold shadow-sm'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-amber-400" />
                  <span>Sócios ({socios.length})</span>
                </button>

                {/* 🛡️ Administração: Exclusivo Administradores */}
                {isAdmin && (
                  <button
                    onClick={() => setActiveSection('administracao')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all flex items-center gap-2.5 ${
                      activeSection === 'administracao'
                        ? 'bg-purple-700 text-white font-semibold shadow-sm'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <Shield className="w-4 h-4 text-amber-300" />
                    <span>🛡️ Administração</span>
                    {matriculaSolicitacoes.length > 0 && (
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] bg-red-500 text-white font-bold">
                        {matriculaSolicitacoes.length}
                      </span>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Quick Profile Details Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="font-semibold text-slate-800">Dados do Meu Perfil</div>
            <div className="text-slate-500">
              <span className="font-medium">Contacto:</span> {currentProfile.phone || 'Sem contacto'}
            </div>
            <div className="text-slate-500">
              <span className="font-medium">Email:</span> {currentProfile.email || 'Sem email'}
            </div>
            <button
              onClick={() => {
                const phone = prompt('Novo contacto telefónico:', currentProfile.phone || '');
                const email = prompt('Novo email corporativo:', currentProfile.email || '');
                if (phone !== null || email !== null) {
                  onUpdateProfile({
                    ...(phone !== null ? { phone } : {}),
                    ...(email !== null ? { email } : {}),
                  });
                }
              }}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Editar Contactos
            </button>
          </div>

        </aside>

        {/* ================= MAIN DYNAMIC CONTENT PANE ================= */}
        <main className="lg:col-span-9 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm min-h-[600px]">
          
          {/* ================= 1. ERP TPS: TRANSACTION PROCESSING ================= */}
          {activeSection === 'erp-tps' && (
            isStudent ? (
              renderAccessDenied(
                'Acesso Restrito ao EduSystem',
                'Alunos não têm acesso ao EduSystem ou a privilégios administrativos. Aceda ao seu Cronograma do Curso e ao Material Pedagógico.',
                'cronograma',
                'Ver Meu Cronograma'
              )
            ) : (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Nível Operacional</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">1. Presença & Aulas Diárias (TPS)</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Registo imediato de presenças diárias, níveis ministrados e notas pontuais dos alunos.
                </p>
              </div>

              {/* Form Input */}
              <form onSubmit={handleAddTps} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">Novo Lançamento Diário</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Aluno:</label>
                    <select
                      value={tpsAluno}
                      onChange={(e) => setTpsAluno(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      {alunos.map((a) => (
                        <option key={a.id} value={a.nome}>{a.nome} ({a.curso})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Curso:</label>
                    <select
                      value={tpsCurso}
                      onChange={(e) => setTpsCurso(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Inglês">Inglês</option>
                      <option value="Francês">Francês</option>
                      <option value="Informática">Informática</option>
                      <option value="Cabeleireiro">Cabeleireiro</option>
                      <option value="Pastelaria">Pastelaria</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nível / Módulo:</label>
                    <select
                      value={tpsNivel}
                      onChange={(e) => setTpsNivel(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="A1">A1 - Iniciante</option>
                      <option value="A2">A2 - Básico</option>
                      <option value="B1">B1 - Intermédio</option>
                      <option value="B2">B2 - Intermédio Superior</option>
                      <option value="C1">C1 - Avançado</option>
                      <option value="Geral">Prático / Geral</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Estado da Presença:</label>
                    <select
                      value={tpsStatus}
                      onChange={(e) => setTpsStatus(e.target.value as 'Presente' | 'Falta')}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Presente">Presente</option>
                      <option value="Falta">Falta</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Avaliação / Nota (0-20):</label>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={tpsNota}
                      onChange={(e) => setTpsNota(Number(e.target.value))}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-sm"
                    >
                      Registar no Sistema
                    </button>
                  </div>
                </div>
              </form>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3">Data / Hora</th>
                      <th className="p-3">Estudante</th>
                      <th className="p-3">Curso & Nível</th>
                      <th className="p-3">Presença</th>
                      <th className="p-3">Nota Atribuída</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tpsRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 font-mono text-slate-500 text-xs">{rec.dateTime}</td>
                        <td className="p-3 font-medium text-slate-900">{rec.aluno}</td>
                        <td className="p-3 text-slate-600">{rec.curso} ({rec.nivel})</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            rec.status === 'Presente' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-800">{rec.nota} / 20</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )
          )}

          {/* ================= 2. ERP CRM: CAPTAÇÃO / MATRÍCULAS ================= */}
          {activeSection === 'erp-crm' && (
            isStudent ? (
              renderAccessDenied(
                'Acesso Restrito ao EduSystem',
                'Alunos não têm acesso ao EduSystem ou a privilégios administrativos. Aceda ao seu Cronograma do Curso e ao Material Pedagógico.',
                'cronograma',
                'Ver Meu Cronograma'
              )
            ) : (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Gestão de Relacionamento</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">2. Captação & Pipeline de Matrículas (CRM)</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Acompanhamento de novos contatos interessados e funil de conversão de estudantes.
                </p>
              </div>

              {/* CRM Funnel Stages */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">1. Contactos Recebidos</div>
                  <div className="text-2xl font-extrabold text-blue-900 mt-1">{matriculaSolicitacoes.length + 8}</div>
                  <div className="text-xs text-blue-600 mt-1">Interessados este mês</div>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                  <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">2. Em Atendimento</div>
                  <div className="text-2xl font-extrabold text-amber-900 mt-1">4</div>
                  <div className="text-xs text-amber-600 mt-1">A aguardar agendamento</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">3. Convertidos / Ativos</div>
                  <div className="text-2xl font-extrabold text-emerald-900 mt-1">{alunos.length}</div>
                  <div className="text-xs text-emerald-600 mt-1">Matrículas confirmadas</div>
                </div>
              </div>

              {/* Pending public submissions */}
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-3">Solicitações Recentes do Formulário Público</h3>
                {matriculaSolicitacoes.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs sm:text-sm bg-slate-50 rounded-2xl border border-slate-200">
                    Nenhuma solicitação pública pendente no momento.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matriculaSolicitacoes.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900">{item.nome}</div>
                          <div className="text-xs text-slate-500">
                            Curso: <span className="font-medium text-slate-700">{item.curso} ({item.nivel})</span> • Tel: {item.contacto}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onApproveMatricula(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                          >
                            Matricular
                          </button>
                          <button
                            onClick={() => onRejectMatricula(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                          >
                            Recusar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            )
          )}

          {/* ================= 3. ERP MIS: RELATÓRIO TÁTICO ================= */}
          {activeSection === 'erp-mis' && (
            isStudent ? (
              renderAccessDenied(
                'Acesso Restrito ao EduSystem',
                'Alunos não têm acesso ao EduSystem ou a privilégios administrativos. Aceda ao seu Cronograma do Curso e ao Material Pedagógico.',
                'cronograma',
                'Ver Meu Cronograma'
              )
            ) : (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-600">Nível Tático</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">3. Relatório Gerencial da Turma (MIS)</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Indicadores consolidados de desempenho, taxa de assiduidade e médias gerais por disciplina.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">Média Geral de Turmas</div>
                  <div className="text-2xl font-bold text-blue-900 mt-1">15.8 / 20</div>
                  <div className="text-xs text-emerald-600 mt-1 font-medium">↑ +1.2 pts vs ciclo anterior</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">Taxa Média de Assiduidade</div>
                  <div className="text-2xl font-bold text-indigo-900 mt-1">91.4%</div>
                  <div className="text-xs text-slate-500 mt-1">Meta institucional: &gt; 85%</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs font-semibold text-slate-500">Alunos com Regularidade Financeira</div>
                  <div className="text-2xl font-bold text-emerald-900 mt-1">
                    {alunos.filter((a) => a.estado === 'pago').length} / {alunos.length}
                  </div>
                  <div className="text-xs text-emerald-600 mt-1 font-medium">Situação sob controle</div>
                </div>
              </div>

              {/* Detailed Breakdown per Course */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <div className="font-bold text-slate-900 text-sm">Resumo de Cursos & Lotação</div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Língua Inglesa (Turmas M1 e Sábado)</span>
                      <span>15 / 18 Vagas (83%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: '83%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Informática na Ótica do Utilizador</span>
                      <span>12 / 12 Vagas (100% - Esgotado)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Língua Francesa (Turma A2)</span>
                      <span>8 / 12 Vagas (67%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '67%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ================= INFLUÊNCIA REAL-TIME DO CRONOGRAMA NO MIS ================= */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900 text-sm">
                      Avanço Curricular & Cumprimento do Cronograma das Turmas
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    cronogramaSummary.temAtrasos 
                      ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  }`}>
                    {cronogramaSummary.temAtrasos ? '⚠️ Atraso Pedagógico Detectado' : '🟢 Sucesso Curricular Registado'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-semibold">Execução Geral da Grelha</div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">
                      {cronogramaSummary.percentualCumprimento}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {cronogramaSummary.concluidos} de {cronogramaSummary.totalTopicos} tópicos concluídos
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-semibold">Aulas em Lecionação Ativa</div>
                    <div className="text-xl font-black text-indigo-600 mt-0.5">
                      {cronogramaSummary.emCurso} Turmas
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Sumários a decorrer no momento
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] text-slate-500 font-semibold">Grelhas Cadastradas</div>
                    <div className="text-xl font-black text-blue-600 mt-0.5">
                      {localCronogramas.length} Cursos
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Geridas por Lázaro, Francisco e Maria
                    </div>
                  </div>
                </div>

                {/* Per Turma Breakdown */}
                <div className="space-y-2 pt-2">
                  <div className="text-xs font-semibold text-slate-700">Progresso por Turma:</div>
                  {localCronogramas.map((c) => {
                    let totalT = 0;
                    let doneT = 0;
                    c.unidades.forEach(u => u.topicos.forEach(t => {
                      totalT++;
                      if (t.status === 'concluido') doneT++;
                    }));
                    const pct = totalT > 0 ? Math.round((doneT / totalT) * 100) : 0;

                    return (
                      <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="font-semibold text-slate-800">
                          {c.curso} ({c.turma}) — <span className="font-normal text-slate-500">{c.professorResponsavel}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }}></div>
                          </div>
                          <span className="font-mono font-bold text-slate-700 w-10 text-right">{pct}%</span>
                          <button
                            onClick={() => setActiveSection('cronograma')}
                            className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                          >
                            Ver Checklist
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ================= INFLUÊNCIA REAL-TIME DE TURMAS & CURSOS CONCLUÍDOS NO ERP MIS ================= */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">
                        Desempenho de Turmas & Cursos Concluídos (EduSystem ERP)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Indicadores sincronizados automaticamente com a gestão de turmas
                      </span>
                    </div>
                  </div>
                  {isAuthorizedSiteEditor(currentUser) && (
                    <button
                      type="button"
                      onClick={() => setActiveSection('gerir-turmas')}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Gerir Turmas</span>
                    </button>
                  )}
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-[11px] font-semibold text-slate-500">Total de Turmas</div>
                    <div className="text-xl font-black text-slate-900 mt-0.5">{turmasSummary.total}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">Turmas registadas</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
                    <div className="text-[11px] font-semibold text-emerald-800">Cursos Concluídos</div>
                    <div className="text-xl font-black text-emerald-700 mt-0.5">{turmasSummary.concluidas}</div>
                    <div className="text-[10px] text-emerald-600 mt-0.5">Turmas graduadas</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
                    <div className="text-[11px] font-semibold text-blue-800">Turmas Ativas</div>
                    <div className="text-xl font-black text-blue-700 mt-0.5">{turmasSummary.ativas}</div>
                    <div className="text-[10px] text-blue-600 mt-0.5">Em andamento</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200">
                    <div className="text-[11px] font-semibold text-indigo-800">Taxa de Conclusão</div>
                    <div className="text-xl font-black text-indigo-700 mt-0.5">{turmasSummary.taxaConclusao}%</div>
                    <div className="text-[10px] text-indigo-600 mt-0.5">{turmasSummary.totalAlunosFormados} alunos formados</div>
                  </div>
                </div>

                {/* Visual Bar Graph per Registered Turma */}
                <div className="space-y-2.5 pt-1">
                  <div className="text-xs font-bold text-slate-700">Status & Lotação por Turma (FYP):</div>
                  <div className="space-y-2">
                    {localTurmas.map((t) => {
                      const isConc = t.status === 'concluido';
                      const pctLotacao = Math.min(100, Math.round((t.alunosNomes.length / 10) * 100));

                      return (
                        <div key={t.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${isConc ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                            <span className="font-bold text-slate-900 font-mono">{t.nome}</span>
                            <span className="text-[11px] text-slate-500">({t.curso} • {t.periodo})</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] text-slate-500 font-medium">Lotação:</span>
                              <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${isConc ? 'bg-emerald-600' : 'bg-blue-600'}`}
                                  style={{ width: `${pctLotacao}%` }}
                                />
                              </div>
                              <span className="font-mono text-[11px] font-bold text-slate-700">{t.alunosNomes.length}/10</span>
                            </div>

                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                              isConc ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {isConc ? 'Concluído' : 'Em Curso'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            )
          )}

          {/* ================= 4. ERP DSS: SIMULADOR DE RISCOS ================= */}
          {activeSection === 'erp-dss' && (
            isStudent ? (
              renderAccessDenied(
                'Acesso Restrito ao EduSystem',
                'Alunos não têm acesso ao EduSystem ou a privilégios administrativos. Aceda ao seu Cronograma do Curso e ao Material Pedagógico.',
                'cronograma',
                'Ver Meu Cronograma'
              )
            ) : !hasErpFullAccess ? (
              renderAccessDenied(
                'Módulo 4 (DSS) Restrito',
                'O Simulador de Riscos e Apoio à Decisão (DSS) requer privilégio avançado expressamente atribuído pela Diretoria Executiva.',
                'erp-tps',
                'Voltar ao EduSystem TPS'
              )
            ) : (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Nível Estratégico Analítico</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">4. Simulador de Riscos & Apoio à Decisão (DSS)</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Previsão analítica de retenção, risco de evasão e simulação de cenários pedagógicos.
                </p>
              </div>

              {/* Simulation Action Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-emerald-900 text-sm">Simulação Preditiva Ativa</h4>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    {dssSimulated
                      ? 'Cenário: Aulas de reforço aos sábados aplicadas. Risco de reprovação reduzido em 65%.'
                      : 'Cenário atual: Modelo padrão sem intervenção pedagógica adicional.'}
                  </p>
                </div>
                <button
                  onClick={() => setDssSimulated(!dssSimulated)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all shadow-sm"
                >
                  {dssSimulated ? 'Restaurar Cenário Base' : 'Simular: Aulas de Reforço no Sábado'}
                </button>
              </div>

              {/* Risk Level Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Risco Baixo</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {dssSimulated ? '92%' : cronogramaSummary.temAtrasos ? '71%' : '84%'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Alunos em ritmo ideal de aprovação</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">Risco Moderado</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {dssSimulated ? '6%' : cronogramaSummary.temAtrasos ? '21%' : '12%'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Desfasamento de cronograma ou faltas</div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xs font-bold text-red-600 uppercase tracking-wider">Risco Crítico</div>
                  <div className="text-2xl font-extrabold text-slate-900 mt-1">
                    {dssSimulated ? '2%' : cronogramaSummary.temAtrasos ? '8%' : '4%'}
                  </div>
                  <div className="text-xs text-slate-500 mt-1">Atrasos de propina e sumários pendentes</div>
                </div>
              </div>

              {/* Influência do Cronograma no DSS */}
              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <strong>Impacto do Cronograma Curricular no Algoritmo DSS:</strong> O cumprimento em tempo real da grelha de tópicos ({cronogramaSummary.percentualCumprimento}%) reduz em 28% a probabilidade de desistência estudantil. {cronogramaSummary.temAtrasos ? 'Atenção: Existem turmas com necessidade de reposição curricular para mitigar o risco moderado.' : 'Sem alertas de atraso curricular no momento.'}
                </div>
              </div>
            </div>
            )
          )}

          {/* ================= 5. ERP ESS: VISÃO DA DIRETORIA ================= */}
          {activeSection === 'erp-ess' && (
            !isAdmin ? (
              renderAccessDenied(
                'Módulo 5 (ESS Diretoria) Restrito',
                'O Painel Executivo da Diretoria cabe exclusivamente aos Administradores (Lázaro Luis, Francisco Faztudo e Maria Victoria) ou membros promovidos a Administrador com quórum triplo aprovado.',
                isStudent ? 'cronograma' : 'erp-tps',
                isStudent ? 'Ver Meu Cronograma' : 'Voltar ao EduSystem TPS'
              )
            ) : (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-purple-600">Nível Executivo</span>
                <h2 className="text-2xl font-bold text-slate-900 mt-0.5">5. Visão Executiva da Diretoria (ESS)</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Painel de alto nível para os sócios diretores: receitas estimadas, inadimplência e projeções de crescimento.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Receita Mensal Estimada</div>
                  <div className="text-2xl font-extrabold text-cyan-400 mt-1">2.220.000 Kz</div>
                  <div className="text-xs text-slate-400 mt-1">Com base em 148 matrículas ativas</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Índice de Inadimplência</div>
                  <div className="text-2xl font-extrabold text-amber-400 mt-1">4.2%</div>
                  <div className="text-xs text-emerald-400 mt-1">Abaixo do teto operacional de 7%</div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 text-white shadow-md">
                  <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Margem Operacional Líquida</div>
                  <div className="text-2xl font-extrabold text-emerald-400 mt-1">68.5%</div>
                  <div className="text-xs text-slate-400 mt-1">Sustentabilidade garantida</div>
                </div>
              </div>

              {/* Strategic Insights */}
              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                <div className="font-bold text-purple-900 text-sm">Diretrizes da Reunião de Sócios</div>
                <ul className="text-xs sm:text-sm text-purple-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                    <span><strong>Expansão de Salas:</strong> Aquisição de 6 novas estações de trabalho para o laboratório de informática com vista à abertura do turno noturno.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-2"></span>
                    <span><strong>Parceria Comunitária Golf 2:</strong> Realização de workshop gratuito de cibersegurança e cidadania digital para jovens locais.</span>
                  </li>
                </ul>
              </div>
            </div>
            )
          )}

          {/* ================= CALENDÁRIO & AGENDA ================= */}
          {activeSection === 'agenda' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Agenda & Tarefas Institucionais</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Acompanhe as prioridades corporativas, prazos e responsabilidades dos sócios.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setAgendaTab('kanban')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        agendaTab === 'kanban' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Quadro Kanban
                    </button>
                    <button
                      onClick={() => setAgendaTab('calendario')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        agendaTab === 'calendario' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-600'
                      }`}
                    >
                      Vista de Calendário
                    </button>
                  </div>

                  <button
                    onClick={() => setShowAddTaskModal(true)}
                    className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Nova Tarefa</span>
                  </button>
                </div>
              </div>

              {/* Kanban Columns */}
              {agendaTab === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Pendente */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        <span>Pendente</span>
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {agenda.filter((t) => t.status === 'pendente').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {agenda.filter((t) => t.status === 'pendente').map((task) => (
                        <div key={task.id} className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-sm space-y-2">
                          <div className="text-xs font-bold text-slate-900">{task.title}</div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Resp: <strong>{task.responsible}</strong></span>
                            <span className="font-mono">{task.date}</span>
                          </div>
                          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              task.priority === 'alta' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {task.priority}
                            </span>
                            <button
                              onClick={() => onUpdateAgendaTaskStatus(task.id, 'em_andamento')}
                              className="text-[11px] text-blue-600 hover:underline font-semibold"
                            >
                              Iniciar →
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Em Andamento */}
                  <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                        <span>Em Andamento</span>
                      </span>
                      <span className="text-xs font-semibold text-blue-600">
                        {agenda.filter((t) => t.status === 'em_andamento').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {agenda.filter((t) => t.status === 'em_andamento').map((task) => (
                        <div key={task.id} className="p-3.5 bg-white rounded-xl border border-blue-200 shadow-sm space-y-2">
                          <div className="text-xs font-bold text-slate-900">{task.title}</div>
                          <div className="flex items-center justify-between text-[11px] text-slate-500">
                            <span>Resp: <strong>{task.responsible}</strong></span>
                            <span className="font-mono">{task.date}</span>
                          </div>
                          <div className="pt-2 flex justify-between items-center border-t border-slate-100">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                              {task.priority}
                            </span>
                            <button
                              onClick={() => onUpdateAgendaTaskStatus(task.id, 'realizada')}
                              className="text-[11px] text-emerald-600 hover:underline font-semibold"
                            >
                              Concluir ✓
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Realizada */}
                  <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Realizada</span>
                      </span>
                      <span className="text-xs font-semibold text-emerald-600">
                        {agenda.filter((t) => t.status === 'realizada').length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {agenda.filter((t) => t.status === 'realizada').map((task) => (
                        <div key={task.id} className="p-3.5 bg-white rounded-xl border border-emerald-200 shadow-sm space-y-1">
                          <div className="text-xs font-bold text-slate-800 line-through text-slate-400">{task.title}</div>
                          <div className="text-[11px] text-slate-400">
                            Concluído por <strong>{task.responsible}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                /* Calendário mensal simples e intuitivo */
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between font-bold text-slate-800 text-sm">
                    <span>Julho de 2026</span>
                    <span className="text-xs text-blue-600 font-semibold">Semestre Académico Ativo</span>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 py-2 border-b border-slate-200">
                    <div>Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div>Sáb</div>
                  </div>

                  <div className="grid grid-cols-7 gap-2 text-center text-xs">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                      const isToday = day === 16;
                      const hasEvent = [4, 11, 16, 18, 25].includes(day);
                      return (
                        <div
                          key={day}
                          className={`p-3 rounded-xl border transition-all ${
                            isToday
                              ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-sm'
                              : hasEvent
                              ? 'bg-blue-50 text-blue-900 border-blue-200 font-medium'
                              : 'bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <div>{day}</div>
                          {hasEvent && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mx-auto mt-1"></div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add Task Modal Sub-form */}
              {showAddTaskModal && (
                <div className="p-5 rounded-2xl bg-slate-100 border border-slate-300 space-y-4">
                  <div className="flex justify-between items-center font-bold text-slate-800 text-sm">
                    <span>Adicionar Nova Tarefa à Agenda</span>
                    <button onClick={() => setShowAddTaskModal(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                  </div>
                  <form onSubmit={handleCreateAgendaTask} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Tarefa:</label>
                      <input
                        type="text"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        placeholder="Ex: Entrega de certificados da turma de informática"
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Responsável:</label>
                        <input
                          type="text"
                          value={taskResp}
                          onChange={(e) => setTaskResp(e.target.value)}
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Prioridade:</label>
                        <select
                          value={taskPriority}
                          onChange={(e) => setTaskPriority(e.target.value as AgendaTask['priority'])}
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="alta">Alta</option>
                          <option value="media">Média</option>
                          <option value="baixa">Baixa</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Data / Prazo:</label>
                        <input
                          type="text"
                          value={taskDate}
                          onChange={(e) => setTaskDate(e.target.value)}
                          placeholder="Ex: Sexta-feira, 24 Jul"
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      Guardar Tarefa
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* ================= ESPAÇO COMUNIDADE ================= */}
          {activeSection === 'comunidade' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Espaço Comunidade & Dúvidas</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Os alunos colocam questões pedagógicas e os professores respondem, atribuindo pontuação (+2 pts) aos estudantes.
                </p>
              </div>

              {/* Form to submit question */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Colocar Nova Dúvida Pedagógica
                </label>
                <textarea
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  rows={2}
                  placeholder="Escreva a sua dúvida sobre o curso, pronúncia, informática ou exercícios..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    if (!newQuestionText.trim()) return;
                    onAddCommunityQuestion(newQuestionText);
                    setNewQuestionText('');
                  }}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
                >
                  Publicar Questão
                </button>
              </div>

              {/* Questions Stream */}
              <div className="space-y-4">
                {community.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center">
                          {item.student.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{item.student}</div>
                          <div className="text-[10px] text-slate-400">{item.date}</div>
                        </div>
                      </div>
                      {item.corrected && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Respondida (+2 pts)</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 font-medium">
                      {item.question}
                    </p>

                    {/* Replies */}
                    {item.replies.length > 0 && (
                      <div className="pl-4 border-l-2 border-indigo-200 space-y-2 pt-2">
                        {item.replies.map((reply, rIdx) => (
                          <div key={rIdx} className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700">
                            <div className="font-bold text-indigo-900">{reply.author} (Docente):</div>
                            <div className="mt-0.5">{reply.text}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply box for teacher */}
                    {isTeacher && (
                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          value={replyInput[item.id] || ''}
                          onChange={(e) => setReplyInput({ ...replyInput, [item.id]: e.target.value })}
                          placeholder="Responder a esta dúvida do aluno..."
                          className="flex-1 text-xs p-2 rounded-xl border border-slate-300"
                        />
                        <button
                          onClick={() => {
                            if (!replyInput[item.id]?.trim()) return;
                            onReplyCommunityQuestion(item.id, replyInput[item.id]);
                            setReplyInput({ ...replyInput, [item.id]: '' });
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                        >
                          Responder (+2 pts)
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= ATRIBUIR TAREFA (PROFESSOR) ================= */}
          {activeSection === 'tarefa-prof' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">✍️ Atribuir Tarefa Pedagógica</h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Crie uma atividade direcionada para uma das suas turmas registadas na academia.
                  </p>
                </div>

                {isAuthorizedSiteEditor(currentUser) && (
                  <button
                    type="button"
                    id="btn-atribuir-tarefa-gerir-turmas"
                    onClick={() => setActiveSection('gerir-turmas')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4 text-cyan-300" />
                    <span>GERIR Turmas</span>
                  </button>
                )}
              </div>

              {/* Banner de atalho para Gerir Turmas */}
              {isAuthorizedSiteEditor(currentUser) && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-white">GERIR Turmas da Academia FYP</div>
                      <div className="text-xs text-slate-300">
                        1-Criar Turmas (até 10 alunos) • 2-Turmas Existentes & Marcar Conclusão de Cursos com reflexo no ERP
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveSection('gerir-turmas')}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition-all flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <Users className="w-4 h-4" />
                    <span>Acessar Gestão de Turmas</span>
                  </button>
                </div>
              )}

              <form onSubmit={handleCreateProfTask} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Atividade / Tarefa:</label>
                  <input
                    type="text"
                    value={profTaskTitle}
                    onChange={(e) => setProfTaskTitle(e.target.value)}
                    placeholder="Ex: Ficha de Leitura - Capítulo 3"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Turma Alvo:</label>
                    <select
                      value={profTaskClass}
                      onChange={(e) => setProfTaskClass(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    >
                      <option value="Turma ING-M1">Turma ING-M1 (Inglês Manhã)</option>
                      <option value="Turma ING-Sábado">Turma ING-Sábado</option>
                      <option value="Turma FR-A2">Turma FR-A2 (Francês)</option>
                      <option value="Turma TI-Manhã">Turma TI-Manhã (Informática)</option>
                      {localTurmas.map((lt) => (
                        <option key={lt.id} value={lt.nome}>
                          {lt.nome} ({lt.curso} - {lt.periodo})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Data Limite:</label>
                    <input
                      type="text"
                      value={profTaskDeadline}
                      onChange={(e) => setProfTaskDeadline(e.target.value)}
                      placeholder="Ex: Sexta-feira, 24 Jul"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Instruções:</label>
                  <textarea
                    value={profTaskDesc}
                    onChange={(e) => setProfTaskDesc(e.target.value)}
                    rows={3}
                    placeholder="Detalhes e objetivos da atividade..."
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-sm"
                >
                  Atribuir à Turma
                </button>
              </form>

              {/* Existing Tasks */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800 text-sm">Tarefas Criadas Recentemente</h3>
                {professorTasks.map((t) => (
                  <div key={t.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900 text-sm">{t.title}</span>
                      <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Prazo: {t.deadline}
                      </span>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Turma: {t.turma}</div>
                    <p className="text-xs text-slate-600 mt-1">{t.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= GERIR TURMAS (NOVA FUNCIONALIDADE INSTITUCIONAL) ================= */}
          {activeSection === 'gerir-turmas' && (
            !isAdmin ? (
              renderAccessDenied(
                'Gestão de Turmas Restrita',
                'A gestão institucional de turmas cabe exclusivamente aos Administradores (Lázaro Luis, Francisco Faztudo e Maria Victoria).',
                isStudent ? 'cronograma' : 'erp-tps',
                isStudent ? 'Ver Meu Cronograma' : 'Voltar ao EduSystem TPS'
              )
            ) : (
            <GerirTurmasSection
              currentUser={currentUser}
              currentRole={currentRole}
              turmas={localTurmas}
              onUpdateTurmas={handleUpdateTurmas}
              matriculaSolicitacoes={matriculaSolicitacoes}
              alunos={alunos}
              onUpdateMatriculas={propOnUpdateMatriculas}
              onUpdateAlunos={propOnUpdateAlunos}
            />
            )
          )}

          {/* ================= MATERIAL PEDAGÓGICO (LIVROS, MANUAIS & ÁUDIOS) ================= */}
          {activeSection === 'material-prof' && (
            <PedagogicalMaterialSection
              currentUser={currentUser}
              currentRole={currentRole}
              materials={localMaterials}
              onUpdateMaterials={handleUpdateMaterials}
              alunos={alunos}
              professores={professores}
            />
          )}

          {/* ================= PAINEL DE DESEMPENHO BUSUU ================= */}
          {activeSection === 'desempenho-busuu' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">📈 Painel de Progresso & Gamificação</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Acompanhamento de proficiência, correções efetuadas e empenho dos estudantes.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {alunos.map((aluno) => (
                  <div key={aluno.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold text-sm flex items-center justify-center">
                          {aluno.nome.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{aluno.nome}</div>
                          <div className="text-xs text-slate-500">{aluno.curso} • {aluno.turma}</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        {aluno.score || 0} Pts
                      </span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                        <span>Progresso no Módulo</span>
                        <span>{aluno.progress || 50}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${aluno.progress || 50}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
                      <div className="p-2 rounded-lg bg-slate-50">
                        <div className="text-slate-400 font-medium">Correções Feitas</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{aluno.corrections || 12}</div>
                      </div>
                      <div className="p-2 rounded-lg bg-slate-50">
                        <div className="text-slate-400 font-medium">Gostos na Comunidade</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{aluno.likes || 8}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= CRONOGRAMA CURRICULAR & PLANO DE LIÇÕES ================= */}
          {activeSection === 'cronograma' && (
            <CourseScheduleSection
              currentUser={currentUser}
              currentRole={currentRole}
              cronogramas={localCronogramas}
              onUpdateCronogramas={handleUpdateCronogramas}
              alunos={alunos}
              professores={professores}
            />
          )}

          {/* ================= DASHBOARD GERAL & GOVERNANÇA DA ACADEMIA ================= */}
          {activeSection === 'consulta-geral' && (
            !isAdmin ? (
              renderAccessDenied(
                'Dashboard Central da Diretoria Restrito',
                'O Dashboard Central com deliberações de matrículas, remoções e quórum de promoções é exclusivo dos Administradores (Lázaro Luis, Francisco Faztudo e Maria Victoria).',
                isStudent ? 'cronograma' : 'erp-tps',
                isStudent ? 'Ver Meu Cronograma' : 'Voltar ao EduSystem TPS'
              )
            ) : (
            <div className="space-y-8">
              {/* Header Executivo do Dashboard */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-200 mb-2">
                    <LayoutDashboard className="w-3.5 h-3.5" />
                    <span>Dashboard Central & Governança FYP+C</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    Dashboard Executivo da Academia
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Visão unificada das solicitações de matrícula pendentes, aprovações de promoção com quórum triplo, remoções e métricas institucionais.
                  </p>
                </div>

                {/* Badge de status global de decisões */}
                <div className="flex flex-wrap items-center gap-2">
                  {(matriculaSolicitacoes.length > 0 || promotions.length > 0 || removals.length > 0 || (privilegios?.filter(p => p.status === 'pendente').length || 0) > 0) ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      {matriculaSolicitacoes.length + promotions.length + removals.length + (privilegios?.filter(p => p.status === 'pendente').length || 0)} decisões pendentes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Governança em dia
                    </span>
                  )}
                </div>
              </div>

              {/* Cards de Métricas Rápidas */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveSection('professores')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Professores</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{professores.length}</div>
                  <div className="text-[11px] text-blue-600 font-semibold mt-1 flex items-center gap-1">
                    Corpo docente ativo →
                  </div>
                </div>

                <div
                  onClick={() => setActiveSection('alunos')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Alunos</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{alunos.length}</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                    Fichas ativas →
                  </div>
                </div>

                <div
                  onClick={() => setActiveSection('gerir-turmas')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Turmas</span>
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{localTurmas.length}</div>
                  <div className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                    {turmasSummary.ativas} em andamento • {turmasSummary.concluidas} concluídas
                  </div>
                </div>

                <div
                  onClick={() => setActiveSection('socios')}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-purple-400 hover:shadow-md cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sócios</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{socios.length}</div>
                  <div className="text-[11px] text-purple-600 font-semibold mt-1 flex items-center gap-1">
                    Mesa de governança →
                  </div>
                </div>
              </div>

              {/* ================= 1. SOLICITAÇÕES DE MATRÍCULA PENDENTES ================= */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                      <UserPlus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          Solicitações de Matrícula Pendentes
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          matriculaSolicitacoes.length > 0 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {matriculaSolicitacoes.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Candidatos inscritos através do formulário público do portal FYP+C (&ldquo;Dá o primeiro passo&rdquo;).
                      </p>
                    </div>
                  </div>
                </div>

                {matriculaSolicitacoes.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-800 text-sm">Sem matrículas pendentes</div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Todas as candidaturas foram avaliadas e adicionadas ao sistema de alunos ou concluídas.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {matriculaSolicitacoes.map((item) => (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all flex flex-col justify-between gap-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                              {item.nome.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm leading-tight">{item.nome}</div>
                              <div className="text-xs text-blue-700 font-semibold mt-0.5">
                                Curso: {item.curso} • Nível: {item.nivel}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] font-semibold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                            {item.data || 'Recente'}
                          </span>
                        </div>

                        <div className="text-xs text-slate-600 flex items-center justify-between pt-2 border-t border-slate-200/80">
                          <div>
                            <span className="text-slate-400 font-medium">Contacto:</span>{' '}
                            <strong className="text-slate-800">{item.contacto}</strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => onApproveMatricula(item.id)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Aprovar</span>
                            </button>
                            <button
                              onClick={() => onRejectMatricula(item.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border border-red-200 text-xs font-semibold transition-all flex items-center gap-1"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Rejeitar</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ================= 2. APROVAÇÕES DE PROMOÇÃO COM QUÓRUM TRIPLO ================= */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          Aprovações de Promoção com Quórum Triplo
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          promotions.length > 0 
                            ? 'bg-amber-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {promotions.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        A promoção oficial exige aprovação unânime e obrigatória dos três sócios fundadores: <strong>Francisco Faztudo</strong>, <strong>Lázaro Luis</strong> e <strong>Maria Victoria</strong>.
                      </p>
                    </div>
                  </div>
                </div>

                {promotions.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-800 text-sm">Nenhuma promoção pendente de aprovação</div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      O quadro de sócios e colaboradores encontra-se estável. Todas as deliberações anteriores foram consolidadas.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {promotions.map((p) => {
                      const aprovados = p.aprovacoes || p.votos || [];
                      const hasVoted = aprovados.includes(currentUser);
                      const fundadores = ['Francisco Faztudo', 'Lázaro Luis', 'Maria Victoria'];
                      const votosNecessarios = 3;
                      const percentualQuorum = Math.round((aprovados.length / votosNecessarios) * 100);

                      return (
                        <div
                          key={p.id}
                          className="p-5 rounded-2xl bg-amber-50/40 border border-amber-200/80 shadow-sm space-y-4"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-black text-slate-900 text-base">{p.nome}</h4>
                                <span className="text-xs font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-md">
                                  {p.cargo || p.novoCargo || 'Sócio'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-600 mt-0.5">
                                Candidatura a promoção com exigência de validação dos 3 sócios fundadores.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-700">
                                Quórum: <strong className="text-amber-800">{aprovados.length} de 3 votos</strong>
                              </span>
                              <div className="w-24 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                                <div
                                  className="h-full bg-amber-500 rounded-full transition-all"
                                  style={{ width: `${Math.min(100, percentualQuorum)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>

                          {/* Quórum Triplo Voto dos 3 Sócios */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-amber-200/60">
                            {fundadores.map((socioNome) => {
                              const votou = aprovados.includes(socioNome);
                              return (
                                <div
                                  key={socioNome}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-semibold ${
                                    votou
                                      ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                      : 'bg-white border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 truncate">
                                    <span className={`w-2 h-2 rounded-full ${votou ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                                    <span className="truncate">{socioNome}</span>
                                  </div>
                                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    votou ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {votou ? 'Votou ✓' : 'Aguardando'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Ação de Voto */}
                          <div className="flex items-center justify-between pt-1">
                            <div className="text-xs text-slate-500">
                              {aprovados.length >= 3 ? (
                                <span className="text-emerald-700 font-bold">✓ Quórum atingido! Promoção validada.</span>
                              ) : (
                                <span>Falta(m) {3 - aprovados.length} voto(s) para validação da promoção.</span>
                              )}
                            </div>

                            {isApprover && !hasVoted && (
                              <button
                                onClick={() => onApprovePromotion(p.id)}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Dar o Meu Voto de Aprovação</span>
                              </button>
                            )}

                            {hasVoted && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> O seu voto foi registado
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ================= 3. REMOÇÕES AGUARDANDO APROVAÇÃO ================= */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold shrink-0">
                      <UserMinus className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          Remoções Aguardando Aprovação
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          removals.length > 0 
                            ? 'bg-red-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {removals.length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Processos disciplinares ou revogações de acesso sujeitas a confirmação do quórum de diretores.
                      </p>
                    </div>
                  </div>
                </div>

                {removals.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-800 text-sm">Nenhuma remoção pendente de aprovação</div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Não existem solicitações ativas de revogação de acessos ou exclusão de membros no sistema.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {removals.map((r) => {
                      const aprovados = r.aprovacoes || r.votos || [];
                      const hasVoted = aprovados.includes(currentUser);
                      return (
                        <div
                          key={r.id}
                          className="p-4 rounded-xl bg-red-50/60 border border-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-red-950 text-sm">{r.nome || r.alvoNome}</span>
                              <span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
                                Pedido de Remoção
                              </span>
                            </div>
                            <div className="text-xs text-slate-600 mt-1">
                              Solicitante: <strong>{r.solicitante || 'Direção'}</strong> • Aprovações: <strong>{aprovados.join(', ') || 'Nenhuma'}</strong> ({aprovados.length}/2 necessários)
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isApprover && !hasVoted && (
                              <button
                                onClick={() => onApproveRemoval(r.id)}
                                className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-105 flex items-center gap-1.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Aprovar Remoção</span>
                              </button>
                            )}
                            {hasVoted && (
                              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Aprovado por si
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ================= 4. ATRIBUIÇÕES DE PRIVILÉGIO COM QUÓRUM TRIPLO ================= */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-lg">
                          Atribuições de Privilégio com Quórum Triplo
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                          privilegios.filter((p) => p.status === 'pendente').length > 0 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {privilegios.filter((p) => p.status === 'pendente').length}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">
                        Atribuições de privilégios soberanos pelos administradores <strong>Lázaro Luis</strong>, <strong>Francisco Faztudo</strong> e <strong>Maria Victoria</strong> (exige aprovação unânime de 3/3 votos).
                      </p>
                    </div>
                  </div>

                  {canAssignPrivilege && (
                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection('admin');
                        setModoAdmin('privilegio');
                      }}
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Atribuir Novo Privilégio</span>
                    </button>
                  )}
                </div>

                {privilegios.length === 0 ? (
                  <div className="p-8 text-center rounded-xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                    <div className="font-bold text-slate-800 text-sm">Nenhum privilégio pendente de aprovação</div>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Todas as atribuições de privilégios a professores e sócios foram validadas ou consolidadas com sucesso.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {privilegios.map((priv) => {
                      const aprovados = priv.aprovacoes || priv.votos || [];
                      const hasVoted = aprovados.includes(currentUser);
                      const fundadores = ['Francisco Faztudo', 'Lázaro Luis', 'Maria Victoria'];
                      const isComplete = aprovados.length >= 3;

                      return (
                        <div
                          key={priv.id}
                          className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                            isComplete
                              ? 'bg-emerald-50/60 border-emerald-300'
                              : 'bg-purple-50/60 border-purple-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                                {priv.nome.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-extrabold text-slate-900 text-base">{priv.nome}</span>
                                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                                    {priv.categoria === 'professor' ? 'Corpo Docente' : 'Corpo Diretivo'}
                                  </span>
                                </div>
                                <div className="text-xs text-purple-900 font-bold mt-1 flex items-center gap-1.5">
                                  <Crown className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                  <span>Privilégio Proposto: {priv.privilegio}</span>
                                </div>
                                <div className="text-xs text-slate-500 mt-1">
                                  Submetido por: <strong className="text-slate-700">{priv.solicitante}</strong> • Data: {priv.data || 'Recente'}
                                </div>
                              </div>
                            </div>

                            {/* Badge do Quórum */}
                            <div className="flex flex-col items-end gap-1">
                              <span className={`px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider ${
                                isComplete
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-purple-600 text-white'
                              }`}>
                                Quórum Triplo: {aprovados.length}/3
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {isComplete ? 'Aprovado por Unanimidade' : 'Pendente de aprovação'}
                              </span>
                            </div>
                          </div>

                          {/* Lista dos 3 Sócios Fundadores com poder de voto */}
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5 mt-3.5 border-t border-purple-200/60">
                            {fundadores.map((f) => {
                              const votou = aprovados.some((v) => v.toLowerCase().replace(/[\u0300-\u036f]/g, '') === f.toLowerCase().replace(/[\u0300-\u036f]/g, ''));
                              return (
                                <div
                                  key={f}
                                  className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-all ${
                                    votou
                                      ? 'bg-emerald-100/90 border-emerald-300 text-emerald-950'
                                      : 'bg-white/90 border-slate-200 text-slate-600'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 min-w-0">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                      votou ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                                    }`}>
                                      {votou ? '✓' : f.substring(0, 1)}
                                    </div>
                                    <span className="text-xs font-bold truncate">{f}</span>
                                  </div>
                                  <span className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded ${
                                    votou ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-100 text-slate-500'
                                  }`}>
                                    {votou ? 'Votou ✓' : 'Aguardando'}
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Ação de Voto */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-3 mt-3 border-t border-purple-200/50">
                            <div className="text-xs text-slate-600 font-medium">
                              {isComplete ? (
                                <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  Plenos poderes concedidos com sucesso! Usuário promovido tem plenos privilégios operacionais.
                                </span>
                              ) : (
                                <span>Falta(m) {3 - aprovados.length} voto(s) dos sócios fundadores para validação plena.</span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {isFounderApprover && !hasVoted && !isComplete && (
                                <button
                                  onClick={() => onApprovePrivilegio && onApprovePrivilegio(priv.id)}
                                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-1.5"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Dar o Meu Voto de Aprovação</span>
                                </button>
                              )}

                              {hasVoted && (
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 flex items-center gap-1">
                                  <Check className="w-3.5 h-3.5" /> O seu voto foi registado
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-purple-600" />
                  <span>Resumo dos Órgãos Sociais & Parcerias Institucionais</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  A FYP+C opera no Golf 2 em estreita colaboração com o ecossistema educativo local e a iniciativa Urânios / Golf 2 em Movimento, garantindo formações acessíveis de informática e línguas com certificação reconhecida e governança transparente.
                </p>
              </div>
            </div>
            )
          )}

          {/* ================= LISTA DE PROFESSORES ================= */}
          {activeSection === 'professores' && (
            <div className="space-y-6">
              {selectedProf ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedProf(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar à lista de professores</span>
                  </button>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-blue-700 text-white font-bold text-2xl flex items-center justify-center">
                        {selectedProf.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedProf.nome}</h3>
                        <p className="text-xs font-semibold text-blue-600">{selectedProf.curso}</p>
                        <p className="text-xs text-slate-500">Salas: {selectedProf.salas}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="font-bold text-slate-700">Estado:</span> Ativo no Corpo Docente
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Módulos:</span> Níveis A1 a B2 & Práticas
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Corpo Docente da Academia</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Clique num professor para consultar a respetiva ficha detalhada.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {professores.map((prof, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedProf(prof)}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 font-bold text-sm flex items-center justify-center">
                            {prof.nome.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{prof.nome}</div>
                            <div className="text-xs text-slate-500">{prof.curso} • {prof.salas}</div>
                          </div>
                        </div>
                        <span className="text-xs text-blue-600 font-semibold">Ver Ficha →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= LISTA DE ALUNOS ================= */}
          {activeSection === 'alunos' && (
            <div className="space-y-6">
              {selectedAluno ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedAluno(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar à lista de alunos</span>
                  </button>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-bold text-2xl flex items-center justify-center">
                          {selectedAluno.nome.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900">{selectedAluno.nome}</h3>
                          <p className="text-xs font-semibold text-emerald-700">{selectedAluno.curso} • {selectedAluno.turma}</p>
                          <p className="text-xs text-slate-500">ID de Matrícula: #{selectedAluno.id}</p>
                        </div>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedAluno.estado === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {selectedAluno.estado === 'pago' ? 'Propina Regularizada' : 'Em Atraso'}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-slate-400 font-medium">Propina</div>
                        <div className="font-bold text-slate-800 text-sm mt-1">{selectedAluno.propina}</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-slate-400 font-medium">Progresso</div>
                        <div className="font-bold text-slate-800 text-sm mt-1">{selectedAluno.progress || 50}%</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-slate-400 font-medium">Pontos Gamificação</div>
                        <div className="font-bold text-slate-800 text-sm mt-1">{selectedAluno.score || 0} Pts</div>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-200">
                        <div className="text-slate-400 font-medium">Dívidas</div>
                        <div className="font-bold text-slate-800 text-sm mt-1">{selectedAluno.dividas}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">Alunos por Turma</h2>
                      <p className="text-xs sm:text-sm text-slate-500">
                        Clique num aluno para consultar a ficha pedagógica e financeira.
                      </p>
                    </div>

                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Pesquisar aluno..."
                        className="text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    {alunos
                      .filter((a) => a.nome.toLowerCase().includes(searchQuery.toLowerCase()) || a.curso.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((aluno) => (
                        <div
                          key={aluno.id}
                          onClick={() => setSelectedAluno(aluno)}
                          className="p-4 rounded-xl bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-all cursor-pointer flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-sm flex items-center justify-center">
                              {aluno.nome.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900 text-sm">{aluno.nome}</div>
                              <div className="text-xs text-slate-500">{aluno.curso} • {aluno.turma}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                              aluno.estado === 'pago' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {aluno.estado === 'pago' ? 'Pago' : 'Dívida'}
                            </span>
                            <span className="text-xs text-emerald-600 font-semibold">Ver Ficha →</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= LISTA DE SÓCIOS ================= */}
          {activeSection === 'socios' && (
            <div className="space-y-6">
              {selectedSocio ? (
                <div className="space-y-4">
                  <button
                    onClick={() => setSelectedSocio(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar à lista de sócios</span>
                  </button>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-purple-800 text-white font-bold text-2xl flex items-center justify-center">
                        {selectedSocio.nome.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedSocio.nome}</h3>
                        <p className="text-xs font-semibold text-purple-700">{selectedSocio.cargo}</p>
                        <p className="text-xs text-slate-500">Status: {selectedSocio.status}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Sócios da Academia</h2>
                    <p className="text-xs sm:text-sm text-slate-500">
                      Corpo societário e executivo da FYP+C.
                    </p>
                  </div>

                  <div className="space-y-2">
                    {socios.map((socio, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedSocio(socio)}
                        className="p-4 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:bg-purple-50/40 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 font-bold text-sm flex items-center justify-center">
                            {socio.nome.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{socio.nome}</div>
                            <div className="text-xs text-slate-500">{socio.cargo}</div>
                          </div>
                        </div>
                        <span className="text-xs text-purple-600 font-semibold">Ver Ficha →</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= ADMINISTRAÇÃO (SUPER ADMINS & SÓCIOS COM PODER DE VOTO) ================= */}
          {activeSection === 'administracao' && (
            !isAdmin ? (
              renderAccessDenied(
                'Painel de Administração Restrito',
                'A área de governança e administração cabe exclusivamente aos Administradores (Lázaro Luis, Francisco Faztudo e Maria Victoria) ou membros promovidos a Administrador com quórum triplo aprovado.',
                isStudent ? 'cronograma' : 'erp-tps',
                isStudent ? 'Ver Meu Cronograma' : 'Voltar ao EduSystem TPS'
              )
            ) : (
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-purple-600">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Painel de Governança & Segurança</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mt-1">Administração e Controlo de Acessos</h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Gestão de promoções com quórum triplo (Francisco, Lázaro e Maria Victoria), aprovações de matrícula e privilégios.
                </p>
              </div>

              {/* CARD: EDITAR A PÁGINA INICIAL - EXCLUSIVO PARA LÁZARO LUIS, FRANCISCO FAZTUDO E MARIA VICTORIA */}
              {isAuthorizedSiteEditor(currentUser) && (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/15 via-yellow-500/10 to-amber-500/5 border-2 border-amber-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-5">
                  <div className="space-y-1.5">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gestão do Site Público • Acesso Exclusivo</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-slate-900">
                      Editar a página inicial & FYP+C Tec
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                      Como membro da Diretoria com privilégio de edição ({currentUser}), pode atualizar e editar todas as informações nas páginas <strong>&ldquo;Início&rdquo;</strong> e <strong>&ldquo;FYP+C Tec&rdquo;</strong>, além de cadastrar novos cursos e serviços tecnológicos diretamente no site.
                    </p>
                  </div>

                  <button
                    id="btn-admin-editar-pagina-inicial"
                    onClick={onStartEditingSite}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2.5 shrink-0"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>{isEditMode ? 'Continuar Edição no Portal' : 'Editar a página inicial'}</span>
                  </button>
                </div>
              )}

              {/* Matrículas Pendentes do Site */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Solicitações de Matrícula Pendentes ({matriculaSolicitacoes.length})</h3>
                {matriculaSolicitacoes.length === 0 ? (
                  <p className="text-xs text-slate-500">Sem matrículas pendentes de aprovação.</p>
                ) : (
                  <div className="space-y-2">
                    {matriculaSolicitacoes.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{item.nome}</div>
                          <div className="text-xs text-slate-500">Contacto: {item.contacto} • Curso: {item.curso} ({item.nivel})</div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onApproveMatricula(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
                          >
                            Aprovar
                          </button>
                          <button
                            onClick={() => onRejectMatricula(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                          >
                            Rejeitar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Promoções Aguardando Aprovação (Quórum Triplo) */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Aprovações de Promoção com Quórum Triplo</h3>
                <p className="text-xs text-slate-500">
                  A promoção exige a aprovação explícita de Francisco Faztudo, Lázaro Luis e Maria Victoria.
                </p>

                {promotions.length === 0 ? (
                  <p className="text-xs text-slate-500">Nenhuma promoção pendente.</p>
                ) : (
                  <div className="space-y-2">
                    {promotions.map((p) => {
                      const hasVoted = p.aprovacoes.includes(currentUser);
                      return (
                        <div key={p.id} className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{p.nome} → {p.cargo}</div>
                            <div className="text-xs text-slate-600">
                              Aprovações obtidas: <strong>{p.aprovacoes.join(', ') || 'Nenhuma ainda'}</strong> ({p.aprovacoes.length}/3)
                            </div>
                          </div>
                          {isApprover && !hasVoted && (
                            <button
                              onClick={() => onApprovePromotion(p.id)}
                              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                            >
                              Dar o Meu Voto
                            </button>
                          )}
                          {hasVoted && (
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                              <Check className="w-3.5 h-3.5" /> Aprovado por si
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Remoções Aguardando Aprovação */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-base">Remoções Aguardando Aprovação</h3>
                {removals.length === 0 ? (
                  <p className="text-xs text-slate-500">Nenhuma remoção pendente.</p>
                ) : (
                  <div className="space-y-2">
                    {removals.map((r) => {
                      const hasVoted = r.aprovacoes.includes(currentUser);
                      return (
                        <div key={r.id} className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between gap-3">
                          <div>
                            <div className="font-bold text-red-900 text-sm">{r.nome}</div>
                            <div className="text-xs text-slate-600">
                              Aprovações: {r.aprovacoes.join(', ') || 'Nenhuma'} ({r.aprovacoes.length}/3)
                            </div>
                          </div>
                          {isApprover && !hasVoted && (
                            <button
                              onClick={() => onApproveRemoval(r.id)}
                              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
                            >
                              Aprovar Remoção
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ================= ATRIBUIR PRIVILÉGIO (QUÓRUM TRIPLO) ================= */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-200 pt-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <KeyRound className="w-4 h-4 text-purple-600" />
                      <h3 className="font-bold text-slate-900 text-base">Atribuições de Privilégio Aguardando Aprovação (Quórum Triplo)</h3>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                        {privilegios.filter((p) => p.status === 'pendente').length}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Poder exclusivo de <strong>Lázaro Luis</strong>, <strong>Francisco Faztudo</strong> e <strong>Maria Victoria</strong> para atribuir privilégios soberanos a sócios ou professores. Requer quórum triplo (3/3).
                    </p>
                  </div>

                  {canAssignPrivilege && (
                    <button
                      type="button"
                      onClick={() => setModoAdmin('privilegio')}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Atribuir Privilégio</span>
                    </button>
                  )}
                </div>

                {privilegios.length === 0 ? (
                  <p className="text-xs text-slate-500">Nenhuma atribuição de privilégio pendente no momento.</p>
                ) : (
                  <div className="space-y-3">
                    {privilegios.map((priv) => {
                      const aprovados = priv.aprovacoes || priv.votos || [];
                      const hasVoted = aprovados.includes(currentUser);
                      const isComplete = aprovados.length >= 3;
                      const fundadores = ['Francisco Faztudo', 'Lázaro Luis', 'Maria Victoria'];

                      return (
                        <div
                          key={priv.id}
                          className={`p-4 rounded-xl border transition-all ${
                            isComplete ? 'bg-emerald-50/80 border-emerald-300' : 'bg-purple-50/70 border-purple-200'
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-extrabold text-slate-900 text-sm">{priv.nome}</span>
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                                  {priv.categoria === 'professor' ? 'Professor' : 'Sócio'}
                                </span>
                                <span className="text-xs text-slate-400">→</span>
                                <span className="text-xs font-black text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
                                  <Crown className="w-3 h-3 text-purple-600" />
                                  {priv.privilegio}
                                </span>
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                Solicitado por: <strong>{priv.solicitante}</strong> • Votos: <strong>{aprovados.join(', ') || 'Nenhum'}</strong> ({aprovados.length}/3 necessários)
                              </div>
                            </div>

                            {/* Botão de Voto */}
                            <div className="flex items-center gap-2">
                              {isFounderApprover && !hasVoted && !isComplete && (
                                <button
                                  onClick={() => onApprovePrivilegio && onApprovePrivilegio(priv.id)}
                                  className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Dar o Meu Voto</span>
                                </button>
                              )}
                              {hasVoted && (
                                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-300">
                                  <Check className="w-3.5 h-3.5" /> Voto Registado
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Três fundadores */}
                          <div className="grid grid-cols-3 gap-2 pt-3 mt-3 border-t border-purple-200/60 text-center">
                            {fundadores.map((f) => {
                              const votou = aprovados.some((v) => v.toLowerCase().replace(/[\u0300-\u036f]/g, '') === f.toLowerCase().replace(/[\u0300-\u036f]/g, ''));
                              return (
                                <div
                                  key={f}
                                  className={`p-2 rounded-lg text-[11px] font-semibold flex items-center justify-between px-2.5 ${
                                    votou
                                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                      : 'bg-white/80 text-slate-600 border border-slate-200'
                                  }`}
                                >
                                  <span className="truncate">{f.split(' ')[0]}</span>
                                  <span className="text-[10px] font-bold">{votou ? '✓ Votou' : '⏳ Aguardando'}</span>
                                </div>
                              );
                            })}
                          </div>

                          {isComplete && (
                            <div className="mt-2 text-[11px] font-bold text-emerald-800 bg-emerald-100/80 p-2 rounded-lg flex items-center gap-1.5 border border-emerald-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>Quórum Triplo (3/3) atingido! Plenos poderes concedidos e ativos no sistema.</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Form: Promover, Atribuir Privilégio ou Adicionar Sócio */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-xl">
                <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
                  <button
                    type="button"
                    onClick={() => setModoAdmin('adicionar')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modoAdmin === 'adicionar' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    1. Adicionar Sócio Direto
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoAdmin('promover')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modoAdmin === 'promover' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    2. Solicitar Promoção
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoAdmin('privilegio')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      modoAdmin === 'privilegio' ? 'bg-purple-600 text-white shadow-xs' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    3. Atribuir Privilégio
                  </button>

                  {isAuthorizedSiteEditor(currentUser) && (
                    <button
                      type="button"
                      id="btn-admin-gerir-turmas"
                      onClick={() => setActiveSection('gerir-turmas')}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 flex items-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>4- GERIR TURMAS</span>
                    </button>
                  )}
                </div>

                {modoAdmin === 'adicionar' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nome Completo:</label>
                      <input
                        type="text"
                        value={novoSocioNome}
                        onChange={(e) => setNovoSocioNome(e.target.value)}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                        placeholder="Ex: Novo Sócio Executivo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Cargo:</label>
                      <input
                        type="text"
                        value={novoSocioCargo}
                        onChange={(e) => setNovoSocioCargo(e.target.value)}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                        placeholder="Ex: Sócio Executivo"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Senha Inicial:</label>
                      <input
                        type="password"
                        value={novoSocioSenha}
                        onChange={(e) => setNovoSocioSenha(e.target.value)}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                      />
                    </div>
                    <button
                      onClick={() => {
                        if (!novoSocioNome.trim()) return;
                        onAddSocio(novoSocioNome, novoSocioCargo || 'Sócio Executivo', novoSocioSenha || '123456');
                        setNovoSocioNome('');
                        setNovoSocioCargo('');
                        setNovoSocioSenha('');
                      }}
                      className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                    >
                      Adicionar Sócio
                    </button>
                  </div>
                )}

                {modoAdmin === 'promover' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Categoria:</label>
                      <select
                        value={promoCategoria}
                        onChange={(e) => {
                          setPromoCategoria(e.target.value as any);
                          setPromoNome('');
                        }}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="">-- Selecionar Categoria --</option>
                        <option value="professor">Professor</option>
                        <option value="aluno">Aluno</option>
                        <option value="socio">Sócio</option>
                      </select>
                    </div>

                    {promoCategoria && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Selecionar {promoCategoria === 'professor' ? 'Professor(a)' : promoCategoria === 'aluno' ? 'Aluno(a)' : 'Sócio(a)'} Cadastrado(a):
                        </label>
                        <select
                          value={promoNome}
                          onChange={(e) => setPromoNome(e.target.value)}
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="">-- Selecionar da lista de {promoCategoria}s cadastrados --</option>
                          {promoCategoria === 'professor' &&
                            professores.map((p, idx) => (
                              <option key={p.id || idx} value={p.nome}>
                                {p.nome} ({p.curso})
                              </option>
                            ))}
                          {promoCategoria === 'aluno' &&
                            alunos.map((a, idx) => (
                              <option key={a.id || idx} value={a.nome}>
                                {a.nome} ({a.curso} - {a.turma})
                              </option>
                            ))}
                          {promoCategoria === 'socio' &&
                            socios.map((s, idx) => (
                              <option key={s.id || idx} value={s.nome}>
                                {s.nome} ({s.cargo})
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {promoNome && (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">Novo Cargo Pretendido:</label>
                        <select
                          value={promoCargo}
                          onChange={(e) => setPromoCargo(e.target.value)}
                          className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                        >
                          <option value="">-- Selecionar Cargo --</option>
                          <option value="Professor">Promover para Professor</option>
                          <option value="Administrador">Promover para Administrador (Plenos Poderes)</option>
                          <option value="Sócio">Promover para Sócio</option>
                          <option value="Secretaria">Promover para Secretaria</option>
                          <option value="Super Administrador">Promover para Super Administrador</option>
                        </select>
                      </div>
                    )}

                    {promoCargo && (
                      <button
                        onClick={() => {
                          onRequestPromotion(promoNome, promoCargo, promoSenha);
                          setPromoNome('');
                          setPromoCargo('');
                          setPromoCategoria('');
                        }}
                        className="py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
                      >
                        Solicitar Promoção para Voto Triplo
                      </button>
                    )}
                  </div>
                )}

                {modoAdmin === 'privilegio' && (
                  <div className="space-y-3">
                    <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <KeyRound className="w-4 h-4 text-purple-600" />
                        <span>Atribuição Soberana de Privilégios</span>
                      </div>
                      <p className="text-[11px] text-purple-800 leading-relaxed">
                        Lázaro Luis, Francisco Faztudo e Maria Victoria têm os poderes de atribuir privilégios a qualquer um dos sócios ou professores. Requer aprovação do Quórum Triplo (3/3) e confere plenos poderes ao promovido.
                      </p>
                    </div>

                    {!canAssignPrivilege && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                        Apenas os 3 administradores (Lázaro Luis, Francisco Faztudo e Maria Victoria) têm autorização para submeter novas atribuições de privilégios.
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Área / Categoria do Membro:</label>
                      <select
                        value={privilegioCategoria}
                        onChange={(e) => {
                          setPrivilegioCategoria(e.target.value as 'professor' | 'socio');
                          setPrivilegioNome('');
                        }}
                        disabled={!canAssignPrivilege}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="professor">Professor (Corpo Docente)</option>
                        <option value="socio">Sócio (Corpo Diretivo & Executivo)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Selecionar {privilegioCategoria === 'professor' ? 'Professor(a)' : 'Sócio(a)'} Cadastrado(a):
                      </label>
                      <select
                        value={privilegioNome}
                        onChange={(e) => setPrivilegioNome(e.target.value)}
                        disabled={!canAssignPrivilege}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="">-- Selecionar da lista de {privilegioCategoria}s cadastrados --</option>
                        {privilegioCategoria === 'professor' &&
                          professores.map((p, idx) => (
                            <option key={p.id || idx} value={p.nome}>
                              {p.nome} ({p.curso})
                            </option>
                          ))}
                        {privilegioCategoria === 'socio' &&
                          socios.map((s, idx) => (
                            <option key={s.id || idx} value={s.nome}>
                              {s.nome} ({s.cargo})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Privilégio a Atribuir:</label>
                      <select
                        value={privilegioTipo}
                        onChange={(e) => setPrivilegioTipo(e.target.value)}
                        disabled={!canAssignPrivilege}
                        className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white font-medium"
                      >
                        <option value="Administradores">Administradores (Plenos poderes iguais a Lázaro Luis e Francisco Faztudo)</option>
                        <option value="Secretaria">Secretaria (Gestão Operacional, Presenças & Matrículas)</option>
                        <option value="Edição de Conteúdo da Área Inicial e da FYP+C Tec">Edição de Conteúdo da Área Inicial e da FYP+C Tec</option>
                        <option value="EduSystem 1 (Presença & Aulas TPS)">EduSystem 1 (Presença & Aulas TPS)</option>
                        <option value="EduSystem 2 (Matrículas / CRM)">EduSystem 2 (Matrículas / CRM)</option>
                        <option value="EduSystem 3 (Relatório Turma MIS)">EduSystem 3 (Relatório Turma MIS)</option>
                        <option value="EduSystem 4 (Simulador Riscos DSS & Governança)">EduSystem 4 (Simulador Riscos DSS & Governança)</option>
                        <option value="EduSystem (Módulos 1, 2, 3 e 4)">EduSystem Completo (Módulos 1, 2, 3 e 4)</option>
                      </select>
                    </div>

                    {canAssignPrivilege && privilegioNome && (
                      <button
                        onClick={() => {
                          if (!canAssignPrivilege) return;
                          if (onRequestPrivilegio) {
                            onRequestPrivilegio(privilegioNome, privilegioCategoria, privilegioTipo);
                          }
                          setPrivilegioNome('');
                        }}
                        className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-2"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Submeter Atribuição de Privilégio para Quórum Triplo (3/3)</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

            </div>
            )
          )}

        </main>
      </div>

    </div>
  );
};
