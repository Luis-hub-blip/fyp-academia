'use client';

import React, { useState } from 'react';
import { FypcService, FypcTecHeroContent } from '../types';
import { 
  Cpu, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  ShieldCheck, 
  Zap, 
  Code2, 
  Terminal, 
  Send,
  Edit3,
  Plus,
  Trash2
} from 'lucide-react';

interface FypcTecSectionProps {
  onOpenServiceModal: (serviceTitle?: string) => void;
  services: FypcService[];
  heroContent: FypcTecHeroContent;
  isEditMode?: boolean;
  canEditSite?: boolean;
  onOpenEditHero?: () => void;
  onOpenAddService?: () => void;
  onOpenEditService?: (service: FypcService) => void;
  onDeleteService?: (id: string) => void;
}

export const FypcTecSection: React.FC<FypcTecSectionProps> = ({ 
  onOpenServiceModal,
  services,
  heroContent,
  isEditMode = false,
  canEditSite = false,
  onOpenEditHero,
  onOpenAddService,
  onOpenEditService,
  onDeleteService,
}) => {
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* ================= HIGH-TECH HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Edit Hero trigger button */}
        {isEditMode && canEditSite && onOpenEditHero && (
          <div className="max-w-5xl mx-auto flex justify-end mb-3">
            <button
              onClick={onOpenEditHero}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-transform hover:scale-105"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Hero & Destaques Tec</span>
            </button>
          </div>
        )}

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span>{heroContent.badgeText}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            {heroContent.title.includes('+') ? (
              <>
                {heroContent.title.split('+')[0]}<span className="text-cyan-400">+</span>{heroContent.title.split('+')[1]}
              </>
            ) : (
              heroContent.title
            )}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            {heroContent.description}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenServiceModal()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-semibold text-sm sm:text-base shadow-xl shadow-blue-900/40 hover:shadow-blue-700/60 transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4 text-cyan-300" />
              <span>Solicitar Consultoria ou Serviços</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 text-left">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Entrega Ágil</div>
              <div className="text-sm font-bold text-white mt-0.5">{heroContent.sprintText}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Disponibilidade</div>
              <div className="text-sm font-bold text-white mt-0.5">{heroContent.uptimeText}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Segurança</div>
              <div className="text-sm font-bold text-white mt-0.5">{heroContent.securityText}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-xs text-slate-400">Suporte Local</div>
              <div className="text-sm font-bold text-white mt-0.5">{heroContent.supportText}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SERVICES GRID WITH REAL HIGH-RES PHOTOGRAPHY ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Portfólio de Engenharia & Serviços ({services.length})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Especialidades Tecnológicas FYP+C
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              Cada área combina metodologia moderna de desenvolvimento com fotografia real da nossa equipa e ambientes operacionais.
            </p>
          </div>

          {/* Add Service button for authorized editors */}
          {isEditMode && canEditSite && onOpenAddService && (
            <button
              onClick={onOpenAddService}
              className="px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Adicionar Novo Serviço FYP+C Tec</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((servico) => {
            const isExpanded = expandedCardId === servico.id;

            return (
              <div
                key={servico.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 relative"
              >
                <div>
                  {/* REAL PHOTOGRAPH */}
                  <div className="relative h-52 w-full overflow-hidden bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={servico.imageUrl}
                      alt={servico.titulo}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                    
                    {/* Tech Category Tag */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-slate-900/90 text-cyan-300 border border-slate-700 backdrop-blur-md">
                        {servico.id.toUpperCase()}
                      </span>
                    </div>

                    {/* Edit mode controls overlay */}
                    {isEditMode && canEditSite && (
                      <div className="absolute top-3 right-3 flex items-center gap-1.5">
                        {onOpenEditService && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenEditService(servico);
                            }}
                            className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 shadow-md transition-all hover:scale-110"
                            title="Editar este serviço"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteService && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Pretende remover o serviço "${servico.titulo}"?`)) {
                                onDeleteService(servico.id);
                              }
                            }}
                            className="p-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 shadow-md transition-all hover:scale-110"
                            title="Remover serviço"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-lg font-bold text-white drop-shadow-md">
                        {servico.titulo}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {servico.resumo}
                    </p>

                    {/* Tag Pills */}
                    <div className="flex flex-wrap gap-1.5">
                      {servico.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Expandable "Saber mais" Details */}
                    {isExpanded && (
                      <div className="pt-3 border-t border-slate-100 space-y-3 animate-fadeIn text-xs text-slate-600">
                        <p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                          {servico.detalhe}
                        </p>

                        <div className="space-y-1.5 pt-1">
                          <p className="font-semibold text-slate-800 text-[11px] uppercase tracking-wider">
                            Entregas e Garantias:
                          </p>
                          {servico.features.map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-2 text-slate-700">
                              <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleExpand(servico.id)}
                    className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-1 py-1.5 px-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <span>{isExpanded ? 'Menos detalhes' : 'Saber mais'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => onOpenServiceModal(servico.titulo)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>Solicitar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

      </section>

      {/* ================= METHODOLOGY & SECURITY BANNER ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 border border-slate-800 relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 bg-tech-dots opacity-20 pointer-events-none"></div>

          <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Padrão de Qualidade Corporativa
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Engenharia Tecnológica com Rigor e Segurança
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Todas as nossas soluções são desenvolvidas seguindo padrões internacionais de arquitetura de software, proteção de dados e monitorização contínua. Seja um website institucional ou um sistema ERP complexo, garantimos código limpo, documentado e de fácil evolução.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Auditorias de Segurança</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Code2 className="w-4 h-4 text-cyan-400" />
                  <span>Código TypeScript & React/Next</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>Infraestrutura em Nuvem Gerenciada</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 text-center lg:text-right">
              <button
                onClick={() => onOpenServiceModal()}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
              >
                Pedir Proposta para o Seu Negócio
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
