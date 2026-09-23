'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Sparkles, 
  Cpu, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';
import { 
  HomeContent, 
  FypcTecHeroContent, 
  CursoDestaque, 
  FypcService, 
  TestimonialItem 
} from '../types';

// =========================================================================
// 1. EDIT HOME HERO & SLOGAN MODAL
// =========================================================================
interface EditHomeHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: HomeContent;
  initialData?: HomeContent;
  onSave: (updated: Partial<HomeContent>) => void;
}

export const EditHomeHeroModal: React.FC<EditHomeHeroModalProps> = ({
  isOpen,
  onClose,
  content: directContent,
  initialData,
  onSave,
}) => {
  const content = directContent || initialData || {
    heroTitle: '',
    heroHighlight: '',
    heroDescription: '',
    heroSlogan: '',
    missionTitle: '',
    missionText: '',
    valuesTitle: '',
    valuesList: []
  };
  const [heroTitle, setHeroTitle] = useState(content.heroTitle);
  const [heroHighlight, setHeroHighlight] = useState(content.heroHighlight);
  const [heroDescription, setHeroDescription] = useState(content.heroDescription);
  const [heroSlogan, setHeroSlogan] = useState(content.heroSlogan);

  useEffect(() => {
    if (isOpen) {
      setHeroTitle(content.heroTitle);
      setHeroHighlight(content.heroHighlight);
      setHeroDescription(content.heroDescription);
      setHeroSlogan(content.heroSlogan);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      heroTitle,
      heroHighlight,
      heroDescription,
      heroSlogan,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base">Editar Título Principal & Hero (Início)</h3>
              <p className="text-xs text-slate-400">Permissão Exclusiva: Lázaro Luis, Francisco Faztudo & Maria Victoria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título Inicial:</label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destaque em Gradiente:</label>
            <input
              type="text"
              value={heroHighlight}
              onChange={(e) => setHeroHighlight(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição do Hero:</label>
            <textarea
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              rows={3}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Slogan Oficial:</label>
            <input
              type="text"
              value={heroSlogan}
              onChange={(e) => setHeroSlogan(e.target.value)}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Alterações</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


// =========================================================================
// 2. EDIT / ADD COURSE MODAL
// =========================================================================
interface EditCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseToEdit?: CursoDestaque | null;
  initialData?: CursoDestaque | null;
  onSave: (course: CursoDestaque) => void;
}

export const EditCourseModal: React.FC<EditCourseModalProps> = ({
  isOpen,
  onClose,
  courseToEdit: directCourse,
  initialData,
  onSave,
}) => {
  const courseToEdit = directCourse !== undefined ? directCourse : initialData;
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Tecnologia & Escritório');
  const [duracao, setDuracao] = useState('3 Meses');
  const [nivel, setNivel] = useState('Iniciante ao Avançado');
  const [vagas, setVagas] = useState(12);
  const [badge, setBadge] = useState('Nova Turma');
  const [descricao, setDescricao] = useState('');
  const [icone, setIcone] = useState('💻');
  const [cor, setCor] = useState('from-blue-600 to-cyan-500');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (courseToEdit) {
        setNome(courseToEdit.nome);
        setCategoria(courseToEdit.categoria);
        setDuracao(courseToEdit.duracao);
        setNivel(courseToEdit.nivel);
        setVagas(courseToEdit.vagas);
        setBadge(courseToEdit.badge);
        setDescricao(courseToEdit.descricao);
        setIcone(courseToEdit.icone);
        setCor(courseToEdit.cor);
        setImageUrl(courseToEdit.imageUrl || '');
      } else {
        setNome('');
        setCategoria('Tecnologia & Idiomas');
        setDuracao('3 Meses');
        setNivel('Prático & Certificado');
        setVagas(12);
        setBadge('Aberto');
        setDescricao('');
        setIcone('🚀');
        setCor('from-blue-600 to-indigo-600');
        setImageUrl('');
      }
    }
  }, [isOpen, courseToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    const updatedCourse: CursoDestaque = {
      id: courseToEdit?.id || `curso-${Date.now()}`,
      nome: nome.trim(),
      categoria,
      duracao,
      nivel,
      vagas: Number(vagas) || 10,
      badge,
      descricao: descricao.trim(),
      icone: icone || '📚',
      cor: cor || 'from-blue-600 to-indigo-600',
      imageUrl: imageUrl.trim() || undefined,
    };

    onSave(updatedCourse);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">
                {courseToEdit ? 'Editar Curso em Destaque' : 'Adicionar Novo Curso à Página Inicial'}
              </h3>
              <p className="text-xs text-slate-400">Permissão Exclusiva: Lázaro Luis, Francisco Faztudo & Maria Victoria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Curso:</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: Robótica e Inteligência Artificial"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ícone / Emoji:</label>
              <input
                type="text"
                value={icone}
                onChange={(e) => setIcone(e.target.value)}
                placeholder="Ex: 🤖, 💻, 🇬🇧"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none text-center text-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoria:</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                placeholder="Ex: Tecnologia & Escritório"
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Selo / Badge:</label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="Ex: Alta Procura / Certificado"
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duração:</label>
              <input
                type="text"
                value={duracao}
                onChange={(e) => setDuracao(e.target.value)}
                placeholder="Ex: 3 Meses"
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nível:</label>
              <input
                type="text"
                value={nivel}
                onChange={(e) => setNivel(e.target.value)}
                placeholder="Ex: Iniciante ao Avançado"
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Vagas:</label>
              <input
                type="number"
                value={vagas}
                onChange={(e) => setVagas(Number(e.target.value))}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cor Gradiente do Cartão:</label>
            <select
              value={cor}
              onChange={(e) => setCor(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 bg-white"
            >
              <option value="from-blue-600 to-cyan-500">Azul & Ciano (Tecnologia)</option>
              <option value="from-blue-700 to-indigo-600">Azul Real & Índigo (Inglês)</option>
              <option value="from-rose-600 to-red-500">Rosa & Vermelho (Francês)</option>
              <option value="from-pink-600 to-rose-400">Rosa Pastel (Estética & Beleza)</option>
              <option value="from-amber-600 to-yellow-500">Âmbar & Dourado (Pastelaria)</option>
              <option value="from-purple-700 to-indigo-700">Roxo & Violeta (Gestão ERP)</option>
              <option value="from-emerald-600 to-teal-500">Verde Esmeralda (Finanças)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL / Caminho da Imagem de Capa:</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Ex: /images/course_informatica_1790165382220.jpg"
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Pode usar caminhos locais da galeria oficial ou URLs diretos seguros (https://...).
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Resumida:</label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Descreva o conteúdo do curso e objetivos de aprendizagem..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{courseToEdit ? 'Atualizar Curso' : 'Publicar Curso'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


// =========================================================================
// 3. EDIT / ADD FYP+C TEC SERVICE MODAL
// =========================================================================
interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit?: FypcService | null;
  initialData?: FypcService | null;
  onSave: (service: FypcService) => void;
}

export const EditServiceModal: React.FC<EditServiceModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit: directService,
  initialData,
  onSave,
}) => {
  const serviceToEdit = directService !== undefined ? directService : initialData;
  const [titulo, setTitulo] = useState('');
  const [idTag, setIdTag] = useState('SOLUÇÃO');
  const [resumo, setResumo] = useState('');
  const [detalhe, setDetalhe] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [tagsStr, setTagsStr] = useState('Tecnologia, Inovação, Cloud');
  const [featuresStr, setFeaturesStr] = useState('Garantia de Qualidade\nSuporte Contínuo\nArquitetura Escalável');

  useEffect(() => {
    if (isOpen) {
      if (serviceToEdit) {
        setTitulo(serviceToEdit.titulo);
        setIdTag(serviceToEdit.id);
        setResumo(serviceToEdit.resumo);
        setDetalhe(serviceToEdit.detalhe);
        setImageUrl(serviceToEdit.imageUrl);
        setTagsStr(serviceToEdit.tags.join(', '));
        setFeaturesStr(serviceToEdit.features.join('\n'));
      } else {
        setTitulo('');
        setIdTag('INOVAÇÃO');
        setResumo('');
        setDetalhe('');
        setImageUrl('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop');
        setTagsStr('Tecnologia, Inovação, Consultoria');
        setFeaturesStr('Arquitetura Segura\nEntrega Rápida\nMonitorização');
      }
    }
  }, [isOpen, serviceToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titulo.trim()) return;

    const tags = tagsStr
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const features = featuresStr
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const updatedService: FypcService = {
      id: (idTag || 'servico').toLowerCase().replace(/\s+/g, '-'),
      titulo: titulo.trim(),
      resumo: resumo.trim(),
      detalhe: detalhe.trim(),
      imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
      tags: tags.length ? tags : ['Tecnologia', 'FYP+C Tec'],
      features: features.length ? features : ['Padrão de Qualidade', 'Suporte Técnico'],
    };

    onSave(updatedService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base">
                {serviceToEdit ? 'Editar Especialidade FYP+C Tec' : 'Adicionar Novo Serviço à FYP+C Tec'}
              </h3>
              <p className="text-xs text-slate-400">Permissão Exclusiva: Lázaro Luis, Francisco Faztudo & Maria Victoria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título do Serviço:</label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Cibersegurança & Ethical Hacking"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Etiqueta / Tag ID:</label>
              <input
                type="text"
                value={idTag}
                onChange={(e) => setIdTag(e.target.value)}
                placeholder="Ex: CYBERSEC"
                className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none uppercase"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">URL da Fotografia de Alta Resolução:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="flex-1 text-xs sm:text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-500 font-medium">Sugestões rápidas:</span>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop')}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border"
              >
                Web & Mobile
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1200&auto=format&fit=crop')}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border"
              >
                Cloud & DevOps
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200&auto=format&fit=crop')}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border"
              >
                Inteligência Artificial
              </button>
              <button
                type="button"
                onClick={() => setImageUrl('https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1200&auto=format&fit=crop')}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border"
              >
                Segurança
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Resumo Curto (Apresentação):</label>
            <textarea
              value={resumo}
              onChange={(e) => setResumo(e.target.value)}
              rows={2}
              placeholder="Breve resumo da solução visível no cartão..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Detalhes Aprofundados (Expandir &quot;Saber Mais&quot;):</label>
            <textarea
              value={detalhe}
              onChange={(e) => setDetalhe(e.target.value)}
              rows={3}
              placeholder="Explicação técnica completa da entrega e escopo..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Tecnologias / Tags (separadas por vírgula):</label>
            <input
              type="text"
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="Ex: Next.js, Flutter, Docker, Kubernetes"
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Entregas e Garantias (uma por linha):</label>
            <textarea
              value={featuresStr}
              onChange={(e) => setFeaturesStr(e.target.value)}
              rows={3}
              placeholder="Ex: Design UI/UX Responsivo&#10;Código Documentado&#10;Garantia de 6 Meses"
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{serviceToEdit ? 'Salvar Alterações' : 'Publicar na FYP+C Tec'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


// =========================================================================
// 4. EDIT FYP+C TEC HERO MODAL
// =========================================================================
interface EditFypcTecHeroModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: FypcTecHeroContent;
  initialData?: FypcTecHeroContent;
  onSave: (updated: Partial<FypcTecHeroContent>) => void;
}

export const EditFypcTecHeroModal: React.FC<EditFypcTecHeroModalProps> = ({
  isOpen,
  onClose,
  content: directContent,
  initialData,
  onSave,
}) => {
  const content = directContent || initialData || {
    badgeText: '',
    title: '',
    description: '',
    sprintText: '',
    uptimeText: '',
    securityText: '',
    supportText: ''
  };
  const [badgeText, setBadgeText] = useState(content.badgeText);
  const [title, setTitle] = useState(content.title);
  const [description, setDescription] = useState(content.description);
  const [sprintText, setSprintText] = useState(content.sprintText);
  const [uptimeText, setUptimeText] = useState(content.uptimeText);
  const [securityText, setSecurityText] = useState(content.securityText);
  const [supportText, setSupportText] = useState(content.supportText);

  useEffect(() => {
    if (isOpen) {
      setBadgeText(content.badgeText);
      setTitle(content.title);
      setDescription(content.description);
      setSprintText(content.sprintText);
      setUptimeText(content.uptimeText);
      setSecurityText(content.securityText);
      setSupportText(content.supportText);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      badgeText,
      title,
      description,
      sprintText,
      uptimeText,
      securityText,
      supportText,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base">Editar Hero & Informações da FYP+C Tec</h3>
              <p className="text-xs text-slate-400">Permissão Exclusiva: Lázaro Luis, Francisco Faztudo & Maria Victoria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Badge de Topo:</label>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título Principal:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Descrição Geral:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destaque 1 (Entrega):</label>
              <input
                type="text"
                value={sprintText}
                onChange={(e) => setSprintText(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destaque 2 (Uptime):</label>
              <input
                type="text"
                value={uptimeText}
                onChange={(e) => setUptimeText(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destaque 3 (Segurança):</label>
              <input
                type="text"
                value={securityText}
                onChange={(e) => setSecurityText(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destaque 4 (Suporte):</label>
              <input
                type="text"
                value={supportText}
                onChange={(e) => setSupportText(e.target.value)}
                className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
                required
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Alterações</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


// =========================================================================
// 5. EDIT MISSION, VISION & VALUES MODAL
// =========================================================================
interface EditMissionValuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  content?: HomeContent;
  initialData?: HomeContent;
  onSave: (updated: Partial<HomeContent>) => void;
}

export const EditMissionValuesModal: React.FC<EditMissionValuesModalProps> = ({
  isOpen,
  onClose,
  content: directContent,
  initialData,
  onSave,
}) => {
  const content = directContent || initialData || {
    heroTitle: '',
    heroHighlight: '',
    heroDescription: '',
    heroSlogan: '',
    missionTitle: '',
    missionText: '',
    valuesTitle: '',
    valuesList: []
  };
  const [missionTitle, setMissionTitle] = useState(content.missionTitle);
  const [missionText, setMissionText] = useState(content.missionText);
  const [valuesTitle, setValuesTitle] = useState(content.valuesTitle);
  const [values, setValues] = useState<{ title: string; desc: string }[]>(content.valuesList);

  useEffect(() => {
    if (isOpen) {
      setMissionTitle(content.missionTitle);
      setMissionText(content.missionText);
      setValuesTitle(content.valuesTitle);
      setValues([...(content.valuesList || [])]);
    }
  }, [isOpen, content]);

  if (!isOpen) return null;

  const handleValueChange = (index: number, field: 'title' | 'desc', val: string) => {
    const updated = [...values];
    updated[index][field] = val;
    setValues(updated);
  };

  const handleAddValue = () => {
    setValues([...values, { title: 'Novo Valor:', desc: 'Descrição do valor institucional.' }]);
  };

  const handleRemoveValue = (index: number) => {
    setValues(values.filter((_, idx) => idx !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      missionTitle,
      missionText,
      valuesTitle,
      valuesList: values,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base">Editar Missão & Valores Institucionais</h3>
              <p className="text-xs text-slate-400">Permissão Exclusiva: Lázaro Luis, Francisco Faztudo & Maria Victoria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Título da Missão:</label>
            <input
              type="text"
              value={missionTitle}
              onChange={(e) => setMissionTitle(e.target.value)}
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Texto da Missão:</label>
            <textarea
              value={missionText}
              onChange={(e) => setMissionText(e.target.value)}
              rows={3}
              className="w-full text-sm p-3 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase">Valores Fundamentais:</label>
              <button
                type="button"
                onClick={handleAddValue}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Valor</span>
              </button>
            </div>

            <div className="space-y-3">
              {values.map((val, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2 relative">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => handleValueChange(idx, 'title', e.target.value)}
                      placeholder="Título do Valor"
                      className="w-1/2 text-xs font-bold p-2 rounded-lg border border-slate-300"
                      required
                    />
                    {values.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    value={val.desc}
                    onChange={(e) => handleValueChange(idx, 'desc', e.target.value)}
                    rows={2}
                    placeholder="Descrição do valor..."
                    className="w-full text-xs p-2 rounded-lg border border-slate-300"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Alterações</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};


// =========================================================================
// 6. EDIT TESTIMONIAL MODAL
// =========================================================================
interface EditTestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonialToEdit?: TestimonialItem | null;
  initialData?: TestimonialItem | null;
  index?: number | null;
  onSave: (testimonial: TestimonialItem, index?: number | null) => void;
}

export const EditTestimonialModal: React.FC<EditTestimonialModalProps> = ({
  isOpen,
  onClose,
  testimonialToEdit: directTestimonial,
  initialData,
  index,
  onSave,
}) => {
  const testimonialToEdit = directTestimonial !== undefined ? directTestimonial : initialData;
  const [quote, setQuote] = useState('');
  const [autor, setAutor] = useState('');
  const [cargo, setCargo] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (testimonialToEdit) {
        setQuote(testimonialToEdit.quote);
        setAutor(testimonialToEdit.autor);
        setCargo(testimonialToEdit.cargo);
      } else {
        setQuote('');
        setAutor('');
        setCargo('Aluno / Parceiro');
      }
    }
  }, [isOpen, testimonialToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quote.trim() || !autor.trim()) return;

    onSave({
      quote: quote.trim(),
      autor: autor.trim(),
      cargo: cargo.trim(),
    }, index);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="font-bold text-base">
                {testimonialToEdit ? 'Editar Testemunho' : 'Adicionar Novo Testemunho'}
              </h3>
              <p className="text-xs text-slate-400">Permissão Exclusiva: Lázaro Luis, Francisco Faztudo & Maria Victoria</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Depoimento / Testemunho:</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              rows={3}
              placeholder="Descreva a experiência do formando ou parceiro..."
              className="w-full text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nome do Autor:</label>
            <input
              type="text"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              placeholder="Ex: Manuel António"
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Cargo / Curso:</label>
            <input
              type="text"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              placeholder="Ex: Formando em Informática"
              className="w-full text-sm p-2.5 rounded-xl border border-slate-300"
              required
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export { EditServiceModal as EditFypcServiceModal };

