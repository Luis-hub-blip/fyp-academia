import { 
  FypcService, 
  Socio, 
  Professor, 
  Aluno, 
  AgendaTask, 
  CommunityQuestion, 
  NewsItem, 
  PartnerProfile,
  CursoDestaque,
  TestimonialItem,
  SlideItem,
  HomeContent,
  FypcTecHeroContent,
  CursoCronograma,
  CronogramaUnidade,
  CronogramaTopico,
  CronogramaStatus,
  PedagogicalMaterial,
  TurmaEdu,
  MatriculaSolicitacao
} from '../types';

export const initialAdmins: Record<string, string> = {
  "Francisco Faztudo": "chico123",
  "Lázaro Luis": "lazaro123",
  "Candido Ngola": "candido123",
  "Leonel Ngola": "leonel123",
  "Emael Morais": "emael123",
  "Maria Victoria": "maria123",
  "Osvaldo Manuel": "osvaldo123",
  "Teacher Amadeu": "amadeu123",
  "Professeur Jean-Pierre": "jean123",
  "Rosario Justo": "justo123",
  "Mauro Kaila": "mauro123",
  "Helena Alburquerque": "helena123",
  "Silo João": "silo123"
};

export const initialPartnersProfiles: Record<string, PartnerProfile> = {
  "Francisco Faztudo": { phone: "923 000 000", email: "francisco@fyp.com", avatar: "" },
  "Lázaro Luis": { phone: "924 111 222", email: "lazaro@fyp.com", avatar: "" },
  "Candido Ngola": { phone: "", email: "", avatar: "" },
  "Leonel Ngola": { phone: "", email: "", avatar: "" },
  "Emael Morais": { phone: "", email: "emael@fyp.com", avatar: "" },
  "Maria Victoria": { phone: "", email: "", avatar: "" },
  "Teacher Amadeu": { phone: "931 555 444", email: "amadeu@fyp.com", avatar: "" },
  "Professeur Jean-Pierre": { phone: "945 222 111", email: "jean@fyp.com", avatar: "" },
  "Rosario Justo": { phone: "923 999 888", email: "rosario@fyp.com", avatar: "" },
  "Mauro Kaila": { phone: "912 444 333", email: "mauro@fyp.com", avatar: "" },
  "Helena Alburquerque": { phone: "951 000 111", email: "helena@fyp.com", avatar: "" },
  "Silo João": { phone: "932 777 666", email: "silo@fyp.com", avatar: "" }
};

export const initialSuperAdmins = ["Francisco Faztudo", "Lázaro Luis", "Maria Victoria"];
export const initialErpFullAccess = ["Francisco Faztudo", "Lázaro Luis", "Maria Victoria"];
export const removalApprovers = ["Francisco Faztudo", "Lázaro Luis", "Maria Victoria"];

export const initialTeachersNomes = [
  "Teacher Amadeu",
  "Professeur Jean-Pierre",
  "Rosario Justo",
  "Mauro Kaila",
  "Emael Morais"
];

export const initialStudentsNomes = [
  "Helena Alburquerque",
  "Silo João"
];

export const initialSocios: Socio[] = [
  { nome: "Francisco Faztudo", cargo: "Sócio-Diretor Geral & Administrador", status: "Ativo" },
  { nome: "Lázaro Luis", cargo: "Sócio-Diretor Pedagógico & Administrador", status: "Ativo" },
  { nome: "Maria Victoria", cargo: "Sócia-Diretora Executiva & Administradora", status: "Ativo" },
  { nome: "Candido Ngola", cargo: "Sócio Executivo", status: "Ativo" },
  { nome: "Leonel Ngola", cargo: "Sócio Executivo", status: "Ativo" },
  { nome: "Emael Morais", cargo: "Sócio & Professor", status: "Ativo" },
  { nome: "Osvaldo Manuel", cargo: "Sócio & Área Técnica", status: "Ativo" }
];

export const initialProfessores: Professor[] = [
  { nome: "Teacher Amadeu", curso: "Língua Inglesa (B2)", salas: "Sala 01" },
  { nome: "Professeur Jean-Pierre", curso: "Língua Francesa (A2)", salas: "Sala 02" },
  { nome: "Lázaro Luis", curso: "Informática Geral", salas: "Laboratório TI" },
  { nome: "Rosario Justo", curso: "A Atribuir", salas: "Por Definir" },
  { nome: "Mauro Kaila", curso: "A Atribuir", salas: "Por Definir" },
  { nome: "Emael Morais", curso: "A Atribuir", salas: "Por Definir" }
];

export const initialAlunos: Aluno[] = [
  { id: 101, nome: "Manuel Diogo", curso: "Inglês", turma: "Turma ING-M1", propina: "15.000 Kz", estado: "pago", dividas: "Nenhuma", score: 0, progress: 65, corrections: 27, likes: 26 },
  { id: 102, nome: "Helena Santos", curso: "Inglês", turma: "Turma ING-M1", propina: "15.000 Kz", estado: "divida", dividas: "1 Mês em Atraso", score: 0, progress: 40, corrections: 12, likes: 18 },
  { id: 103, nome: "Helena Alburquerque", curso: "Inglês", turma: "Turma ING-Sábado", propina: "15.000 Kz", estado: "pago", dividas: "Nenhuma", score: 0, progress: 75, corrections: 32, likes: 45 },
  { id: 104, nome: "Silo João", curso: "Francês", turma: "Turma FR-A2", propina: "15.000 Kz", estado: "pago", dividas: "Nenhuma", score: 0, progress: 50, corrections: 8, likes: 10 },
  { id: 105, nome: "António Pedro", curso: "Informática", turma: "Turma INF-T1", propina: "15.000 Kz", estado: "pago", dividas: "Nenhuma", score: 0, progress: 55, corrections: 15, likes: 20 }
];

