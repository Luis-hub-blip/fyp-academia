'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { HomeSection } from '../components/HomeSection';
import { FypcTecSection } from '../components/FypcTecSection';
import { ProfileEduSystemSection } from '../components/ProfileEduSystemSection';
import { LoginSection } from '../components/LoginSection';
import { 
  LoginModal, 
  PublicRegistrationModal, 
  SolicitarServicoModal, 
  ChangePasswordModal 
} from '../components/Modals';
import { 
  SiteEditModeBanner 
} from '../components/SiteEditModeBanner';
import { 
  EditHomeHeroModal, 
  EditMissionValuesModal, 
  EditCourseModal, 
  EditFypcTecHeroModal, 
  EditFypcServiceModal, 
  EditTestimonialModal 
} from '../components/SiteEditModals';
import { 
  initialAdmins, 
  initialPartnersProfiles, 
  initialSuperAdmins, 
  initialErpFullAccess, 
  removalApprovers, 
  initialTeachersNomes, 
  initialStudentsNomes, 
  initialSocios, 
  initialProfessores, 
  initialAlunos, 
  initialAgenda, 
  initialCommunity, 
  initialNews,
  initialCursosDestaque,
  initialHomeContent,
  initialFypcTecHeroContent,
  initialTestimonials,
  fypcServicesData,
  initialCronogramas,
  initialPedagogicalMaterials,
  initialTurmasEdu
} from '../data/initialData';
import { 
  UserRole, 
  Socio, 
  Professor, 
  Aluno, 
  AgendaTask, 
  CommunityQuestion, 
  NewsItem, 
  MatriculaSolicitacao, 
  PromotionRequest, 
  RemovalRequest, 
  PartnerProfile,
  HomeContent,
  FypcTecHeroContent,
  CursoDestaque,
  FypcService,
  TestimonialItem,
  CursoCronograma,
  PedagogicalMaterial,
  TurmaEdu,
  PrivilegioRequest
} from '../types';
import { isAuthorizedSiteEditor, addAuthorizedSiteEditor } from '../utils/editorPermissions';

