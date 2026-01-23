import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const CookieConsent = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Проверяем, было ли уже дано согласие
        const consent = localStorage.getItem('cookieConsent');
        if (!consent) {
            // Показываем плашку через 1.5 секунды после захода на сайт
            const timer = setTimeout(() => setIsVisible(true), 1500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6"
                >
                    <div className="max-w-7xl mx-auto bg-[#21243F] border border-white/10 rounded-[15px] p-5 md:p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8">
                        <div className="flex items-start gap-4">
                            <div className="hidden md:flex bg-white/5 p-3 rounded-full shrink-0">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#F25A18]">
                                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <p className="text-white/90 font-inter text-[13px] sm:text-[14px] md:text-[15px] text-center md:text-left leading-relaxed">
                                Мы используем файлы cookie для улучшения работы сайта и анализа трафика. Продолжая использовать сайт, вы соглашаетесь с нашей{' '}
                                <a href="/#/privacy" className="text-[#F25A18] hover:text-white transition-colors font-bold underline decoration-[#F25A18]/50 underline-offset-4" onClick={() => setTimeout(() => window.location.reload(), 10)}>
                                    Политикой конфиденциальности
                                </a>.
                            </p>
                        </div>
                        <button
                            onClick={handleAccept}
                            className="whitespace-nowrap bg-[#F25A18] hover:bg-[#d84a0c] active:scale-95 text-white font-[800] text-[14px] px-8 py-3 rounded-[10px] shadow-lg transition-all uppercase font-manrope w-full md:w-auto"
                        >
                            Хорошо, понятно
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CookieConsent;