export const initialAgenda: AgendaTask[] = [
  { id: 1, date: "Quinta-feira, 16 Jul", title: "Ajustes do espaço de informática e laboratório", responsible: "York", priority: "alta", status: "pendente" },
  { id: 2, date: "Por marcar", title: "Formação de comunicação corporativa e liderança", responsible: "Lázaro Luis", priority: "alta", status: "em_andamento" },
  { id: 3, date: "Domingo", title: "Gravações audiovisuais e conteúdos para turmas de línguas", responsible: "York", priority: "media", status: "pendente" },
  { id: 4, date: "Sexta", title: "Flyer institucional (3 lonas de alta definição)", responsible: "Francisco Faztudo", priority: "media", status: "pendente" },
  { id: 5, date: "Sexta", title: "Preparar documentação de matrículas e fichas de inscrição", responsible: "Lázaro Luis", priority: "media", status: "realizada" },
  { id: 6, date: "Sem data", title: "Terminar o inquérito de satisfação dos alunos", responsible: "York", priority: "baixa", status: "pendente" },
  { id: 7, date: "Sem data", title: "Criar calendário de postagens para as redes", responsible: "Maria Victoria", priority: "baixa", status: "pendente" },
  { id: 8, date: "Sem data", title: "Criar turma executiva no espaço New Project", responsible: "Francisco Faztudo", priority: "alta", status: "pendente" }
];

export const initialCommunity: CommunityQuestion[] = [
  {
    id: 1,
    student: "Silo João",
    date: "14 Jul 2026",
    question: "As aulas práticas de informática vão utilizar sistemas operativos Linux ou apenas Windows?",
    replies: [
      { author: "Lázaro Luis", text: "Focaremos inicialmente em ambiente Windows por ser o padrão de mercado solicitado pelas empresas locais, integrando comandos de terminal e produtividade." }
    ],
    corrected: true
  },
  {
    id: 2,
    student: "Helena Alburquerque",
    date: "15 Jul 2026",
    question: "O material de apoio impresso de Inglês tem um custo adicional ou já está incluído no pacote da formação?",
    replies: [
      { author: "Teacher Amadeu", text: "Todo o manual digital e cadernos de exercícios em PDF estão 100% incluídos. As cópias encadernadas são facultativas." }
    ],
    corrected: true
  }
];

export const initialNews: NewsItem[] = [
  {
    id: 1,
    title: "Grandes Aberturas no Próximo Mês — Projeto 'Inglês & TI no Golf 2'",
    text: "As inscrições estão oficialmente abertas com vagas limitadas para os módulos de Informática na Ótica do Utilizador e Inglês Profissional de Sábado. Venha transformar as suas competências!",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop",
    date: Date.now() - (2 * 24 * 60 * 60 * 1000),
    likes: 14
  },
  {
    id: 2,
    title: "Lançamento da Plataforma EduSystem ERP 2026",
    text: "A FYP+C disponibiliza o novo sistema de processamento de presenças, relatórios gerenciais e acompanhamento analítico para professores e encarregados de educação.",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop",
    date: Date.now() - (6 * 24 * 60 * 60 * 1000),
    likes: 29
  }
];

// SERVIÇOS FYP+C TEC COM FOTOGRAFIAS REAIS DE ALTA DEFINIÇÃO
export const fypcServicesData: FypcService[] = [
  {
    id: 'web-mobile',
    titulo: 'Aplicações Web e Mobile',
    resumo: 'Portais institucionais, sistemas em nuvem e aplicações móveis nativas e híbridas sob medida.',
    detalhe: 'Desenvolvemos plataformas web de alto desempenho, painéis analíticos em tempo real e aplicativos iOS e Android focados em experiência do utilizador, segurança estrita e arquitetura escalável.',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
    tags: ['React', 'Next.js', 'Flutter', 'Node.js', 'APIs REST'],
    features: ['Design UI/UX Responsivo', 'Arquitetura Serverless & Microserviços', 'Integração de Pagamentos Locais (Multicaixa)']
  },
  {
    id: 'cloud-devops',
    titulo: 'Cloud & DevOps',
    resumo: 'Infraestrutura corporativa resiliente, pipelines de CI/CD e automação total de servidores.',
    detalhe: 'Configuração e monitorização contínua de clusters na nuvem (AWS, Google Cloud, Azure), orquestração de containers, backups automatizados e planos de recuperação de desastres (DRP).',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop',
    tags: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Monitorização 24/7'],
    features: ['Escalabilidade Automática', 'Zero-Downtime Deployment', 'Auditoria de Custos Cloud']
  },
  {
    id: 'ia',
    titulo: 'Inteligência Artificial & Dados',
    resumo: 'Assistentes inteligentes, modelos de linguagem e automação preditiva orientada a resultados.',
    detalhe: 'Implementação de assistentes conversacionais corporativos, processamento inteligente de documentos, previsão de evasão e relatórios analíticos alimentados por algoritmos avançados de Machine Learning.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop',
    tags: ['IA Generativa', 'LLMs', 'Visão Computacional', 'Business Intelligence'],
    features: ['Chatbots com Base de Conhecimento Local', 'Automação de Tarefas Repetitivas', 'Dashboards Preditivos']
  },
  {
    id: 'multimedia',
    titulo: 'Multimédia & Produção Audiovisual',
    resumo: 'Captação 4K, fotografia corporativa, motion graphics e conteúdos para marcas líderes.',
    detalhe: 'Estúdio profissional de gravação de spots institucionais, cobertura de eventos de grande porte, podcasts educativos e edição de vídeo com finalização de cor e som de padrão broadcast.',
    imageUrl: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=1200&auto=format&fit=crop',
    tags: ['Vídeo 4K', 'Fotografia', 'Motion Graphics', 'Edição de Som'],
    features: ['Spots Comerciais & Institucionais', 'Cobertura Fotográfica de Eventos', 'Design Gráfico & Identidade Visual']
  },
  {
    id: 'marketing',
    titulo: 'Marketing Digital & Crescimento',
    resumo: 'Estratégia de aquisição, gestão de tráfego pago, SEO técnico e campanhas de impacto.',
    detalhe: 'Gestão estratégica de presença digital com segmentação geográfica precisa, campanhas de conversão no Meta Ads e Google Ads, e relatórios transparentes de ROI para o mercado angolano e internacional.',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop',
    tags: ['Google Ads', 'Meta Ads', 'SEO', 'Email Marketing', 'Gestão de Redes'],
    features: ['Funis de Conversão Otimizados', 'Gestão Editorial de Redes Sociais', 'Relatórios Mensais de Performance']
  },
  {
    id: 'seguranca',
    titulo: 'Consultoria & Segurança da Informação',
    resumo: 'Proteção contra ameaças cibernéticas, auditorias de vulnerabilidade e governança de dados.',
    detalhe: 'Testes de penetração em redes corporativas, conformidade com legislações de proteção de dados (RGPD e leis locais), implementação de firewalls de última geração e capacitação de equipas.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop',
    tags: ['SOC', 'Pentest', 'Firewall UTM', 'Políticas de Privacidade', 'Zero Trust'],
    features: ['Auditoria Completa de Redes', 'Treinamento Anti-Phishing para Colaboradores', 'Plano de Resposta a Incidentes']
  },
  {
    id: 'erp',
    titulo: 'Sistemas Empresariais (ERP / CRM)',
    resumo: 'Plataformas completas de gestão acadêmica, faturação, recursos humanos e controle financeiro.',
    detalhe: 'Engenharia de software empresarial sob medida, como o EduSystem ERP da FYP+C, unificando controle de mensalidades, frequências, emissão de declarações e relatórios para a diretoria.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop',
    tags: ['EduSystem', 'Faturação Certificada', 'Gestão Acadêmica', 'RH & Salários'],
    features: ['Módulos Modulares Personalizáveis', 'Acesso Seguro Baseado em Papéis (RBAC)', 'Exportação Excel & Relatórios PDF']
  }
];

