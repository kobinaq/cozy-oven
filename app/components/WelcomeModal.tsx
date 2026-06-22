"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Gift, Sparkles } from "lucide-react";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show modal after a short delay for better UX
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-[#231913]/60 backdrop-blur-sm z-[10000]"
            onClick={handleClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
              }}
              className="premium-card relative rounded-3xl max-w-md w-full overflow-hidden pointer-events-auto"
            >
              {/* Decorative gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#c79a4b]/15 via-[#fffdf8]/40 to-[#69715b]/10" />
              
              {/* Animated sparkles */}
              <div className="absolute top-4 right-4">
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Sparkles className="w-6 h-6 text-[#c79a4b]" />
                </motion.div>
              </div>

              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-[#f6ead8] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>

              {/* Content */}
              <div className="relative p-8 md:p-10 text-center">
                {/* Gift Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    delay: 0.2,
                    damping: 15,
                    stiffness: 200,
                  }}
                  className="mb-6 flex justify-center"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#c79a4b]/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative bg-[#231913] p-6 rounded-full">
                      <Gift className="w-12 h-12 text-white" />
                    </div>
                  </div>
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl md:text-3xl font-bold text-[#231913] mb-3"
                >
                  Welcome to the gift shop.
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-[#6b5d50] text-base md:text-lg mb-6 leading-relaxed"
                >
                  Explore premium banana bread boxes, flavor flights, and sweet gifts prepared by Cozy Oven.
                </motion.p>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  onClick={handleClose}
                  className="premium-button w-full py-4 px-8 relative overflow-hidden group"
                >
                  <span className="relative z-10">Start Shopping</span>
                </motion.button>

              </div>

              {/* Decorative bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#231913] via-[#c79a4b] to-[#69715b]" />
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

