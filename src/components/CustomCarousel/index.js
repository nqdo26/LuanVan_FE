import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Spin } from 'antd';

import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import styles from './CustomCarousel.module.scss';
import classNames from 'classnames/bind';
import DestinationCard from '~/components/DestinationCard';

const cx = classNames.bind(styles);

function CustomCarousel({ title, destinations = [], loading = false, number = 4 }) {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    if (loading) {
        return (
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>{title}</h2>
                <div className={cx('loading-container')}>
                    <Spin size="large" />
                </div>
            </div>
        );
    }

    if (!destinations.length) {
        return (
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>{title}</h2>
                <div className={cx('no-data')}>
                    <p>Không có dữ liệu để hiển thị</p>
                </div>
            </div>
        );
    }

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
                        1200: { slidesPerView: 4 },
                        1150: { slidesPerView: 3 },
                        900: { slidesPerView: 2 },
                        600: { slidesPerView: 2 },
                        0: { slidesPerView: 1 },
                    }}
                >
                    {destinations.map((destination, index) => (
                        <SwiperSlide key={destination._id || index}>
                            <div className={cx('carousel-items')}>
                                <DestinationCard destination={destination} />
                            </div>
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

export default CustomCarousel;
