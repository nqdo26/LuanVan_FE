import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import SearchBar from '~/components/SearchBar';
import DestinationCard from '~/components/DestinationCard';
import { getDestinationsApi } from '~/utils/api';
import { Button } from 'antd';
import { ArrowRightToLine } from 'lucide-react';

const cx = classNames.bind(styles);

function Home() {
    const [currentSection, setCurrentSection] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);

    // Refs for each section
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const section4Ref = useRef(null);

    const sectionRefs = [section1Ref, section2Ref, section3Ref, section4Ref];

    const sectionVariants = {
        hidden: {
            opacity: 0,
        },
        visible: {
            opacity: 1,
        },
        exit: {
            opacity: 0,
        },
    };

    const transition = {
        duration: 0.2,
        ease: 'easeInOut',
    };

    // Load destinations when component mounts
    useEffect(() => {
        const loadDestinations = async () => {
            setIsLoadingDestinations(true);
            try {
                const response = await getDestinationsApi({ limit: 6 });
                if (response && response.data) {
                    // Đảm bảo chỉ lấy tối đa 6 items
                    setDestinations(response.data.slice(0, 6));
                }
            } catch (error) {
                console.error('Error loading destinations:', error);
            } finally {
                setIsLoadingDestinations(false);
            }
        };

        loadDestinations();
    }, []);

    useEffect(() => {
        let isScrolling = false;

        const handleScroll = (e) => {
            if (isScrolling || isTransitioning) return;

            e.preventDefault();
            isScrolling = true;
            setIsTransitioning(true);

            const direction = e.deltaY > 0 ? 1 : -1;
            const nextSection = Math.max(0, Math.min(3, currentSection + direction));

            if (nextSection !== currentSection) {
                setCurrentSection(nextSection);
            } else {
                setTimeout(() => {
                    isScrolling = false;
                    setIsTransitioning(false);
                }, 100);
                return;
            }

            setTimeout(() => {
                isScrolling = false;
                setIsTransitioning(false);
            }, 200);
        };

        window.addEventListener('wheel', handleScroll, { passive: false });

        return () => {
            window.removeEventListener('wheel', handleScroll);
        };
    }, [currentSection, isTransitioning]);

    const scrollToSection = (sectionIndex) => {
        if (isTransitioning) return;
        setIsTransitioning(true);

        setCurrentSection(sectionIndex);

        setTimeout(() => {
            setIsTransitioning(false);
        }, 400);
    };

    const handleSectionClick = (sectionIndex) => {
        scrollToSection(sectionIndex);
    };

    return (
        <div className={cx('wrapper')}>
            <AnimatePresence>
                {/* Section 1 */}
                {currentSection === 0 && (
                    <motion.section
                        key="section-1"
                        ref={section1Ref}
                        className={cx('section', 'section-1')}
                        style={{
                            backgroundImage: `url(${process.env.PUBLIC_URL}/section1.png)`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                        }}
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={transition}
                    >
                        <div className={cx('section-1-content')}>
                            <motion.h1
                                className={cx('section-1-title')}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                Welcome to GoOhNo
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <SearchBar />
                            </motion.div>
                        </div>
                    </motion.section>
                )}

                {/* Section 2 */}
                {currentSection === 1 && (
                    <motion.section
                        key="section-2"
                        ref={section2Ref}
                        className={cx('section', 'section-2')}
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={transition}
                    >
                        <motion.div
                            className={cx('section-content')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <div className={cx('section-2-content')}>
                                <div className={cx('section-2-left')}>
                                    <h1 className={cx('section-2-title')}>Khám phá những địa điểm du lịch thú vị</h1>
                                    <Button className={cx('section-2-button')} size="large" href="/destinations">
                                        Xem tất cả địa điểm <ArrowRightToLine size={18} />
                                    </Button>
                                </div>
                                <div className={cx('section-2-right')}>
                                    {isLoadingDestinations ? (
                                        <div className={cx('loading')}>
                                            <div className={cx('loading-spinner')}></div>
                                        </div>
                                    ) : (
                                        <div className={cx('destinations-grid')}>
                                            {destinations.slice(0, 6).map((destination, index) => (
                                                <motion.div
                                                    key={destination._id}
                                                    className={cx('destination-item')}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{
                                                        duration: 0.5,
                                                        delay: index * 0.1,
                                                    }}
                                                >
                                                    <DestinationCard destination={destination} />
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.section>
                )}

                {/* Section 3 */}
                {currentSection === 2 && (
                    <motion.section
                        key="section-3"
                        ref={section3Ref}
                        className={cx('section', 'section-3')}
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={transition}
                    >
                        <motion.div
                            className={cx('section-content')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <h2>Section 3</h2>
                            {/* Thêm nội dung Section 3 ở đây */}
                        </motion.div>
                    </motion.section>
                )}

                {/* Section 4 */}
                {currentSection === 3 && (
                    <motion.section
                        key="section-4"
                        ref={section4Ref}
                        className={cx('section', 'section-4')}
                        variants={sectionVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={transition}
                    >
                        <motion.div
                            className={cx('section-content')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <h2>Section 4</h2>
                        </motion.div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Navigation dots */}
            <div className={cx('navigation-dots')}>
                {[0, 1, 2, 3].map((index) => (
                    <motion.div
                        key={index}
                        className={cx('dot', { active: currentSection === index })}
                        onClick={() => handleSectionClick(index)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Home;
