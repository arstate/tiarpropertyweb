import React from 'react';
import { WA_CS_NUMBER } from '@/data/properties';

export function JsonLdSchema() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://tiarproperty.com';

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'RealEstateAgent',
        '@id': `${baseUrl}/#organization`,
        name: 'Tiar Property',
        url: baseUrl,
        telephone: `+${WA_CS_NUMBER}`,
        areaServed: [
          { '@type': 'City', name: 'Surabaya' },
          { '@type': 'City', name: 'Sidoarjo' },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Sidoarjo',
          addressRegion: 'Jawa Timur',
          addressCountry: 'ID',
        },
        sameAs: ['https://www.instagram.com/tiar.property/'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Apakah benar bisa beli rumah DP 0% di Surabaya & Sidoarjo?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Ya, tersedia skema DP 0% tanpa uang muka. Cukup UTJ Rp 1 sampai 5 Juta untuk mengunci kavling dan langsung memproses berkas KPR.',
            },
          },
          {
            '@type': 'Question',
            name: 'Apa saja biaya yang digratiskan oleh Tiar Property?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Bebas biaya BPHTB, AJB, balik nama, notaris, serta subsidi biaya KPR hingga Rp 20 Juta dan subsidi angsuran Rp 1,4 Juta per bulan.',
            },
          },
          {
            '@type': 'Question',
            name: 'Bank apa saja yang bekerja sama untuk proses KPR?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Tim analis Tiar Property mendampingi pengajuan berkas ke 5 Bank BUMN dan Syariah rekanan: BTN, BRI, BSI, Mandiri, dan BNI.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
