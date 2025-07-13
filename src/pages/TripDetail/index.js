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
import { getTourBySlugApi, getDestinationsByTagsApi } from '~/utils/api';

const cx = classNames.bind(styles);

const items = [
    { key: 'trip', label: 'Lịch trình' },
    { key: 'suggest', label: 'Địa điểm nổi bậc' },
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
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [destinationsLoading, setDestinationsLoading] = useState(false);

    const pageSize = 6;

    const tripNavOptions = [
        { label: 'Quán ăn & Nhà hàng' },
        { label: 'Quán cà phê' },
        { label: 'Công viên' },
        { label: 'Di tích lịch sử' },
        { label: 'Gần trung tâm' },
        { label: 'Bảo tàng' },
        { label: 'Khu vui chơi' },
        { label: 'Mua sắm' },
        { label: 'Chụp hình sống ảo' },
        { label: 'Thích hợp gia đình' },
        { label: 'Thích hợp cặp đôi' },
    ];

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
            if (!tour?.tags || tour.tags.length === 0) {
                setDestinations([]);
                return;
            }

            setDestinationsLoading(true);
            try {
                const tagIds = tour.tags.map((tag) => tag._id || tag);

                const response = await getDestinationsByTagsApi(tagIds, tour.city?._id, 20);

                if (response && response.EC === 0) {
                    setDestinations(response.data);
                    setFilteredDestinations(response.data);
                    setSelectedIndexes([]);
                } else {
                    console.error('Error response:', response);
                    setDestinations([]);
                }
            } catch (error) {
                console.error('Error fetching destinations by tags:', error);
                setDestinations([]);
                setFilteredDestinations([]);
            } finally {
                setDestinationsLoading(false);
            }
        };

        fetchDestinations();
    }, [tour]);

    useEffect(() => {
        if (selectedIndexes.length === 0) {
            setFilteredDestinations(destinations);
        } else {
            const labelKeywordMap = {
                'quán ăn & nhà hàng': ['quán ăn', 'nhà hàng', 'restaurant', 'ẩm thực', 'món ăn'],
                'quán cà phê': ['cà phê', 'coffee', 'cafe', 'quán cà phê'],
                'công viên': ['công viên', 'park', 'vườn', 'thiên nhiên'],
                'di tích lịch sử': ['di tích', 'lịch sử', 'cổ', 'văn hóa', 'bảo tàng'],
                'gần trung tâm': ['trung tâm', 'downtown', 'city center', 'trung tâm thành phố'],
                'bảo tàng': ['bảo tàng', 'museum', 'triển lãm'],
                'khu vui chơi': ['vui chơi', 'giải trí', 'entertainment', 'game'],
                'mua sắm': ['mua sắm', 'shopping', 'chợ', 'siêu thị'],
                'chụp hình sống ảo': ['sống ảo', 'check-in', 'ảnh đẹp', 'chụp hình'],
                'thích hợp gia đình': ['gia đình', 'family', 'trẻ em'],
                'thích hợp cặp đôi': ['cặp đôi', 'couple', 'lãng mạn'],
            };

            const selectedKeywords = selectedIndexes.flatMap((index) => {
                const label = tripNavOptions[index]?.label.toLowerCase();
                return labelKeywordMap[label] || [label];
            });

            const filtered = destinations.filter((destination) => {
                if (!destination.tags || destination.tags.length === 0) return false;

                return destination.tags.some((tag) => {
                    const tagTitle = (tag.title || tag).toLowerCase();
                    return selectedKeywords.some(
                        (keyword) =>
                            tagTitle.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(tagTitle),
                    );
                });
            });

            setFilteredDestinations(filtered);
        }

        setCurrentPage(1);
    }, [selectedIndexes, destinations, tripNavOptions]);

    const totalPages = Math.ceil(filteredDestinations.length / pageSize);
    const pagedDestinations = filteredDestinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
                                <TripItinerary tour={tour} onTourUpdate={handleTourChange} />
                            </div>
                        )}
                        {activeTab === 'suggest' && (
                            <div className={cx('suggest')}>
                                <TripNav
                                    options={tripNavOptions}
                                    selectedIndexes={selectedIndexes}
                                    onToggle={handleToggle}
                                />

                                {selectedIndexes.length > 0 && (
                                    <div
                                        style={{
                                            padding: '10px 0',
                                            fontSize: '14px',
                                            color: '#666',
                                            borderBottom: '1px solid #f0f0f0',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        Đang lọc theo:{' '}
                                        {selectedIndexes.map((index) => tripNavOptions[index]?.label).join(', ')} • Tìm
                                        thấy {filteredDestinations.length} địa điểm
                                    </div>
                                )}
                                {destinationsLoading ? (
                                    <div style={{ textAlign: 'center', padding: '20px' }}>
                                        <Spin />
                                    </div>
                                ) : (
                                    <div className={cx('suggest')}>
                                        {pagedDestinations.length > 0 ? (
                                            <div className={cx('result-list')}>
                                                {pagedDestinations.map((destination) => (
                                                    <div key={destination._id} className={cx('result-list-item')}>
                                                        <DestinationCard
                                                            destination={destination}
                                                            title={destination.title}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div
                                                style={{
                                                    width: '100%',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    padding: '20px',
                                                    color: '#999',
                                                    fontSize: '14px',
                                                }}
                                            >
                                                {selectedIndexes.length > 0
                                                    ? 'Không có địa điểm nào phù hợp với bộ lọc đã chọn'
                                                    : tour?.tags && tour.tags.length > 0
                                                    ? 'Chưa có địa điểm nào phù hợp với tags của tour này'
                                                    : 'Hãy thêm các thẻ cho hành trình trong phần cài đặt để có gợi ý cá nhân hóa.'}
                                            </div>
                                        )}
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
                    <CityInfo city={tour.city} tour={tour} />
                </div>
            </div>
        </motion.div>
    );
}

export default TripDetail;
