import { useEffect, useRef, useState } from 'react';
import desktopVideo from '../../public/video/backgroundp-c.mp4';
import mobileVideo from '../../public/video/backgorund-mobile.mp4';

function canUseBackgroundVideo() {
  if (typeof window === 'undefined') return false;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  return !reducedMotion && !saveData;
}

function useMobileVideo() {
  const [isMobile, setIsMobile] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  ));

  useEffect(() => {
    const query = window.matchMedia('(max-width: 767px)');
    const handleChange = (event) => setIsMobile(event.matches);
    query.addEventListener?.('change', handleChange);
    return () => query.removeEventListener?.('change', handleChange);
  }, []);

  return isMobile;
}

export default function Hero({ storeOpen, storeLoading, storeError, onOpenCart }) {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoEnabled] = useState(canUseBackgroundVideo);
  const isMobile = useMobileVideo();
  const videoSource = isMobile ? mobileVideo : desktopVideo;

  const statusText = storeLoading
    ? 'Verificando atendimento…'
    : storeError
      ? 'Status temporariamente indisponível'
      : storeOpen
        ? 'Delivery disponível'
        : 'Delivery fechado agora';
  const statusKind = storeLoading || storeError ? 'checking' : storeOpen ? 'open' : 'closed';

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoEnabled) return undefined;

    const updatePlayback = (isVisible = true) => {
      if (document.hidden || !isVisible) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };
    let heroVisible = true;
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
        heroVisible = entry.isIntersecting;
        updatePlayback(heroVisible);
      }, { threshold: 0.08 })
      : null;
    if (observer) observer.observe(video.closest('.hero'));
    else updatePlayback(true);
    const handleVisibility = () => updatePlayback(heroVisible);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [videoEnabled, videoSource]);

  return (
    <section className={`hero${videoReady ? ' hero--video-ready' : ''}`} id="home">
      {videoEnabled && (
        <video
          key={videoSource}
          ref={videoRef}
          src={videoSource}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex="-1"
          onLoadStart={() => setVideoReady(false)}
          onCanPlay={() => setVideoReady(true)}
          onError={() => setVideoReady(false)}
        />
      )}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-ambient" aria-hidden="true" />
      <div className="hero-side-note" aria-hidden="true">Mikami · Santa Cecília</div>

      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-overline hero-reveal hero-reveal--1">
            <span>Delivery &amp; Retirada</span>
            <span className="hero-overline__place">Santa Cecília</span>
          </div>
          <h1 className="hero-reveal hero-reveal--2">
            Sushi fresco,<br />
            <em>Experiência<br className="title-break" /> Mikami.</em>
          </h1>
          <p className="hero-subtitle hero-reveal hero-reveal--3">
            Combos, temakis e sashimis preparados com qualidade premium. Peça em poucos minutos.
          </p>

          <div className="hero-actions hero-reveal hero-reveal--4">
            <a className="hero-cta hero-cta--primary" href="#cardapio">
              Ver cardápio <i className="fas fa-arrow-down" aria-hidden="true" />
            </a>
            <button type="button" className="hero-cta hero-cta--secondary" onClick={onOpenCart}>
              <i className="fas fa-bag-shopping" aria-hidden="true" /> Abrir carrinho
            </button>
          </div>

          <div className="hero-info hero-meta hero-reveal hero-reveal--5">
            <div className={`info-chip info-chip--${statusKind}`}>
              <span className="info-chip__icon" aria-hidden="true"><i className="fas fa-circle" /></span>
              <div>
                <strong>Atendimento</strong>
                <span>{statusText}</span>
              </div>
            </div>
            <div className="info-chip">
              <span className="info-chip__icon" aria-hidden="true"><i className="fas fa-location-dot" /></span>
              <div>
                <strong>Local</strong>
                <span>Santa Cecília · Centro</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <a className="hero-scroll-cue" href="#cardapio" aria-label="Ir para o cardápio">
        <span>Explore</span><i className="fas fa-chevron-down" aria-hidden="true" />
      </a>
    </section>
  );
}
