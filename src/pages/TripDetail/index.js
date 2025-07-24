import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './TripDetail.module.scss';
import { motion } from 'framer-motion';
import TripHeader from '~/components/TripHeader';
import CityInfo from '~/components/CityInfo';
import { Tabs, Spin, message } from 'antd';
import DestinationCard from '~/components/DestinationCard';
import TripNav from '~/components/TripNav';

import TripItinerary from '~/components/TripItinerary';
import { useParams } from 'react-router-dom';
import { getTourBySlugApi, getDestinationsByTagsApi } from '~/utils/api';

const cx = classNames.bind(styles);

const items = [
    { key: 'trip', label: 'Lịch trình' },
    { key: 'suggest', label: 'Địa điểm nổi bậc' },
    { key: 'favourities', label: 'Địa điểm yêu thích' },
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
    const [favorites, setFavorites] = useState([]);
    const [favoritesLoading, setFavoritesLoading] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setFavoritesLoading(true);
                const res = await import('~/utils/api').then((mod) => mod.getUserFavoritesApi());
                if (res && res.EC === 0) {
                    setFavorites(res.data || []);
                } else {
                    setFavorites([]);
                }
            } catch (error) {
                setFavorites([]);
            } finally {
                setFavoritesLoading(false);
            }
        };
        fetchFavorites();
    }, []);

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
    }, [selectedIndexes, destinations, tripNavOptions]);

    const prevSelectedIndexesRef = React.useRef(selectedIndexes);
    useEffect(() => {
        if (
            prevSelectedIndexesRef.current !== selectedIndexes &&
            (destinations.length !== 0 || tripNavOptions.length !== 0)
        ) {
            setCurrentPage(1);
        }
        prevSelectedIndexesRef.current = selectedIndexes;
    }, [selectedIndexes, destinations, tripNavOptions]);

    const totalPages = Math.ceil(filteredDestinations.length / pageSize);
    const pagedDestinations = filteredDestinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handleToggle = (index) => {
        setSelectedIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleTourChange = (updatedTour) => {
        setTour(updatedTour);
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/trip/${slug}`;
        if (navigator.share) {
            navigator
                .share({
                    title: tour?.name || 'Hành trình',
                    text: `Khám phá hành trình: ${tour?.name || ''}`,
                    url: shareUrl,
                })
                .catch((error) => message.error('Lỗi khi chia sẻ: ' + error.message));
        } else {
            navigator.clipboard.writeText(shareUrl);
            message.info('Đã sao chép liên kết hành trình vào clipboard!');
        }
    };

    const handleDownload = async () => {
        try {
            const html2pdf = (await import('html2pdf.js')).default;

            setIsExporting(true); // 👉 Bật chế độ xuất PDF
            setTimeout(async () => {
                const itineraryElement = document.getElementById('trip-itinerary');
                if (!itineraryElement) {
                    message.error('Không tìm thấy lịch trình để tải xuống');
                    setIsExporting(false);
                    return;
                }

                const filename = tour?.slug;
                const opt = {
                    margin: 0.5,
                    filename: filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true },
                    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
                };

                await html2pdf().from(itineraryElement).set(opt).save();
                message.success('Đã tải lịch trình thành PDF!');
                setIsExporting(false); // 👉 Tắt chế độ xuất sau khi xong
            }, 100); // Delay nhỏ để DOM cập nhật
        } catch (error) {
            setIsExporting(false);
            message.error('Lỗi khi tải xuống lịch trình: ' + error.message);
        }
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
                    <TripHeader
                        tour={tour}
                        handleShare={handleShare}
                        handleDownload={handleDownload}
                        onTourChange={handleTourChange}
                    />
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
                            <div className={cx('trip')} style={{ position: 'relative' }}>
                                {isExporting && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            width: '100%',
                                            height: '100%',
                                            background: 'white',
                                            zIndex: 10,
                                            display: 'flex',

                                            justifyContent: 'center',
                                            transition: 'opacity 0.3s',
                                        }}
                                    >
                                        <Spin style={{ marginTop: 80 }} size="large" tip="Đang xuất PDF..." />
                                    </div>
                                )}
                                <TripItinerary tour={tour} onTourUpdate={handleTourChange} isExporting={isExporting} />
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
                        {activeTab === 'favourities' && (
                            <div className={cx('favourities')}>
                                {favoritesLoading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <Spin size="large" />
                                    </div>
                                ) : favorites && favorites.length > 0 ? (
                                    <div className={cx('result-list')}>
                                        {favorites.map((destination) => (
                                            <DestinationCard
                                                key={destination._id}
                                                destination={destination}
                                                title={destination.title}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        <p>Bạn chưa có địa điểm yêu thích nào.</p>
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