export const initialCursosDestaque: CursoDestaque[] = [
  {
    id: 'informatica',
    nome: 'Informática na Ótica do Utilizador',
    categoria: 'Tecnologia & Escritório',
    duracao: '3 Meses',
    nivel: 'Iniciante ao Avançado',
    vagas: 12,
    badge: 'Alta Procura',
    descricao: 'Domínio do Windows, Pacote Microsoft Office (Word, Excel, PowerPoint), ferramentas de IA no trabalho, navegação segura e produtividade digital.',
    icone: '💻',
    cor: 'from-blue-600 to-cyan-500',
    imageUrl: '/images/course_informatica_1790165382220.jpg'
  },
  {
    id: 'ingles',
    nome: 'Língua Inglesa (English Course)',
    categoria: 'Idiomas Globais',
    duracao: '6 Meses / Nível',
    nivel: 'Níveis A1 a C2',
    vagas: 15,
    badge: 'Certificado Internacional',
    descricao: 'Método imersivo e comunicativo focado em conversação rápida, gramática aplicada, escuta ativa e inglês para negócios.',
    icone: '🇬🇧',
    cor: 'from-blue-700 to-indigo-600',
    imageUrl: '/images/course_ingles_1790165393687.jpg'
  },
  {
    id: 'frances',
    nome: 'Língua Francesa (Cours de Français)',
    categoria: 'Idiomas Globais',
    duracao: '6 Meses / Nível',
    nivel: 'Níveis A1 a B2',
    vagas: 10,
    badge: 'Turmas Dinâmicas',
    descricao: 'Aprenda francês com professores especializados: pronúncia correta, vocabulário essencial, diálogo prático e preparação para exames.',
    icone: '🇫🇷',
    cor: 'from-rose-600 to-red-500',
    imageUrl: '/images/course_frances_1790165403464.jpg'
  },
  {
    id: 'cabeleireiro',
    nome: 'Estética & Cabeleireiro Profissional',
    categoria: 'Artes & Beleza',
    duracao: '4 Meses',
    nivel: 'Prático e Profissionalizante',
    vagas: 8,
    badge: 'Empreendedorismo',
    descricao: 'Técnicas modernas de corte, colorimetria, tratamentos capilares, modelagem e gestão prática de salão de beleza.',
    icone: '💇',
    cor: 'from-pink-600 to-rose-400',
    imageUrl: '/images/course_cabeleireiro_1790165414851.jpg'
  },
  {
    id: 'pastelaria',
    nome: 'Gastronomia & Pastelaria Fina',
    categoria: 'Culinária & Confeitaria',
    duracao: '3 Meses',
    nivel: 'Prático e Comercial',
    vagas: 8,
    badge: 'Criação de Negócio',
    descricao: 'Massas, recheios finos, bolos artísticos, salgados para eventos, boas práticas de higiene alimentar e precificação comercial.',
    icone: '🧁',
    cor: 'from-amber-600 to-yellow-500',
    imageUrl: '/images/course_pastelaria_1790165426605.jpg'
  }
];

export const initialTestimonials: TestimonialItem[] = [
  {
    quote: "A formação de Informática na FYP+C abriu-me as portas para o meu primeiro estágio corporativo. Os computadores são modernos e o método é 100% focado no que o mercado pede.",
    autor: "Manuel António",
    cargo: "Aluno de Informática & Assistente Administrativo"
  },
  {
    quote: "Fazer o curso de Inglês de Sábado foi a melhor decisão. Em apenas 4 meses a minha fluência e confiança para entrevistas melhorou drasticamente com os professores nativos e dedicados.",
    autor: "Helena Alburquerque",
    cargo: "Estudante de Relações Internacionais"
  },
  {
    quote: "O ecossistema integrado da FYP+C e o suporte da direção pedagógica mostram um compromisso genuíno com cada estudante e com o desenvolvimento comunitário do Golf 2.",
    autor: "Dr. Carlos Mendes",
    cargo: "Encarregado de Educação & Parceiro Comunitário"
  }
];

