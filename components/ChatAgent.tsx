import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';

export const ChatAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Lock body and html scroll when chat is open to "lock control" of the background
  // Relies on `scrollbar-gutter: stable` in CSS to prevent layout shift
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Background Blur Overlay - Locks control of the page behind */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60] bg-luxury-green/30 backdrop-blur-md"
            />
            
            {/* Chat Modal Window */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              transition={{ 
                type: "spring", 
                stiffness: 350, 
                damping: 30,
                mass: 0.8
              }}
              style={{ transformOrigin: 'bottom right' }}
              className="fixed z-[70] bottom-24 right-6 w-[90vw] md:w-[450px] h-[600px] md:h-[700px] max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 flex flex-col"
            >
              {/* Iframe Container */}
              <div className="flex-1 bg-gray-50 relative">
                 <iframe 
                    src="https://agenttiar.vercel.app/#/chat/agentaitiar"
                    className="absolute inset-0 w-full h-full border-0"
                    title="Tiar Property AI Agent"
                 />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-[80] w-16 h-16 bg-luxury-green text-luxury-yellow rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] flex items-center justify-center border-2 border-luxury-yellow/20 outline-none"
      >
        <div className="relative w-full h-full flex items-center justify-center">
            <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                    <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute"
                    >
                        <X size={32} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="chat"
                        initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                        animate={{ rotate: 0, opacity: 1, scale: 1 }}
                        exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute"
                    >
                        <div className="relative">
                            <MessageCircle size={32} />
                            <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
      </motion.button>
    </>
  );
};