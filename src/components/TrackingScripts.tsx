'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Tracks all outbound WhatsApp clicks globally (wa.me) and fires
 * Meta Pixel `Contact` + GA4 `generate_lead` events with source context.
 */
export function TrackingScripts() {
  useEffect(() => {
    const handleWaClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest('a[href*="wa.me"]');
      if (!target) return;

      const href = target.getAttribute('href') || '';
      const source =
        target.getAttribute('data-wa-source') ||
        target.closest('section, footer, nav, header')?.id ||
        'website_cta';

      if (typeof window.fbq === 'function') {
        window.fbq('track', 'Contact', {
          content_name: source,
          destination: href,
        });
      }

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'WhatsApp',
          event_label: source,
          link_url: href,
        });
      }
    };

    const handleCtaMove = (event: MouseEvent) => {
      const cta = (event.target as HTMLElement | null)?.closest('.dual-cta') as HTMLElement | null;
      if (!cta) return;
      const circle = cta.querySelector('.dual-cta__circle') as HTMLElement | null;
      if (!circle) return;

      const ctaRect = cta.getBoundingClientRect();
      const restCenterX = ctaRect.right - circle.offsetWidth / 2;
      const restCenterY = ctaRect.top + ctaRect.height / 2;

      const minX = -(ctaRect.width - circle.offsetWidth);
      const maxX = 0;
      const rawX = event.clientX - restCenterX;
      const clampedX = Math.max(minX, Math.min(maxX, rawX));
      const rawY = Math.max(-10, Math.min(10, (event.clientY - restCenterY) * 0.45));

      cta.style.setProperty('--cta-x', `${clampedX.toFixed(1)}px`);
      cta.style.setProperty('--cta-y', `${rawY.toFixed(1)}px`);
    };

    document.addEventListener('click', handleWaClick);
    document.addEventListener('mousemove', handleCtaMove, { passive: true });
    return () => {
      document.removeEventListener('click', handleWaClick);
      document.removeEventListener('mousemove', handleCtaMove);
    };
  }, []);

  return (
    <>
      {META_PIXEL_ID && (
        <>
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
          </Script>
        </>
      )}

      {GA_MEASUREMENT_ID && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');`}
          </Script>
        </>
      )}
    </>
  );
}
