import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCreative, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-creative';
import classNames from 'classnames/bind';
import styles from './ImageCarousel.module.scss';

const cx = classNames.bind(styles);

const carouselImages = [
    { src: '/carousel-1.png', alt: 'Image 1' },
    { src: '/carousel-2.png', alt: 'Image 2' },
    { src: '/carousel-3.png', alt: 'Image 3' },
    { src: '/carousel-4.png', alt: 'Image 4' },
    { src: '/carousel-5.png', alt: 'Image 5' },
    { src: '/carousel-6.png', alt: 'Image 6' },
];

function ImageCarousel() {
    const location = useLocation();
    const swiperRef = useRef(null);

    // Force restart autoplay every time route change or component mount
    useEffect(() => {
        const timer = setTimeout(() => {
            if (swiperRef.current && swiperRef.current.autoplay) {
                swiperRef.current.autoplay.start();
            }
        }, 300); // Delay nhỏ để Swiper init xong đã
        return () => clearTimeout(timer);
    }, [location]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex justify-center"
        >
            <div className={cx('carousel-bg-wrapper')}>
                <div className={cx('carousel-container')}>
                    <Swiper
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        modules={[EffectCreative, Autoplay]}
                        effect="creative"
                        grabCursor
                        centeredSlides
                        slidesPerView={2.2}
                        loop
                        speed={1000}
                        autoplay={{
                            delay: 2000,
                            disableOnInteraction: false,
                        }}
                        creativeEffect={{
                            prev: {
                                shadow: true,
                                translate: ['-120%', 0, -500],
                                scale: 0.75,
                            },
                            next: {
                                shadow: true,
                                translate: ['120%', 0, -500],
                                scale: 0.75,
                            },
                        }}
                        breakpoints={{
                            1200: { slidesPerView: 2.2 },
                            900: { slidesPerView: 1.5 },
                            600: { slidesPerView: 1.1 },
                            0: { slidesPerView: 1 },
                        }}
                    >
                        {carouselImages.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className={cx('carousel-item')}>
                                    <img src={image.src} alt={image.alt} className={cx('carousel-image')} />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </motion.div>
    );
}

export default ImageCarousel;
