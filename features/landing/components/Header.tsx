'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Button } from '@/features/landing/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/features/landing/ui/dialog';
import { Menu, X } from 'lucide-react';
import DemoForm from './DemoForm';
import Logo from './Logo';
import { trackEvent } from "@/lib/analytics";

const navigation = [
  { name: 'Dashboard', href: '#dashboard' },
  { name: 'Funcionalidades', href: '#features' },
  { name: 'Preços', href: '#pricing' },
  //{ name: 'Prova Social', href: '#social-proof' },
  { name: 'Comparativo', href: '#comparison' },
  { name: 'Contato', href: '#contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const handleScroll = () => {
      const sections = navigation.map(item => item.href.slice(1));
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function checkAuthStatus() {
      try {
        const res = await fetch("/api/auth-status", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          if (mounted) setIsLoggedIn(false);
          return;
        }

        const data = await res.json();

        const logged =
          Boolean(data?.success && data?.user) ||
          Boolean(data?.authenticated) ||
          Boolean(data?.user);

        if (mounted) setIsLoggedIn(logged);
      } catch {
        if (mounted) setIsLoggedIn(false);
      }
    }

    checkAuthStatus();

    return () => {
      mounted = false;
    };
  }, []);

  const scrollToSection = (href: string) => {
    trackEvent("section_nav_click", {
      location: "header",
      target_section: href,
    });

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Progress Bar */}
      <motion.div
        className="progress-bar"
        style={{ scaleX }}
      />

      <header className="fixed top-0 w-full z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm font-medium transition-colors hover:text-primary focus-ring rounded-md px-2 py-1 ${activeSection === item.href.slice(1)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                    }`}
                >
                  {item.name}
                </button>
              ))}
            </nav>

            {/* CTAs */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => {
                  trackEvent("login_click", {
                    location: "header_desktop",
                    label: isLoggedIn ? "Acessar" : "Login",
                    destination: isLoggedIn ? "/inicio" : "/login",
                  });

                  window.location.href = isLoggedIn ? "/inicio" : "/login";
                }}
              >
                {isLoggedIn ? 'Acessar' : 'Login'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="magnetic gradient-brand text-white border-0"
                    onClick={() => {
                      trackEvent("demo_modal_open", {
                        location: "header_desktop",
                        label: "Solicite uma demonstração",
                      });
                    }}
                  >
                    Solicite uma demonstração
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DemoForm />
                </DialogContent>
              </Dialog>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus-ring"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Abrir menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <motion.div
            initial={false}
            animate={{ height: isOpen ? 'auto' : 0 }}
            className="md:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className={`block px-3 py-2 text-base font-medium transition-colors w-full text-left focus-ring rounded-md ${activeSection === item.href.slice(1)
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary'
                    }`}
                >
                  {item.name}
                </button>
              ))}
              <div className="pt-4 space-y-2">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => {
                    trackEvent("login_click", {
                      location: "header_mobile",
                      label: isLoggedIn ? "Acessar" : "Login",
                      destination: isLoggedIn ? "/inicio" : "/login",
                    });

                    window.location.href = isLoggedIn ? "/inicio" : "/login";
                  }}
                >
                  {isLoggedIn ? 'Acessar' : 'Login'}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full gradient-brand text-white border-0"
                      onClick={() => {
                        trackEvent("demo_modal_open", {
                          location: "header_mobile",
                          label: "Solicite uma demonstração",
                        });
                      }}
                    >
                      Solicite uma demonstração
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DemoForm />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>
        </div>
      </header>
    </>
  );
}