export const initialSlides: SlideItem[] = [
  { id: '1', title: 'Identidade Corporativa FYP+C', subtitle: 'Cartão de Visita & Branding Exclusivo', image: '/business card back.png' },
  { id: '2', title: 'Material Académico & Merchandising', subtitle: 'Tote Bag Oficial da Academia', image: '/Mockup Bolsa Tote.png' },
  { id: '3', title: 'Uniforme & Presença Oficial', subtitle: 'Polo Executivo para Professores e Alunos', image: '/Mockup Camiseta Polo.png' },
  { id: '4', title: 'Sinalética & Campus Físico', subtitle: 'Placa Institucional de Fachada', image: '/Signage-1.png' },
];

export const initialHomeContent: HomeContent = {
  heroTitle: 'Construa o Seu Futuro com',
  heroHighlight: 'Tecnologia e Idiomas',
  heroDescription: 'A FYP+C é uma academia de línguas e centro de computação aplicada, dedicada a formar competências linguísticas e digitais essenciais para o mercado de trabalho moderno.',
  heroSlogan: "Take a step on us and we'll make the whole journey together.",
  statsAlunosBase: 140,
  statsProfessoresOverride: 0,
  statsSociosOverride: 0,
  statsCursosCount: 5,
  missionTitle: 'Missão Institucional',
  missionText: 'A nossa missão é oferecer uma formação acessível, estruturada e de qualidade em línguas estrangeiras e informática na ótica do utilizador, dotando os nossos formandos de ferramentas práticas para prosperarem profissionalmente e gerarem impacto comunitário em Angola.',
  valuesTitle: 'Valores Fundamentais',
  valuesList: [
    { title: 'Compromisso com o aluno:', desc: 'Acompanhamento contínuo da frequência, notas e superação de dificuldades.' },
    { title: 'Qualidade e Rigor:', desc: 'Ensino orientado a resultados práticos e utilidade no mundo corporativo.' },
    { title: 'Inovação Tecnológica:', desc: 'Adoção de ferramentas digitais e plataformas integradas (EduSystem ERP).' }
  ],
  pilar1Title: '1. Metodologia Imersiva & Prática',
  pilar1Desc: 'Estações de trabalho equipadas com computadores atualizados, softwares essenciais do mercado e dinâmica ativa de conversação em línguas desde a primeira aula.',
  pilar2Title: '2. EduSystem ERP Integrado',
  pilar2Desc: 'Controlo em tempo real de presenças (TPS), pipeline de alunos (CRM), relatórios táticos de turmas (MIS), simulador preditivo de risco (DSS) e visão da diretoria (ESS).',
  pilar3Title: '3. Divisão FYP+C Tec',
  pilar3Desc: 'Além da academia de ensino, oferecemos soluções corporativas de engenharia de software, nuvem, inteligência artificial, produção audiovisual e segurança digital.'
};

export const initialFypcTecHeroContent: FypcTecHeroContent = {
  badgeText: 'Divisão Tecnológica & Inovação Digital FYP+C',
  title: 'FYP+C Tec',
  titleHighlight: '+',
  description: 'Soluções tecnológicas completas para impulsionar o seu negócio — do software sob medida à segurança cibernética, da arquitetura em nuvem à inteligência artificial aplicada.',
  sprintText: 'Sprints Semanais',
  uptimeText: '99.9% Uptime SLA',
  securityText: 'Padrão OWASP & LGPD',
  supportText: 'Luanda & Remoto'
};

