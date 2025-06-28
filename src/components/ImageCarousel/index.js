import React, { useRef, useState } from 'react';
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
    const swiperRef = useRef(null);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [firstSlideTriggered, setFirstSlideTriggered] = useState(false);

    const handleImgLoad = () => {
        setImagesLoaded((prev) => prev + 1);
        if (swiperRef.current) {
            swiperRef.current.update();
        }
    };

    React.useEffect(() => {
        if (imagesLoaded === carouselImages.length && swiperRef.current && !firstSlideTriggered) {
            swiperRef.current.slideNext(1000);
            setFirstSlideTriggered(true);
        }
    }, [imagesLoaded, firstSlideTriggered]);

    return (
        <div className="flex justify-center">
            <div className={cx('carousel-bg-wrapper')}>
                <div className={cx('carousel-container')}>
                    <Swiper
                        modules={[EffectCreative, Autoplay]}
                        effect="creative"
                        grabCursor
                        centeredSlides
                        slidesPerView={2.2}
                        loop
                        speed={900}
                        autoplay={{
                            delay: 1800,
                            disableOnInteraction: false,
                        }}
                        creativeEffect={{
                            prev: {
                                shadow: true,
                                translate: ['-120%', 0, -500],
                                scale: 0.8,
                            },
                            next: {
                                shadow: true,
                                translate: ['120%', 0, -500],
                                scale: 0.8,
                            },
                        }}
                        breakpoints={{
                            1200: { slidesPerView: 2.2 },
                            900: { slidesPerView: 1.5 },
                            600: { slidesPerView: 1.1 },
                            0: { slidesPerView: 1 },
                        }}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                    >
                        {carouselImages.map((image, idx) => (
                            <SwiperSlide key={idx}>
                                <div className={cx('carousel-item')}>
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        className={cx('carousel-image')}
                                        onLoad={handleImgLoad}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}

export default ImageCarousel;
