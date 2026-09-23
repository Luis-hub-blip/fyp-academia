'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Award, 
  Users, 
  CheckCircle2, 
  Heart, 
  Calendar, 
  Cpu, 
  Globe2, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Layers,
  GraduationCap,
  Edit3,
  Plus,
  Trash2,
  Search,
  Filter,
  Clock,
  BookOpen,
  TrendingUp,
  X,
  Flame,
  Check
} from 'lucide-react';
import { 
  NewsItem, 
  UserRole, 
  HomeContent, 
  CursoDestaque, 
  TestimonialItem 
} from '../types';

interface HomeSectionProps {
  news: NewsItem[];
  likedNews: number[];
  onToggleLike: (id: number) => void;
  onAddNews: (newItem: Omit<NewsItem, 'id' | 'likes'>) => void;
  onDeleteNews: (id: number) => void;
  currentRole: UserRole;
  onOpenRegisterCourse: (courseName: string) => void;
  onNavigateToFypcTec: () => void;
  alunosCount: number;
  professoresCount: number;
  sociosCount: number;

  // New site editing capabilities (exclusive to Lázaro Luis, Francisco Faztudo & Maria Victoria)
  isEditMode?: boolean;
  canEditSite?: boolean;
  homeContent: HomeContent;
  cursos: CursoDestaque[];
  testimonials: TestimonialItem[];
  onOpenEditHero?: () => void;
  onOpenEditMissionValues?: () => void;
  onOpenAddCourse?: () => void;
  onOpenEditCourse?: (curso: CursoDestaque) => void;
  onDeleteCourse?: (id: string) => void;
  onOpenAddTestimonial?: () => void;
  onOpenEditTestimonial?: (test: TestimonialItem, index: number) => void;
  onDeleteTestimonial?: (index: number) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  news,
  likedNews,
  onToggleLike,
  onAddNews,
  onDeleteNews,
  currentRole,
  onOpenRegisterCourse,
  onNavigateToFypcTec,
  alunosCount,
  professoresCount,
  sociosCount,
  isEditMode = false,
  canEditSite = false,
  homeContent,
  cursos,
  testimonials,
  onOpenEditHero,
  onOpenEditMissionValues,
  onOpenAddCourse,
  onOpenEditCourse,
  onDeleteCourse,
  onOpenAddTestimonial,
  onOpenEditTestimonial,
  onDeleteTestimonial,
}) => {
  // Slider state for mockups
  const slides = [
    { title: 'Identidade Corporativa FYP+C', subtitle: 'Cartão de Visita & Branding Exclusivo', image: '/business card back.png' },
    { title: 'Material Académico & Merchandising', subtitle: 'Tote Bag Oficial da Academia', image: '/Mockup Bolsa Tote.png' },
    { title: 'Uniforme & Presença Oficial', subtitle: 'Polo Executivo para Professores e Alunos', image: '/Mockup Camiseta Polo.png' },
    { title: 'Sinalética & Campus Físico', subtitle: 'Placa Institucional de Fachada', image: '/Signage-1.png' },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeNewsFilter, setActiveNewsFilter] = useState<'todos' | 'video' | 'image'>('todos');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Dynamic Course Filtering & Search
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('todos');
  const [courseSearchQuery, setCourseSearchQuery] = useState<string>('');

  const getCourseImage = (curso: CursoDestaque): string => {
    if (curso.imageUrl) return curso.imageUrl;
    const lowerNome = curso.nome.toLowerCase();
    const lowerId = curso.id.toLowerCase();
    if (lowerId.includes('inform') || lowerNome.includes('inform') || lowerNome.includes('computador')) {
      return '/images/course_informatica_1790165382220.jpg';
    }
    if (lowerId.includes('ingl') || lowerNome.includes('ingl') || lowerNome.includes('english')) {
      return '/images/course_ingles_1790165393687.jpg';
    }
    if (lowerId.includes('fran') || lowerNome.includes('fran') || lowerNome.includes('français')) {
      return '/images/course_frances_1790165403464.jpg';
    }
    if (lowerId.includes('cabel') || lowerNome.includes('cabel') || lowerNome.includes('estét') || lowerNome.includes('beleza')) {
      return '/images/course_cabeleireiro_1790165414851.jpg';
    }
    if (lowerId.includes('past') || lowerNome.includes('past') || lowerNome.includes('gastro') || lowerNome.includes('culin')) {
      return '/images/course_pastelaria_1790165426605.jpg';
    }
    return '/images/course_informatica_1790165382220.jpg';
  };

  // Admin news post state
  const [newTitle, setNewTitle] = useState('');
  const [newText, setNewText] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'video' | 'none'>('image');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Autoplay hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Autoplay testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const filteredNews = news.filter((item) => {
    if (activeNewsFilter === 'todos') return true;
    return item.mediaType === activeNewsFilter;
  });

  const handlePublishNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newText.trim()) return;
    onAddNews({
      title: newTitle,
      text: newText,
      mediaType: newMediaType,
      mediaUrl: newMediaUrl || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop',
      date: Date.now(),
    });
    setNewTitle('');
    setNewText('');
    setNewMediaUrl('');
    setNewMediaType('image');
  };

  const safeTestimonialIndex = testimonials.length > 0 ? currentTestimonial % testimonials.length : 0;
  const activeTestimonial = testimonials[safeTestimonialIndex];

  return (
    <div className="space-y-16 pb-20">

      {/* ================= HERO SECTION WITH BRAND CAROUSEL ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        
        {/* Subtle Tech Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          
          {/* Header Tagline & Edit trigger */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span>Plataforma FYP+C 2026 • Inovação Académica & Tecnológica</span>
            </div>

            {/* EDIT HERO BUTTON (FOR AUTHORIZED EDITORS) */}
            {isEditMode && canEditSite && onOpenEditHero && (
              <button
                onClick={onOpenEditHero}
                className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
                title="Editar textos do Hero e Slogan"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Título & Slogan</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                {homeContent.heroTitle}{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  {homeContent.heroHighlight}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                {homeContent.heroDescription}
              </p>

              {/* Slogan Banner */}
              <div className="p-4 rounded-xl bg-slate-900/80 border-l-4 border-cyan-400 border-y border-r border-slate-800 text-sm italic text-slate-200 shadow-lg">
                &ldquo;{homeContent.heroSlogan}&rdquo;
              </div>

              {/* Interactive CTAs */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  id="hero-btn-primeiro-passo"
                  onClick={() => onOpenRegisterCourse('Informática')}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm sm:text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center gap-2.5 group"
                >
                  <span>Dar o primeiro passo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-cyan-300" />
                </button>

                <button
                  id="hero-btn-explorar-tec"
                  onClick={onNavigateToFypcTec}
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-slate-700 hover:border-slate-600 transition-all flex items-center gap-2.5"
                >
                  <Cpu className="w-4 h-4 text-purple-400" />
                  <span>Soluções FYP+C Tec</span>
                </button>
              </div>

              {/* Quick Tech Features Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-cyan-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Certificado</p>
                    <p className="text-slate-400">Reconhecido</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">Laboratórios</p>
                    <p className="text-slate-400">100% Práticos</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div className="text-xs">
                    <p className="font-semibold text-white">EduSystem</p>
                    <p className="text-slate-400">ERP Integrado</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Interactive Mockup Slider */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 p-2.5 border border-slate-700/80 shadow-2xl backdrop-blur-xl">
                
                {/* Visual Glass Header with controls */}
                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/60 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80"></span>
                    <span className="text-[11px] font-mono text-slate-400 ml-1">fypc-identity-preview</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Display Image Card */}
                <div className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={slides[currentSlide].image}
                    alt={slides[currentSlide].title}
                    className="w-full h-full object-contain p-2 transition-all duration-700 ease-in-out hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/95 via-slate-950/60 to-transparent p-4 text-left">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-cyan-400">
                      Material Oficial FYP+C
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-xs text-slate-300">
                      {slides[currentSlide].subtitle}
                    </p>
                  </div>
                </div>

                {/* Slider Thumb Dots & Quick Tab Selectors */}
                <div className="grid grid-cols-4 gap-1.5 mt-3 pt-2.5 border-t border-slate-800">
                  {slides.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`px-2 py-1.5 rounded-lg border text-center transition-all ${
                        currentSlide === idx
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 font-bold shadow-xs'
                          : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200 text-xs'
                      }`}
                    >
                      <span className="text-[10px] sm:text-[11px] block truncate">
                        {idx === 0 ? '💼 Cartão' : idx === 1 ? '👜 Tote Bag' : idx === 2 ? '👕 Polo' : '🏢 Fachada'}
                      </span>
                    </button>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= METRICS COUNTERS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              +{homeContent.statsAlunosBase + alunosCount}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Alunos Formados & Ativos
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 mx-auto rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {professoresCount}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Professores Certificados
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 mx-auto rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {sociosCount}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Sócios e Gestores
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {cursos.length}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-0.5">
              Cursos Oficiais
            </div>
          </div>
        </div>
      </section>

      {/* ================= MODERN COURSES SHOWCASE ================= */}
      <section id="cursos-destaque" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header & Section Description */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Formação Prática, Presencial & Certificada</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Os Nossos Cursos em Destaque
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed">
              Programas intensivos desenhados com laboratórios modernos no Golf 2 para capacitar jovens e profissionais com habilidades práticas de alta procura no mercado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* ADD NEW COURSE BUTTON FOR AUTHORIZED EDITORS */}
            {isEditMode && canEditSite && onOpenAddCourse && (
              <button
                onClick={onOpenAddCourse}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar Novo Curso</span>
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Filter Controls & Live Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: 'todos', label: 'Todos os Cursos' },
              { id: 'tecnologia', label: 'Tecnologia & Escritório' },
              { id: 'idiomas', label: 'Idiomas Globais' },
              { id: 'profissional', label: 'Profissionalizantes' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCourseCategoryFilter(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  courseCategoryFilter === cat.id
                    ? 'bg-blue-700 text-white shadow-xs font-bold'
                    : 'bg-white text-slate-600 hover:bg-slate-200/60 hover:text-slate-900 border border-slate-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={courseSearchQuery}
              onChange={(e) => setCourseSearchQuery(e.target.value)}
              placeholder="Pesquisar por curso, área ou competência..."
              className="w-full pl-10 pr-9 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 shadow-2xs"
            />
            {courseSearchQuery && (
              <button
                onClick={() => setCourseSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                title="Limpar pesquisa"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        {(() => {
          const filteredCursos = cursos.filter((curso) => {
            const cat = (curso.categoria || '').toLowerCase();
            const nome = (curso.nome || '').toLowerCase();
            const desc = (curso.descricao || '').toLowerCase();

            let matchesCategory = true;
            if (courseCategoryFilter === 'tecnologia') {
              matchesCategory = cat.includes('tec') || cat.includes('escrit') || curso.id === 'informatica';
            } else if (courseCategoryFilter === 'idiomas') {
              matchesCategory = cat.includes('idiom') || cat.includes('ingl') || cat.includes('fran') || curso.id === 'ingles' || curso.id === 'frances';
            } else if (courseCategoryFilter === 'profissional') {
              matchesCategory = cat.includes('arte') || cat.includes('beleza') || cat.includes('culin') || cat.includes('past') || curso.id === 'cabeleireiro' || curso.id === 'pastelaria';
            }

            const query = courseSearchQuery.trim().toLowerCase();
            const matchesSearch = !query || nome.includes(query) || desc.includes(query) || cat.includes(query);

            return matchesCategory && matchesSearch;
          });

          if (filteredCursos.length === 0) {
            return (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Search className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Nenhum curso encontrado</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Não encontramos resultados para &quot;{courseSearchQuery}&quot; na categoria selecionada.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setCourseCategoryFilter('todos');
                    setCourseSearchQuery('');
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Limpar Filtros e Ver Todos
                </button>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCursos.map((curso) => {
                const courseImageSrc = getCourseImage(curso);
                const isAlmostFull = curso.vagas <= 8;

                return (
                  <div
                    key={curso.id}
                    className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
                  >
                    {/* Top Image Showcase Banner */}
                    <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
                      {/* Course Image */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={courseImageSrc}
                        alt={curso.nome}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
                      />

                      {/* Ambient Gradient Shadows */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />

                      {/* Top Badges Overlay */}
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none z-10">
                        {/* Status/Badge */}
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold shadow-md">
                          {isAlmostFull && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          <span>{curso.badge || 'Inscrições Abertas'}</span>
                        </span>

                        {/* Floating Glass Icon */}
                        <div className="w-9 h-9 rounded-xl bg-white/90 backdrop-blur-md text-slate-900 shadow-md flex items-center justify-center text-lg border border-white/50">
                          {curso.icone}
                        </div>
                      </div>

                      {/* Category Label at bottom of image */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs z-10 pointer-events-none">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-cyan-300 drop-shadow-md">
                          {curso.categoria}
                        </span>
                        <span className="text-[11px] text-slate-300 font-semibold bg-slate-950/60 backdrop-blur-xs px-2 py-0.5 rounded-md border border-white/10">
                          {curso.nivel}
                        </span>
                      </div>

                      {/* Edit Controls Overlay for Authorized Directors */}
                      {isEditMode && canEditSite && (
                        <div className="absolute top-3 right-14 z-20 flex items-center gap-1.5">
                          {onOpenEditCourse && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenEditCourse(curso);
                              }}
                              className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-lg transition-transform hover:scale-110"
                              title="Editar este curso"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onDeleteCourse && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (confirm(`Tem a certeza que deseja remover o curso "${curso.nome}"?`)) {
                                  onDeleteCourse(curso.id);
                                }
                              }}
                              className="p-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg transition-transform hover:scale-110"
                              title="Remover este curso"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Information Body */}
                    <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug">
                          {curso.nome}
                        </h3>

                        {/* Clean Metadata without Pills */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-600" />
                            {curso.duracao}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-600">Presencial</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 font-semibold flex items-center gap-0.5">
                            <Check className="w-3 h-3 text-emerald-600" /> Certificado
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {curso.descricao}
                        </p>
                      </div>

                      {/* Class Capacity Progress Bar */}
                      <div className="pt-3 border-t border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-600 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-blue-600" />
                            <span>Vagas Disponíveis:</span>
                          </span>
                          <span className="font-bold text-slate-900">
                            {curso.vagas} lugares restantes
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(100, Math.max(30, 100 - (curso.vagas * 4)))}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Card Action Button */}
                    <div className="p-4 bg-slate-50/80 border-t border-slate-100">
                      <button
                        onClick={() => onOpenRegisterCourse(curso.nome)}
                        className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold bg-blue-700 hover:bg-blue-800 text-white transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 group/btn"
                      >
                        <span>Garantir Vaga / Inscrever</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-cyan-300" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          );
        })()}

      </section>

      {/* ================= THREE INNOVATION PILLARS ================= */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
              Diferenciais Competitivos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Como a FYP+C Eleva o Seu Potencial
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Um ecossistema formativo onde a teoria é imediatamente convertida em prática digital e comunicativa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center mb-4 border border-blue-500/30">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{homeContent.pilar1Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {homeContent.pilar1Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 border border-purple-500/30">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{homeContent.pilar2Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {homeContent.pilar2Desc}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur-md">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <Globe2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{homeContent.pilar3Title}</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {homeContent.pilar3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= NEWS & NOTÍCIAS SECTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Atividades Recentes
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              Notícias sobre Nós
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveNewsFilter('todos')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeNewsFilter === 'todos'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveNewsFilter('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeNewsFilter === 'image'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Fotos
            </button>
            <button
              onClick={() => setActiveNewsFilter('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeNewsFilter === 'video'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Vídeos
            </button>
          </div>
        </div>

        {/* Admin News Publisher Box */}
        {currentRole === 'admin' && (
          <form
            onSubmit={handlePublishNews}
            className="mb-8 p-6 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-blue-900 tracking-wider">
                Publicar Nova Notícia ou Comunicado
              </span>
              <span className="text-[11px] text-blue-700 font-medium">Área Administrativa</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Título da Notícia:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ex: Cerimónia de Entrega de Certificados"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL da Imagem / Vídeo:</label>
                <input
                  type="text"
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tipo de Mídia:</label>
              <select
                value={newMediaType}
                onChange={(e) => setNewMediaType(e.target.value as 'image' | 'video' | 'none')}
                className="text-xs sm:text-sm p-2 rounded-xl border border-slate-300 bg-white text-slate-900"
              >
                <option value="image">Fotografia</option>
                <option value="video">Vídeo</option>
                <option value="none">Apenas Texto</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Descrição:</label>
              <textarea
                value={newText}
                onChange={(e) => setNewText(e.target.value)}
                rows={2}
                placeholder="Detalhes sobre a novidade..."
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold shadow transition-all"
            >
              Publicar Notícia
            </button>
          </form>
        )}

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const isLiked = likedNews.includes(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {item.mediaUrl && item.mediaType !== 'none' && (
                    <div className="relative h-48 w-full bg-slate-950 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.mediaUrl}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase px-2.5 py-1 rounded-md bg-slate-900/80 text-white backdrop-blur-md">
                        {item.mediaType === 'video' ? 'Vídeo' : 'Fotografia'}
                      </span>
                    </div>
                  )}

                  <div className="p-5">
                    <span className="text-[11px] font-medium text-slate-400">
                      {new Date(item.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onToggleLike(item.id)}
                    className={`flex items-center gap-1.5 text-xs font-semibold transition-colors ${
                      isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                    <span>{item.likes + (isLiked ? 1 : 0)} Gostos</span>
                  </button>

                  {currentRole === 'admin' && (
                    <button
                      onClick={() => onDeleteNews(item.id)}
                      className="text-xs text-red-500 hover:text-red-700 font-medium"
                    >
                      Remover
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= MISSION, VISION & VALUES ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Edit Mission & Values button */}
        {isEditMode && canEditSite && onOpenEditMissionValues && (
          <div className="flex justify-end mb-3">
            <button
              onClick={onOpenEditMissionValues}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Missão & Valores</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-950 text-white shadow-xl relative overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-cyan-400 flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-3">{homeContent.missionTitle}</h3>
            <p className="text-sm text-slate-200 leading-relaxed font-normal">
              {homeContent.missionText}
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-slate-900 shadow-md">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold tracking-tight mb-3">{homeContent.valuesTitle}</h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              {homeContent.valuesList.map((val, vIdx) => (
                <li key={vIdx} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0"></span>
                  <span><strong>{val.title}</strong> {val.desc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS CAROUSEL ================= */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
              Comunidade & Confiança ({testimonials.length})
            </span>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight mt-1">
              O Que Dizem de Nós
            </h2>
          </div>

          {/* Add Testimonial button for authorized directors */}
          {isEditMode && canEditSite && onOpenAddTestimonial && (
            <button
              onClick={onOpenAddTestimonial}
              className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Testemunho</span>
            </button>
          )}
        </div>

        {activeTestimonial && (
          <div className="relative bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-lg text-center">
            
            {/* Edit/Delete current testimonial for authorized directors */}
            {isEditMode && canEditSite && (
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                {onOpenEditTestimonial && (
                  <button
                    onClick={() => onOpenEditTestimonial(activeTestimonial, safeTestimonialIndex)}
                    className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow transition-transform hover:scale-105"
                    title="Editar este testemunho"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDeleteTestimonial && testimonials.length > 1 && (
                  <button
                    onClick={() => {
                      if (confirm(`Remover testemunho de "${activeTestimonial.autor}"?`)) {
                        onDeleteTestimonial(safeTestimonialIndex);
                      }
                    }}
                    className="p-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 shadow transition-transform hover:scale-105"
                    title="Remover testemunho"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Quote className="w-6 h-6" />
            </div>

            <p className="text-base sm:text-lg text-slate-700 italic max-w-2xl mx-auto leading-relaxed">
              &ldquo;{activeTestimonial.quote}&rdquo;
            </p>

            <div className="mt-6">
              <div className="font-bold text-slate-900 text-sm sm:text-base">
                {activeTestimonial.autor}
              </div>
              <div className="text-xs text-slate-500">
                {activeTestimonial.cargo}
              </div>
            </div>

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`h-2 rounded-full transition-all ${
                      safeTestimonialIndex === idx ? 'w-6 bg-blue-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Ver testemunho ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </section>

      {/* ================= FINAL CALL TO ACTION ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-8 sm:p-12 text-white shadow-2xl text-center relative overflow-hidden border border-blue-800">
          <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none"></div>
          
          <div className="relative max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-300 bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              Vagas Limitadas para o Próximo Ciclo
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Pronto para Dar o Primeiro Passo?
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Inscreva-se hoje nas turmas de Informática, Inglês ou Francês e receba acompanhamento personalizado da direção pedagógica da FYP+C.
            </p>
            <div className="pt-2">
              <button
                onClick={() => onOpenRegisterCourse('Informática')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
              >
                Garantir a Minha Vaga Agora
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