export const initialCronogramas: CursoCronograma[] = [
  {
    id: 'crono-ing-m1',
    curso: 'Inglês',
    turma: 'Turma ING-M1',
    professorResponsavel: 'Teacher Amadeu',
    criadoPor: 'Lázaro Luis',
    dataCriacao: '01/08/2026',
    ultimaAtualizacao: '20/08/2026',
    unidades: [
      {
        id: 'u-ing-1',
        numero: 1,
        titulo: 'Módulo A1 — Fundamentos & Comunicação Diária',
        descricao: 'Apresentações formais, pronúncia básica e estruturas orais do presente simples.',
        status: 'concluido',
        topicos: [
          {
            id: 'top-ing-1',
            numero: 1,
            titulo: 'Greetings, Alphabet & Formal vs Informal Introductions',
            sumario: 'Cumprimentos formais e informais, soletração de nomes e números de telefone, pronomes pessoais e verb to be afirmativo.',
            duracaoHoras: 4,
            dataPrevista: '05/08/2026',
            dataConclusao: '05/08/2026',
            status: 'concluido',
            confirmadoPor: 'Teacher Amadeu',
            dataConfirmacao: '05/08/2026 11:30',
            observacoesProfessor: 'Turma muito participativa. Domínio consolidado do alfabeto e saudações.'
          },
          {
            id: 'top-ing-2',
            numero: 2,
            titulo: 'Nationalities, Countries, Occupations & Negative/Interrogative',
            sumario: 'Vocabulário de profissões em Luanda e no mundo, países e nacionalidades. Perguntas com What/Where/Who.',
            duracaoHoras: 4,
            dataPrevista: '12/08/2026',
            dataConclusao: '12/08/2026',
            status: 'concluido',
            confirmadoPor: 'Teacher Amadeu',
            dataConfirmacao: '12/08/2026 11:45',
            observacoesProfessor: 'Excelente rendimento no exercício prático de conversação em duplas.'
          },
          {
            id: 'top-ing-3',
            numero: 3,
            titulo: 'Daily Routines, Telling the Time & Simple Present Habits',
            sumario: 'Horas, dias da semana, rotina diária matinal e noturna. Advérbios de frequência (always, usually, sometimes, never).',
            duracaoHoras: 4,
            dataPrevista: '19/08/2026',
            dataConclusao: '19/08/2026',
            status: 'concluido',
            confirmadoPor: 'Teacher Amadeu',
            dataConfirmacao: '19/08/2026 12:00',
            observacoesProfessor: 'Sumário lecionado e avaliado com 100% de presença.'
          }
        ]
      },
      {
        id: 'u-ing-2',
        numero: 2,
        titulo: 'Módulo A2 — Interação Prática & Situações do Quotidiano',
        descricao: 'Comunicação em restaurantes, viagens, compras e meios de transporte urbano.',
        status: 'em_curso',
        topicos: [
          {
            id: 'top-ing-4',
            numero: 4,
            titulo: 'Food & Dining Out, Ordering at Restaurants & Countable/Uncountable',
            sumario: 'Cardápios, fazer pedidos em restaurantes e hotéis, expressões de cortesia (Would you like, Could I have), substantivos contáveis e incontáveis.',
            duracaoHoras: 4,
            dataPrevista: '26/08/2026',
            status: 'em_curso',
            confirmadoPor: 'Teacher Amadeu',
            dataConfirmacao: '21/08/2026 09:15',
            observacoesProfessor: 'AULA ATUAL EM LECIONAÇÃO: Prática oral ativa de simulação de pedidos em cafés e restaurantes.'
          },
          {
            id: 'top-ing-5',
            numero: 5,
            titulo: 'Travel, Public Transport & Asking for Directions',
            sumario: 'Orientação espacial (turn left, go straight, opposite, between), comprar bilhetes de avião e táxi, leitura de mapas e placas.',
            duracaoHoras: 4,
            dataPrevista: '02/09/2026',
            status: 'trancado'
          },
          {
            id: 'top-ing-6',
            numero: 6,
            titulo: 'Shopping, Stores & Prices Vocabulary',
            sumario: 'Vocabulário de lojas, vestuário, cores, tamanhos, perguntar preços (How much is this?) e pagar em kwanzas e moedas estrangeiras.',
            duracaoHoras: 4,
            dataPrevista: '09/09/2026',
            status: 'trancado'
          }
        ]
      },
      {
        id: 'u-ing-3',
        numero: 3,
        titulo: 'Módulo B1 — Fluência no Trabalho & Apresentações',
        descricao: 'Comunicação corporativa, redação de correspondência formal e simulações de entrevista.',
        status: 'trancado',
        topicos: [
          {
            id: 'top-ing-7',
            numero: 7,
            titulo: 'Business Phone Calls & Formal Email Etiquette',
            sumario: 'Atendimento telefónico em empresas, mensagens de ausência, estrutura padrão de um email em inglês corporativo.',
            duracaoHoras: 4,
            dataPrevista: '16/09/2026',
            status: 'trancado'
          },
          {
            id: 'top-ing-8',
            numero: 8,
            titulo: 'Job Interviews, Resume Presentation & Pitching Ideas',
            sumario: 'Perguntas clássicas de entrevista de emprego em multinacionais, apresentação de competências e conquistas profissionais.',
            duracaoHoras: 4,
            dataPrevista: '23/09/2026',
            status: 'trancado'
          },
          {
            id: 'top-ing-9',
            numero: 9,
            titulo: 'Practical Assessment & Final Fluency Certification Exam',
            sumario: 'Avaliação oral individual e teste escrito compreensivo para emissão de certificado oficial da Academia FYP+C.',
            duracaoHoras: 4,
            dataPrevista: '30/09/2026',
            status: 'trancado'
          }
        ]
      }
    ]
  },
  {
    id: 'crono-inf-t1',
    curso: 'Informática',
    turma: 'Turma INF-T1',
    professorResponsavel: 'Lázaro Luis',
    criadoPor: 'Francisco Faztudo',
    dataCriacao: '01/08/2026',
    ultimaAtualizacao: '21/08/2026',
    unidades: [
      {
        id: 'u-inf-1',
        numero: 1,
        titulo: 'Módulo 1 — Hardware, Arquitetura & Sistema Operativo Windows',
        descricao: 'Conhecimento aprofundado dos componentes internos, periféricos e ambiente Windows 11.',
        status: 'concluido',
        topicos: [
          {
            id: 'top-inf-1',
            numero: 1,
            titulo: 'Arquitetura de Computadores: CPU, RAM, SSD/HDD e Periféricos',
            sumario: 'Identificação de barramentos, memórias voláteis e permanentes, funcionamento de fontes de alimentação e placas-mãe.',
            duracaoHoras: 4,
            dataPrevista: '02/08/2026',
            dataConclusao: '02/08/2026',
            status: 'concluido',
            confirmadoPor: 'Lázaro Luis',
            dataConfirmacao: '02/08/2026 16:00',
            observacoesProfessor: 'Apresentação prática no laboratório com componentes abertos.'
          },
          {
            id: 'top-inf-2',
            numero: 2,
            titulo: 'Configuração do Windows 11, Contas de Utilizador & Gestão de Pastas',
            sumario: 'Explorador de Ficheiros, criação de estruturas hierárquicas de diretórios, painel de controlo e personalização segura.',
            duracaoHoras: 4,
            dataPrevista: '09/08/2026',
            dataConclusao: '09/08/2026',
            status: 'concluido',
            confirmadoPor: 'Lázaro Luis',
            dataConfirmacao: '09/08/2026 16:30',
            observacoesProfessor: 'Todos os alunos executaram o exercício de organização de ficheiros com nota máxima.'
          },
          {
            id: 'top-inf-3',
            numero: 3,
            titulo: 'Atalhos de Teclado, Compactação de Ficheiros (.ZIP/.RAR) e Impressoras',
            sumario: 'Velocidade e produtividade com atalhos de sistema, gestão de spooler de impressão e compactação de pastas de trabalho.',
            duracaoHoras: 4,
            dataPrevista: '16/08/2026',
            dataConclusao: '16/08/2026',
            status: 'concluido',
            confirmadoPor: 'Lázaro Luis',
            dataConfirmacao: '16/08/2026 17:00',
            observacoesProfessor: 'Módulo de introdução finalizado com êxito.'
          }
        ]
      },
      {
        id: 'u-inf-2',
        numero: 2,
        titulo: 'Módulo 2 — Produtividade de Escritório (Microsoft Word & Excel)',
        descricao: 'Documentação executiva formal e folhas de cálculo com fórmulas de cálculo financeiro e estatístico.',
        status: 'em_curso',
        topicos: [
          {
            id: 'top-inf-4',
            numero: 4,
            titulo: 'Microsoft Word: Formatação de Ofícios, Tabelas, Margens e Cabeçalhos',
            sumario: 'Normas de correspondência formal angolana, índices automáticos de matérias, tabelas personalizadas e exportação para PDF protegido.',
            duracaoHoras: 4,
            dataPrevista: '23/08/2026',
            status: 'em_curso',
            confirmadoPor: 'Lázaro Luis',
            dataConfirmacao: '20/08/2026 14:00',
            observacoesProfessor: 'EM CURSO: Alunos a elaborar ofício ministerial e relatório empresarial.'
          },
          {
            id: 'top-inf-5',
            numero: 5,
            titulo: 'Microsoft Excel: Fórmulas Condicionais (SE, E, OU), PROCV e Cálculos de Folha',
            sumario: 'Automatização de cálculos salariais com IRT e INSS, fórmulas lógicas encadeadas e funções de procura vertical e horizontal.',
            duracaoHoras: 4,
            dataPrevista: '30/08/2026',
            status: 'trancado'
          },
          {
            id: 'top-inf-6',
            numero: 6,
            titulo: 'Microsoft Excel: Tabelas Dinâmicas, Validação de Dados e Gráficos Gerenciais',
            sumario: 'Construção de mini dashboards de vendas e matrículas escolares, gráficos de barras e circulares profissionais.',
            duracaoHoras: 4,
            dataPrevista: '06/09/2026',
            status: 'trancado'
          }
        ]
      },
      {
        id: 'u-inf-3',
        numero: 3,
        titulo: 'Módulo 3 — Redes de Computadores, Internet & Cibersegurança Prática',
        descricao: 'Conectividade segura, partilha de recursos e proteção ativa de dados corporativos.',
        status: 'trancado',
        topicos: [
          {
            id: 'top-inf-7',
            numero: 7,
            titulo: 'Configuração de Redes Locais (LAN/Wi-Fi), Endereços IP e Routers',
            sumario: 'Topologia estrela, cabos de rede RJ45 e crimpagem, configuração de IP estático e dinâmico (DHCP).',
            duracaoHoras: 4,
            dataPrevista: '13/09/2026',
            status: 'trancado'
          },
          {
            id: 'top-inf-8',
            numero: 8,
            titulo: 'Boas Práticas de Cibersegurança, Prevenção de Phishing e Backups na Nuvem',
            sumario: 'Autenticação em dois fatores (2FA), gestão de palavras-passe complexas e sincronização em Google Drive/OneDrive.',
            duracaoHoras: 4,
            dataPrevista: '20/09/2026',
            status: 'trancado'
          },
          {
            id: 'top-inf-9',
            numero: 9,
            titulo: 'Projeto Final Integrado & Avaliação Prática no Laboratório',
            sumario: 'Resolução de caso prático de escritório simulando a gestão documental e financeira de uma empresa.',
            duracaoHoras: 4,
            dataPrevista: '27/09/2026',
            status: 'trancado'
          }
        ]
      }
    ]
  },
  {
    id: 'crono-fr-a2',
    curso: 'Francês',
    turma: 'Turma FR-A2',
    professorResponsavel: 'Professeur Jean-Pierre',
    criadoPor: 'Maria Victoria',
    dataCriacao: '05/08/2026',
    ultimaAtualizacao: '20/08/2026',
    unidades: [
      {
        id: 'u-fr-1',
        numero: 1,
        titulo: 'Unité 1 — Salutations, Identité & Découverte de la Langue',
        descricao: 'Phonétique, présentations personnelles et verbes de base.',
        status: 'concluido',
        topicos: [
          {
            id: 'top-fr-1',
            numero: 1,
            titulo: 'L’alphabet, les accents et les formules de politesse en français',
            sumario: 'Prononciation des sons nasaux, saluer le matin et le soir, tutoiement et vouvoiement.',
            duracaoHoras: 4,
            dataPrevista: '03/08/2026',
            dataConclusao: '03/08/2026',
            status: 'concluido',
            confirmadoPor: 'Professeur Jean-Pierre',
            dataConfirmacao: '03/08/2026 15:30',
            observacoesProfessor: 'Très bonne prononciation initiale des étudiants.'
          },
          {
            id: 'top-fr-2',
            numero: 2,
            titulo: 'Se présenter: Nom, Nationalité, Âge et Profession',
            sumario: 'Les verbes Être et Avoir au présent, les nombres de 0 à 100 et les pays francophones.',
            duracaoHoras: 4,
            dataPrevista: '10/08/2026',
            dataConclusao: '10/08/2026',
            status: 'concluido',
            confirmadoPor: 'Professeur Jean-Pierre',
            dataConfirmacao: '10/08/2026 15:30',
            observacoesProfessor: 'Exercice oral réussi par Silo João et ses camarades.'
          }
        ]
      },
      {
        id: 'u-fr-2',
        numero: 2,
        titulo: 'Unité 2 — La Ville, Les Achats & La Vie Quotidienne',
        descricao: 'Demander son chemin, faire des courses et décrire sa journée.',
        status: 'em_curso',
        topicos: [
          {
            id: 'top-fr-3',
            numero: 3,
            titulo: 'Demander son chemin, s’orienter et réserver un hôtel',
            sumario: 'Lexique de la ville, prépositions de lieu (à côté de, en face de), réserver une chambre par téléphone.',
            duracaoHoras: 4,
            dataPrevista: '24/08/2026',
            status: 'em_curso',
            confirmadoPor: 'Professeur Jean-Pierre',
            dataConfirmacao: '19/08/2026 14:00',
            observacoesProfessor: 'EN COURS: Simulation dynamique en classe.'
          },
          {
            id: 'top-fr-4',
            numero: 4,
            titulo: 'Au restaurant et au marché: commander et payer',
            sumario: 'Les articles partitifs (du, de la, des), poser des questions et exprimer ses goûts.',
            duracaoHoras: 4,
            dataPrevista: '31/08/2026',
            status: 'trancado'
          },
          {
            id: 'top-fr-5',
            numero: 5,
            titulo: 'Évaluation formative orale et écrite A2',
            sumario: 'Contrôle continu des connaissances linguistiques et délivrance du rapport de niveau.',
            duracaoHoras: 4,
            dataPrevista: '07/09/2026',
            status: 'trancado'
          }
        ]
      }
    ]
  }
];

