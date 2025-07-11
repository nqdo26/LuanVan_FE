import classNames from 'classnames/bind';
import styles from './TripDetail.module.scss';
import { motion } from 'framer-motion';
import TripHeader from '~/components/TripHeader';
import CityInfo from '~/components/CityInfo';
import { Tabs, Spin, message } from 'antd';
import DestinationCard from '~/components/DestinationCard';
import TripNav from '~/components/TripNav';
import { useState, useEffect } from 'react';
import TripItinerary from '~/components/TripItinerary';
import { useParams } from 'react-router-dom';
import { getTourBySlugApi, getDestinationsApi } from '~/utils/api';

const cx = classNames.bind(styles);

const items = [
    { key: 'trip', label: 'Lịch trình' },
    { key: 'suggest', label: 'Địa điểm nổi bật' },
];

const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

function TripDetail() {
    const { slug } = useParams();
    const [activeTab, setActiveTab] = useState('trip');
    const [selectedIndexes, setSelectedIndexes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [tour, setTour] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [destinationsLoading, setDestinationsLoading] = useState(false);

    const pageSize = 6;

    useEffect(() => {
        const fetchTour = async () => {
            if (!slug) return;

            setLoading(true);
            try {
                const response = await getTourBySlugApi(slug);

                if (response && response.EC === 0) {
                    setTour(response.DT);
                } else {
                    message.error('Không tìm thấy hành trình');
                }
            } catch (error) {
                console.error('Error fetching tour:', error);
                message.error('Có lỗi xảy ra khi tải hành trình');
            } finally {
                setLoading(false);
            }
        };

        fetchTour();
    }, [slug]);

    useEffect(() => {
        const fetchDestinations = async () => {
            if (!tour?.city?._id) return;

            setDestinationsLoading(true);
            try {
                const response = await getDestinationsApi();
                if (response.data && response.data.EC === 0) {
                    const cityDestinations = response.data.DT.filter((dest) => dest.city === tour.city._id);
                    setDestinations(cityDestinations);
                }
            } catch (error) {
                console.error('Error fetching destinations:', error);
            } finally {
                setDestinationsLoading(false);
            }
        };

        fetchDestinations();
    }, [tour]);

    const totalPages = Math.ceil(destinations.length / pageSize);
    const pagedDestinations = destinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleToggle = (index) => {
        setSelectedIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleTourChange = (updatedTour) => {
        setTour(updatedTour);
    };

    if (loading) {
        return (
            <div
                className={cx('wrapper')}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!tour) {
        return (
            <div className={cx('wrapper')} style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Không tìm thấy hành trình</h2>
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
                <div className={cx('main')}>
                    <TripHeader tour={tour} onTourChange={handleTourChange} />
                    <Tabs
                        className={cx('tabs')}
                        onChange={(key) => {
                            setActiveTab(key);
                            scrollToSection(key);
                        }}
                        items={items.map(({ key, label }) => ({
                            key,
                            label: <span className={cx('tab-item')}>{label}</span>,
                        }))}
                    />

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'trip' && (
                            <div className={cx('trip')}>
                                <TripItinerary tour={tour} />
                            </div>
                        )}
                        {activeTab === 'suggest' && (
                            <div className={cx('suggest')}>
                                <TripNav
                                    options={[
                                        { label: 'Quán ăn & Nhà hàng' },
                                        { label: 'Quán cà phê' },
                                        { label: 'Công viên' },
                                        { label: 'Di tích lịch sử' },
                                        { label: 'Bảo tàng' },
                                    ]}
                                    selectedIndexes={selectedIndexes}
                                    onToggle={handleToggle}
                                />
                                {destinationsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <Spin />
                                    </div>
                                ) : (
                                    <div className={cx('suggest-list')}>
                                        <div className={cx('result-list')}>
                                            {pagedDestinations.length > 0 ? (
                                                pagedDestinations.map((destination) => (
                                                    <div key={destination._id} className={cx('result-list-item')}>
                                                        <DestinationCard
                                                            destination={destination}
                                                            title={destination.title}
                                                        />
                                                    </div>
                                                ))
                                            ) : (
                                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                                    Chưa có địa điểm nào trong thành phố này
                                                </div>
                                            )}
                                        </div>
                                        {totalPages > 1 && (
                                            <div className={cx('pagination')}>
                                                <button
                                                    disabled={currentPage === 1}
                                                    onClick={() => setCurrentPage(currentPage - 1)}
                                                >
                                                    {'<'}
                                                </button>
                                                <span>
                                                    Trang {currentPage} / {totalPages}
                                                </span>
                                                <button
                                                    disabled={currentPage === totalPages}
                                                    onClick={() => setCurrentPage(currentPage + 1)}
                                                >
                                                    {'>'}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </div>
                <div className={cx('info')}>
                    <CityInfo city={tour.city} />
                </div>
            </div>
        </motion.div>
    );
}

export default TripDetail;