export default function App() {
  // Navigation
  const [currentTab, setCurrentTab] = useState<'inicio' | 'fypc-tec' | 'meu-perfil' | 'login'>('inicio');

  // Auth State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('guest');
  const [credentials, setCredentials] = useState<Record<string, string>>(initialAdmins);
  const [partnersProfiles, setPartnersProfiles] = useState<Record<string, PartnerProfile>>(initialPartnersProfiles);

  // Domain State
  const [socios, setSocios] = useState<Socio[]>(initialSocios);
  const [professores, setProfessores] = useState<Professor[]>(initialProfessores);
  const [alunos, setAlunos] = useState<Aluno[]>(initialAlunos);
  const [agenda, setAgenda] = useState<AgendaTask[]>(initialAgenda);
  const [community, setCommunity] = useState<CommunityQuestion[]>(initialCommunity);
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [likedNews, setLikedNews] = useState<number[]>([]);
  const [matriculaSolicitacoes, setMatriculaSolicitacoes] = useState<MatriculaSolicitacao[]>([]);
  const [promotions, setPromotions] = useState<PromotionRequest[]>([]);
  const [removals, setRemovals] = useState<RemovalRequest[]>([]);
  const [privilegios, setPrivilegios] = useState<PrivilegioRequest[]>([]);
  const [superAdminsList, setSuperAdminsList] = useState<string[]>(initialSuperAdmins);
  const [erpFullAccessList, setErpFullAccessList] = useState<string[]>(initialErpFullAccess);
  const [removalApproversList, setRemovalApproversList] = useState<string[]>(removalApprovers);
  const [cronogramas, setCronogramas] = useState<CursoCronograma[]>(initialCronogramas);
  const [materials, setMaterials] = useState<PedagogicalMaterial[]>(initialPedagogicalMaterials);
  const [turmasEdu, setTurmasEdu] = useState<TurmaEdu[]>(initialTurmasEdu);

  // Dynamic Site Content (Editable by Lázaro Luis, Francisco Faztudo, Maria Victoria)
  const [homeContent, setHomeContent] = useState<HomeContent>(initialHomeContent);
  const [fypcTecHeroContent, setFypcTecHeroContent] = useState<FypcTecHeroContent>(initialFypcTecHeroContent);
  const [cursos, setCursos] = useState<CursoDestaque[]>(initialCursosDestaque);
  const [fypcServices, setFypcServices] = useState<FypcService[]>(fypcServicesData);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(initialTestimonials);

  // Edit Mode state
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  // Site Edit Modals
  const [isEditHomeHeroOpen, setIsEditHomeHeroOpen] = useState(false);
  const [isEditMissionValuesOpen, setIsEditMissionValuesOpen] = useState(false);
  const [isEditCourseModalOpen, setIsEditCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<CursoDestaque | null>(null);
  const [isEditFypcHeroOpen, setIsEditFypcHeroOpen] = useState(false);
  const [isEditServiceModalOpen_custom, setIsEditServiceModalOpen_custom] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<FypcService | null>(null);
  const [isEditTestimonialModalOpen, setIsEditTestimonialModalOpen] = useState(false);
  const [testimonialToEdit, setTestimonialToEdit] = useState<TestimonialItem | null>(null);
  const [testimonialEditIndex, setTestimonialEditIndex] = useState<number | null>(null);

  // Standard Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCourseForRegister, setSelectedCourseForRegister] = useState('Informática');
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState<string | undefined>(undefined);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('fyp_current_user');
      if (savedUser) setCurrentUser(savedUser);

      const savedCreds = localStorage.getItem('fyp_academy_credentials');
      if (savedCreds) setCredentials(JSON.parse(savedCreds));

      const savedProfiles = localStorage.getItem('fyp_partners_profiles');
      if (savedProfiles) setPartnersProfiles(JSON.parse(savedProfiles));

      const savedSocios = localStorage.getItem('fyp_socios_data');
      if (savedSocios) setSocios(JSON.parse(savedSocios));

      const savedProfessores = localStorage.getItem('fyp_professores_data');
      if (savedProfessores) setProfessores(JSON.parse(savedProfessores));

      const savedAlunos = localStorage.getItem('fyp_alunos_data');
      if (savedAlunos) setAlunos(JSON.parse(savedAlunos));

      const savedAgenda = localStorage.getItem('fyp_agenda_data');
      if (savedAgenda) setAgenda(JSON.parse(savedAgenda));

      const savedCommunity = localStorage.getItem('fyp_community_data');
      if (savedCommunity) setCommunity(JSON.parse(savedCommunity));

      const savedNews = localStorage.getItem('fyp_news_data');
      if (savedNews) setNews(JSON.parse(savedNews));

      const savedLiked = localStorage.getItem('fyp_news_liked_ids');
      if (savedLiked) setLikedNews(JSON.parse(savedLiked));

      const savedMatriculas = localStorage.getItem('fyp_matriculas_data');
      if (savedMatriculas) setMatriculaSolicitacoes(JSON.parse(savedMatriculas));

      const savedPromotions = localStorage.getItem('fyp_promotions_data');
      if (savedPromotions) setPromotions(JSON.parse(savedPromotions));

      const savedRemovals = localStorage.getItem('fyp_removals_data');
      if (savedRemovals) setRemovals(JSON.parse(savedRemovals));

      const savedPrivilegios = localStorage.getItem('fyp_privilegios_data');
      if (savedPrivilegios) setPrivilegios(JSON.parse(savedPrivilegios));

      const savedSuperAdmins = localStorage.getItem('fyp_super_admins');
      if (savedSuperAdmins) {
        try {
          const parsed = JSON.parse(savedSuperAdmins);
          setSuperAdminsList(Array.from(new Set([...initialSuperAdmins, ...parsed])));
        } catch {
          setSuperAdminsList(initialSuperAdmins);
        }
      } else {
        setSuperAdminsList(initialSuperAdmins);
      }

      const savedErpAccess = localStorage.getItem('fyp_erp_full_access');
      if (savedErpAccess) {
        try {
          const parsed = JSON.parse(savedErpAccess);
          setErpFullAccessList(Array.from(new Set([...initialErpFullAccess, ...parsed])));
        } catch {
          setErpFullAccessList(initialErpFullAccess);
        }
      } else {
        setErpFullAccessList(initialErpFullAccess);
      }

      const savedApprovers = localStorage.getItem('fyp_removal_approvers');
      if (savedApprovers) {
        try {
          const parsed = JSON.parse(savedApprovers);
          setRemovalApproversList(Array.from(new Set([...removalApprovers, ...parsed])));
        } catch {
          setRemovalApproversList(removalApprovers);
        }
      } else {
        setRemovalApproversList(removalApprovers);
      }

      const savedCronogramas = localStorage.getItem('fyp_curso_cronogramas');
      if (savedCronogramas) setCronogramas(JSON.parse(savedCronogramas));

      const savedMaterials = localStorage.getItem('fyp_pedagogical_materials');
      if (savedMaterials) setMaterials(JSON.parse(savedMaterials));

      const savedTurmas = localStorage.getItem('fyp_turmas_edu');
      if (savedTurmas) setTurmasEdu(JSON.parse(savedTurmas));

      // Dynamic site content load
      const savedHomeContent = localStorage.getItem('fyp_home_content');
      if (savedHomeContent) setHomeContent(JSON.parse(savedHomeContent));

      const savedFypcHero = localStorage.getItem('fyp_tec_hero_content');
      if (savedFypcHero) setFypcTecHeroContent(JSON.parse(savedFypcHero));

      const savedCursos = localStorage.getItem('fyp_cursos_destaque');
      if (savedCursos) setCursos(JSON.parse(savedCursos));

      const savedServices = localStorage.getItem('fyp_tec_services');
      if (savedServices) setFypcServices(JSON.parse(savedServices));

      const savedTestimonials = localStorage.getItem('fyp_testimonials');
      if (savedTestimonials) setTestimonials(JSON.parse(savedTestimonials));
    } catch (err) {
      console.warn('Erro ao carregar dados do localStorage:', err);
    }
  }, []);

  // Update Role dynamically whenever currentUser changes
  useEffect(() => {
    if (!currentUser) {
      setCurrentRole('guest');
      setIsEditMode(false);
      return;
    }

    const cleanUser = currentUser.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim();
    const isExplicitAdmin = 
      superAdminsList.some((sa) => sa.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanUser) || 
      initialSuperAdmins.some((sa) => sa.toLowerCase().replace(/[\u0300-\u036f]/g, '').trim() === cleanUser);

    if (isExplicitAdmin) {
      setCurrentRole('admin');
    } else if (
      initialStudentsNomes.some((sn) => sn.toLowerCase().trim() === cleanUser) || 
      alunos.some((a) => a.nome.toLowerCase().trim() === cleanUser)
    ) {
      setCurrentRole('student');
    } else if (
      initialTeachersNomes.some((tn) => tn.toLowerCase().trim() === cleanUser) || 
      professores.some((p) => p.nome.toLowerCase().trim() === cleanUser)
    ) {
      setCurrentRole('teacher');
    } else if (socios.some((s) => s.nome.toLowerCase().trim() === cleanUser)) {
      setCurrentRole('socio');
    } else {
      setCurrentRole('guest');
    }

    // Safety: ensure edit mode is turned off if user is not authorized
    if (!isAuthorizedSiteEditor(currentUser)) {
      setIsEditMode(false);
    }
  }, [currentUser, superAdminsList, socios, professores, alunos]);

  // Sync current user to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('fyp_current_user', currentUser);
    } else {
      localStorage.removeItem('fyp_current_user');
    }
  }, [currentUser]);

  const saveCredentials = (newCreds: Record<string, string>) => {
    setCredentials(newCreds);
    localStorage.setItem('fyp_academy_credentials', JSON.stringify(newCreds));
  };

  const saveSocios = (newSocios: Socio[]) => {
    setSocios(newSocios);
    localStorage.setItem('fyp_socios_data', JSON.stringify(newSocios));
  };

  const saveProfessores = (newProfs: Professor[]) => {
    setProfessores(newProfs);
    localStorage.setItem('fyp_professores_data', JSON.stringify(newProfs));
  };

  const saveAlunos = (newAlunos: Aluno[]) => {
    setAlunos(newAlunos);
    localStorage.setItem('fyp_alunos_data', JSON.stringify(newAlunos));
  };

  const saveAgenda = (newAgenda: AgendaTask[]) => {
    setAgenda(newAgenda);
    localStorage.setItem('fyp_agenda_data', JSON.stringify(newAgenda));
  };

  const saveCommunity = (newComm: CommunityQuestion[]) => {
    setCommunity(newComm);
    localStorage.setItem('fyp_community_data', JSON.stringify(newComm));
  };

  const saveNews = (newNews: NewsItem[]) => {
    setNews(newNews);
    localStorage.setItem('fyp_news_data', JSON.stringify(newNews));
  };

  const saveMatriculas = (newMatriculas: MatriculaSolicitacao[]) => {
    setMatriculaSolicitacoes(newMatriculas);
    localStorage.setItem('fyp_matriculas_data', JSON.stringify(newMatriculas));
  };

  const savePromotions = (newProms: PromotionRequest[]) => {
    setPromotions(newProms);
    localStorage.setItem('fyp_promotions_data', JSON.stringify(newProms));
  };

  const saveRemovals = (newRems: RemovalRequest[]) => {
    setRemovals(newRems);
    localStorage.setItem('fyp_removals_data', JSON.stringify(newRems));
  };

  const savePrivilegios = (newPrivs: PrivilegioRequest[]) => {
    setPrivilegios(newPrivs);
    localStorage.setItem('fyp_privilegios_data', JSON.stringify(newPrivs));
  };

  const handleUpdateCronogramas = (updated: CursoCronograma[]) => {
    setCronogramas(updated);
    localStorage.setItem('fyp_curso_cronogramas', JSON.stringify(updated));
  };

  const handleUpdateMaterials = (updated: PedagogicalMaterial[]) => {
    setMaterials(updated);
    localStorage.setItem('fyp_pedagogical_materials', JSON.stringify(updated));
  };

  const handleUpdateTurmas = (updated: TurmaEdu[]) => {
    setTurmasEdu(updated);
    localStorage.setItem('fyp_turmas_edu', JSON.stringify(updated));
  };

  // Content editing handlers
  const handleToggleEditMode = () => {
    if (!isAuthorizedSiteEditor(currentUser)) {
      alert('Acesso restrito: apenas Lázaro Luis, Francisco Faztudo e Maria Victoria têm permissão para editar.');
      return;
    }
    const nextState = !isEditMode;
    setIsEditMode(nextState);
    if (nextState && currentTab === 'meu-perfil') {
      setCurrentTab('inicio');
    }
  };

  const handleSaveHomeHero = (updated: Partial<HomeContent>) => {
    const merged = { ...homeContent, ...updated };
    setHomeContent(merged);
    localStorage.setItem('fyp_home_content', JSON.stringify(merged));
  };

  const handleSaveMissionValues = (updated: Partial<HomeContent>) => {
    const merged = { ...homeContent, ...updated };
    setHomeContent(merged);
    localStorage.setItem('fyp_home_content', JSON.stringify(merged));
  };

  const handleSaveCourse = (course: CursoDestaque) => {
    const exists = cursos.some((c) => c.id === course.id);
    const updated = exists 
      ? cursos.map((c) => (c.id === course.id ? course : c))
      : [course, ...cursos];
    setCursos(updated);
    localStorage.setItem('fyp_cursos_destaque', JSON.stringify(updated));
  };

  const handleDeleteCourse = (id: string) => {
    const updated = cursos.filter((c) => c.id !== id);
    setCursos(updated);
    localStorage.setItem('fyp_cursos_destaque', JSON.stringify(updated));
  };

  const handleSaveFypcTecHero = (updated: FypcTecHeroContent) => {
    setFypcTecHeroContent(updated);
    localStorage.setItem('fyp_tec_hero_content', JSON.stringify(updated));
  };

  const handleSaveService = (service: FypcService) => {
    const exists = fypcServices.some((s) => s.id === service.id);
    const updated = exists
      ? fypcServices.map((s) => (s.id === service.id ? service : s))
      : [...fypcServices, service];
    setFypcServices(updated);
    localStorage.setItem('fyp_tec_services', JSON.stringify(updated));
  };

  const handleDeleteService = (id: string) => {
    const updated = fypcServices.filter((s) => s.id !== id);
    setFypcServices(updated);
    localStorage.setItem('fyp_tec_services', JSON.stringify(updated));
  };

  const handleSaveTestimonial = (testimonial: TestimonialItem, index: number | null) => {
    let updated: TestimonialItem[];
    if (index !== null && index >= 0 && index < testimonials.length) {
      updated = testimonials.map((t, idx) => (idx === index ? testimonial : t));
    } else {
      updated = [...testimonials, testimonial];
    }
    setTestimonials(updated);
    localStorage.setItem('fyp_testimonials', JSON.stringify(updated));
  };

  const handleDeleteTestimonial = (index: number) => {
    const updated = testimonials.filter((_, idx) => idx !== index);
    setTestimonials(updated);
    localStorage.setItem('fyp_testimonials', JSON.stringify(updated));
  };

  // Auth Handlers
  const handleLogin = (identifier: string, pass: string): boolean => {
    const trimmedIdent = identifier.trim().toLowerCase();

    // Find matching user in credentials (by name or by email)
    const foundUser = Object.keys(credentials).find((u) => {
      if (u.toLowerCase() === trimmedIdent) return true;
      const profile = partnersProfiles[u];
      if (profile && profile.email && profile.email.toLowerCase() === trimmedIdent) return true;
      const cleanUser = u.toLowerCase().replace(/\s+/g, '.');
      if (`${cleanUser}@fypc.ao` === trimmedIdent || `${cleanUser}@fyp.com` === trimmedIdent) return true;
      return false;
    });

    if (foundUser) {
      const expectedPass = credentials[foundUser];
      if (expectedPass === pass) {
        setCurrentUser(foundUser);
        if (currentTab === 'login') {
          setCurrentTab('meu-perfil');
        }
        setIsLoginModalOpen(false);
        return true;
      }
    }

    // Also check in alunos
    const foundAluno = alunos.find((a) => a.nome.toLowerCase() === trimmedIdent);
    if (foundAluno) {
      const expectedPass = credentials[foundAluno.nome] || 'aluno123';
      if (expectedPass === pass) {
        setCurrentUser(foundAluno.nome);
        if (currentTab === 'login') {
          setCurrentTab('meu-perfil');
        }
        setIsLoginModalOpen(false);
        return true;
      }
    }

    return false;
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentRole('guest');
    setIsEditMode(false);
    setCurrentTab('inicio');
  };

  const handleSavePassword = (newPass: string) => {
    if (!currentUser) return;
    const updatedCreds = { ...credentials, [currentUser]: newPass };
    saveCredentials(updatedCreds);
    alert('Palavra-passe atualizada com sucesso no EduSystem!');
  };

  // News Handlers
  const handleToggleLike = (id: number) => {
    let updatedLikes: number[];
    if (likedNews.includes(id)) {
      updatedLikes = likedNews.filter((i) => i !== id);
    } else {
      updatedLikes = [...likedNews, id];
    }
    setLikedNews(updatedLikes);
    localStorage.setItem('fyp_news_liked_ids', JSON.stringify(updatedLikes));
  };

  const handleAddNews = (newItem: Omit<NewsItem, 'id' | 'likes'>) => {
    const item: NewsItem = {
      ...newItem,
      id: Date.now(),
      likes: 0,
    };
    const updated = [item, ...news];
    saveNews(updated);
  };

  const handleDeleteNews = (id: number) => {
    const updated = news.filter((n) => n.id !== id);
    saveNews(updated);
  };

  // Partner Profile Update
  const handleUpdateProfile = (data: Partial<PartnerProfile>) => {
    if (!currentUser) return;
    const existing: PartnerProfile = partnersProfiles[currentUser] || {
      nome: currentUser,
      cargo: 'Membro EduSystem',
      bio: '',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop`,
      telefone: '+244 923 000 000',
      phone: '+244 923 000 000',
      email: `${currentUser.toLowerCase().replace(/\s+/g, '.')}@fypc.ao`,
      especialidade: 'Gestão e Tecnologia',
      horarioAtendimento: 'Seg - Sex: 08:00 - 17:00',
    };
    const updatedProfiles: Record<string, PartnerProfile> = {
      ...partnersProfiles,
      [currentUser]: { ...existing, ...data },
    };
    setPartnersProfiles(updatedProfiles);
    localStorage.setItem('fyp_partners_profiles', JSON.stringify(updatedProfiles));
  };

  // Domain Agenda & Community Handlers
  const handleAddAgendaTask = (task: Omit<AgendaTask, 'id'>) => {
    const newTask: AgendaTask = { ...task, id: Date.now() };
    saveAgenda([...agenda, newTask]);
  };

  const handleUpdateAgendaTaskStatus = (id: number, status: AgendaTask['status']) => {
    const updated = agenda.map((t) => (t.id === id ? { ...t, status } : t));
    saveAgenda(updated);
  };

  const handleAddCommunityQuestion = (question: string) => {
    if (!currentUser) return;
    const newQ: CommunityQuestion = {
      id: Date.now(),
      student: currentUser,
      date: new Date().toLocaleDateString('pt-PT'),
      question: question,
      replies: [],
      corrected: false,
    };
    saveCommunity([newQ, ...community]);
  };

  const handleReplyCommunityQuestion = (questionId: number, replyText: string) => {
    if (!currentUser) return;
    const updated = community.map((q) => {
      if (q.id === questionId) {
        return {
          ...q,
          replies: [
            ...q.replies,
            { author: currentUser, text: replyText },
          ],
        };
      }
      return q;
    });
    saveCommunity(updated);
  };

  const handleSubmitPublicRegistration = (data: {
    nome: string;
    contacto: string;
    curso: string;
    nivel: string;
  }) => {
    const newMatricula: MatriculaSolicitacao = {
      id: Date.now(),
      ...data,
      data: new Date().toLocaleDateString('pt-PT'),
    };
    saveMatriculas([newMatricula, ...matriculaSolicitacoes]);
    alert('A sua candidatura foi enviada com sucesso! A direção entrará em contacto.');
  };

  const handleApproveMatricula = (id: number) => {
    const mat = matriculaSolicitacoes.find((m) => m.id === id);
    if (!mat) return;
    const newAluno: Aluno = {
      id: alunos.length > 0 ? Math.max(...alunos.map((a) => a.id)) + 1 : 1,
      nome: mat.nome,
      curso: mat.curso,
      turma: 'Turma Geral',
      propina: '5.000 Kz',
      estado: 'pago',
      dividas: '0 Kz',
      score: 80,
      progress: 10,
      corrections: 0,
      likes: 0,
      nivel: mat.nivel,
      presencas: 0,
      faltas: 0,
      notas: [],
      status: 'ativo',
    };
    saveAlunos([...alunos, newAluno]);
    saveMatriculas(matriculaSolicitacoes.filter((m) => m.id !== id));
  };

  const handleRejectMatricula = (id: number) => {
    saveMatriculas(matriculaSolicitacoes.filter((m) => m.id !== id));
  };

  const handleAddSocio = (nome: string, cargo: string, pass: string) => {
    const newSocio: Socio = {
      id: socios.length + 1,
      nome,
      cargo,
      status: 'Ativo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    };
    saveSocios([...socios, newSocio]);
    const updatedCreds = { ...credentials, [nome]: pass };
    saveCredentials(updatedCreds);
  };

  const handleRequestPromotion = (nome: string, cargo: string, pass?: string) => {
    if (!currentUser) return;
    const newReq: PromotionRequest = {
      id: Date.now(),
      nome,
      cargo,
      novoCargo: cargo,
      solicitante: currentUser,
      aprovacoes: [currentUser],
      votos: [currentUser],
      status: 'pendente',
    };
    savePromotions([...promotions, newReq]);
    if (pass) {
      const updatedCreds = { ...credentials, [nome]: pass };
      saveCredentials(updatedCreds);
    }
  };

  const grantFullPowers = (nome: string, privilegioOuCargo: string) => {
    const privClean = (privilegioOuCargo || '').toLowerCase();

    // Plenos poderes de Administrador (iguais a Lázaro Luis e Francisco Faztudo)
    if (privClean.includes('admin') || privClean === 'administradores') {
      const updatedSuperAdmins = Array.from(new Set([...superAdminsList, nome]));
      setSuperAdminsList(updatedSuperAdmins);
      localStorage.setItem('fyp_super_admins', JSON.stringify(updatedSuperAdmins));

      const updatedErp = Array.from(new Set([...erpFullAccessList, nome]));
      setErpFullAccessList(updatedErp);
      localStorage.setItem('fyp_erp_full_access', JSON.stringify(updatedErp));

      const updatedApprovers = Array.from(new Set([...removalApproversList, nome]));
      setRemovalApproversList(updatedApprovers);
      localStorage.setItem('fyp_removal_approvers', JSON.stringify(updatedApprovers));

      addAuthorizedSiteEditor(nome);

      if (currentUser === nome) {
        setCurrentRole('admin');
      }
    } else if (
      privClean.includes('edição') || 
      privClean.includes('edicao') || 
      privClean.includes('conteúdo') || 
      privClean.includes('conteudo')
    ) {
      addAuthorizedSiteEditor(nome);
    } else if (privClean.includes('edusystem') || privClean.includes('secretaria')) {
      const updatedErp = Array.from(new Set([...erpFullAccessList, nome]));
      setErpFullAccessList(updatedErp);
      localStorage.setItem('fyp_erp_full_access', JSON.stringify(updatedErp));
    }
  };

  const handleApprovePromotion = (id: number) => {
    if (!currentUser) return;
    const updated = promotions.map((req) => {
      if (req.id === id) {
        const aprovacoes = (req.aprovacoes || req.votos || []).includes(currentUser)
          ? (req.aprovacoes || req.votos || [])
          : [...(req.aprovacoes || req.votos || []), currentUser];
        const status = aprovacoes.length >= 3 ? 'aprovado' : 'pendente';
        if (status === 'aprovado') {
          const newSocio: Socio = {
            id: socios.length + 1,
            nome: req.nome,
            cargo: req.cargo || req.novoCargo || 'Sócio',
            status: 'Ativo',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
          };
          saveSocios([...socios, newSocio]);
          grantFullPowers(req.nome, req.cargo || req.novoCargo || 'Sócio');
        }
        return { ...req, aprovacoes, votos: aprovacoes, status: status as PromotionRequest['status'] };
      }
      return req;
    });
    savePromotions(updated);
  };

  const handleRequestPrivilegio = (nome: string, categoria: 'socio' | 'professor', privilegio: string) => {
    if (!currentUser) return;
    const newReq: PrivilegioRequest = {
      id: Date.now(),
      nome,
      categoria,
      privilegio,
      solicitante: currentUser,
      aprovacoes: [currentUser],
      votos: [currentUser],
      status: 'pendente',
      data: new Date().toLocaleDateString('pt-PT')
    };
    savePrivilegios([...privilegios, newReq]);
  };

  const handleApprovePrivilegio = (id: number) => {
    if (!currentUser) return;
    const updated = privilegios.map((req) => {
      if (req.id === id) {
        const aprovacoes = (req.aprovacoes || req.votos || []).includes(currentUser)
          ? (req.aprovacoes || req.votos || [])
          : [...(req.aprovacoes || req.votos || []), currentUser];
        const status = aprovacoes.length >= 3 ? 'aprovado' : 'pendente';
        if (status === 'aprovado') {
          grantFullPowers(req.nome, req.privilegio);
        }
        return { ...req, aprovacoes, votos: aprovacoes, status: status as PrivilegioRequest['status'] };
      }
      return req;
    });
    savePrivilegios(updated);
  };

  const handleRequestRemoval = (nome: string) => {
    if (!currentUser) return;
    const newRem: RemovalRequest = {
      id: Date.now(),
      nome,
      alvoNome: nome,
      solicitante: currentUser,
      aprovacoes: [currentUser],
      votos: [currentUser],
      status: 'pendente',
    };
    saveRemovals([...removals, newRem]);
  };

  const handleApproveRemoval = (id: number) => {
    if (!currentUser) return;
    const updated = removals.map((rem) => {
      if (rem.id === id) {
        const aprovacoes = (rem.aprovacoes || rem.votos || []).includes(currentUser)
          ? (rem.aprovacoes || rem.votos || [])
          : [...(rem.aprovacoes || rem.votos || []), currentUser];
        const status = aprovacoes.length >= 2 ? 'aprovado' : 'pendente';
        if (status === 'aprovado') {
          saveSocios(socios.filter((s) => s.nome !== (rem.nome || rem.alvoNome)));
          saveProfessores(professores.filter((p) => p.nome !== (rem.nome || rem.alvoNome)));
          saveAlunos(alunos.filter((a) => a.nome !== (rem.nome || rem.alvoNome)));
        }
        return { ...rem, aprovacoes, votos: aprovacoes, status: status as RemovalRequest['status'] };
      }
      return rem;
    });
    saveRemovals(updated);
  };

  const handleUpdateAluno = (alunoId: number, updates: Partial<Aluno>) => {
    const updated = alunos.map((aluno) => {
      if (aluno.id === alunoId) {
        return { ...aluno, ...updates };
      }
      return aluno;
    });
    saveAlunos(updated);
  };

  const currentProfile: PartnerProfile = (currentUser && partnersProfiles[currentUser]) || {
    nome: currentUser || 'Convidado',
    cargo: currentRole === 'admin' ? 'Administrador' : currentRole === 'teacher' ? 'Professor' : currentRole === 'student' ? 'Aluno' : currentRole === 'socio' ? 'Sócio Executivo' : 'Visitante',
    bio: 'Bem-vindo ao EduSystem da FYP+C.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    telefone: '+244 923 000 000',
    phone: '+244 923 000 000',
    email: 'contacto@fypc.ao',
    especialidade: 'Educação & Tecnologia',
    horarioAtendimento: 'Seg - Sex: 08:00 - 17:00',
  };

  const canEditSite = isAuthorizedSiteEditor(currentUser);

  // If user navigated to login tab
  if (currentTab === 'login') {
    return (
      <LoginSection
        onLogin={handleLogin}
        onBackToPublic={() => setCurrentTab('inicio')}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Sleek Modern Header with Administração dropdown */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => {
          if (tab === 'meu-perfil' && !currentUser) {
            setCurrentTab('login');
          } else {
            setCurrentTab(tab);
          }
        }}
        currentUser={currentUser}
        currentRole={currentRole}
        userAvatar={currentProfile.avatar}
        onOpenLogin={() => setCurrentTab('login')}
        onLogout={handleLogout}
        onChangePassword={() => setIsChangePasswordModalOpen(true)}
        onOpenRegister={() => {
          setSelectedCourseForRegister('Informática');
          setIsRegisterModalOpen(true);
        }}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

      {/* Floating persistent banner when Edit Mode is active */}
      <SiteEditModeBanner
        isEditMode={isEditMode}
        canEdit={canEditSite}
        currentUser={currentUser}
        currentTab={currentTab}
        onToggleEditMode={handleToggleEditMode}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenAddCourse={() => {
          setCourseToEdit(null);
          setIsEditCourseModalOpen(true);
        }}
        onOpenAddService={() => {
          setServiceToEdit(null);
          setIsEditServiceModalOpen_custom(true);
        }}
        onOpenAddTestimonial={() => {
          setTestimonialToEdit(null);
          setTestimonialEditIndex(null);
          setIsEditTestimonialModalOpen(true);
        }}
      />

      {/* Main View Area */}
      <div className="flex-1">
        {currentTab === 'inicio' && (
          <HomeSection
            news={news}
            likedNews={likedNews}
            onToggleLike={handleToggleLike}
            onAddNews={handleAddNews}
            onDeleteNews={handleDeleteNews}
            currentRole={currentRole}
            onOpenRegisterCourse={(courseName) => {
              setSelectedCourseForRegister(courseName);
              setIsRegisterModalOpen(true);
            }}
            onNavigateToFypcTec={() => setCurrentTab('fypc-tec')}
            alunosCount={alunos.length}
            professoresCount={professores.length}
            sociosCount={socios.length}
            isEditMode={isEditMode}
            canEditSite={canEditSite}
            homeContent={homeContent}
            cursos={cursos}
            testimonials={testimonials}
            onOpenEditHero={() => setIsEditHomeHeroOpen(true)}
            onOpenEditMissionValues={() => setIsEditMissionValuesOpen(true)}
            onOpenAddCourse={() => {
              setCourseToEdit(null);
              setIsEditCourseModalOpen(true);
            }}
            onOpenEditCourse={(c) => {
              setCourseToEdit(c);
              setIsEditCourseModalOpen(true);
            }}
            onDeleteCourse={handleDeleteCourse}
            onOpenAddTestimonial={() => {
              setTestimonialToEdit(null);
              setTestimonialEditIndex(null);
              setIsEditTestimonialModalOpen(true);
            }}
            onOpenEditTestimonial={(t, idx) => {
              setTestimonialToEdit(t);
              setTestimonialEditIndex(idx);
              setIsEditTestimonialModalOpen(true);
            }}
            onDeleteTestimonial={handleDeleteTestimonial}
          />
        )}

        {currentTab === 'fypc-tec' && (
          <FypcTecSection
            services={fypcServices}
            heroContent={fypcTecHeroContent}
            isEditMode={isEditMode}
            canEditSite={canEditSite}
            onOpenServiceModal={(serviceTitle) => {
              setSelectedServiceTitle(serviceTitle);
              setIsServiceModalOpen(true);
            }}
            onOpenEditHero={() => setIsEditFypcHeroOpen(true)}
            onOpenAddService={() => {
              setServiceToEdit(null);
              setIsEditServiceModalOpen_custom(true);
            }}
            onOpenEditService={(s) => {
              setServiceToEdit(s);
              setIsEditServiceModalOpen_custom(true);
            }}
            onDeleteService={handleDeleteService}
          />
        )}

        {currentTab === 'meu-perfil' && currentUser && (
          <ProfileEduSystemSection
            currentUser={currentUser}
            currentRole={currentRole}
            currentProfile={currentProfile}
            onUpdateProfile={handleUpdateProfile}
            socios={socios}
            professores={professores}
            alunos={alunos}
            agenda={agenda}
            community={community}
            matriculaSolicitacoes={matriculaSolicitacoes}
            promotions={promotions}
            removals={removals}
            superAdmins={superAdminsList}
            erpFullAccess={erpFullAccessList}
            removalApprovers={removalApproversList}
            privilegios={privilegios}
            onRequestPrivilegio={handleRequestPrivilegio}
            onApprovePrivilegio={handleApprovePrivilegio}
            onAddAgendaTask={handleAddAgendaTask}
            onUpdateAgendaTaskStatus={handleUpdateAgendaTaskStatus}
            onAddCommunityQuestion={handleAddCommunityQuestion}
            onReplyCommunityQuestion={handleReplyCommunityQuestion}
            onApproveMatricula={handleApproveMatricula}
            onRejectMatricula={handleRejectMatricula}
            onAddSocio={handleAddSocio}
            onRequestPromotion={handleRequestPromotion}
            onApprovePromotion={handleApprovePromotion}
            onRequestRemoval={handleRequestRemoval}
            onApproveRemoval={handleApproveRemoval}
            onUpdateAluno={handleUpdateAluno}
            onStartEditingSite={() => {
              setIsEditMode(true);
              setCurrentTab('inicio');
            }}
            isEditMode={isEditMode}
            cronogramas={cronogramas}
            onUpdateCronogramas={handleUpdateCronogramas}
            materials={materials}
            onUpdateMaterials={handleUpdateMaterials}
            turmas={turmasEdu}
            onUpdateTurmas={handleUpdateTurmas}
            onUpdateMatriculas={(updated) => {
              setMatriculaSolicitacoes(updated);
              localStorage.setItem('fyp_matriculas_data', JSON.stringify(updated));
            }}
            onUpdateAlunos={(updated) => {
              setAlunos(updated);
              localStorage.setItem('fyp_alunos_data', JSON.stringify(updated));
            }}
          />
        )}
      </div>

      {/* Institutional Modern Footer */}
      <Footer
        onNavigate={(tab) => {
          if (tab === 'meu-perfil' && !currentUser) {
            setCurrentTab('login');
          } else {
            setCurrentTab(tab);
          }
        }}
        onOpenRegister={() => {
          setSelectedCourseForRegister('Informática');
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Standard Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      <PublicRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        defaultCourse={selectedCourseForRegister}
        onSubmitRegistration={handleSubmitPublicRegistration}
      />

      <SolicitarServicoModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        defaultService={selectedServiceTitle}
        onSubmit={() => {
          alert('A sua solicitação foi registada pela equipa FYP+C Tec com sucesso!');
        }}
      />

      {currentUser && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          currentUser={currentUser}
          onSavePassword={handleSavePassword}
        />
      )}

      {/* ================= SITE EDITING MODALS (EXCLUSIVO LÁZARO, FRANCISCO, MARIA VICTORIA) ================= */}
      <EditHomeHeroModal
        isOpen={isEditHomeHeroOpen}
        onClose={() => setIsEditHomeHeroOpen(false)}
        initialData={homeContent}
        onSave={handleSaveHomeHero}
      />

      <EditMissionValuesModal
        isOpen={isEditMissionValuesOpen}
        onClose={() => setIsEditMissionValuesOpen(false)}
        initialData={homeContent}
        onSave={handleSaveMissionValues}
      />

      <EditCourseModal
        isOpen={isEditCourseModalOpen}
        onClose={() => setIsEditCourseModalOpen(false)}
        initialData={courseToEdit}
        onSave={handleSaveCourse}
      />

      <EditFypcTecHeroModal
        isOpen={isEditFypcHeroOpen}
        onClose={() => setIsEditFypcHeroOpen(false)}
        initialData={fypcTecHeroContent}
        onSave={handleSaveFypcTecHero}
      />

      <EditFypcServiceModal
        isOpen={isEditServiceModalOpen_custom}
        onClose={() => setIsEditServiceModalOpen_custom(false)}
        initialData={serviceToEdit}
        onSave={handleSaveService}
      />

      <EditTestimonialModal
        isOpen={isEditTestimonialModalOpen}
        onClose={() => setIsEditTestimonialModalOpen(false)}
        initialData={testimonialToEdit}
        index={testimonialEditIndex}
        onSave={handleSaveTestimonial}
      />

    </div>
  );
}
