'use client';

import React, { useState, useRef } from 'react';
import { PedagogicalMaterial, MaterialTipo, UserRole, Aluno, Professor } from '../types';
import { isAuthorizedSiteEditor } from '../utils/editorPermissions';
import { 
  BookOpen, 
  Headphones, 
  Download, 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award, 
  Trash2, 
  Play, 
  Pause, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  Volume2, 
  ExternalLink,
  X,
  FileCheck
} from 'lucide-react';

interface PedagogicalMaterialSectionProps {
  currentUser: string;
  currentRole: UserRole;
  materials: PedagogicalMaterial[];
  onUpdateMaterials: (updated: PedagogicalMaterial[]) => void;
  alunos?: Aluno[];
  professores?: Professor[];
}

export const PedagogicalMaterialSection: React.FC<PedagogicalMaterialSectionProps> = ({
  currentUser,
  currentRole,
  materials,
  onUpdateMaterials,
  alunos = [],
  professores = []
}) => {
  const isAuthorizedAdmin = isAuthorizedSiteEditor(currentUser);
  const isStudent = currentRole === 'student';
  const isTeacher = currentRole === 'teacher' || professores.some((p) => p.nome.toLowerCase() === currentUser.toLowerCase());

  // Determine student's enrolled course if applicable
  const studentInfo = isStudent ? alunos.find((a) => a.nome.toLowerCase() === currentUser.toLowerCase()) : null;
  const initialCourseSelection = studentInfo?.curso || 'Todos os Cursos';

  // Filters & Search
  const [selectedCurso, setSelectedCurso] = useState<string>(initialCourseSelection);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'todos' | 'livros' | 'audios'>('todos');

  // Audio Playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioPlaybackProgress, setAudioPlaybackProgress] = useState<{ [id: string]: number }>({});
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Upload Modals state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [uploadType, setUploadType] = useState<MaterialTipo>('livro');
  const [uploadCurso, setUploadCurso] = useState<string>('Inglês');
  const [uploadTitulo, setUploadTitulo] = useState<string>('');
  const [uploadAutor, setUploadAutor] = useState<string>('');
  const [uploadDescricao, setUploadDescricao] = useState<string>('');
  const [uploadNivel, setUploadNivel] = useState<string>('A1 / A2');
  const [uploadDuracao, setUploadDuracao] = useState<string>('4 min 30 s');
  
  // Drag & drop file state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Available institutional courses
  const allCourses = [
    'Inglês',
    'Francês',
    'Informática na Ótica do Utilizador',
    'Secretariado Executivo & Gestão de Documentos',
    'Contabilidade Informatizada & Gestão Financeira',
    'Design Gráfico & Multimédia',
    'Redes de Computadores & Cibersegurança',
    'Atendimento ao Cliente & Vendas'
  ];

  // Audio allowed courses strictly: Francês e Inglês
  const audioAllowedCourses = ['Inglês', 'Francês'];

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Open Upload Modal
  const openUploadModal = (type: MaterialTipo) => {
    setUploadType(type);
    setSelectedFile(null);
    setFileBase64(null);
    setUploadTitulo('');
    setUploadDescricao('');
    setUploadAutor(currentUser);
    
    // For audio, restrict course selection strictly to Inglês or Francês
    if (type === 'audio') {
      setUploadCurso(selectedCurso === 'Francês' ? 'Francês' : 'Inglês');
      setUploadDuracao('3 min 45 s');
    } else {
      setUploadCurso(selectedCurso !== 'Todos os Cursos' ? selectedCurso : 'Inglês');
    }
    
    setIsUploadModalOpen(true);
  };

  // Submit Upload
  const handleSaveMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitulo.trim()) return;

    const fileFormat = uploadType === 'audio' 
      ? (selectedFile?.name.split('.').pop()?.toUpperCase() || 'MP3')
      : (selectedFile?.name.split('.').pop()?.toUpperCase() || 'PDF');

    const calculatedSize = selectedFile 
      ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
      : uploadType === 'audio' ? '6.2 MB' : '15.4 MB';

    const newMaterial: PedagogicalMaterial = {
      id: `mat-${Date.now()}`,
      titulo: uploadTitulo.trim(),
      curso: uploadCurso,
      tipo: uploadType,
      formato: fileFormat,
      tamanho: calculatedSize,
      duracao: uploadType === 'audio' ? uploadDuracao : undefined,
      autorOuEditora: uploadAutor.trim() || 'Academia FYP+C',
      descricao: uploadDescricao.trim() || (uploadType === 'audio' ? 'Faixa de áudio e compreensão oral oficial FYP+C' : 'Manual pedagógico autorizado FYP+C'),
      dataUpload: new Date().toLocaleDateString('pt-PT'),
      uploadedBy: currentUser,
      fileName: selectedFile?.name || `${uploadTitulo.trim().replace(/\s+/g, '_')}_FYPC.${fileFormat.toLowerCase()}`,
      fileUrl: fileBase64 || undefined,
      nivelRecomendado: uploadNivel
    };

    onUpdateMaterials([newMaterial, ...materials]);
    setIsUploadModalOpen(false);
  };

  // Delete Material
  const handleDeleteMaterial = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthorizedAdmin) return;
    if (confirm('Tem certeza de que deseja remover este material pedagógico da biblioteca?')) {
      onUpdateMaterials(materials.filter((m) => m.id !== id));
      if (playingAudioId === id) {
        stopAudioPlayback();
      }
    }
  };

  // Trigger Download
  const handleDownload = (material: PedagogicalMaterial, e: React.MouseEvent) => {
    e.stopPropagation();

    if (material.fileUrl) {
      // Real uploaded file data url
      const link = document.createElement('a');
      link.href = material.fileUrl;
      link.download = material.fileName || `${material.titulo}.${material.formato.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Generate clean authentic academic text / audio placeholder blob for seed materials
      const content = `=====================================================
FYP+C — FORMAÇÃO PROFISSIONAL & CONSULTORIA
MATERIAL PEDAGÓGICO OFICIAL
=====================================================

TÍTULO: ${material.titulo}
CURSO: ${material.curso}
TIPO: ${material.tipo.toUpperCase()} (${material.formato})
AUTOR / EDITORA: ${material.autorOuEditora || 'FYP+C'}
NÍVEL RECOMENDADO: ${material.nivelRecomendado || 'Geral'}
DATA DE DISPONIBILIZAÇÃO: ${material.dataUpload}
RESPONSÁVEL PELO ENVIO: ${material.uploadedBy}

DESCRIÇÃO PEDAGÓGICA:
${material.descricao}

-----------------------------------------------------
Este material destina-se aos estudantes e docentes inscritos
no curso de ${material.curso} na FYP+C.
Todos os direitos reservados à Academia FYP+C.
=====================================================`;

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = material.fileName || `${material.titulo.replace(/\s+/g, '_')}_FYPC.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Toggle Audio Play / Pause
  const toggleAudioPlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (playingAudioId === id) {
      stopAudioPlayback();
    } else {
      stopAudioPlayback();
      setPlayingAudioId(id);
      setAudioPlaybackProgress((prev) => ({ ...prev, [id]: prev[id] || 5 }));

      audioIntervalRef.current = setInterval(() => {
        setAudioPlaybackProgress((prev) => {
          const current = prev[id] || 0;
          if (current >= 100) {
            stopAudioPlayback();
            return { ...prev, [id]: 0 };
          }
          return { ...prev, [id]: current + 2 };
        });
      }, 500);
    }
  };

  const stopAudioPlayback = () => {
    if (audioIntervalRef.current) {
      clearInterval(audioIntervalRef.current);
      audioIntervalRef.current = null;
    }
    setPlayingAudioId(null);
  };

  // Filtered Materials
  const filteredMaterials = materials.filter((m) => {
    const matchesCourse = selectedCurso === 'Todos os Cursos' || m.curso.toLowerCase() === selectedCurso.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      m.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.descricao?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.autorOuEditora?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activeTab === 'todos' 
      ? true 
      : activeTab === 'livros' 
        ? (m.tipo === 'livro' || m.tipo === 'manual') 
        : m.tipo === 'audio';

    return matchesCourse && matchesSearch && matchesType;
  });

  const booksAndManuals = filteredMaterials.filter((m) => m.tipo === 'livro' || m.tipo === 'manual');
  const audioTracks = filteredMaterials.filter((m) => m.tipo === 'audio');

  // Check if current course filter allows audio
  const isAudioAllowedForSelectedCourse = selectedCurso === 'Todos os Cursos' || audioAllowedCourses.includes(selectedCurso);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Biblioteca Pedagógica & Laboratório de Áudio FYP+C</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Material Pedagógico, Livros & Áudios
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Repositório institucional de livros didáticos, manuais operacionais e faixas de listening tracks.
            Download livre para professores e estudantes dos respetivos cursos.
          </p>
        </div>

        {/* Upload Buttons for Authorized Admins */}
        {isAuthorizedAdmin && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              id="btn-upload-manual-admin"
              onClick={() => openUploadModal('livro')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Upload de Livro / Manual</span>
            </button>

            <button
              id="btn-upload-audio-admin"
              onClick={() => openUploadModal('audio')}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Headphones className="w-4 h-4" />
              <span>Upload de Áudio (Inglês / Francês)</span>
            </button>
          </div>
        )}
      </div>

      {/* Course Selector & Search Controls */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* COURSE SELECTOR DROPDOWN */}
          <div className="flex-1 max-w-md">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-blue-600" />
              <span>Selecionar Curso da Instituição:</span>
            </label>
            <div className="relative">
              <select
                id="select-curso-material"
                value={selectedCurso}
                onChange={(e) => setSelectedCurso(e.target.value)}
                className="w-full text-xs sm:text-sm p-2.5 pr-8 rounded-xl border border-slate-300 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              >
                <option value="Todos os Cursos">🌐 Todos os Cursos da FYP+C</option>
                {allCourses.map((c) => (
                  <option key={c} value={c}>
                    {c} {audioAllowedCourses.includes(c) ? '🎧 (Com Áudios & Manuais)' : '📚 (Manuais)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SEARCH INPUT */}
          <div className="flex-1 max-w-sm">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>Pesquisar Conteúdo:</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ex: English File, Excel, Piste Audio..."
                className="w-full text-xs sm:text-sm p-2.5 pl-9 rounded-xl border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 text-xs"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('todos')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'todos'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Todos os Materiais ({filteredMaterials.length})
          </button>

          <button
            onClick={() => setActiveTab('livros')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'livros'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Livros & Manuais ({booksAndManuals.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('audios')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'audios'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Áudios & Listening Tracks ({audioTracks.length})</span>
            {!isAudioAllowedForSelectedCourse && (
              <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded-full ml-1">
                Apenas Francês/Inglês
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Selected Course Context Banner for Student/Teacher */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="text-blue-900 flex items-center gap-2">
          <span className="font-bold">Curso em Exibição:</span>
          <span className="px-2.5 py-0.5 rounded-md bg-blue-600 text-white font-semibold">
            {selectedCurso}
          </span>
          {isStudent && studentInfo && (
            <span className="text-slate-600">
              (Seu curso de matrícula: <strong>{studentInfo.curso}</strong>)
            </span>
          )}
        </div>
        <div className="text-slate-500 text-[11px]">
          {isAuthorizedAdmin
            ? '⭐ Modo Curadoria de Conteúdo: Lázaro Luis, Francisco Faztudo e Maria Victoria'
            : '📥 Clique em "Baixar / Download" para transferir os ficheiros diretamente para o seu dispositivo.'}
        </div>
      </div>

      {/* ================= SECTION 1: LIVROS E MANUAIS DIDÁTICOS ================= */}
      {(activeTab === 'todos' || activeTab === 'livros') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">
                📚 Livros Didáticos & Manuais de Apoio
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {booksAndManuals.length} material(is) disponível(is)
            </span>
          </div>

          {booksAndManuals.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs sm:text-sm">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Nenhum livro ou manual cadastrado para o curso selecionado ({selectedCurso}).
              {isAuthorizedAdmin && (
                <div className="mt-3">
                  <button
                    onClick={() => openUploadModal('livro')}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Fazer Upload Agora</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {booksAndManuals.map((mat) => (
                <div
                  key={mat.id}
                  id={`card-material-${mat.id}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-200">
                          {mat.formato} • {mat.tipo.toUpperCase()}
                        </span>
                        {mat.nivelRecomendado && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                            Nível: {mat.nivelRecomendado}
                          </span>
                        )}
                      </div>

                      {isAuthorizedAdmin && (
                        <button
                          onClick={(e) => handleDeleteMaterial(mat.id, e)}
                          title="Remover material"
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                        {mat.titulo}
                      </h4>
                      <p className="text-xs text-blue-700 font-medium mt-1">
                        {mat.curso} • {mat.autorOuEditora || 'FYP+C'}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {mat.descricao}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Tam: {mat.tamanho || '15 MB'}</span>
                      <span>Enviado por: {mat.uploadedBy}</span>
                    </div>

                    {/* DOWNLOAD BUTTON FOR STUDENTS, TEACHERS AND ADMINS */}
                    <button
                      id={`btn-download-${mat.id}`}
                      onClick={(e) => handleDownload(mat, e)}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                      <span>Baixar Material ({mat.formato})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 2: ÁUDIOS & LISTENING TRACKS ================= */}
      {(activeTab === 'todos' || activeTab === 'audios') && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-amber-600" />
              <h3 className="text-lg font-bold text-slate-900">
                🎧 Áudios & Listening Tracks
              </h3>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Exclusivo para Inglês e Francês
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {audioTracks.length} faixa(s) de áudio
            </span>
          </div>

          {/* Notice when user selected a non-language course */}
          {!isAudioAllowedForSelectedCourse && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Aviso Pedagógico:</strong> O curso selecionado ({selectedCurso}) não possui faixas de áudio porque as listening tracks e faixas sonoras estão disponíveis <strong>exclusivamente para os cursos de Francês e Inglês</strong>, conforme diretriz pedagógica da instituição. Para ouvir ou descarregar áudios, selecione &quot;Inglês&quot; ou &quot;Francês&quot; no seletor de cursos acima.
              </div>
            </div>
          )}

          {isAudioAllowedForSelectedCourse && audioTracks.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs sm:text-sm">
              <Headphones className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              Nenhuma faixa de áudio cadastrada para {selectedCurso}.
              {isAuthorizedAdmin && (
                <div className="mt-3">
                  <button
                    onClick={() => openUploadModal('audio')}
                    className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 inline-flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Fazer Upload de Áudio</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {audioTracks.map((mat) => {
                const isPlaying = playingAudioId === mat.id;
                const progress = audioPlaybackProgress[mat.id] || 0;

                return (
                  <div
                    key={mat.id}
                    id={`card-audio-${mat.id}`}
                    className="p-5 rounded-2xl bg-white border border-amber-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                            {mat.formato} • {mat.curso}
                          </span>
                          {mat.duracao && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span>{mat.duracao}</span>
                            </span>
                          )}
                        </div>

                        {isAuthorizedAdmin && (
                          <button
                            onClick={(e) => handleDeleteMaterial(mat.id, e)}
                            title="Remover áudio"
                            className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                          {mat.titulo}
                        </h4>
                        <p className="text-xs text-amber-700 font-medium mt-1">
                          {mat.autorOuEditora || 'Laboratório de Línguas FYP+C'}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {mat.descricao}
                      </p>

                      {/* Interactive Audio Player Preview */}
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                        <div className="flex items-center justify-between text-xs text-amber-900 font-medium">
                          <div className="flex items-center gap-2">
                            <button
                              id={`btn-play-${mat.id}`}
                              onClick={(e) => toggleAudioPlay(mat.id, e)}
                              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer ${
                                isPlaying ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-amber-300 shadow-xs'
                              }`}
                            >
                              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
                            </button>
                            <span>{isPlaying ? 'A reproduzir...' : 'Ouvir no Navegador'}</span>
                          </div>
                          <span className="text-[11px] text-amber-700 font-mono">
                            {isPlaying ? `${Math.round((progress / 100) * 270)}s` : mat.duracao || 'MP3 Oficial'}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-amber-200/60 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-600 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Tamanho: {mat.tamanho || '6 MB'}</span>
                        <span>Enviado por: {mat.uploadedBy}</span>
                      </div>

                      {/* DOWNLOAD BUTTON FOR AUDIO */}
                      <button
                        id={`btn-download-audio-${mat.id}`}
                        onClick={(e) => handleDownload(mat, e)}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer group"
                      >
                        <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                        <span>Baixar Áudio ({mat.formato})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= UPLOAD MODAL FOR AUTHORIZED ADMINS ================= */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className={`p-5 text-white flex items-center justify-between ${
              uploadType === 'audio' ? 'bg-amber-600' : 'bg-blue-600'
            }`}>
              <div className="flex items-center gap-2.5">
                {uploadType === 'audio' ? <Headphones className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                <div>
                  <h3 className="font-bold text-base">
                    {uploadType === 'audio' ? 'Upload de Áudio (Listening Track)' : 'Upload de Livro / Manual Pedagógico'}
                  </h3>
                  <p className="text-xs text-white/80">
                    Acesso exclusivo: Lázaro Luis, Francisco Faztudo e Maria Victoria
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveMaterial} className="p-6 overflow-y-auto space-y-4">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => {
                    setUploadType('livro');
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    uploadType !== 'audio'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📚 Livro / Manual
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUploadType('audio');
                    if (!audioAllowedCourses.includes(uploadCurso)) {
                      setUploadCurso('Inglês');
                    }
                  }}
                  className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                    uploadType === 'audio'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🎧 Áudio (Francês & Inglês)
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Título do Material: *
                </label>
                <input
                  type="text"
                  value={uploadTitulo}
                  onChange={(e) => setUploadTitulo(e.target.value)}
                  placeholder={uploadType === 'audio' ? 'Ex: Listening Track 03 - Job Interview Conversation' : 'Ex: Manual Prático de Microsoft Excel 2026'}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              {/* Course Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Curso Alvo da Instituição: *
                </label>
                {uploadType === 'audio' ? (
                  <div>
                    <select
                      value={uploadCurso}
                      onChange={(e) => setUploadCurso(e.target.value)}
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-amber-300 bg-amber-50/50 font-semibold text-amber-900 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      required
                    >
                      <option value="Inglês">Língua Inglesa (Inglês)</option>
                      <option value="Francês">Língua Francesa (Francês)</option>
                    </select>
                    <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      Regra Institucional: Faixas de áudio só estão disponíveis para os cursos de Francês e Inglês.
                    </p>
                  </div>
                ) : (
                  <select
                    value={uploadCurso}
                    onChange={(e) => setUploadCurso(e.target.value)}
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    required
                  >
                    {allCourses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Author / Publisher & Level or Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Autor / Editora / Coordenação:
                  </label>
                  <input
                    type="text"
                    value={uploadAutor}
                    onChange={(e) => setUploadAutor(e.target.value)}
                    placeholder="Ex: Oxford, CLE ou Equipa FYP+C"
                    className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {uploadType === 'audio' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Duração Estimada:
                    </label>
                    <input
                      type="text"
                      value={uploadDuracao}
                      onChange={(e) => setUploadDuracao(e.target.value)}
                      placeholder="Ex: 4 min 15 s"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nível Recomendado:
                    </label>
                    <input
                      type="text"
                      value={uploadNivel}
                      onChange={(e) => setUploadNivel(e.target.value)}
                      placeholder="Ex: A1, B2, Iniciante, Geral"
                      className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Resumo / Instruções Pedagógicas:
                </label>
                <textarea
                  value={uploadDescricao}
                  onChange={(e) => setUploadDescricao(e.target.value)}
                  rows={2}
                  placeholder="Objetivos do material, temas abordados e orientações aos estudantes..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Drag-and-Drop / File Picker Area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ficheiro do Material ({uploadType === 'audio' ? 'MP3, WAV, M4A' : 'PDF, DOCX, EPUB'}):
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50/80 scale-[1.01]'
                      : selectedFile
                        ? 'border-emerald-500 bg-emerald-50/60'
                        : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={uploadType === 'audio' ? 'audio/*,.mp3,.wav,.m4a' : '.pdf,.docx,.doc,.epub,.zip'}
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="space-y-1">
                      <FileCheck className="w-8 h-8 text-emerald-600 mx-auto" />
                      <div className="font-bold text-slate-900 text-sm">
                        {selectedFile.name}
                      </div>
                      <div className="text-xs text-emerald-700">
                        Pronto para upload • {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                      <div className="text-[11px] text-slate-400 underline mt-1">
                        Clique ou arraste outro para substituir
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                      <div className="font-bold text-slate-800 text-xs sm:text-sm">
                        Arraste o ficheiro para aqui ou <span className="text-blue-600 underline">clique para selecionar</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {uploadType === 'audio' ? 'Suporta MP3, WAV, M4A até 50MB' : 'Suporta PDF, DOCX, EPUB até 100MB'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2.5 rounded-xl text-white text-xs sm:text-sm font-semibold shadow-sm transition-all flex items-center gap-2 ${
                    uploadType === 'audio'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  <span>Concluir Upload</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
