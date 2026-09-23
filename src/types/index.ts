export type UserRole = 'guest' | 'admin' | 'teacher' | 'student' | 'socio';

export interface PartnerProfile {
  phone: string;
  email: string;
  avatar: string;
  nome?: string;
  cargo?: string;
  bio?: string;
  telefone?: string;
  especialidade?: string;
  horarioAtendimento?: string;
}

export interface Socio {
  id?: number;
  nome: string;
  cargo: string;
  status: string;
  avatar?: string;
}

export interface Professor {
  id?: number;
  nome: string;
  curso: string;
  salas: string;
}

export interface Aluno {
  id: number;
  nome: string;
  curso: string;
  turma: string;
  propina: string;
  estado: 'pago' | 'divida';
  dividas: string;
  score: number;
  progress: number;
  corrections: number;
  likes: number;
  nivel?: string;
  presencas?: number;
  faltas?: number;
  notas?: number[];
  status?: string;
}

export interface AgendaTask {
  id: number;
  date: string;
  title: string;
  responsible: string;
  priority: 'alta' | 'media' | 'baixa';
  status: 'pendente' | 'em_andamento' | 'realizada';
}

export interface CommunityReply {
  author: string;
  text: string;
}

export interface CommunityQuestion {
  id: number;
  student: string;
  date: string;
  question: string;
  replies: CommunityReply[];
  corrected: boolean;
}

export interface NewsItem {
  id: number;
  title: string;
  text: string;
  mediaType: 'video' | 'image' | 'none';
  mediaUrl: string;
  date: number;
  likes: number;
}

export interface MatriculaSolicitacao {
  id: number;
  nome: string;
  contacto: string;
  curso: string;
  nivel: string;
  data: string;
  status?: 'pendente' | 'aprovada' | 'rejeitada';
}

export interface PromotionRequest {
  id: number;
  nome: string;
  cargo: string;
  novoCargo?: string;
  solicitante?: string;
  senhaInicial?: string;
  aprovacoes: string[];
  votos?: string[];
  status?: 'pendente' | 'aprovado' | 'rejeitado';
}

export interface RemovalRequest {
  id: number;
  nome: string;
  alvoNome?: string;
  solicitante?: string;
  aprovacoes: string[];
  votos?: string[];
  status?: 'pendente' | 'aprovado' | 'rejeitado';
}

export type PrivilegioTipo = 
  | 'Administradores'
  | 'Secretaria'
  | 'Edição de Conteúdo da Área Inicial e da FYP+C Tec'
  | 'EduSystem 1 (Presença & Aulas TPS)'
  | 'EduSystem 2 (Matrículas / CRM)'
  | 'EduSystem 3 (Relatório Turma MIS)'
  | 'EduSystem 4 (Simulador Riscos DSS & Governança)'
  | 'EduSystem (Módulos 1, 2, 3 e 4)';

export interface PrivilegioRequest {
  id: number;
  nome: string;
  categoria: 'socio' | 'professor';
  privilegio: PrivilegioTipo | string;
  solicitante: string;
  aprovacoes: string[];
  votos?: string[];
  status?: 'pendente' | 'aprovado' | 'rejeitado';
  data?: string;
}

export interface FypcService {
  id: string;
  titulo: string;
  resumo: string;
  detalhe: string;
  imageUrl: string;
  tags: string[];
  features: string[];
}

export interface CalendarEvent {
  day: number;
  month: number;
  year: number;
  title: string;
  cat: 'ingles' | 'frances' | 'informatica' | 'evento';
}

export interface StudentClassTask {
  id: number;
  title: string;
  turma: string;
  deadline: string;
  desc: string;
  author: string;
  date: string;
}

export interface TpsRecord {
  id: string;
  dateTime: string;
  aluno: string;
  curso: string;
  nivel: string;
  status: 'Presente' | 'Falta';
  nota: number;
}

export interface CursoDestaque {
  id: string;
  nome: string;
  categoria: string;
  duracao: string;
  nivel: string;
  vagas: number;
  badge: string;
  descricao: string;
  icone: string;
  cor: string;
  imageUrl?: string;
}

export interface TestimonialItem {
  id?: number;
  quote: string;
  autor: string;
  cargo: string;
}

export interface SlideItem {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
}

export interface HomeContent {
  heroTitle: string;
  heroHighlight: string;
  heroDescription: string;
  heroSlogan: string;
  statsAlunosBase: number;
  statsProfessoresOverride: number;
  statsSociosOverride: number;
  statsCursosCount: number;
  missionTitle: string;
  missionText: string;
  valuesTitle: string;
  valuesList: { title: string; desc: string }[];
  pilar1Title: string;
  pilar1Desc: string;
  pilar2Title: string;
  pilar2Desc: string;
  pilar3Title: string;
  pilar3Desc: string;
}

export interface FypcTecHeroContent {
  badgeText: string;
  title: string;
  titleHighlight: string;
  description: string;
  sprintText: string;
  uptimeText: string;
  securityText: string;
  supportText: string;
}

export type CronogramaStatus = 'concluido' | 'em_curso' | 'trancado';

export interface CronogramaTopico {
  id: string;
  numero: number;
  titulo: string;
  sumario: string;
  duracaoHoras?: number;
  dataPrevista?: string;
  dataConclusao?: string;
  status: CronogramaStatus;
  confirmadoPor?: string;
  dataConfirmacao?: string;
  observacoesProfessor?: string;
}

export interface CronogramaUnidade {
  id: string;
  numero: number;
  titulo: string;
  descricao?: string;
  status?: CronogramaStatus;
  topicos: CronogramaTopico[];
}

export interface CursoCronograma {
  id: string;
  curso: string;
  turma: string;
  professorResponsavel?: string;
  criadoPor: string;
  dataCriacao: string;
  ultimaAtualizacao: string;
  unidades: CronogramaUnidade[];
}

export type MaterialTipo = 'livro' | 'manual' | 'audio';

export interface PedagogicalMaterial {
  id: string;
  titulo: string;
  curso: string;
  tipo: MaterialTipo;
  formato: string;
  tamanho?: string;
  duracao?: string;
  autorOuEditora?: string;
  descricao?: string;
  dataUpload: string;
  uploadedBy: string;
  fileUrl?: string;
  fileName?: string;
  nivelRecomendado?: string;
}

export type TurmaPeriodo = 'Manhã' | 'Tarde' | 'Noite';

export interface TurmaEdu {
  id: string;
  nome: string;
  curso: string;
  periodo: TurmaPeriodo;
  alunosNomes: string[];
  status: 'em_andamento' | 'concluido';
  dataCriacao: string;
  dataConclusao?: string;
  professorResponsavel?: string;
  sala?: string;
}
