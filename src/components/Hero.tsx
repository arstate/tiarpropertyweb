import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from '@/components/ScrollReveal';

export function Hero() {
  return (
    <section
      aria-label="Hunian Pilihan Surabaya dan Sidoarjo"
      className="relative w-full h-[100svh] min-h-[620px] max-h-[880px] flex flex-col justify-end overflow-hidden bg-[#181612] text-[#FAF8F5]"
    >
      {/* Background Architectural Residence (Local Upscaled WebP) */}
      <img
        src="/images/properties/hero-residence.webp"
        alt="Fasad rumah modern dua lantai dengan taman depan asri di kawasan Surabaya dan Sidoarjo"
        width={1920}
        height={1080}
        loading="eager"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Gradient Scrim for 7:1+ Editorial Contrast */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(180deg, rgba(24,22,18,0.34) 0%, rgba(24,22,18,0.42) 45%, rgba(24,22,18,0.84) 100%)',
        }}
      />

      {/* Foreground Content + Bottom-Bleed Wordmark */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-24 pb-3 sm:pb-5 flex flex-col gap-6 sm:gap-8 lg:gap-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-8 items-end">
          <ScrollReveal delay={0} className="md:col-span-7">
            <h1 className="font-display font-medium text-[clamp(2.25rem,4.5vw,4.35rem)] leading-[1.03] tracking-[-0.025em] text-[#FAF8F5] max-w-[16ch]">
              Rumah Surabaya dan Sidoarjo tanpa DP.
            </h1>
          </ScrollReveal>

          <ScrollReveal
            delay={120}
            className="md:col-span-5 md:justify-self-end md:max-w-[40ch] flex flex-col items-start gap-4"
          >
            <p className="font-body text-[15px] sm:text-base lg:text-[18px] leading-[1.5] text-[#FAF8F5]/92">
              UTJ mulai <span className="num-clean font-medium">Rp 1</span> juta, bebas biaya akad, dan subsidi angsuran{' '}
              <span className="num-clean font-medium">Rp 1,4</span> juta per bulan.
            </p>
            <a href="#klaster" className="dual-cta">
              <span className="dual-cta__label">Jelajahi Klaster Pilihan</span>
              <span className="dual-cta__circle" aria-hidden="true">
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </span>
            </a>
          </ScrollReveal>
        </div>

        {/* Monumental Bottom-Bleed Wordmark */}
        <ScrollReveal delay={220}>
          <div
            aria-hidden="true"
            className="w-full font-display font-medium text-[clamp(2.75rem,13.6vw,13.5rem)] leading-[0.84] tracking-[-0.035em] text-[#FAF8F5] text-center whitespace-nowrap select-none pt-1"
          >
            tiar property
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
