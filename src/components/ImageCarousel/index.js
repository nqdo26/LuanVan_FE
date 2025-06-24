import React from 'react';
import { motion } from 'framer-motion';
import { Carousel } from 'antd';
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
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="flex justify-center"
        >
            <div className={cx('carousel-container')}>
                <Carousel autoplay autoplaySpeed={3000} effect="scrollx">
                    {carouselImages.map((image, index) => (
                        <div key={index} className={cx('carousel-item')}>
                            <img src={image.src} alt={image.alt} className={cx('carousel-image')} />
                        </div>
                    ))}
                </Carousel>
            </div>
        </motion.div>
    );
}

export default ImageCarousel;
