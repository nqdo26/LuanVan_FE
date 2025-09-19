import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import SearchBar from '~/components/SearchBar';
import DestinationCard from '~/components/DestinationCard';
import { getDestinationsApi } from '~/utils/api';
import { Button } from 'antd';
import { ArrowRightToLine, MoveRight, Bot, MessageCircle, Sparkles } from 'lucide-react';
import { FaLandmark, FaMountain, FaUmbrellaBeach } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function Home() {
    const navigate = useNavigate();

    const [currentSection, setCurrentSection] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [destinations, setDestinations] = useState([]);
    const [isLoadingDestinations, setIsLoadingDestinations] = useState(false);
    const [hoveredBox, setHoveredBox] = useState(null);

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

    const onClickBien = () => {
        navigate('/categories/bien');
    };

    const onClickNui = () => {
        navigate('/categories/nui');
    };

    const onClickVanHoa = () => {
        navigate('/categories/vanhoa');
    };

    const onClickGobot = () => {
        navigate('/gobot-assistant');
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
                                    <motion.h1
                                        className={cx('section-2-title')}
                                        initial={{ opacity: 0, x: -100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                    >
                                        Khám phá những địa điểm du lịch thú vị
                                    </motion.h1>
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: 0.6 }}
                                    >
                                        <Button className={cx('section-2-button')} size="large" href="/destinations">
                                            Xem tất cả địa điểm <ArrowRightToLine size={18} />
                                        </Button>
                                    </motion.div>
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
                                                        duration: 0.6,
                                                        delay: index * 0.3,
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
                            className={cx('section-3-content')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <motion.div
                                className={cx('section-3-box', 'box-1')}
                                onMouseEnter={() => setHoveredBox('box-1')}
                                onMouseLeave={() => setHoveredBox(null)}
                                onClick={onClickNui}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/categories/nui.png)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <motion.h1
                                    className={cx('section-3-title')}
                                    animate={{
                                        y: hoveredBox === 'box-1' ? -20 : 0,
                                        opacity: hoveredBox === 'box-1' ? 0.9 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaMountain /> <p>Thiên nhiên núi rừng</p>
                                </motion.h1>
                                <motion.p
                                    className={cx('section-3-description-wrapper')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: hoveredBox === 'box-1' ? 1 : 0,
                                        y: hoveredBox === 'box-1' ? 0 : 20,
                                    }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <p className={cx('section-3-description')}>
                                        Khám phá vẻ đẹp hoang sơ của núi rừng Việt Nam, nơi thiên nhiên hùng vĩ giao hòa
                                        cùng bầu không khí trong lành, mát mẻ. Những dãy núi trập trùng, thác nước tung
                                        bọt trắng xóa và những bản làng bình yên mang đến cho du khách cảm giác vừa
                                        phiêu lưu, vừa thư thái. Đây là hành trình dành cho những ai yêu thích trekking,
                                        leo núi, hòa mình vào thiên nhiên và tìm lại sự bình yên trong tâm hồn sau những
                                        ngày bộn bề.
                                    </p>
                                    <p className={cx('section-3-button')}>
                                        Khám phá ngay <MoveRight />
                                    </p>
                                </motion.p>
                            </motion.div>
                            <motion.div
                                className={cx('section-3-box', 'box-2')}
                                onMouseEnter={() => setHoveredBox('box-2')}
                                onMouseLeave={() => setHoveredBox(null)}
                                onClick={onClickVanHoa}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/categories/vanhoa.png)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <motion.h1
                                    className={cx('section-3-title')}
                                    animate={{
                                        y: hoveredBox === 'box-2' ? -20 : 0,
                                        opacity: hoveredBox === 'box-2' ? 0.9 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaLandmark />
                                    <p> Hành trình văn hóa</p>
                                </motion.h1>
                                <motion.p
                                    className={cx('section-3-description-wrapper')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: hoveredBox === 'box-2' ? 1 : 0,
                                        y: hoveredBox === 'box-2' ? 0 : 20,
                                    }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <p className={cx('section-3-description')}>
                                        Trải nghiệm chiều sâu văn hóa độc đáo của Việt Nam thông qua những công trình
                                        kiến trúc cổ kính, các di sản lịch sử và lễ hội truyền thống rực rỡ sắc màu. Mỗi
                                        vùng đất là một câu chuyện, một nếp sống riêng, mang đến hành trình khám phá đầy
                                        ý nghĩa cho những ai yêu thích tìm hiểu văn hóa và bản sắc dân tộc. Đây chính là
                                        cơ hội để du khách kết nối với con người địa phương, thưởng thức ẩm thực đặc
                                        trưng và lưu giữ những trải nghiệm tinh thần khó quên.
                                    </p>
                                    <p className={cx('section-3-button')}>
                                        Khám phá ngay <MoveRight />
                                    </p>
                                </motion.p>
                            </motion.div>
                            <motion.div
                                className={cx('section-3-box', 'box-3')}
                                onMouseEnter={() => setHoveredBox('box-3')}
                                onMouseLeave={() => setHoveredBox(null)}
                                onClick={onClickBien}
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.3 }}
                                style={{
                                    backgroundImage: `url(${process.env.PUBLIC_URL}/categories/bien.png)`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                }}
                            >
                                <motion.h1
                                    className={cx('section-3-title')}
                                    animate={{
                                        y: hoveredBox === 'box-3' ? -20 : 0,
                                        opacity: hoveredBox === 'box-3' ? 0.9 : 1,
                                    }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <FaUmbrellaBeach />
                                    <p> Biển đảo</p>
                                </motion.h1>
                                <motion.p
                                    className={cx('section-3-description-wrapper')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{
                                        opacity: hoveredBox === 'box-3' ? 1 : 0,
                                        y: hoveredBox === 'box-3' ? 0 : 20,
                                    }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <p className={cx('section-3-description')}>
                                        Đắm mình trong không gian tươi mát của biển xanh, cát trắng và nắng vàng rực rỡ,
                                        nơi những bãi biển trải dài và hòn đảo xinh đẹp tạo nên một bức tranh thiên
                                        nhiên tuyệt mỹ. Du khách có thể lựa chọn những hoạt động đầy hứng khởi như lặn
                                        ngắm san hô, chèo kayak, hay đơn giản chỉ là thư giãn trên bãi cát mềm mại, tận
                                        hưởng âm thanh sóng vỗ dịu dàng. Biển đảo là điểm đến lý tưởng để nghỉ dưỡng,
                                        khám phá và tái tạo năng lượng cho những hành trình mới.
                                    </p>
                                    <p className={cx('section-3-button')}>
                                        Khám phá ngay <MoveRight />
                                    </p>
                                </motion.p>
                            </motion.div>
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
                            className={cx('section-4-content')}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.3 }}
                        >
                            <div className={cx('section-4-left')}>
                                <motion.h1
                                    className={cx('section-4-title')}
                                    initial={{ opacity: 0, x: -80 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.2 }}
                                >
                                    Gặp gỡ Gobot
                                </motion.h1>
                                <motion.p
                                    className={cx('section-4-subtitle')}
                                    initial={{ opacity: 0, x: -60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.35 }}
                                >
                                    Trợ lý du lịch AI giúp bạn lên lịch trình thông minh, gợi ý điểm đến, ăn uống và kế
                                    hoạch cá nhân hóa chỉ trong vài giây.
                                </motion.p>

                                <motion.ul
                                    className={cx('section-4-features')}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.5 }}
                                >
                                    <li className={cx('feature-item')}>
                                        <Sparkles size={18} /> Gợi ý địa điểm phù hợp yêu cầu, sở thích
                                    </li>
                                    <li className={cx('feature-item')}>
                                        <MessageCircle size={18} /> Trò chuyện tự nhiên như một hướng dẫn viên du lịch
                                    </li>
                                    <li className={cx('feature-item')}>
                                        <Bot size={18} /> Thông tin địa điểm được cập nhật liên tục 
                                    </li>
                                </motion.ul>

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.65 }}
                                >
                                    <Button size="large" className={cx('section-4-button')} onClick={onClickGobot}>
                                        Trò chuyện với Gobot <MoveRight size={18} />
                                    </Button>
                                </motion.div>
                            </div>
                            <motion.div
                                className={cx('section-4-right')}
                                initial={{ opacity: 0, x: 80 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.35 }}
                            >
                                <div className={cx('section-4-illustration-wrap')}>
                                    <img
                                        src={`${process.env.PUBLIC_URL}/ai-img.png`}
                                        alt="Gobot AI"
                                        className={cx('section-4-illustration')}
                                    />
                                    <div className={cx('glow')}></div>
                                </div>
                            </motion.div>
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
