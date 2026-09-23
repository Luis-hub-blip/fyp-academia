'use client';

import React from 'react';
import { Phone, Mail, MapPin, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'inicio' | 'fypc-tec' | 'meu-perfil' | 'login') => void;
  onOpenRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenRegister }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs sm:text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-900 to-indigo-950 p-1 border border-blue-500/30 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logo.png" alt="FYP+C Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                FYP<span className="text-amber-400">+</span>C
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Academia de Línguas e Centro de Computação Aplicada. Formação de competências práticas com certificação de excelência.
            </p>
            <div className="text-[11px] text-cyan-400 italic">
              &ldquo;Take a step on us and we&apos;ll make the whole journey together.&rdquo;
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Navegação Rápida</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Página Inicial & Novidades
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('fypc-tec')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  FYP+C Tec — Serviços Digitais
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRegister}
                  className="hover:text-cyan-400 transition-colors text-amber-300 font-semibold"
                >
                  Dar o Primeiro Passo (Matrícula)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('meu-perfil')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Portal do Aluno & EduSystem ERP
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('login')}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Acesso Restrito ao Sistema (Login)
                </button>
              </li>
            </ul>
          </div>

          {/* Cursos */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Formações Ativas</h4>
            <ul className="space-y-2 text-xs">
              <li className="text-slate-300">Informática na Ótica do Utilizador</li>
              <li className="text-slate-300">Língua Inglesa (Níveis A1 ao C2)</li>
              <li className="text-slate-300">Língua Francesa (Níveis A1 ao B2)</li>
              <li className="text-slate-300">Estética & Cabeleireiro Profissional</li>
              <li className="text-slate-300">Gastronomia & Pastelaria Fina</li>
            </ul>
          </div>

          {/* Location & Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Contactos & Localização</h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Golf 2, Luanda — República de Angola</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>+244 923 000 000 / 924 111 222</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>contacto@fypacademia.com</span>
              </div>
            </div>

            {/* Community Project Partner */}
            <div className="mt-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Parceria Comunitária: <strong>Urânios · Golf 2 em Movimento</strong></span>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} FYP+C Academia & Tecnologia. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Desenvolvido com padrão Next.js e inovação tecnológica</span>
            <Heart className="w-3 h-3 text-red-500 inline ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
};
