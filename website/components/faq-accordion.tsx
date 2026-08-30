'use client';

import gsap from 'gsap';
import { useEffect, useRef, useState } from 'react';

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const panels = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const currentPanels = panels.current;
    return () => gsap.killTweensOf(currentPanels);
  }, []);

  function toggle(index: number) {
    const shouldOpen = openIndex !== index;
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const duration = reducedMotion ? 0 : 0.48;

    if (openIndex !== null) {
      gsap.to(panels.current[openIndex], {
        height: 0,
        opacity: 0,
        duration,
        ease: 'power3.inOut',
      });
    }

    if (shouldOpen) {
      const panel = panels.current[index];
      setOpenIndex(index);
      gsap.killTweensOf(panel);
      gsap.fromTo(
        panel,
        { height: 0, opacity: 0 },
        { height: 'auto', opacity: 1, duration, ease: 'power3.out' },
      );
    } else {
      setOpenIndex(null);
    }
  }

  return (
    <div className="mt-12">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;

        return (
          <div key={item.question} className="py-3">
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-6 py-3 text-left text-lg font-semibold"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(index)}
            >
              <span>{item.question}</span>
              <span
                className="shrink-0 font-mono text-xl font-normal"
                aria-hidden="true"
              >
                {isOpen ? '−' : '+'}
              </span>
            </button>
            <section
              ref={(node) => {
                panels.current[index] = node;
              }}
              id={panelId}
              aria-labelledby={buttonId}
              aria-hidden={!isOpen}
              className="h-0 overflow-hidden opacity-0"
            >
              <p className="max-w-2xl pb-4 pt-1 leading-7 text-muted-foreground">
                {item.answer}
              </p>
            </section>
          </div>
        );
      })}
    </div>
  );
}
