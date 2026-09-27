import { useEffect, useRef, useState } from 'react';

const pillars = [
  {
    number: '01',
    title: 'Corte preciso',
    text: 'Peças montadas com atenção a cada detalhe.',
  },
  {
    number: '02',
    title: 'Receitas Mikami',
    text: 'Combinações pensadas para equilibrar textura e sabor.',
  },
  {
    number: '03',
    title: 'Do nosso balcão',
    text: 'Retirada e delivery para Santa Cecília e região.',
  },
];

export default function ExperienceStrip() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`experience-strip${visible ? ' experience-strip--visible' : ''}`} aria-label="A experiência Mikami">
      <div className="container experience-grid">
        {pillars.map((pillar, index) => (
          <article className="experience-item" style={{ '--experience-index': index }} key={pillar.number}>
            <span className="experience-number" aria-hidden="true">{pillar.number}</span>
            <div>
              <h2>{pillar.title}</h2>
              <p>{pillar.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
