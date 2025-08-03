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
import { getCityBySlugApi, getDestinationsByCityApi } from '~/utils/api';

const cx = classNames.bind(styles);

function CityDetail() {
    const { id: slug } = useParams();
    const [cityData, setCityData] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [destinationsLoading, setDestinationsLoading] = useState(false);

    const pageSize = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const [totalDestinations, setTotalDestinations] = useState(0);

    // Thêm state cho sort và filter
    const [sortOption, setSortOption] = useState('Recommended');
    const [categoryFilters, setCategoryFilters] = useState([]);

    const totalPages = Math.ceil(totalDestinations / pageSize);
    const pagedDestinations = destinations;

    useEffect(() => {
        if (slug) {
            fetchCityData();
        }
    }, [slug]);

    useEffect(() => {
        if (slug) {
            fetchDestinations();
        }
    }, [slug, currentPage, sortOption, categoryFilters]);

    useEffect(() => {
        if (cityData) {
            document.title = `${cityData.name} - GoOhNo`;
        }

        return () => {
            document.title = 'GoOhNo';
        };
    }, [cityData]);

    const fetchDestinations = async () => {
        if (!slug) return;

        try {
            setDestinationsLoading(true);

            console.log('=== FETCHING DESTINATIONS ===');
            console.log('Current page:', currentPage);
            console.log('Page size:', pageSize);
            console.log('Skip:', (currentPage - 1) * pageSize);

            let sort = 'createdAt';
            let order = -1;
            if (sortOption === 'Rate: Low to High') {
                sort = 'statistics.averageRating';
                order = 1;
            } else if (sortOption === 'Rate: High to Low') {
                sort = 'statistics.averageRating';
                order = -1;
            }

            const filters = categoryFilters.length > 0 ? { categories: categoryFilters } : {};

            const response = await getDestinationsByCityApi(slug, {
                limit: pageSize,
                skip: (currentPage - 1) * pageSize,
                sort,
                order,
                ...filters,
            });

            if (response && response.EC === 0) {
                console.log('✅ Fetch successful!');
                console.log('Destinations received:', response.data.destinations.length);
                console.log('Total destinations in city:', response.data.total);
                console.log('Destinations data:', response.data.destinations);
                console.log('==============================');

                setDestinations(response.data.destinations);
                setTotalDestinations(response.data.total);
            } else {
                console.log('❌ Fetch failed!');
                console.log('Response:', response);
                console.log('==============================');

                notification.error({
                    message: 'Lỗi',
                    description: response?.data?.EM || 'Không thể tải danh sách địa điểm',
                });
            }
        } catch (error) {
            console.log('💥 Fetch error!');
            console.error('Error fetching destinations:', error);
            console.log('==============================');

            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải danh sách địa điểm',
            });
        } finally {
            setDestinationsLoading(false);
        }
    };

    const fetchCityData = async () => {
        try {
            setLoading(true);
            const response = await getCityBySlugApi(slug);
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
                            info: Array.isArray(cityData.info) ? cityData.info.slice(0, 2) : [],
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
                            <CitySideBar categoryFilters={categoryFilters} setCategoryFilters={setCategoryFilters} />
                        </div>
                        <div className={cx('list')}>
                            <div className={cx('nav-sorter')}>
                                <ResultSorter sortOption={sortOption} setSortOption={setSortOption} />
                            </div>
                            <div className={cx('items')}>
                                {destinationsLoading ? (
                                    <div className={cx('loading')}>
                                        <Spin size="large" />
                                    </div>
                                ) : pagedDestinations.length > 0 ? (
                                    <>
                                        <div className={cx('result-list')}>
                                            {pagedDestinations.map((destination) => (
                                                <div key={destination._id} className={cx('result-list-item')}>
                                                    <DestinationCard destination={destination} />
                                                </div>
                                            ))}
                                        </div>
                                        {totalDestinations > 0 && (
                                            <div className={cx('pagination')}>
                                                <button
                                                    disabled={currentPage === 1}
                                                    onClick={() => {
                                                        console.log('🔄 PAGINATION: Going to previous page');
                                                        console.log(
                                                            'From page:',
                                                            currentPage,
                                                            'to page:',
                                                            currentPage - 1,
                                                        );
                                                        setCurrentPage(currentPage - 1);
                                                    }}
                                                >
                                                    {'<'}
                                                </button>
                                                <span>
                                                    {currentPage} / {totalPages}
                                                </span>
                                                <button
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => {
                                                        console.log('🔄 PAGINATION: Going to next page');
                                                        console.log(
                                                            'From page:',
                                                            currentPage,
                                                            'to page:',
                                                            currentPage + 1,
                                                        );
                                                        setCurrentPage(currentPage + 1);
                                                    }}
                                                >
                                                    {'>'}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className={cx('empty-message')}>Chưa có địa điểm nào trong thành phố này</div>
                                )}
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