export const initialPedagogicalMaterials: PedagogicalMaterial[] = [
  {
    id: 'mat-ing-1',
    titulo: 'English File Intermediate Student Book 4th Edition',
    curso: 'Inglês',
    tipo: 'livro',
    formato: 'PDF',
    tamanho: '24.8 MB',
    autorOuEditora: 'Oxford University Press',
    descricao: 'Livro didático principal para estudantes dos níveis A2, B1 e B2 com gramática aplicada, vocabulário e exercícios de conversação.',
    dataUpload: '10/08/2026',
    uploadedBy: 'Lázaro Luis',
    fileName: 'English_File_Intermediate_4th_Ed_FYPC.pdf',
    nivelRecomendado: 'B1 / B2',
  },
  {
    id: 'mat-ing-2',
    titulo: 'Grammar in Use Essential - Raymond Murphy',
    curso: 'Inglês',
    tipo: 'manual',
    formato: 'PDF',
    tamanho: '14.2 MB',
    autorOuEditora: 'Cambridge University Press',
    descricao: 'Guia de referência e prática autónoma de gramática com exercícios resolvidos e testes de diagnóstico.',
    dataUpload: '12/08/2026',
    uploadedBy: 'Francisco Faztudo',
    fileName: 'Essential_Grammar_in_Use_FYPC.pdf',
    nivelRecomendado: 'A1 / A2',
  },
  {
    id: 'mat-ing-audio-1',
    titulo: 'Listening Track 01 - Business Meeting & Introductions',
    curso: 'Inglês',
    tipo: 'audio',
    formato: 'MP3',
    tamanho: '6.4 MB',
    duracao: '4 min 30 s',
    autorOuEditora: 'FYP+C Language Lab / Oxford',
    descricao: 'Diálogo corporativo entre gestores e clientes para treino de compreensão auditiva e sotaques internacionais.',
    dataUpload: '14/08/2026',
    uploadedBy: 'Lázaro Luis',
    fileName: 'Track01_Business_Introductions_FYPC.mp3',
    nivelRecomendado: 'B1',
  },
  {
    id: 'mat-ing-audio-2',
    titulo: 'Listening Track 02 - At the Airport & Checking in',
    curso: 'Inglês',
    tipo: 'audio',
    formato: 'MP3',
    tamanho: '5.1 MB',
    duracao: '3 min 45 s',
    autorOuEditora: 'FYP+C Language Lab',
    descricao: 'Situação real em aeroporto internacional: controle de passaportes, despacho de bagagens e direções de embarque.',
    dataUpload: '15/08/2026',
    uploadedBy: 'Maria Victoria',
    fileName: 'Track02_Airport_Checkin_FYPC.mp3',
    nivelRecomendado: 'A2',
  },
  {
    id: 'mat-fr-1',
    titulo: 'Echo A1 - Méthode de Français avec Cahier d\'exercices',
    curso: 'Francês',
    tipo: 'livro',
    formato: 'PDF',
    tamanho: '28.3 MB',
    autorOuEditora: 'CLE International',
    descricao: 'Método comunicativo completo de língua francesa para jovens e adultos, abordando situações do dia a dia e cultura francófona.',
    dataUpload: '11/08/2026',
    uploadedBy: 'Maria Victoria',
    fileName: 'Echo_A1_Methode_de_Francais_FYPC.pdf',
    nivelRecomendado: 'A1',
  },
  {
    id: 'mat-fr-2',
    titulo: 'Grammaire Progressive du Français - Niveau Intermédiaire',
    curso: 'Francês',
    tipo: 'manual',
    formato: 'PDF',
    tamanho: '16.5 MB',
    autorOuEditora: 'CLE International',
    descricao: 'Manual de aperfeiçoamento gramatical francês com 600 exercícios práticos e autoavaliações.',
    dataUpload: '13/08/2026',
    uploadedBy: 'Lázaro Luis',
    fileName: 'Grammaire_Progressive_Francais_FYPC.pdf',
    nivelRecomendado: 'A2 / B1',
  },
  {
    id: 'mat-fr-audio-1',
    titulo: 'Piste Audio 01 - Prononciation et Salutations en Français',
    curso: 'Francês',
    tipo: 'audio',
    formato: 'MP3',
    tamanho: '7.8 MB',
    duracao: '6 min 15 s',
    autorOuEditora: 'Alliance / FYP+C Francophonie',
    descricao: 'Treino intensivo de fonética francesa, sons nasais, vogais fechadas e entonação em conversas de acolhimento.',
    dataUpload: '14/08/2026',
    uploadedBy: 'Maria Victoria',
    fileName: 'Piste01_Prononciation_Francaise_FYPC.mp3',
    nivelRecomendado: 'A1',
  },
  {
    id: 'mat-fr-audio-2',
    titulo: 'Piste Audio 02 - Commander au Bistro et Vocabulaire Quotidien',
    curso: 'Francês',
    tipo: 'audio',
    formato: 'MP3',
    tamanho: '5.9 MB',
    duracao: '4 min 10 s',
    autorOuEditora: 'Alliance / FYP+C Francophonie',
    descricao: 'Áudio imersivo com diálogo ao vivo num restaurante parisiense e interações com empregados de mesa.',
    dataUpload: '16/08/2026',
    uploadedBy: 'Francisco Faztudo',
    fileName: 'Piste02_Commander_Bistro_FYPC.mp3',
    nivelRecomendado: 'A2',
  },
  {
    id: 'mat-inf-1',
    titulo: 'Manual Prático de Informática na Ótica do Utilizador FYP+C',
    curso: 'Informática na Ótica do Utilizador',
    tipo: 'manual',
    formato: 'PDF',
    tamanho: '19.4 MB',
    autorOuEditora: 'Academia FYP+C Formação Tecnológica',
    descricao: 'Apostila oficial dos laboratórios FYP+C: Windows 11, Microsoft Word, Excel para negócios, PowerPoint e navegação segura na internet.',
    dataUpload: '08/08/2026',
    uploadedBy: 'Francisco Faztudo',
    fileName: 'Manual_Informatica_Otica_Utilizador_FYPC.pdf',
    nivelRecomendado: 'Iniciante / Intermediário',
  },
  {
    id: 'mat-inf-2',
    titulo: 'Guia de Fórmulas Avançadas e Dashboards no Excel',
    curso: 'Informática na Ótica do Utilizador',
    tipo: 'livro',
    formato: 'PDF',
    tamanho: '11.2 MB',
    autorOuEditora: 'Equipa Técnica FYP+C',
    descricao: 'Funções PROCV/XLOOKUP, tabelas dinâmicas, formatação condicional e automação de planilhas administrativas.',
    dataUpload: '15/08/2026',
    uploadedBy: 'Lázaro Luis',
    fileName: 'Guia_Excel_Dashboards_FYPC.pdf',
    nivelRecomendado: 'Intermediário',
  },
  {
    id: 'mat-sec-1',
    titulo: 'Manual de Técnicas de Secretariado e Redação Comercial',
    curso: 'Secretariado Executivo & Gestão de Documentos',
    tipo: 'manual',
    formato: 'PDF',
    tamanho: '13.8 MB',
    autorOuEditora: 'Instituto FYP+C de Gestão',
    descricao: 'Modelos de atas, ofícios, circulares administrativas, protocolo empresarial e gestão de correspondência.',
    dataUpload: '09/08/2026',
    uploadedBy: 'Lázaro Luis',
    fileName: 'Manual_Secretariado_Executivo_FYPC.pdf',
    nivelRecomendado: 'Geral',
  }
];

