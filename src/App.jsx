import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, X } from 'lucide-react';
import CookieConsent from './CookieConsent';

// Вспомогательная функция для путей к изображениям
const getAsset = (path) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    
    // Чистый путь от корня домена
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return cleanPath;
};

const App = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1920);
    const [visibleWorksCount, setVisibleWorksCount] = useState(3);

    useEffect(() => {
        // Принудительный скролл наверх при монтировании
        window.scrollTo(0, 0);
        
        const handleResize = () => setWindowWidth(window.innerWidth);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        // Вызываем сразу для установки начального состояния
        handleScroll();
        
        window.addEventListener('scroll', handleScroll);
        window.addEventListener('resize', handleResize);
        
        // Небольшой таймаут для проверки скролла после рендеринга (фикс для восстановления позиции)
        const timeoutId = setTimeout(handleScroll, 100);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);

    const menuItems = ['Услуги', 'Преимущества', 'Работы', 'Отзывы', 'Контакты'];
    const sectionIds = {
        'Услуги': 'services',
        'Преимущества': 'advantages',
        'Работы': 'works',
        'Отзывы': 'reviews',
        'Контакты': 'contacts'
    };

    // getAsset moved outside component

    const [services, setServices] = useState([
        {
            title: 'РЕМОНТ',
            image: '/image/block3/foto1.jpg',
            items: [
                'Ремонт газовых котлов (любых марок)',
                'Устранение ошибок и сбоев',
                'Ремонт бойлеров',
                'Ликвидация протечек',
                'Аварийные выезды'
            ]
        },
        {
            title: 'ОБСЛУЖИВАНИЕ',
            image: '/image/block3/foto2.jpg',
            items: [
                'Химическая промывка систем отопления',
                'Очистка теплообменников и бойлеров',
                'Обслуживание фильтров (перезасыпка колонн)',
                'Настройка автоматики и балансировка'
            ]
        },
        {
            title: 'МОНТАЖ И ПРОЕКТИРОВАНИЕ',
            image: '/image/block3/foto3.jpg',
            items: [
                'Отопление, водоснабжение, канализация «под ключ»',
                'Реконструкция котельных',
                'Установка фильтров (по анализу воды)',
                'Монтаж радиаторов и теплого пола'
            ]
        }
    ]);

    const advantages = [
        {
            title: 'Гарантия качества',
            text: 'Даем гарантию на все виды работ (монтаж и сервис)'
        },
        {
            title: 'Гибкие решения',
            text: 'Работаем как по готовому проекту, так и разрабатываем решения с нуля'
        },
        {
            title: 'Комплексный сервис',
            text: 'Не просто чиним, а продлеваем срок службы оборудования (промывка, настройка)'
        },
        {
            title: 'Оперативная помощь',
            text: 'Быстро реагируем на аварийные вызовы по Истринскому району'
        },
        {
            title: 'Любые объекты',
            text: 'Обслуживаем системы, смонтированные нами и другими подрядчиками'
        }
    ];

    const [works, setWorks] = useState([
        {
            title: 'Монтаж котельной на базе Vaillant д. Снегири',
            image: '/image/block6/foto4.jpg'
        },
        {
            title: 'Промывка теплого пола от шлама КП «Гринфилд»',
            image: '/image/block6/foto5.jpg'
        },
        {
            title: 'Установка системы умягчения воды д. Обушково',
            image: '/image/block6/foto6.jpg'
        },
        {
            title: 'Обвязка котельной КП «Княжье Озеро»',
            image: '/image/block6/foto7.jpg'
        },
        {
            title: 'Комплексная система водоочистки д. Котово',
            image: '/image/block6/foto8.jpg'
        },
        {
            title: 'Монтаж котельной под ключ с. Рождествено',
            image: '/image/block6/foto9.jpg'
        }
    ]);

    useEffect(() => {
        const fetchData = async () => {
            // Пытаемся определить URL API автоматически
            let baseUrl = import.meta.env.VITE_API_URL;
            
            if (!baseUrl) {
                // Если переменная не задана, используем текущий хост, но с портом 1337
                // Убираем возможную точку в конце домена
                const hostname = window.location.hostname.replace(/\.$/, '');
                baseUrl = `http://${hostname}:1337`;
            }
            
            // Если baseUrl уже содержит https или мы не на порту 1337, оставляем как есть.
            // Но если мы на HTTPS и пытаемся достучаться до 1337 - принудительно используем http,
            // чтобы избежать ERR_CONNECTION_REFUSED. 
            // (В идеале это должен решать Nginx Proxy)
            if (window.location.protocol === 'https:' && baseUrl.includes(':1337') && baseUrl.startsWith('https:')) {
                baseUrl = baseUrl.replace('https:', 'http:');
            }
            
            console.log('Fetching from API:', baseUrl);
            try {
                const resWorks = await fetch(`${baseUrl}/api/rabotas?populate=*`);
                const jsonWorks = await resWorks.json();
                
                if (jsonWorks.data && jsonWorks.data.length > 0) {
                    const formatted = jsonWorks.data.map(item => {
                        // Обработка данных для Strapi 4 и Strapi 5
                        const attrs = item.attributes || item;
                        const imageData = attrs.image?.data?.attributes || attrs.image;
                        
                        return {
                            title: attrs.title,
                            image: imageData?.url ? `${baseUrl}${imageData.url}` : getAsset('image/block6/foto4.jpg')
                        };
                    });
                    setWorks(formatted);
                }
            } catch (e) { console.log('Rabota API error', e); }

            // Загрузка услуг
            try {
                const resServices = await fetch(`${baseUrl}/api/uslugas?populate=*`);
                const jsonServices = await resServices.json();
                
                if (jsonServices.data && jsonServices.data.length > 0) {
                    const formatted = jsonServices.data.map(item => {
                        const attrs = item.attributes || item;
                        const imageData = attrs.image?.data?.attributes || attrs.image;
                        
                        return {
                            title: attrs.title,
                            image: imageData?.url ? `${baseUrl}${imageData.url}` : getAsset('image/block3/foto1.jpg'),
                            items: Array.isArray(attrs.items) ? attrs.items : []
                        };
                    });
                    setServices(formatted);
                }
            } catch (e) { console.log('Usluga API error', e); }
        };
        fetchData();
    }, []);

    // Remove the previous redundant preload effect since we added a better one above

    const reviews = [
        {
            name: 'Алексей',
            text: 'Всем кто живет в Истре РЕКОМЕНДУЮ! После 3 лет, отопление стало некорректно работать, приехали промыли, продули и настроили после криворукого местного сантехника. Работали 12 часов без остановки, так как на улице зима. СПАСИБО!'
        },
        {
            name: 'Владимир Федоров',
            text: 'Все очень понравилось, всем рекомендую и сам впредь буду к ним обращаться, специалисты высокого уровня с огромным опытом работы, ничего лишнего, все по делу.'
        },
        {
            name: 'Михаил',
            text: 'Исполнитель сделал все очень качественно. Подошел к задаче обслуживания системы с глубоким знанием компонентов системы. Дал профессиональные комментарии по системам отопления и водоочистки. Рекомендую.'
        },
        {
            name: 'Екатерина',
            text: 'Очень благодарна ребятам за оперативность! Котёл встал в самый мороз, приехали через час после звонка. Всё быстро починили, объяснили как пользоваться автоматикой. Теперь дома снова тепло. Рекомендую всем!'
        }
    ];

    // Функция для определения, какие пункты меню показывать в зависимости от ширины экрана
    // Чтобы они не пересекали оранжевую линию
    const getVisibleItems = () => {
        if (windowWidth > 2100) return menuItems;
        if (windowWidth > 1950) return menuItems.slice(0, 4);
        if (windowWidth > 1800) return menuItems.slice(0, 3);
        if (windowWidth > 1680) return menuItems.slice(0, 2);
        if (windowWidth > 1580) return menuItems.slice(0, 1);
        return [];
    };

    const visibleItems = getVisibleItems();

    return (
        <div className="min-h-screen bg-[#1a1a1a] selection:bg-[#F25A18] selection:text-white font-manrope">
            {/* Header */}
            <motion.header
                initial={false}
                animate={{
                    height: windowWidth < 640 ? 80 : (windowWidth < 1024 ? 100 : (isScrolled ? 100 : 140)),
                    backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
                    boxShadow: isScrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
                }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
            >
                {/* Decorative Design (SVG Line/Ribbon) - Visible only when NOT scrolled */}
                {!isScrolled && (
                    <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden hidden lg:block">
                        <svg width="100%" height="160" fill="none">
                            <g transform={`translate(${windowWidth - 1920 - 40}, 0)`}>
                                {/* 1. White Block for Button */}
                                <path
                                    d="M 1528,0 L 2000,0 L 2000,88 L 1616,88 Z"
                                    fill="#FFFFFF"
                                />

                                {/* 2. The Main Orange Ribbon (Stroke) */}
                                <path
                                    d="M -2000,30 L 1520,30 L 1605,115 L 2000,115"
                                    stroke="#F25A18"
                                    strokeWidth="14"
                                    strokeLinejoin="miter"
                                />
                            </g>
                        </svg>
                    </div>
                )}

                {/* Header Content */}
                <div className="w-full h-full flex items-center relative z-10 px-0 md:px-4">
                    {/* Mobile Header (visible below 1024px) */}
                    <div className="flex lg:hidden items-center justify-start w-full transition-all duration-300 py-2 px-0">
                        <div className="flex items-center gap-0 transform translate-y-1">
                            <div className="relative flex items-center justify-start" style={{ width: windowWidth < 640 ? '80px' : '100px', height: windowWidth < 640 ? '80px' : '100px' }}>
                                {/* Logo 1 (White - always present) */}
                                <img
                                    src={getAsset("image/block1i2iShapka/logo1.png")}
                                    alt="Logo White"
                                    className={`absolute left-0 w-auto h-full object-contain transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
                                    style={{ opacity: isScrolled ? 0 : 1 }}
                                />
                                {/* Logo 2 (Dark - always present) */}
                                <img
                                    src={getAsset("image/block3/logo2.png")}
                                    alt="Logo Dark"
                                    className={`absolute left-0 w-auto h-full object-contain transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
                                    style={{ opacity: isScrolled ? 1 : 0 }}
                                />
                            </div>
                            <div className={`flex flex-col justify-center items-stretch w-fit -ml-1 transition-all duration-300 ${isScrolled ? 'text-[#21243F]' : 'text-white'}`}>
                                <div className={`font-[800] leading-none uppercase transition-all duration-300 ${windowWidth < 640 ? 'text-[12px]' : 'text-[15px]'}`}>
                                    <div className="flex justify-between w-full">
                                        {"СЕРВИСНАЯ СЛУЖБА ИСТРА".split("").map((char, i) => (
                                            <span key={i}>{char === " " ? "\u00A0" : char}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className={`font-[800] leading-none uppercase tracking-tight opacity-100 mt-1 whitespace-nowrap ${windowWidth < 640 ? 'text-[12px]' : 'text-[15px]'}`}>
                                    ОБСЛУЖИВАНИЕ / РЕМОНТ / МОНТАЖ
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PC Header (visible from 1024px) */}
                    <div className="hidden lg:flex items-center w-full h-full 2xl:pr-[450px]">
                        {/* Logo Section - Two-image cross-fade for stability */}
                        <div className={`flex items-center shrink-0 transition-all duration-300 ${isScrolled ? 'ml-0 md:ml-4 lg:ml-8' : 'ml-0 md:-ml-2 xl:-ml-10'}`}>
                            <div className="relative flex items-center transition-all duration-300">
                                {/* Placeholder to keep space */}
                                <motion.img
                                    animate={{
                                        height: isScrolled
                                            ? (windowWidth < 1024 ? 110 : windowWidth < 1280 ? 150 : 180)
                                            : (windowWidth < 1024 ? 110 : windowWidth < 1280 ? 150 : 180),
                                        y: isScrolled ? 10 : 28
                                    }}
                                    transition={{ duration: 0.3 }}
                                    src={getAsset("image/block1i2iShapka/logo1.png")}
                                    className="w-auto opacity-0"
                                    alt=""
                                />
                                {/* Logo 1 (White - for dark background) */}
                                <motion.img
                                    initial={false}
                                    animate={{
                                        opacity: isScrolled ? 0 : 1,
                                        scale: isScrolled ? 0.8 : 1,
                                        y: isScrolled ? 10 : 28
                                    }}
                                    transition={{ duration: 0.3 }}
                                    src={getAsset("image/block1i2iShapka/logo1.png")}
                                    alt=""
                                    className="h-full w-auto absolute left-0 top-0 object-contain pointer-events-none"
                                />
                                {/* Logo 2 (Dark - for white background) */}
                                <motion.img
                                    initial={false}
                                    animate={{
                                        opacity: isScrolled ? 1 : 0,
                                        scale: isScrolled ? 1 : 1.2,
                                        y: isScrolled ? 10 : 28
                                    }}
                                    transition={{ duration: 0.3 }}
                                    src={getAsset("image/block3/logo2.png")}
                                    alt=""
                                    className="h-full w-auto absolute left-0 top-0 object-contain pointer-events-none"
                                />
                            </div>
                            <div className={`flex flex-col justify-center items-stretch w-fit transition-all duration-300 ${isScrolled
                                ? 'transform translate-y-0.5 ml-3 md:ml-4 lg:ml-8'
                                : 'transform translate-y-[22px] ml-1.5 md:ml-0 lg:ml-4'
                                } ${isScrolled ? 'text-[#21243F]' : 'text-white'}`}>
                                <h2 className={`font-[800] leading-[1.1] uppercase transition-all duration-300 text-[24px] lg:text-[28px] xl:text-[32px]`}>
                                    <div className="flex justify-between w-full">
                                        {"СЕРВИСНАЯ СЛУЖБА ИСТРА".split("").map((char, i) => (
                                            <span key={i}>{char === " " ? "\u00A0" : char}</span>
                                        ))}
                                    </div>
                                </h2>
                                <p className={`font-[800] leading-[1.1] uppercase tracking-tight opacity-100 transition-all duration-300 whitespace-nowrap text-[20px] lg:text-[24px] xl:text-[28px] mt-1`}>
                                    Обслуживание / Ремонт / Монтаж
                                </p>
                            </div>
                        </div>

                        <nav className={`flex items-center justify-center flex-grow gap-6 2xl:gap-10 transition-all duration-300 pointer-events-none ${isScrolled ? 'transform translate-y-0' : 'transform translate-y-[18px]'}`}>
                            {menuItems.map((item, index) => (
                                index < visibleItems.length && (
                                    <a
                                        key={item}
                                        href={`#${sectionIds[item]}`}
                                        className={`pointer-events-auto flex-shrink-0 font-[800] text-[20px] 2xl:text-[26px] transition-colors hover:text-[#F25A18] whitespace-nowrap ${isScrolled ? 'text-[#21243F]' : 'text-white'}`}
                                    >
                                        {item}
                                    </a>
                                )
                            ))}
                        </nav>
                    </div>

                    {/* Right Button Section - Fixed position relative to the right edge to stay inside the SVG block */}
                    <div className="hidden lg:flex items-center absolute right-0 top-0 h-full w-[250px] md:w-[350px] lg:w-[400px] xl:w-[450px] justify-center z-20 pointer-events-none pr-4 md:pr-8 xl:pr-0">
                        <motion.a
                            href="#contacts"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{
                                y: isScrolled ? 0 : -28,
                                x: isScrolled ? 0 : 55
                            }}
                            className={`pointer-events-auto bg-[#F25A18] text-white font-[800] text-[14px] md:text-[16px] xl:text-[19px] px-4 md:px-6 xl:px-8 py-2 md:py-3 xl:py-3.5 rounded-[10px] xl:rounded-[12px] flex items-center gap-2 xl:gap-3 whitespace-nowrap shadow-xl transform transition-all duration-300`}
                        >
                            СВЯЗАТЬСЯ С НАМИ
                            <ChevronRight size={windowWidth < 1280 ? 18 : 22} strokeWidth={3} />
                        </motion.a>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 md:p-3 absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-30 mt-0"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? (
                            <X size={windowWidth < 768 ? 28 : 36} className="text-[#21243F]" style={{ color: '#21243F' }} />
                        ) : (
                            <Menu size={windowWidth < 768 ? 28 : 36} className={isScrolled ? 'text-[#21243F]' : 'text-white'} style={{ color: isScrolled ? '#21243F' : '#ffffff' }} />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Overlay - OUTSIDE of header content for better layout */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/60 z-[110] lg:hidden backdrop-blur-sm"
                            />
                            <motion.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-white z-[120] lg:hidden shadow-2xl flex flex-col"
                            >
                                <div className="p-6 md:p-8 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-10 w-full">
                                        <div className="flex flex-col items-start w-full">
                                            <div className="mb-0 flex flex-col items-start">
                                                <div className="text-[24px] font-[800] text-[#21243F] leading-[0.95] uppercase tracking-tighter">
                                                    ИНЖЕНЕРНЫЕ СИСТЕМЫ
                                                </div>
                                                <div className="text-[20px] font-[800] text-[#F25A18] leading-[0.95] uppercase tracking-tighter mt-1">
                                                    В ИСТРИНСКОМ РАЙОНЕ
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-[#21243F] -mt-2 -mr-2 flex-shrink-0">
                                            <X size={32} />
                                        </button>
                                    </div>

                                    <nav className="flex flex-col gap-6">
                                        {menuItems.map((item) => (
                                            <a
                                                key={item}
                                                href={`#${sectionIds[item]}`}
                                                className="font-[800] text-[18px] sm:text-[22px] md:text-[26px] text-[#21243F] hover:text-[#F25A18] transition-colors border-b border-gray-100 pb-2"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                {item}
                                            </a>
                                        ))}
                                    </nav>

                                    <div className="mt-auto pt-10 flex flex-col gap-6">
                                        <a href="#contacts" onClick={() => setIsMobileMenuOpen(false)} className="w-full bg-[#F25A18] text-white font-[800] text-[18px] py-4 rounded-[12px] shadow-lg active:scale-95 transition-transform text-center">
                                            СВЯЗАТЬСЯ С НАМИ
                                        </a>
                                        <div className="text-center">
                                            <a href="tel:+79776189906" className="text-[#21243F] font-extrabold text-[20px] hover:text-[#F25A18] transition-colors">
                                                +7 (977) 618-99-06
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* Hero Section */}
            <section className="relative h-screen min-h-[600px] md:min-h-[800px] flex items-start overflow-hidden">
                {/* Animated Background */}
                <motion.div
                    animate={{ scale: [1, 1.05] }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear"
                    }}
                    className="absolute inset-0 z-0"
                >
                    <div className="absolute inset-0 bg-black/45 z-10" />
                    <img
                        src={getAsset("image/block1i2iShapka/fon1.jpg")}
                        alt="Engineer at work"
                        className="w-full h-full object-cover object-[25%_center] md:object-center"
                    />
                </motion.div>

                {/* Hero Content */}
                <div className="relative z-20 w-full px-4 sm:px-8 lg:px-20 pt-[160px] sm:pt-[210px] md:pt-[340px] lg:translate-x-[35px]">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: { transition: { staggerChildren: 0.2 } }
                        }}
                        className="max-w-[1400px]"
                    >
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.8 }}
                            className="text-[32px] sm:text-[48px] md:text-[90px] lg:text-[100px] font-[800] text-white leading-[1.1] md:leading-[0.95] mb-6 sm:mb-10 md:mb-14 uppercase tracking-tighter"
                        >
                            Профессиональный ремонт, монтаж и<br />
                            обслуживание отопления и водоснабжения.<br />
                            <span className="text-[#F26E35] inline-block mt-2 md:mt-4">В ИСТРИНСКОМ РАЙОНЕ</span>
                        </motion.h1>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.8 }}
                            className="text-[16px] sm:text-[22px] md:text-[36px] lg:text-[46px] font-[600] text-white/95 max-w-[1300px] leading-[1.3] md:leading-[1.25] mb-10 sm:mb-14 md:mb-24"
                        >
                            Гарантия на работы и аварийные выезды
                        </motion.p>

                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: { opacity: 1, y: 0 }
                            }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.a
                                href="#contacts"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative bg-[#F25A18] text-white font-[800] text-[18px] sm:text-[24px] md:text-[40px] lg:text-[50px] px-8 sm:px-12 md:px-24 py-5 sm:py-7 md:py-12 rounded-[10px] md:rounded-[15px] flex items-center gap-4 md:gap-10 shadow-2xl w-fit"
                            >
                                ВЫЗВАТЬ МАСТЕРА
                                <ChevronRight size={windowWidth < 640 ? 24 : (windowWidth < 768 ? 32 : 64)} strokeWidth={3} className="transition-transform group-hover:translate-x-2" />

                                {/* Glow Animation */}
                                <motion.div
                                    animate={{
                                        boxShadow: [
                                            "0 0 0px 0px rgba(242, 90, 24, 0)",
                                            "0 0 65px 45px rgba(242, 90, 24, 0.6)",
                                            "0 0 0px 0px rgba(242, 90, 24, 0)"
                                        ]
                                    }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 rounded-[15px] pointer-events-none"
                                />
                            </motion.a>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Block 3: Services (Second Block) */}
            <section id="services" className="relative min-h-screen bg-white pt-20 md:pt-[160px] pb-20 overflow-hidden">
                {/* Fixed Background (Parallax effect) */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${getAsset("image/block3/fon2.jpg")})`,
                        backgroundAttachment: windowWidth < 1024 ? 'scroll' : 'fixed',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                <div className="relative z-10 max-w-full mx-auto px-4 sm:px-16 lg:px-32">
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-[28px] sm:text-[48px] md:text-[64px] font-[800] leading-[1.1] text-[#21243F] mb-8 sm:mb-[70px] uppercase font-manrope"
                    >
                        Профессиональная забота о вашем доме: <span className="text-[#F25A18]">монтаж</span><br className="hidden md:block" />
                        <span className="text-[#F25A18]"> ремонт и обслуживание систем отопления и водоснабжения</span>
                    </motion.h2>

                    {/* Services Grid - Fixed aspect ratio cards, smaller overall */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-20 items-stretch w-full">
                        {services.map((service, index) => (
                            <div key={index} className="relative z-30">
                                <motion.div
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.2 }}
                                    className="group relative overflow-hidden rounded-[15px] md:rounded-[20px] bg-black shadow-lg cursor-pointer h-[350px] md:h-[450px] lg:h-[550px]"
                                >
                                    <div className="absolute inset-0">
                                        <img src={getAsset(service.image)} alt={service.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                                    </div>
                                    <div className="absolute inset-0 p-6 md:p-10 lg:p-12 flex flex-col justify-end">
                                        <h3 className="text-[18px] sm:text-[24px] md:text-[36px] lg:text-[48px] font-[600] text-white leading-tight uppercase font-inter transition-all duration-500 group-hover:-translate-y-[180px] md:group-hover:-translate-y-[250px]">
                                            {service.title}
                                        </h3>
                                        <ul className="mt-4 space-y-2 opacity-0 translate-y-8 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-[-15px] md:group-hover:translate-y-[-30px] font-inter absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12">
                                            {Array.isArray(service.items) && service.items.map((item, i) => (
                                                <li key={i} className="text-[14px] md:text-[20px] lg:text-[24px] font-[500] text-white leading-tight flex items-start gap-3">
                                                    <svg width="22" height="18" viewBox="0 0 18 14" fill="none" className="mt-1 shrink-0 w-4 h-4 md:w-6 md:h-5">
                                                        <path d="M1 7L6 12L17 1" stroke="#F25A18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            </div>
                        ))}

                        {/* 4. CTA Card */}
                        <div className="relative z-30">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.6 }}
                                className="border-[2px] border-[#F25A18] rounded-[15px] md:rounded-[20px] p-8 md:p-12 flex flex-col justify-between bg-white shadow-xl h-[350px] md:h-[450px] lg:h-[550px]"
                            >
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0 mt-1"><circle cx="16" cy="16" r="14" stroke="#F25A18" strokeWidth="2" /><path d="M9 16L14 21L23 11" stroke="#F25A18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <p className="text-[18px] md:text-[26px] lg:text-[32px] font-[500] text-[#21243F] leading-tight font-inter">Работаем с объектами любой сложности</p>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0 mt-1"><circle cx="16" cy="16" r="14" stroke="#F25A18" strokeWidth="2" /><path d="M9 16L14 21L23 11" stroke="#F25A18" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                        <p className="text-[18px] md:text-[26px] lg:text-[32px] font-[500] text-[#21243F] leading-tight font-inter">Выполним профессиональный монтаж систем отопления и водоснабжения с гарантией на работы</p>
                                    </div>
                                </div>
                                <motion.a
                                    href="#contacts"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-[#F25A18] text-white font-[800] text-[18px] sm:text-[20px] md:text-[28px] py-4 sm:py-6 rounded-[12px] md:rounded-[15px] flex items-center justify-center gap-3 sm:gap-4 shadow-xl uppercase font-manrope transition-shadow hover:shadow-orange-500/20"
                                >
                                    УЗНАТЬ СТОИМОСТЬ <ChevronRight size={windowWidth < 640 ? 24 : 36} strokeWidth={3} />
                                </motion.a>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Block 4: Why trust us (Advantages) */}
            <section id="advantages" className="relative min-h-screen bg-white py-12 md:py-24 overflow-hidden flex flex-col justify-center">
                {/* Fixed Background (Parallax effect) */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${getAsset("image/block3/fon2.jpg")})`,
                        backgroundAttachment: windowWidth < 1024 ? 'scroll' : 'fixed',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                <div className="relative z-10 max-w-full mx-auto px-6 md:px-16 lg:px-32 flex flex-col items-start">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-[32px] sm:text-[48px] md:text-[64px] font-[800] leading-tight text-[#21243F] mb-10 md:mb-20 uppercase font-manrope text-left"
                    >
                        Почему <span className="text-[#F25A18]">нам доверяют</span> инженерные системы
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full mb-10 md:mb-20">
                        {advantages.map((adv, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="bg-white rounded-[20px] p-6 shadow-[0_20px_70px_rgba(0,0,0,0.35)] flex flex-col items-center text-center h-auto min-h-[300px] md:min-h-[450px] justify-start border-[2px] border-gray-200 overflow-hidden relative"
                            >
                                <h3 className="text-[18px] sm:text-[22px] md:text-[24px] lg:text-[26px] xl:text-[24px] 2xl:text-[32px] font-[800] text-[#F25A18] leading-[1.1] font-inter mb-4 md:mb-6 w-full break-words px-2 uppercase min-h-fit md:min-h-[2.2em] flex flex-col items-center justify-center">
                                    {adv.title.split(' ').map((word, i) => (
                                        <span key={i}>{word}</span>
                                    ))}
                                </h3>
                                <p className="text-[18px] sm:text-[17px] md:text-[18px] lg:text-[20px] xl:text-[18px] 2xl:text-[24px] font-[500] text-[#21243F] leading-[1.3] font-inter break-words w-full px-2">
                                    {adv.text}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.a
                        href="#contacts"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="self-center bg-[#F25A18] text-white font-[800] text-[20px] md:text-[25px] px-10 md:px-16 py-4 md:py-6 rounded-[10px] md:rounded-[15px] flex items-center gap-4 shadow-2xl uppercase font-manrope group"
                    >
                        ОСТАВИТЬ ЗАЯВКУ <ChevronRight size={windowWidth < 768 ? 24 : 32} strokeWidth={3} className="transition-transform group-hover:translate-x-2" />
                    </motion.a>
                </div>
            </section>

            {/* Block 5: Why maintenance matters */}
            <section className="relative bg-white py-12 md:py-16 flex flex-col justify-center overflow-visible">
                {/* Fixed Background (Parallax effect) */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${getAsset("image/block3/fon2.jpg")})`,
                        backgroundAttachment: windowWidth < 1024 ? 'scroll' : 'fixed',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-full mx-auto w-full px-4 md:px-6 lg:px-32 mt-0 overflow-visible"
                >
                    <div className="bg-[#21243F] rounded-[20px] md:rounded-[30px] pt-12 md:pt-20 lg:pt-16 px-4 md:px-6 lg:px-24 pb-8 md:pb-12 lg:pb-16 shadow-2xl relative flex flex-col justify-start gap-6 md:gap-8 h-auto min-h-fit lg:min-h-[700px] overflow-visible">
                        <div className="flex flex-col gap-6 pt-0 pb-4">
                            <div className="pt-4 md:pt-10 lg:pt-0">
                                <h2 className="text-[22px] sm:text-[32px] md:text-[48px] lg:text-[64px] font-[800] leading-tight text-white uppercase font-manrope text-center px-2 md:px-4">
                                    Почему <span className="text-[#F25A18]">нельзя откладывать</span> обслуживание?
                                </h2>
                            </div>

                            <p className="text-[16px] sm:text-[24px] md:text-[36px] lg:text-[52px] font-[600] text-white leading-tight font-inter text-center mt-0 md:mt-2 mb-0 md:mb-2 px-2 md:px-4">
                                <span className="text-[#F25A18]">Ответ:</span> Даже дорогое оборудование теряет эффективность без сервиса
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 xl:gap-12 2xl:gap-[163px] mt-2 md:mt-4 px-0 md:px-10">
                                <div className="bg-[#373A52] rounded-[15px] md:rounded-[20px] pt-6 md:pt-8 px-4 md:px-6 pb-8 md:pb-10 flex flex-col items-center justify-start text-center gap-4 md:gap-6 lg:gap-8 h-auto lg:min-h-[220px] border border-white/5">
                                    <h3 className="text-[18px] sm:text-[30px] md:text-[34px] lg:text-[22px] xl:text-[32px] 2xl:text-[46px] font-[600] text-white font-inter leading-[1.1] w-full px-2 break-words">
                                        Тепловизионная диагностика
                                    </h3>
                                    <p className="text-[14px] sm:text-[20px] md:text-[22px] lg:text-[16px] xl:text-[22px] 2xl:text-[29px] font-[500] text-[#F25A18] font-inter w-full px-2">
                                        найдем утечки тепла
                                    </p>
                                </div>
                                <div className="bg-[#373A52] rounded-[15px] md:rounded-[20px] pt-6 md:pt-8 px-4 md:px-6 pb-8 md:pb-10 flex flex-col items-center justify-start text-center gap-4 md:gap-6 lg:gap-8 h-auto lg:min-h-[220px] border border-white/5">
                                    <h3 className="text-[18px] sm:text-[30px] md:text-[34px] lg:text-[22px] xl:text-[32px] 2xl:text-[46px] font-[600] text-white font-inter leading-[1.1] w-full px-2 break-words">
                                        Удаление шлама и накипи
                                    </h3>
                                    <p className="text-[14px] sm:text-[20px] md:text-[22px] lg:text-[16px] xl:text-[22px] 2xl:text-[29px] font-[500] text-[#F25A18] font-inter w-full px-2">
                                        экономия газа до 20%
                                    </p>
                                </div>
                                <div className="bg-[#373A52] rounded-[15px] md:rounded-[20px] pt-6 md:pt-8 px-4 md:px-6 pb-8 md:pb-10 flex flex-col items-center justify-start text-center gap-4 md:gap-6 lg:gap-8 h-auto lg:min-h-[220px] border border-white/5">
                                    <h3 className="text-[18px] sm:text-[30px] md:text-[34px] lg:text-[22px] xl:text-[32px] 2xl:text-[46px] font-[600] text-white font-inter leading-[1.1] w-full px-2 break-words">
                                        Настройка автоматики
                                    </h3>
                                    <p className="text-[14px] sm:text-[20px] md:text-[22px] lg:text-[16px] xl:text-[22px] 2xl:text-[29px] font-[500] text-[#F25A18] font-inter w-full px-2">
                                        стабильная работа
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-[15px] md:rounded-[20px] py-4 md:py-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-8 mt-4 md:mt-8 lg:mt-16 mx-0 md:mx-10 px-4 md:px-6 lg:px-24 xl:px-36 min-h-fit md:min-h-[120px] lg:min-h-[160px] overflow-hidden">
                            <p className="text-[14px] sm:text-[15px] md:text-[20px] lg:text-[24px] xl:text-[30px] font-[600] text-[#21243F] font-inter tracking-widest uppercase text-center whitespace-nowrap flex-1 min-w-0 overflow-hidden pr-0 sm:pr-12">
                                ТЕПЛО. ТИХО. ЭКОНОМНО
                            </p>
                            <div className="flex-shrink-0 flex justify-center sm:justify-end w-full sm:w-auto">
                                <motion.a
                                    href="#contacts"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="relative bg-[#F25A18] text-white font-[800] text-[16px] md:text-[28px] lg:text-[32px] xl:text-[36px] px-6 md:px-14 xl:px-20 py-3 md:py-6 xl:py-7 rounded-[10px] md:rounded-[15px] shadow-2xl uppercase font-manrope overflow-hidden group flex items-center gap-3 md:gap-5 shrink-0 whitespace-nowrap"
                                >
                                    ВЫЗВАТЬ МАСТЕРА <ChevronRight size={windowWidth < 768 ? 24 : 44} strokeWidth={4} className="w-5 h-5 md:w-8 md:h-8 lg:w-11 lg:h-11 flex-shrink-0" />
                                    <motion.div
                                        animate={{
                                            left: ['-100%', '200%'],
                                        }}
                                        transition={{
                                            duration: 1.5,
                                            repeat: Infinity,
                                            repeatDelay: 3.5,
                                            ease: "linear",
                                        }}
                                        className="absolute top-0 h-full w-[100px] bg-white/30 -skew-x-[45deg] pointer-events-none"
                                    />
                                </motion.a>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* Block 6: Our Works */}
            <section id="works" className="relative min-h-screen bg-white py-12 md:py-24 flex flex-col justify-start overflow-hidden">
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${getAsset("image/block3/fon2.jpg")})`,
                        backgroundAttachment: windowWidth < 1024 ? 'scroll' : 'fixed',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                <div className="relative z-10 max-w-full mx-auto w-full px-6 lg:px-32">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-[32px] sm:text-[48px] md:text-[64px] font-[800] leading-tight mb-10 md:mb-20 uppercase font-manrope text-left"
                    >
                        <span className="text-[#F25A18]">Наши</span> <span className="text-[#21243F]">работы</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {works.map((work, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: (index % 3) * 0.1
                                }}
                                className={`group relative aspect-[4/3] overflow-hidden rounded-[15px] md:rounded-[20px] bg-[#21243F] cursor-pointer ${index >= visibleWorksCount ? 'hidden' : 'block'}`}
                            >
                                <img
                                    src={getAsset(work.image)}
                                    alt={work.title}
                                    className="w-full h-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-110"
                                />
                                {/* Gradient overlay - visible on mobile */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#21243F]/90 via-[#21243F]/20 to-transparent opacity-100 lg:opacity-0 transition-opacity duration-300 lg:group-hover:opacity-100" />
                                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                                    <p className="text-[16px] md:text-[20px] font-[500] text-white font-inter leading-[1.3] transform translate-y-0 lg:translate-y-4 lg:opacity-0 transition-all duration-300 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                                        {work.title}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {visibleWorksCount < works.length && (
                        <div className="mt-12 md:mt-20 flex justify-center">
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setVisibleWorksCount(prev => Math.min(prev + 3, works.length))}
                                className="bg-white border-[1px] border-[#21243F]/20 text-[#21243F] font-[800] text-[18px] md:text-[19px] px-10 md:px-12 py-4 md:py-5 rounded-[10px] shadow-sm hover:shadow-md transition-all font-manrope uppercase"
                            >
                                Загрузить еще
                            </motion.button>
                        </div>
                    )}
                </div>
            </section>

            {/* Block 7: Reviews */}
            <section id="reviews" className="relative bg-white pt-24 pb-20 flex flex-col justify-center overflow-hidden">
                {/* Fixed Background (Parallax effect) */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${getAsset("image/block3/fon2.jpg")})`,
                        backgroundAttachment: 'fixed',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                <div className="relative z-10 max-w-full mx-auto w-full px-6 md:px-8 lg:px-32 flex flex-col items-start">
                    <motion.h2
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-[32px] sm:text-[48px] md:text-[64px] font-[800] leading-tight mb-10 md:mb-20 uppercase font-manrope text-left"
                    >
                        <span className="text-[#21243F]">Отзывы</span> <span className="text-[#F25A18]">наших клиентов</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-20 w-full items-stretch">
                        {reviews.map((review, index) => (
                            <div key={index} className="w-full flex">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 0.6,
                                        delay: index * 0.1
                                    }}
                                    className="bg-white rounded-[20px] p-6 md:p-8 shadow-[0_4px_25px_rgba(33,36,63,0.3)] flex flex-col border-[0.5px] border-gray-100 min-w-0 w-full aspect-square md:aspect-auto md:min-h-[350px]"
                                >
                                    <div className="flex justify-between items-start mb-6 md:mb-8 shrink-0">
                                        <div className="flex gap-1 xl:gap-2">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 xl:w-7 xl:h-7" viewBox="0 0 24 24" fill="#F25A18">
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <svg className="w-8 h-6 md:w-10 md:h-8 xl:w-12 xl:h-10" viewBox="0 0 45 35" fill="none">
                                            <path d="M13.5 0C6.04416 0 0 6.04416 0 13.5C0 17.91 2.115 21.825 5.4 24.3L2.7 35H11.7L14.4 24.3C18.225 21.375 20.7 16.74 20.7 11.475C20.7 5.13 17.4825 0 13.5 0ZM37.8 0C30.3442 0 24.3 6.04416 24.3 13.5C24.3 17.91 26.415 21.825 29.7 24.3L27 35H36L38.7 24.3C42.525 21.375 45 16.74 45 11.475C45 5.13 41.7825 0 37.8 0Z" fill="#21243F" />
                                        </svg>
                                    </div>

                                    <div className="flex-grow min-h-0 flex flex-col justify-start">
                                        <p className="text-[16px] sm:text-[14px] md:text-[13px] lg:text-[14px] xl:text-[17px] 2xl:text-[22px] font-[500] text-[#21243F] font-inter leading-[1.3] 2xl:leading-[1.4]">
                                            {review.text}
                                        </p>
                                    </div>

                                    <p className="text-[14px] sm:text-[16px] xl:text-[20px] 2xl:text-[22px] font-[600] text-[#F25A18] font-inter mt-4 shrink-0">
                                        {review.name}
                                    </p>
                                </motion.div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center w-full">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="group bg-white rounded-[15px] px-6 sm:px-10 py-4 sm:py-5 shadow-[0_4px_25px_rgba(33,36,63,0.3)] flex items-center gap-4 sm:gap-6 transition-all border border-gray-100"
                        >
                            <div className="flex items-center gap-3 sm:gap-5">
                                <div className="w-[32px] h-[32px] sm:w-[45px] sm:h-[45px] flex items-center justify-center shrink-0">
                                    <svg viewBox="0 0 40 40" className="w-full h-full">
                                        <circle cx="12" cy="12" r="7" fill="#9358FF" />
                                        <circle cx="28" cy="12" r="6" fill="#00AAFF" />
                                        <circle cx="14" cy="28" r="8" fill="#00FF85" />
                                        <circle cx="28" cy="26" r="7" fill="#FF5E69" />
                                    </svg>
                                </div>
                                <span className="text-[16px] sm:text-[24px] md:text-[30px] font-[600] text-[#21243F] font-inter transition-colors whitespace-nowrap">
                                    Читать все отзывы на Авито
                                </span>
                            </div>
                            <div className="text-[#21243F] transition-transform group-hover:translate-x-2 shrink-0">
                                <ChevronRight size={windowWidth < 640 ? 24 : 36} strokeWidth={2.5} />
                            </div>
                        </motion.button>
                    </div>
                </div>
            </section>

            {/* Final CTA Block from Screenshot */}
            <section className="pt-20 md:pt-40 mb-0 text-center relative w-full px-4 md:px-0 pb-20 md:pb-40 overflow-hidden">
                {/* Fixed Background (Parallax effect) */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `url(${getAsset("image/block3/fon2.jpg")})`,
                        backgroundAttachment: windowWidth < 1024 ? 'scroll' : 'fixed',
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        backgroundRepeat: 'no-repeat'
                    }}
                />

                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-[32px] sm:text-[40px] md:text-[64px] font-[800] text-[#21243F] leading-tight uppercase font-manrope mb-10 md:mb-20 relative z-10"
                >
                    АТ-СЕРВИС — сервис,<br />
                    на который можно<br />
                    положиться
                </motion.h2>

                <div className="relative h-[160px] md:h-[200px] flex items-center justify-center">
                    <div className="absolute inset-0 z-0 pointer-events-none flex items-center">
                        <svg width="100%" height="100%" viewBox={`0 0 ${windowWidth} ${windowWidth < 768 ? 160 : 200}`} fill="none" className="w-full h-full">
                            <path
                                d={(() => {
                                    const w = windowWidth;
                                    const isMobile = w < 768;
                                    const buttonWidth = isMobile ? Math.min(w - 60, 320) : 550;
                                    const slope = isMobile ? 30 : 70;
                                    const yTop = isMobile ? 70 : 90;
                                    const yBottom = isMobile ? 140 : 185;

                                    const center = w / 2;
                                    const x1 = -10; // Extra padding to ensure it goes off screen
                                    const x2 = center - (buttonWidth / 2) - slope;
                                    const x3 = center - (buttonWidth / 2);
                                    const x4 = center + (buttonWidth / 2);
                                    const x5 = center + (buttonWidth / 2) + slope;
                                    const x6 = w + 10;

                                    return `M ${x1},${yTop} L ${x2},${yTop} L ${x3},${yBottom} L ${x4},${yBottom} L ${x5},${yTop} L ${x6},${yTop}`;
                                })()}
                                stroke="#F25A18"
                                strokeWidth={windowWidth < 768 ? "6" : "10"}
                                strokeLinejoin="miter"
                                strokeLinecap="square"
                                vectorEffect="non-scaling-stroke"
                            />
                        </svg>
                    </div>

                    <motion.a
                        href="#contacts"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        style={{ translateY: windowWidth < 768 ? "5px" : "-10px" }}
                        className="bg-[#21243F] text-white font-[800] text-[18px] md:text-[28px] px-8 md:px-20 py-4 md:py-7 rounded-[10px] md:rounded-[15px] flex items-center gap-3 md:gap-5 shadow-2xl uppercase font-manrope relative z-10"
                    >
                        ВЫЗВАТЬ МАСТЕРА <ChevronRight size={windowWidth < 768 ? 24 : 32} strokeWidth={3} />
                    </motion.a>
                </div>
            </section>

            {/* Footer / Closing Contact Section */}
            <footer id="contacts" className="bg-[#21243F] pt-20 pb-20 px-6 md:px-12 lg:px-48 xl:px-64 w-full relative z-20 mb-0 overflow-hidden">
                <div className="max-w-full mx-auto grid grid-cols-1 lg:grid-cols-3 items-center gap-12 lg:gap-8 xl:gap-16">
                    {/* PC VERSION: LOGO (LEFT) */}
                    <div className="hidden lg:flex flex-col items-start transition-transform duration-300">
                                <img
                                    src={getAsset("image/block9/logo_invert.png")}
                                    alt="AT SERVICE"
                                    className="h-[200px] xl:h-[260px] w-auto mb-2"
                                />
                        <div className="text-white font-manrope font-[800] flex flex-col items-start w-fit lg:ml-4">
                            <h3 className="text-[14px] xl:text-[16px] leading-tight uppercase tracking-[0.04em] whitespace-nowrap">Сервисная служба Истра</h3>
                            <p className="text-[12px] xl:text-[14px] leading-tight mt-1 whitespace-nowrap font-bold tracking-[0.01em]">Обслуживание / Ремонт / Монтаж</p>
                        </div>
                    </div>

                    {/* РЕКВИЗИТЫ ДЛЯ DESKTOP (CENTER) */}
                    <div className="hidden lg:flex flex-col items-center justify-center w-full">
                        <div className="flex flex-col gap-6 text-[#515678] text-[13px] xl:text-[14px] font-semibold font-inter border-x border-white/5 px-10 xl:px-14 py-4">
                            <div className="flex flex-col gap-0.5">
                                <p className="text-white/30 uppercase text-[10px] xl:text-[11px] tracking-widest mb-1">Реквизиты:</p>
                                <p>ИП Бойкова Эльмира Викторовна</p>
                                <p>ИНН: 500406181094</p>
                                <p>ОГРНИП: 323774600215139</p>
                                <p>ОКПО: 2021605256</p>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <p className="text-white/30 uppercase text-[10px] xl:text-[11px] tracking-widest mb-1">Банк:</p>
                                <p>БАНК ВТБ (ПАО) / БИК: 44525411</p>
                                <p className="break-all">Р/С: 40802810223710000000</p>
                                <p className="break-all">К/С: 30101810145250000000</p>
                            </div>
                        </div>
                    </div>

                    {/* MOBILE VERSION */}
                    <div className="flex lg:hidden flex-col items-center text-center w-full">
                        <img
                            src={getAsset("image/block9/logo_invert.png")}
                            alt="AT SERVICE"
                            className="w-[240px] h-auto mb-4"
                        />
                        <div className="text-white font-manrope font-[800] flex flex-col items-center">
                            <h3 className="text-[20px] leading-tight uppercase tracking-[0.04em] whitespace-nowrap">Сервисная служба Истра</h3>
                            <p className="text-[14px] leading-tight mt-1 whitespace-nowrap font-bold tracking-[0.01em] opacity-90">Обслуживание / Ремонт / Монтаж</p>
                        </div>
                    </div>

                    {/* CONTACTS (RIGHT) */}
                    <div className="flex flex-col gap-8 xl:gap-12 text-center lg:text-right w-full lg:w-auto items-center lg:items-end pr-0 lg:pr-4">
                        <div className="flex flex-col items-center lg:items-end">
                            <h4 className="text-[#F25A18] text-[18px] xl:text-[22px] font-semibold font-inter mb-1 xl:mb-2">Адрес:</h4>
                            <p className="text-white text-[18px] xl:text-[22px] font-semibold font-inter leading-tight">
                                Московская область, Истринский район,<br />
                                с. Лучинское, ул. Железнодорожная д. 62 Б
                            </p>
                        </div>

                        <div className="flex flex-col items-center lg:items-end">
                            <h4 className="text-[#F25A18] text-[18px] xl:text-[22px] font-semibold font-inter mb-1 xl:mb-2">Телефон:</h4>
                            <a href="tel:+79776189906" className="text-white text-[28px] xl:text-[42px] font-semibold font-inter hover:text-[#F25A18] transition-colors leading-none tracking-tight">
                                +7 (977) 618-99-06
                            </a>
                        </div>

                        <div className="flex flex-col items-center lg:items-end">
                            <h4 className="text-[#F25A18] text-[18px] xl:text-[22px] font-semibold font-inter mb-2 xl:mb-3">Режим работы:</h4>
                            <p className="text-white text-[18px] xl:text-[22px] font-semibold font-inter leading-none">
                                ПН.- ВС. 9:00-21:00
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center pb-10 px-6 max-w-4xl mx-auto border-t border-white/10 pt-10">
                    <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 text-[#515678] text-[14px] md:text-[16px] font-semibold font-inter mb-10">
                        <div className="flex flex-col gap-1">
                            <p className="text-white/80 uppercase text-[12px] tracking-wider mb-1">Реквизиты:</p>
                            <p>ИП Бойкова Эльмира Викторовна</p>
                            <p>ИНН: 500406181094</p>
                            <p>ОГРНИП: 323774600215139</p>
                            <p>ОКПО: 2021605256</p>
                        </div>
                        <div className="flex flex-col gap-1">
                            <p className="text-white/80 uppercase text-[12px] tracking-wider mb-1">Банковские данные:</p>
                            <p>Банк: БАНК ВТБ (ПАО)</p>
                            <p>БИК: 44525411</p>
                            <p>Корр. счет: 30101810145250000000</p>
                            <p>Расчетный счет: 40802810223710000000</p>
                        </div>
                    </div>
                    
                    <p className="text-[#515678] text-[14px] sm:text-[16px] lg:text-[18px] font-semibold font-inter max-w-none leading-relaxed opacity-60 mb-6">
                        Размещенные данные носят информационный характер и не являются публичной офертой
                    </p>

                    <Link 
                        to="/privacy" 
                        className="text-white/40 hover:text-[#F25A18] text-[12px] sm:text-[14px] uppercase tracking-widest font-bold transition-all border border-white/10 hover:border-[#F25A18]/50 px-6 py-2 rounded-full inline-block"
                    >
                        Политика конфиденциальности
                    </Link>
                </div>
            </footer>
            
            <CookieConsent />
        </div>
    );
};

export default App;
