import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './CityCarousel.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CityCarousel({ title, card, number }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <div className={cx('wrapper')}>
            <h2 className={cx('title')}>{title}</h2>
            <div className={cx('carousel-container')}>
                <div ref={prevRef} className={cx('custom-nav', 'prev')}>
                    <LeftOutlined className={cx('nav-icon')} />
                </div>
                <Swiper
                    modules={[Navigation]}
                    spaceBetween={16}
                    slidesPerView={number}
                    navigation={{
                        prevEl: prevRef.current,
                        nextEl: nextRef.current,
                    }}
                    onInit={(swiper) => {
                        swiper.params.navigation.prevEl = prevRef.current;
                        swiper.params.navigation.nextEl = nextRef.current;
                        swiper.navigation.init();
                        swiper.navigation.update();
                    }}
                    breakpoints={{
                        1200: { slidesPerView: 7 },
                        900: { slidesPerView: 4 },
                        600: { slidesPerView: 3 },
                        0: { slidesPerView: 2 },
                    }}
                >
                    {Array.from({ length: 8 }).map((_, i) => (
                        <SwiperSlide key={i}>
                            <div className={cx('carousel-items')}>{card}</div>
                        </SwiperSlide>
                    ))}
                </Swiper>
                <div ref={nextRef} className={cx('custom-nav', 'next')}>
                    <RightOutlined className={cx('nav-icon')} />
                </div>
            </div>
        </div>
    );
}

export default CityCarousel;