export const initialMatriculaSolicitacoes: MatriculaSolicitacao[] = [
  {
    id: 1,
    nome: 'Beatriz Gaspar',
    contacto: '923 111 222',
    curso: 'Inglês',
    nivel: 'B1 (Intermédio)',
    data: '18/09/2026',
    status: 'pendente'
  },
  {
    id: 2,
    nome: 'Domingos Kiala',
    contacto: '934 555 777',
    curso: 'Inglês',
    nivel: 'A2 (Básico)',
    data: '19/09/2026',
    status: 'pendente'
  },
  {
    id: 3,
    nome: 'Teresa Manuel',
    contacto: '941 222 333',
    curso: 'Francês',
    nivel: 'A1 (Iniciante)',
    data: '17/09/2026',
    status: 'pendente'
  },
  {
    id: 4,
    nome: 'Rui Canganjo',
    contacto: '929 888 444',
    curso: 'Informática',
    nivel: 'Geral / Prático',
    data: '19/09/2026',
    status: 'pendente'
  },
  {
    id: 5,
    nome: 'Sandra Quaresma',
    contacto: '927 333 111',
    curso: 'Secretariado Executivo & Gestão de Documentos',
    nivel: 'Geral / Prático',
    data: '20/09/2026',
    status: 'pendente'
  },
  {
    id: 6,
    nome: 'Paulo Bento',
    contacto: '931 444 888',
    curso: 'Contabilidade Informatizada & Gestão Financeira',
    nivel: 'Geral / Prático',
    data: '20/09/2026',
    status: 'pendente'
  },
  {
    id: 7,
    nome: 'Maria Odete',
    contacto: '922 456 789',
    curso: 'Informática',
    nivel: 'Geral / Prático',
    data: '21/09/2026',
    status: 'pendente'
  },
  {
    id: 8,
    nome: 'João Lourenço Silva',
    contacto: '912 345 678',
    curso: 'Inglês',
    nivel: 'A1 (Iniciante)',
    data: '21/09/2026',
    status: 'pendente'
  }
];

