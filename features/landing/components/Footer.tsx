'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';
import Logo from './Logo';
import { trackEvent } from "@/lib/analytics";

const footerSections = [
  {
    title: 'Plataforma',
    links: [
      { name: 'Funcionalidades', href: '#features' },
      { name: 'Preços', href: '#pricing' },
      //{ name: 'Integrações', href: '#' },
      //{ name: 'API', href: '#' },
    ],
  },
  /*{
    title: 'Recursos',
    links: [
      { name: 'Blog', href: '#' },
      { name: 'Guias', href: '#' },
      { name: 'Webinars', href: '#' },
      { name: 'Case Studies', href: '#' },
    ],
  },
  {
    title: 'Empresa',
    links: [
      { name: 'Sobre nós', href: '#' },
      { name: 'Carreiras', href: '#' },
      { name: 'Imprensa', href: '#' },
      { name: 'Parceiros', href: '#' },
    ],
  },*/
  {
    title: 'Suporte',
    links: [
      { name: 'Central de Ajuda', href: '#' },
      //{ name: 'Contato', href: '#contact' },
      //{ name: 'Status', href: '#' },
      //{ name: 'Treinamentos', href: '#' },
    ],
  },
];

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: 'https://www.linkedin.com/company/hokocompany' },
  { name: 'Instagram', icon: Instagram, href: 'https://www.instagram.com/hokoainalytics' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    trackEvent("section_nav_click", {
      location: "footer",
      target_section: href,
    });

    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer id="contact" className="bg-slate-950 text-white border-t border-border">
      <div className="container-custom">
        {/* Main footer content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Company info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <div className="mb-6">
                <Logo />
              </div>
              {/*<p className="text-slate-300 mb-8 leading-relaxed">
                Uma ferramenta de inteligência de marca e comunicação que conecta performance, percepção e valor para decisões mais rápidas, embasadas e estratégicas.
              </p>*/}

              {/* Contact info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-hoko-primary/30 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-hoko-primary" />
                  </div>
                  <span className="text-slate-300">marketing@hokocomunicacao.com.br</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-hoko-primary/30 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-hoko-primary" />
                  </div>
                  <span className="text-slate-300">+55 19 99714-8221</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-hoko-primary/30 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-hoko-primary" />
                  </div>
                  <span className="text-slate-300">Campinas, SP - Brasil</span>
                </div>
              </div>
            </motion.div>

            {/* Links sections */}
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h3 className="font-semibold text-white mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-slate-300 hover:text-hoko-primary transition-colors duration-300 focus-ring rounded"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom section */}
        <div className="py-8 border-t border-slate-800/50">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-slate-400"
            >
              <span>&copy; 2025 ho.ko AI.nalytics. Todos os direitos reservados.</span>
              <div className="flex space-x-6">
                <button
                  className="hover:text-white transition-colors focus-ring rounded"
                  onClick={() => {
                    trackEvent("legal_click", {
                      location: "footer",
                      label: "Termos de Uso",
                      destination: "/legal/termos",
                    });

                    window.location.href = "/legal/termos";
                  }}
                >
                  Termos de Uso
                </button>
                <button
                  className="hover:text-white transition-colors focus-ring rounded"
                  onClick={() => {
                    trackEvent("legal_click", {
                      location: "footer",
                      label: "Política de Privacidade",
                      destination: "/legal/privacidade",
                    });

                    window.location.href = "/legal/privacidade";
                  }}
                >
                  Política de Privacidade
                </button>
              </div>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="flex space-x-4"
            >
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-slate-800/50 hover:bg-hoko-primary rounded-lg flex items-center justify-center transition-all duration-300 magnetic focus-ring"
                    aria-label={social.name}
                    onClick={() => {
                      trackEvent("social_click", {
                        platform: social.name,
                        location: "footer",
                      });
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Quick navigation 
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="pb-8"
        >
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-4">Navegação rápida:</p>
            <div className="flex flex-wrap justify-center gap-4">
              {['#features', '#pricing', '#social-proof', '#comparison'].map((href) => (
                <button
                  key={href}
                  onClick={() => scrollToSection(href)}
                  className="text-sm text-slate-300 hover:text-hoko-primary transition-colors focus-ring rounded px-2 py-1"
                >
                  {href.replace('#', '').replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </motion.div>*/}
      </div>
    </footer>
  );
}