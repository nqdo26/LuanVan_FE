import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { Spin, notification } from 'antd';
import styles from './CityDetail.module.scss';
import CityGallery from '~/components/CityGallery';
import CustomNav from '~/components/CustomNav';
import WeatherInfo from '~/components/WeatherInfo';
import CitySideBar from '~/components/CitySideBar';
import ResultSorter from '~/components/ResultSorter';
import DestinationCard from '~/components/DestinationCard';
import { getCityBySlugApi } from '~/utils/api';

const cx = classNames.bind(styles);

function CityDetail() {
    const { id: slug } = useParams(); // Đổi tên id thành slug để rõ ý nghĩa
    const [cityData, setCityData] = useState(null);
    const [loading, setLoading] = useState(true);

    const pageSize = 6;
    const [currentPage, setCurrentPage] = useState(1);

    const destinations = [
        { id: 1, title: 'Destination 1' },
        { id: 2, title: 'Destination 2' },
        { id: 3, title: 'Destination 3' },
        { id: 4, title: 'Destination 4' },
        { id: 5, title: 'Destination 5' },
        { id: 6, title: 'Destination 6' },
        { id: 7, title: 'Destination 7' },
        { id: 8, title: 'Destination 8' },
        { id: 9, title: 'Destination 9' },
    ];

    const totalPages = Math.ceil(destinations.length / pageSize);
    const pagedDestinations = destinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    useEffect(() => {
        if (slug) {
            fetchCityData();
        }
    }, [slug]);

    useEffect(() => {
        if (cityData) {
            document.title = `${cityData.name} - Du lịch Việt Nam`;
        }

        return () => {
            document.title = 'Du lịch Việt Nam';
        };
    }, [cityData]);

    const fetchCityData = async () => {
        try {
            setLoading(true);
            const response = await getCityBySlugApi(slug);
            console.log('City response:', response);

            if (response && response.EC === 0) {
                setCityData(response.data);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin thành phố',
                });
            }
        } catch (error) {
            console.error('Error fetching city:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải thông tin thành phố',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!cityData) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: '18px',
                }}
            >
                Không tìm thấy thông tin thành phố
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div id="info" className={cx('header')}>
                    <CityGallery
                        city={{
                            title: cityData.name,
                            description: cityData.description,
                            images: cityData.images || [],
                            time: 'Thời gian tốt nhất để ghé thăm',
                            duration: 'Khám phá từ 2-3 ngày',
                        }}
                    />
                </div>
                <div className={cx('body')}>
                    <div className={cx('nav')}>
                        <CustomNav />
                    </div>
                    <h1 className={cx('title')}>Vài nét về {cityData.name}</h1>
                    <div className={cx('info')}>
                        <p id="destination" className={cx('description')}>
                            {cityData.description}
                        </p>
                    </div>
                    <h1 className={cx('title')}>Các địa điểm và tour du lịch ở {cityData.name}</h1>
                    <div className={cx('destination')}>
                        <div className={'sidebar'}>
                            <CitySideBar />
                        </div>
                        <div className={cx('list')}>
                            <div className={cx('nav')}>
                                <ResultSorter />
                            </div>
                            <div className={cx('items')}>
                                <div className={cx('result-list')}>
                                    {pagedDestinations.map((item) => (
                                        <div key={item.id} className={cx('result-list-item')}>
                                            <DestinationCard title={item.title} />
                                        </div>
                                    ))}
                                </div>
                                <div className={cx('pagination')}>
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        {'<'}
                                    </button>
                                    <span>
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        {'>'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 id="weather" className={cx('title')}>
                        Thông tin hữu ích
                    </h1>
                    <div className={cx('weather')}>
                        <WeatherInfo city={cityData} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CityDetail;
