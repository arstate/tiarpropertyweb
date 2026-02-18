import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Zap, ShieldCheck } from 'lucide-react';

export const ValueProps: React.FC = () => {
  const values = [
    {
      title: "TANPA DP",
      desc: "Cukup bayar tanda jadi, langsung proses KPR. Tidak perlu pusing mengumpulkan uang muka puluhan juta.",
      icon: <CheckCircle2 size={40} className="text-luxury-yellow" />
    },
    {
      title: "FREE BIAYA",
      desc: "Harga sudah termasuk BPHTB, AJB, BBN, dan Biaya KPR. Hemat hingga 50 juta lebih di awal.",
      icon: <ShieldCheck size={40} className="text-luxury-yellow" />
    },
    {
      title: "PROSES SAT-SET",
      desc: "Tim legal kami membantu pengurusan berkas sampai lolos. Kami partner resmi bank BUMN & Swasta.",
      icon: <Zap size={40} className="text-luxury-yellow" />
    }
  ];

  return (
    <section id="promo" className="py-24 bg-luxury-offwhite">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              className="bg-white p-10 rounded-3xl border border-gray-100 hover:shadow-2xl hover:shadow-luxury-green/10 transition-shadow duration-500 group"
            >
              <div className="mb-6 bg-luxury-green/5 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-serif text-3xl font-bold text-luxury-green mb-4 group-hover:text-luxury-gold transition-colors">
                {item.title}
              </h3>
              <p className="text-luxury-slate leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};