export const initialTurmasEdu: TurmaEdu[] = [
  {
    id: 'turma-ing-01',
    nome: 'FYP INGLES 01',
    curso: 'Inglês',
    periodo: 'Manhã',
    alunosNomes: ['Manuel Diogo', 'Helena Santos'],
    status: 'em_andamento',
    dataCriacao: '10/08/2026',
    professorResponsavel: 'Francisco Faztudo',
    sala: 'Sala 01 (Línguas)'
  },
  {
    id: 'turma-ing-02',
    nome: 'FYP INGLES 02',
    curso: 'Inglês',
    periodo: 'Noite',
    alunosNomes: ['Helena Alburquerque'],
    status: 'em_andamento',
    dataCriacao: '15/08/2026',
    professorResponsavel: 'Francisco Faztudo',
    sala: 'Sala 01 (Línguas)'
  },
  {
    id: 'turma-fr-01',
    nome: 'FYP FRANCES 01',
    curso: 'Francês',
    periodo: 'Tarde',
    alunosNomes: ['Silo João'],
    status: 'em_andamento',
    dataCriacao: '12/08/2026',
    professorResponsavel: 'Lázaro Luis',
    sala: 'Sala 02 (Humanidades)'
  },
  {
    id: 'turma-inf-01',
    nome: 'FYP INFORMATICA 01',
    curso: 'Informática',
    periodo: 'Manhã',
    alunosNomes: ['António Pedro'],
    status: 'em_andamento',
    dataCriacao: '05/08/2026',
    professorResponsavel: 'Lázaro Luis',
    sala: 'Lab Informática 01'
  }
];


