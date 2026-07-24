import { createContext, useContext, useRef, useEffect, useState, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { registerGSAP, refreshScrollTrigger } from '../utils/gsapSetup';

const SmoothScrollContext = createContext(null);

export function SmoothScrollProvider({ children }) {
  const scrollRef = useRef(null);
  const locoRef = useRef(null);
  const location = useLocation();
  const [scrollY, setScrollY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const isPublicPage = ['/', '/login', '/signup', '/forgot-password'].includes(location.pathname);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    registerGSAP();

    if (isMobile || !isPublicPage) {
      if (locoRef.current) {
        locoRef.current.destroy();
        locoRef.current = null;
        document.documentElement.classList.remove('has-scroll-smooth');
        document.body.classList.remove('has-scroll-smooth');
      }
      return;
    }

    let mounted = true;
    let ls = null;

    const initLoco = async () => {
      try {
        const LocomotiveScroll = (await import('locomotive-scroll')).default;
        if (!mounted || !scrollRef.current) return;

        await new Promise((r) => requestAnimationFrame(r));

        ls = new LocomotiveScroll({
          el: scrollRef.current,
          smooth: { mobile: 0, desktop: 15 },
          multiplier: 1,
          lerp: 0.08,
          smartphone: { smooth: false },
          tablet: { smooth: false },
        });

        if (!mounted) {
          ls.destroy();
          return;
        }

        locoRef.current = ls;
        document.documentElement.classList.add('has-scroll-smooth');
        document.body.classList.add('has-scroll-smooth');

        const { ScrollTrigger } = await import('gsap/ScrollTrigger');

        ls.on('scroll', (args) => {
          setScrollY(args.scroll.y);
          ScrollTrigger.update(args.scroll.y);
        });

        ScrollTrigger.scrollerProxy(scrollRef.current, {
          scrollTop: (value) => {
            if (arguments.length && locoRef.current) {
              locoRef.current.scrollTo(value, { duration: 0, disableLerp: true });
            }
            return locoRef.current ? locoRef.current.scroll.instance.scroll.y : 0;
          },
          getBoundingClientRect: () => ({
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          }),
          pinType: scrollRef.current.style.transform ? 'transform' : 'fixed',
        });
      } catch (err) {
        console.warn('Locomotive Scroll init failed:', err);
      }
    };

    initLoco();

    return () => {
      mounted = false;
      if (ls) {
        try { ls.destroy(); } catch (e) {}
        ls = null;
        locoRef.current = null;
      }
      document.documentElement.classList.remove('has-scroll-smooth');
      document.body.classList.remove('has-scroll-smooth');
    };
  }, [isMobile, isPublicPage]);

  useEffect(() => {
    if (locoRef.current) {
      requestAnimationFrame(() => {
        locoRef.current.update();
        refreshScrollTrigger();
      });
    }
  }, [location.pathname]);

  const scrollTo = useCallback((selector, options) => {
    if (locoRef.current) {
      locoRef.current.scrollTo(selector, options || { duration: 1, offset: 0 });
    }
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scrollRef, scrollY, scrollTo, locoRef }}>
      <div ref={scrollRef} data-scroll-container>
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const ctx = useContext(SmoothScrollContext);
  if (!ctx) return { scrollRef: null, scrollY: 0, scrollTo: () => {}, locoRef: null };
  return ctx;
}
