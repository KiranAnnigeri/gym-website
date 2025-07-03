"use client";

import React, { useEffect, useRef, useState, useCallback, useLayoutEffect } from "react";


export default function Home() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    about: false,
    services: false,
    transformation: false,
    contact: false,
  });
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsAppAnim, setWhatsAppAnim] = useState(false);
  const whatsappBtnRef = useRef<HTMLButtonElement>(null);
  const [waBtnPos, setWaBtnPos] = useState<{right: number, bottom: number}>({right: 24, bottom: 24});

  const openWhatsApp = () => {
    if (whatsappBtnRef.current) {
      const rect = whatsappBtnRef.current.getBoundingClientRect();
      setWaBtnPos({
        right: window.innerWidth - rect.right,
        bottom: window.innerHeight - rect.bottom
      });
    }
    setShowWhatsApp(true);
    setTimeout(() => setWhatsAppAnim(true), 10);
  };

  const closeWhatsApp = () => {
    setWhatsAppAnim(false);
    setTimeout(() => setShowWhatsApp(false), 300);
  };
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    phone: "",
    goals: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const transformationRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const horizontalSectionRef = useRef<HTMLDivElement>(null);
  const [isHorizontalActive, setIsHorizontalActive] = useState(false);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);
  const horizontalWrapperRef = useRef<HTMLDivElement>(null);
  const [horizontalScrollWidth, setHorizontalScrollWidth] = useState(0);

  useEffect(() => {
    setHasMounted(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-section');
            if (id) {
              setIsVisible(prev => ({ ...prev, [id]: true }));
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const refs = [heroRef, aboutRef, servicesRef, transformationRef, contactRef];
    refs.forEach(ref => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      closeWhatsApp();
      setShowSuccess(false);
      setFormData({ name: '', age: '', phone: '', goals: '' });
    }, 3002);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Calculate the width of the horizontal scroll area
  useLayoutEffect(() => {
    const scroller = horizontalScrollRef.current;
    if (scroller) {
      setHorizontalScrollWidth(scroller.scrollWidth);
    }
  }, [isVisible.services]);

  // Robust horizontal scroll hijack for Next-Gen Training
  useLayoutEffect(() => {
    const wrapper = horizontalWrapperRef.current;
    const scroller = horizontalScrollRef.current;
    if (!wrapper || !scroller) return;

    // Calculate the scrollable distance
    const scrollDistance = scroller.scrollWidth - window.innerWidth;
    const wrapperTop = wrapper.offsetTop;
    const wrapperHeight = scrollDistance + window.innerHeight;
    wrapper.style.height = `${wrapperHeight}px`;

    function onScroll() {
      const scrollY = window.scrollY;
      // Clamp scroll position to the horizontal scroll range
      const start = wrapperTop;
      const end = wrapperTop + scrollDistance;
      if (!scroller) return;
      if (scrollY >= start && scrollY <= end) {
        // Pin the section and map vertical scroll to horizontal
        if (scroller?.style.position !== 'fixed') {
          scroller?.style && (scroller.style.position = 'fixed');
          scroller?.style && (scroller.style.top = '0px');
          scroller?.style && (scroller.style.left = '0px');
          scroller?.style && (scroller.style.width = '100vw');
          scroller?.style && (scroller.style.height = '100vh');
        }
        const horizontalScroll = scrollY - start;
        if (scroller) scroller.scrollLeft = horizontalScroll;
      } else {
        // Unpin the section
        scroller?.style && (scroller.style.position = '');
        scroller?.style && (scroller.style.top = '');
        scroller?.style && (scroller.style.left = '');
        scroller?.style && (scroller.style.width = '');
        scroller?.style && (scroller.style.height = '');
        if (scrollY < start) {
          if (scroller) scroller.scrollLeft = 0;
        } else if (scrollY > end) {
          if (scroller) scroller.scrollLeft = scrollDistance;
        }
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    // Initial call
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [horizontalScrollWidth]);

  // Activate horizontal scroll when section enters viewport
  useEffect(() => {
    const section = horizontalSectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      if (
        rect.top <= window.innerHeight * 0.2 &&
        rect.bottom > window.innerHeight * 0.5 &&
        !isHorizontalActive
      ) {
        setIsHorizontalActive(true);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHorizontalActive]);

  return (
    <>
      <div className="bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/80 backdrop-blur-md z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              FITPRO
            </div>
            <div className="hidden md:flex space-x-8">
              {[ 
                { name: 'About', id: 'about' },
                { name: 'Services', id: 'services' },
                { name: 'Results', id: 'results' },
                { name: 'Contact', id: 'contact' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => smoothScrollTo(item.id)}
                  className="text-gray-300 hover:text-white transition-colors duration-300 whitespace-nowrap cursor-pointer hover:scale-105 transform"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        ref={heroRef}
        data-section="hero"
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
            linear-gradient(135deg, #000000 0%, #0c0c0c 100%)
          `,
          transform: hasMounted ? `translateY(${scrollY * 0.5}px)` : undefined,
          transition: hasMounted ? 'transform 0.1s ease-out' : undefined
        }}
      >
        {/* 3D Floating Elements */}
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => {
            const staticLeft = `${20 + (i * 12)}%`;
            const staticTop = `${30 + (i % 3) * 20}%`;
            let style: React.CSSProperties = { left: staticLeft, top: staticTop };
            if (hasMounted) {
              style.transform = `translateY(${Math.sin(scrollY * 0.01 + i) * 30}px) scale(${1.1 + Math.sin(scrollY * 0.01 + i) * 0.1}) rotateX(${scrollY * 0.1 + i * 45}deg) rotateY(${scrollY * 0.05 + i * 30}deg)`;
              style.animationDelay = `${i * 0.5}s`;
              style.transition = 'transform 0.2s cubic-bezier(0.4,0,0.2,1)';
            }
            return (
              <div key={i} className="absolute animate-float" style={style}>
                <div className={`w-4 h-4 bg-gradient-to-r ${i % 2 === 0 ? 'from-blue-400 to-cyan-300' : 'from-purple-400 to-pink-300'} rounded-full shadow-2xl opacity-80 blur-[1px]`}></div>
              </div>
            );
          })}
        </div>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
                conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(59, 130, 246, 0.05) 90deg, transparent 180deg, rgba(147, 51, 234, 0.05) 270deg, transparent 360deg)
              `,
              transform: hasMounted ? `rotate(${scrollY * 0.1}deg) scale(${1 + scrollY * 0.0001})` : undefined
            }}
          ></div>
        </div>
          <div className={`relative z-10 text-center max-w-4xl mx-auto px-6 transition-all duration-1000 ${isVisible.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h1 
            className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent"
            style={{
              transform: hasMounted ? `perspective(1000px) rotateX(${scrollY * 0.05}deg) translateZ(${scrollY * 0.1}px)` : undefined,
              textShadow: '0 0 30px rgba(59, 130, 246, 0.3)'
            }}
          >
            TRANSFORM
          </h1>
          <h2 
            className="text-2xl md:text-4xl mb-8 text-gray-300 font-light"
            style={{
              transform: hasMounted ? `translateY(${scrollY * 0.02}px) translateZ(${scrollY * 0.05}px)` : undefined,
              transition: hasMounted ? 'transform 0.1s ease-out' : undefined
            }}
          >
            Your Body. Your Mind. Your Life.
          </h2>
          <p 
            className="text-xl md:text-2xl mb-12 text-gray-400 max-w-2xl mx-auto"
            style={{
              transform: hasMounted ? `translateY(${scrollY * -0.02}px)` : undefined,
              transition: hasMounted ? 'transform 0.1s ease-out' : undefined
            }}
          >
            Experience the future of personal training with cutting-edge technology and proven results
          </p>
          <button
            onClick={() => smoothScrollTo('about')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 px-12 py-4 text-xl font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 whitespace-nowrap cursor-pointer"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        data-section="about"
        id="about"
          className={`py-32 relative overflow-visible transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{
          background: `
            radial-gradient(circle at 80% 20%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            linear-gradient(180deg, #000000 0%, #111111 50%, #0a0a0a 100%)
          `
        }}
      >
        {/* 3D Background Elements */}
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={hasMounted ? {
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`,
                transform: `perspective(1000px) rotateX(${45 + scrollY * 0.02 + i * 15}deg) rotateY(${scrollY * 0.03 + i * 20}deg) translateZ(${Math.sin(scrollY * 0.01 + i) * 60}px) scale(${1.05 + Math.sin(scrollY * 0.01 + i) * 0.08})`,
                animationDelay: `${i * 0.7}s`,
                transition: 'transform 0.2s cubic-bezier(0.4,0,0.2,1)'
              } : {
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i % 2) * 40}%`
              }}
            >
              <div className={`w-24 h-24 border border-emerald-400/20 rounded-lg transform rotate-45 ${i % 2 === 0 ? 'bg-gradient-to-br from-emerald-500/10 to-transparent' : 'bg-gradient-to-br from-blue-500/10 to-transparent'} blur-[2px]`}></div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className={`grid md:grid-cols-2 gap-16 items-center transition-all duration-1000 ${isVisible.about ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div>
              <h2 
                className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent"
                style={{
                  transform: `perspective(800px) rotateY(${scrollY * 0.02}deg)`,
                  transition: 'transform 0.1s ease-out'
                }}
              >
                Meet Your Future
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                I'm not just a personal trainer - I'm your transformation architect. Using advanced biometric tracking, 
                AI-powered workout optimization, and cutting-edge recovery protocols, I deliver results that seemed impossible.
              </p>
              <div className="space-y-6">
                {[ 
                  { label: 'Clients Transformed', value: '500+' },
                  { label: 'Success Rate', value: '98%' },
                  { label: 'Years Experience', value: '12+' }
                ].map((stat, index) => (
                  <div 
                    key={index} 
                    className="flex items-center space-x-4 transform hover:scale-105 transition-transform duration-300"
                    style={{
                      transform: `translateX(${Math.sin(scrollY * 0.01 + index) * 5}px)`,
                      transition: 'transform 0.1s ease-out'
                    }}
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    <span className="text-gray-400">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div 
              className="relative"
              style={{
                transform: `perspective(1000px) rotateY(${scrollY * -0.01}deg) translateZ(${scrollY * 0.05}px)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <img
                src="https://readdy.ai/api/search-image?query=professional%20personal%20trainer%20in%20futuristic%20gym%20setting%2C%20athletic%20build%2C%20confident%20pose%2C%20modern%20fitness%20environment%20with%20blue%20neon%20lighting%2C%20high-tech%20equipment%20in%20background%2C%20professional%20portrait%20style&width=600&height=800&seq=trainer-portrait&orientation=portrait"
                alt="Personal Trainer"
                className="w-full h-96 object-cover object-top rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section with Horizontal Scroll */}
        <div
          ref={horizontalWrapperRef}
          style={{
            position: 'relative',
            height: horizontalScrollWidth && typeof window !== 'undefined' && window.innerWidth && window.innerHeight
              ? `${horizontalScrollWidth - window.innerWidth + window.innerHeight}px`
              : '120vh', // fallback for SSR or undefined
            zIndex: 2,
          }}
        >
      <section
        ref={servicesRef}
        data-section="services"
        id="services"
            className={`sticky top-0 h-screen w-full flex items-center bg-gradient-to-br from-[#111] to-[#1a1a1a] transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{
              overflow: 'hidden',
              zIndex: 2,
            }}
          >
            <div className="max-w-7xl mx-auto px-6 w-full">
              <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.services ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}> 
            <h2 
                  className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent drop-shadow-lg"
              style={{
                transform: `perspective(1000px) rotateX(${scrollY * 0.01}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              Next-Gen Training
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Revolutionary approaches that merge technology with proven training methodologies
            </p>
          </div>
              <div
                ref={horizontalScrollRef}
                className="flex space-x-8 min-w-max no-scrollbar snap-x snap-mandatory"
                style={{
                  overflowX: 'auto',
                  scrollBehavior: 'smooth',
                  WebkitOverflowScrolling: 'touch',
                  height: '400px',
                  alignItems: 'center',
                }}
                tabIndex={0}
              >
              {[ 
                {
                  title: 'AI-Powered Programs',
                  description: 'Machine learning algorithms create personalized workouts that adapt in real-time to your progress',
                  icon: 'ri-robot-2-line',
                    image: 'https://readdy.ai/api/search-image?query=futuristic%20AI%20robot%20trainer%2C%20holographic%20interface%2C%20blue%20digital%20elements%2C%20high-tech%20workout%20analysis&width=400&height=400&seq=ai-robot&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20robot%20personal%20trainer%2C%20futuristic%20gym%2C%20blue%20neon%20lighting%2C%20full%20body%2C%20standing%20pose&width=200&height=300&seq=ai-robot-char&orientation=portrait'
                },
                {
                  title: 'Biometric Optimization',
                  description: 'Advanced sensors monitor your vital signs to maximize performance and prevent overtraining',
                  icon: 'ri-heart-pulse-line',
                    image: 'https://readdy.ai/api/search-image?query=biometric%20wearable%20fitness%20technology%2C%20heart%20rate%20sensors%2C%20modern%20health%20tracking%20equipment&width=400&height=400&seq=biometric&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20character%20wearing%20biometric%20fitness%20band%2C%20futuristic%20gym%2C%20full%20body&width=200&height=300&seq=biometric-char&orientation=portrait'
                },
                {
                  title: 'Virtual Reality Training',
                  description: 'Immersive workout experiences that make training engaging and challenge your limits',
                  icon: 'ri-virtual-reality-line',
                    image: 'https://readdy.ai/api/search-image?query=virtual%20reality%20fitness%20training%2C%20person%20wearing%20VR%20headset%20in%20modern%20gym&width=400&height=400&seq=vr-training&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20character%20with%20VR%20headset%2C%20futuristic%20gym%2C%20full%20body&width=200&height=300&seq=vr-char&orientation=portrait'
                },
                {
                  title: 'Holographic Coaching',
                  description: 'Real-time 3D holographic trainers provide instant form correction and motivation',
                  icon: 'ri-focus-3-line',
                    image: 'https://readdy.ai/api/search-image?query=holographic%20fitness%20coach%20projection%2C%203D%20trainer%20hologram%20in%20modern%20gym&width=400&height=400&seq=holographic&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20hologram%20coach%20character%2C%20futuristic%20gym%2C%20full%20body&width=200&height=300&seq=holo-char&orientation=portrait'
                },
                {
                  title: 'Neural Enhancement',
                  description: 'Brain-training protocols optimize mind-muscle connection and mental performance',
                  icon: 'ri-brain-line',
                    image: 'https://readdy.ai/api/search-image?query=neural%20enhancement%20fitness%20technology%2C%20brain%20monitoring%20headset%2C%20futuristic%20mental%20training%20device&width=400&height=400&seq=neural&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20character%20with%20neural%20headset%2C%20futuristic%20gym%2C%20full%20body&width=200&height=300&seq=neural-char&orientation=portrait'
                },
                {
                  title: 'Smart Recovery',
                  description: 'AI-driven recovery protocols using cryotherapy, compression, and sleep optimization',
                  icon: 'ri-refresh-line',
                    image: 'https://readdy.ai/api/search-image?query=futuristic%20recovery%20chamber%2C%20cryotherapy%20pod%2C%20smart%20recovery%20technology&width=400&height=400&seq=recovery&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20character%20in%20recovery%20pod%2C%20futuristic%20gym%2C%20full%20body&width=200&height=300&seq=recovery-char&orientation=portrait'
                },
                {
                  title: 'Genetic Optimization',
                  description: 'DNA analysis creates training programs tailored to your unique genetic makeup',
                  icon: 'ri-dna-line',
                    image: 'https://readdy.ai/api/search-image?query=genetic%20analysis%20for%20fitness%2C%20DNA%20helix%20visualization%2C%20scientific%20fitness%20testing&width=400&height=400&seq=genetic&orientation=square',
                    character: 'https://readdy.ai/api/search-image?query=3d%20character%20with%20DNA%20helix%2C%20futuristic%20gym%2C%20full%20body&width=200&height=300&seq=genetic-char&orientation=portrait'
                }
              ].map((service, index) => (
                <div
                  key={index}
                    className={`relative bg-white/10 backdrop-blur-lg border border-purple-400/30 shadow-2xl rounded-3xl p-8 min-w-[350px] flex-shrink-0 flex flex-col items-center group transition-all duration-700 hover:scale-105 hover:shadow-purple-500/40 hover:border-purple-400/60 snap-center ${isVisible.services ? 'animate-fade-in-up' : 'opacity-0 translate-y-20'}`}
                  style={{ 
                      minHeight: '420px', // ensure enough height for all content
                      transitionDelay: `${index * 120}ms`,
                    transform: `perspective(1000px) rotateY(${Math.sin(scrollY * 0.01 + index) * 5}deg) translateZ(${Math.cos(scrollY * 0.01 + index) * 10}px)`
                  }}
                >
                    <div className="absolute -top-16 left-1/2 -translate-x-1/2 z-20 w-24 h-32 pointer-events-none">
                      <img src={service.character} alt="3D Character" className="w-full h-full object-contain drop-shadow-2xl animate-float" />
                    </div>
                    <div className="relative mb-6 w-full h-48 rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={service.image}
                      alt={service.title}
                        className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-xl"></div>
                  </div>
                  <div 
                      className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mb-4 transform group-hover:rotate-12 transition-transform duration-300 shadow-lg shadow-purple-500/30"
                  >
                    <i className={`${service.icon} text-2xl text-white`}></i>
                  </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center">{service.title}</h3>
                    <p className="text-gray-300 text-center text-sm mb-2">{service.description}</p>
                </div>
              ))}
            </div>
          {/* Scroll Indicator */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center space-x-2 text-gray-400">
              <i className="ri-arrow-left-line"></i>
              <span className="text-sm">Scroll to explore more</span>
              <i className="ri-arrow-right-line"></i>
            </div>
          </div>
        </div>
      </section>
        </div>

        {/* Transformation Results */}
      <section
        ref={transformationRef}
        data-section="transformation"
        id="results"
          className={`py-32 relative overflow-visible transition-all duration-1000 ${isVisible.transformation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{
          background: `
            radial-gradient(circle at 60% 40%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.2) 0%, transparent 50%),
            linear-gradient(225deg, #0a0a0a 0%, #1a1a1a 50%, #000000 100%)
          `
        }}
      >
        {/* 3D Success Elements */}
        <div className="absolute inset-0">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${8 + (i * 9)}%`,
                top: `${15 + (i % 3) * 25}%`,
                transform: `
                  perspective(1000px) 
                  rotateX(${60 + scrollY * 0.04 + i * 12}deg) 
                  rotateY(${scrollY * 0.05 + i * 18}deg) 
                  translateZ(${Math.sin(scrollY * 0.015 + i) * 40}px)
                `,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className={`w-8 h-8 ${i % 2 === 0 ? 'bg-gradient-to-br from-emerald-400/30 to-green-600/30' : 'bg-gradient-to-br from-blue-400/30 to-cyan-600/30'} rounded-full shadow-lg animate-pulse`}></div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className={`text-center mb-20 transition-all duration-1000 ${isVisible.transformation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}> 
            <h2 
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-blue-600 bg-clip-text text-transparent"
              style={{
                transform: `perspective(1000px) rotateX(${scrollY * -0.01}deg)`,
                transition: 'transform 0.1s ease-out'
              }}
            >
              Real Results
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Witness the power of next-generation training through our clients' incredible transformations
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  before: 'https://readdy.ai/api/search-image?query=fitness%20transformation%20before%20photo%2C%20person%20with%20average%20fitness%20level%2C%20simple%20gym%20clothing%2C%20neutral%20background%2C%20realistic%20portrait%20style&width=300&height=400&seq=before-1&orientation=portrait',
                  after: 'https://readdy.ai/api/search-image?query=fitness%20transformation%20after%20photo%2C%20athletic%20muscular%20person%2C%20confident%20pose%2C%20professional%20gym%20attire%2C%20dramatic%20lighting%2C%20success%20story%20portrait&width=300&height=400&seq=after-1&orientation=portrait',
                  name: 'Sarah M.',
                  story: '6 months • Lost 35 lbs • Gained confidence',
                  quote: 'The future of fitness is here, and it works!',
                  instagram: 'https://instagram.com/sarah_transforms',
                  tiktok: 'https://tiktok.com/@sarah_fit'
                },
                {
                  before: 'https://readdy.ai/api/search-image?query=male%20fitness%20transformation%20before%20photo%2C%20regular%20build%20person%2C%20casual%20gym%20wear%2C%20simple%20background%2C%20authentic%20portrait&width=300&height=400&seq=before-2&orientation=portrait',
                  after: 'https://readdy.ai/api/search-image?query=male%20fitness%20transformation%20after%20photo%2C%20muscular%20athletic%20build%2C%20confident%20stance%2C%20professional%20fitness%20attire%2C%20dramatic%20gym%20lighting&width=300&height=400&seq=after-2&orientation=portrait',
                  name: 'Mike R.',
                  story: '4 months • Built 20 lbs muscle • Increased strength 300%',
                  quote: 'Technology meets results - absolutely mind-blowing!',
                  instagram: 'https://instagram.com/mike_strong',
                  youtube: 'https://youtube.com/@mike_fitness'
                },
                {
                  before: 'https://readdy.ai/api/search-image?query=female%20fitness%20transformation%20before%20photo%2C%20woman%20starting%20fitness%2C%20comfortable%20workout%20clothes%2C%20encouraging%20expression&width=300&height=400&seq=before-3&orientation=portrait',
                  after: 'https://readdy.ai/api/search-image?query=female%20fitness%20transformation%20after%20photo%2C%20strong%20athletic%20woman%2C%20confident%20fitness%20pose%2C%20professional%20workout%20attire%2C%20inspiring%20transformation&width=300&height=400&seq=after-3&orientation=portrait',
                  name: 'Jessica K.',
                  story: '8 months • Lost 45 lbs • Completed first marathon',
                  quote: 'Never thought I could run a marathon. Dreams do come true!',
                  instagram: 'https://instagram.com/jess_marathon',
                  facebook: 'https://facebook.com/jessica.runner'
                },
                {
                  before: 'https://readdy.ai/api/search-image?query=older%20adult%20fitness%20transformation%20before%20photo%2C%20mature%20person%20beginning%20fitness%20journey%2C%20comfortable%20clothes%2C%20positive%20attitude&width=300&height=400&seq=before-4&orientation=portrait',
                  after: 'https://readdy.ai/api/search-image?query=older%20adult%20fitness%20transformation%20after%20photo%2C%20fit%20mature%20person%2C%20active%20lifestyle%2C%20confident%20pose%2C%20inspiring%20senior%20fitness&width=300&height=400&seq=after-4&orientation=portrait',
                  name: 'Robert T.',
                  story: '1 year • Lost 50 lbs • Reversed diabetes',
                  quote: 'At 55, I feel better than I did at 35!',
                  linkedin: 'https://linkedin.com/in/robert-transforms',
                  facebook: 'https://facebook.com/robert.fitness'
                },
                {
                  before: 'https://readdy.ai/api/search-image?query=young%20adult%20fitness%20transformation%20before%20photo%2C%20college%20student%20starting%20fitness%2C%20casual%20athletic%20wear%2C%20determined%20expression&width=300&height=400&seq=before-5&orientation=portrait',
                  after: 'https://readdy.ai/api/search-image?query=young%20adult%20fitness%20transformation%20after%20photo%2C%20athletic%20college%20student%2C%20muscular%20build%2C%20confident%20fitness%20pose%2C%20inspiring%20youth%20transformation&width=300&height=400&seq=after-5&orientation=portrait',
                  name: 'Alex P.',
                  story: '5 months • Built lean muscle • Boosted confidence',
                  quote: 'From couch to competition ready. This program works!',
                  tiktok: 'https://tiktok.com/@alex_gains',
                  instagram: 'https://instagram.com/alex_fitness'
                },
                {
                  before: 'https://readdy.ai/api/search-image?query=busy%20professional%20fitness%20transformation%20before%20photo%2C%20office%20worker%20starting%20fitness%20journey%2C%20business%20casual%20to%20workout%20transition&width=300&height=400&seq=before-6&orientation=portrait',
                  after: 'https://readdy.ai/api/search-image?query=busy%20professional%20fitness%20transformation%20after%20photo%2C%20fit%20business%20person%2C%20balanced%20lifestyle%2C%20professional%20yet%20athletic%20appearance&width=300&height=400&seq=after-6&orientation=portrait',
                  name: 'Emma L.',
                  story: '7 months • Balanced work & fitness • Lost 30 lbs',
                  quote: 'Finally found a program that fits my busy schedule!',
                  linkedin: 'https://linkedin.com/in/emma-balanced',
                  twitter: 'https://twitter.com/emma_fits'
                }
              ].map((transformation, index) => (
                <div
                  key={index}
                    className={`bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 transition-all duration-1000 hover:shadow-2xl hover:shadow-emerald-500/20 ${isVisible.transformation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                  style={{
                    transitionDelay: `${index * 200}ms`,
                    transform: `perspective(1000px) rotateX(${Math.sin(scrollY * 0.01 + index) * 3}deg) translateZ(${Math.cos(scrollY * 0.01 + index) * 15}px)`
                  }}
                >
                  <div className="flex space-x-4 mb-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">BEFORE</p>
                      <img
                        src={transformation.before}
                        alt="Before transformation"
                        className="w-20 h-28 object-cover object-top rounded-lg shadow-lg"
                      />
                    </div>
                    <div className="flex items-center">
                      <i 
                        className="ri-arrow-right-line text-xl text-emerald-500 animate-pulse"
                        style={{
                          transform: `translateX(${Math.sin(scrollY * 0.02) * 2}px)`
                        }}
                      ></i>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-400 mb-1">AFTER</p>
                      <img
                        src={transformation.after}
                        alt="After transformation"
                        className="w-20 h-28 object-cover object-top rounded-lg shadow-lg"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-bold text-white">{transformation.name}</h3>
                    <div className="flex space-x-2">
                      {transformation.instagram && (
                        <a 
                          href={transformation.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-gradient-to-br from-pink-500 to-orange-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className="ri-instagram-fill text-white text-sm"></i>
                        </a>
                      )}
                      {transformation.tiktok && (
                        <a 
                          href={transformation.tiktok} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-black rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className="ri-tiktok-fill text-white text-sm"></i>
                        </a>
                      )}
                      {transformation.youtube && (
                        <a 
                          href={transformation.youtube} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className="ri-youtube-fill text-white text-sm"></i>
                        </a>
                      )}
                      {transformation.facebook && (
                        <a 
                          href={transformation.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className="ri-facebook-fill text-white text-sm"></i>
                        </a>
                      )}
                      {transformation.linkedin && (
                        <a 
                          href={transformation.linkedin} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className="ri-linkedin-fill text-white text-sm"></i>
                        </a>
                      )}
                      {transformation.twitter && (
                        <a 
                          href={transformation.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
                        >
                          <i className="ri-twitter-fill text-white text-sm"></i>
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-emerald-400 mb-3 text-sm">{transformation.story}</p>
                  <p className="text-gray-300 italic text-sm">"{transformation.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

        {/* Contact Section */}
      <section
        ref={contactRef}
        data-section="contact"
        id="contact"
          className={`py-32 relative overflow-visible transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
        style={{
          background: `
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2) 0%, transparent 70%),
            radial-gradient(circle at 30% 80%, rgba(147, 51, 234, 0.15) 0%, transparent 60%),
            linear-gradient(180deg, #000000 0%, #0a0a0a 100%)
          `
        }}
      >
        <div className="max-w-4xl mx-auto px-6 relative z-10">
            <div className={`text-center transition-all duration-1000 ${isVisible.contact ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}> 
            <h2 
                className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent"
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                lineHeight: 1.1,
                transform: `perspective(1000px) rotateY(${scrollY * 0.01}deg)`,
                transition: 'transform 0.1s ease-out',
                maxWidth: '100%'
              }}
            >
              Ready to Transform?
            </h2>
            <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
              The future of your fitness journey starts with a single decision. Let's build something extraordinary together.
            </p>
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-blue-500/25">
                  <i className="ri-phone-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Call Direct</h3>
                <p className="text-gray-400 mb-4">Ready to start immediately?</p>
                <a href="tel:+1234567890" className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="bg-gray-900/70 backdrop-blur-sm rounded-2xl p-8 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg shadow-purple-500/25">
                  <i className="ri-mail-line text-2xl text-white"></i>
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">Email Me</h3>
                <p className="text-gray-400 mb-4">Let's discuss your goals</p>
                <a href="mailto:info@fitpro.com" className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                  info@fitpro.com
                </a>
              </div>
            </div>
            <button
              onClick={() => setShowWhatsApp(true)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 px-16 py-6 text-xl font-semibold rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 whitespace-nowrap cursor-pointer"
            >
              Book Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 relative overflow-hidden">
        <div className="absolute inset-0">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${30 + (i % 2) * 40}%`,
                transform: `
                  perspective(800px) 
                  rotateX(${30 + scrollY * 0.02 + i * 30}deg) 
                  rotateY(${scrollY * 0.03 + i * 25}deg)
                `,
                transition: 'transform 0.1s ease-out'
              }}
            >
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"></div>
            </div>
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent mb-4">
            FITPRO
          </div>
          <p className="text-gray-400 mb-8">The Future of Personal Training</p>
          <div className="flex justify-center space-x-6">
            {[
              { icon: 'ri-instagram-line', href: 'https://instagram.com' },
              { icon: 'ri-facebook-line', href: 'https://facebook.com' },
              { icon: 'ri-twitter-line', href: 'https://twitter.com' },
              { icon: 'ri-linkedin-line', href: 'https://linkedin.com' }
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-lg cursor-pointer"
              >
                <i className={`${social.icon} text-xl text-gray-400 hover:text-white`}></i>
              </a>
            ))}
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500"> 2024 FITPRO. All rights reserved.</p>
          </div>
        </div>
      </footer>
      </div>
      {/* WhatsApp Sticky Button - always at viewport bottom right */}
      <button
        ref={whatsappBtnRef}
        onClick={openWhatsApp}
        className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-110 cursor-pointer animate-pulse whatsapp-fab"
        style={{
          position: 'fixed',
          right: 24,
          bottom: 24,
          zIndex: 1100,
        }}
      >
        <i className="ri-whatsapp-line text-white text-2xl"></i>
      </button>
      {/* WhatsApp Floating Window */}
      {showWhatsApp && (
        <>
          {/* Overlay */}
          <div className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${whatsAppAnim ? 'opacity-100' : 'opacity-0'}`}></div>
          {/* Floating Form */}
          <div
            className={`fixed z-50 max-w-md w-full bg-white rounded-2xl p-8 shadow-2xl ${whatsAppAnim ? 'wa-float-in' : 'wa-float-out'}`}
            style={{
              right: 40,
              bottom: 104,
              opacity: whatsAppAnim ? 1 : 0,
              transform: whatsAppAnim ? 'scale(1) translateY(0)' : 'scale(0.7) translateY(40px)',
                    pointerEvents: 'auto',
              transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
            }}
          >
            <button
              onClick={closeWhatsApp}
              className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors cursor-pointer"
            >
              <i className="ri-close-line text-gray-600"></i>
            </button>
            {!showSuccess ? (
              <>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4">
                    <i className="ri-whatsapp-line text-white text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Get Started Today</h3>
                    <p className="text-gray-600">Tell us about yourself</p>
                  </div>
                </div>
                <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Your age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fitness Goals</label>
                    <textarea
                      name="goals"
                      value={formData.goals}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800"
                      placeholder="Tell us about your fitness goals..."
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Submit
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-check-line text-white text-2xl"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p className="text-gray-600">Someone from our team will reach out to you soon.</p>
              </div>
            )}
          </div>
        </>
      )}
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .wa-float-in {
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        .wa-float-out {
          transition: all 0.3s cubic-bezier(.4,0,.2,1);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in-up {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transition: opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1);
        }
        html {
          scroll-behavior: smooth;
        }
        * {
          transform-style: preserve-3d;
        }
        .whatsapp-fab {
          z-index: 1100 !important;
          position: fixed;
          bottom: 1.5rem;
          right: 1.5rem;
          box-shadow: 0 4px 16px 0 rgba(34,197,94,0.25), 0 1.5px 8px 0 rgba(0,0,0,0.10);
          pointer-events: auto;
        }
        /* Custom scrollbar for horizontal scroll */
        .overflow-x-auto::-webkit-scrollbar {
          height: 8px;
        }
        .overflow-x-auto::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb {
          background: linear-gradient(90deg, #8b5cf6, #ec4899);
          border-radius: 4px;
        }
        .overflow-x-auto::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(90deg, #7c3aed, #db2777);
        }
      `}</style>
    </>
  );
}