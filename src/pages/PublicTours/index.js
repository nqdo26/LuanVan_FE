import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spin, Card, Empty, Input, Select, Pagination } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './PublicTours.module.scss';
import { getPublicToursApi, getCitiesApi } from '~/utils/api';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

function PublicTours() {
    const navigate = useNavigate();
    const [tours, setTours] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const pageSize = 12;

    useEffect(() => {
        fetchCities();
    }, []);

    useEffect(() => {
        fetchTours();
    }, [currentPage, selectedCity]);

    const fetchCities = async () => {
        try {
            const response = await getCitiesApi();
            if (response.data && response.data.EC === 0) {
                setCities(response.data.DT);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const fetchTours = async () => {
        setLoading(true);
        try {
            const params = {
                page: currentPage,
                limit: pageSize,
                cityId: selectedCity,
            };

            const response = await getPublicToursApi(params);
            if (response.data && response.data.EC === 0) {
                setTours(response.data.DT.tours || []);
                setTotalItems(response.data.DT.pagination?.totalItems || 0);
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTourClick = (tour) => {
        navigate(`/trip-detail/${tour.slug}`);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
    };

    const handleCityChange = (value) => {
        setSelectedCity(value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDate = (startDate, endDate) => {
        if (startDate && endDate) {
            return `${dayjs(startDate).format('DD/MM')} - ${dayjs(endDate).format('DD/MM/YYYY')}`;
        }
        return 'Chưa xác định';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('header')}>
                <h1 className={cx('title')}>Khám phá lịch trình du lịch</h1>
                <p className={cx('subtitle')}>Tham khảo các lịch trình được chia sẻ bởi cộng đồng</p>

                <div className={cx('filters')}>
                    <Input
                        placeholder="Tìm kiếm lịch trình..."
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className={cx('search-input')}
                        size="large"
                    />

                    <Select
                        placeholder="Chọn thành phố"
                        value={selectedCity}
                        onChange={handleCityChange}
                        className={cx('city-select')}
                        size="large"
                        allowClear
                    >
                        {cities.map((city) => (
                            <Select.Option key={city._id} value={city._id}>
                                {city.title}
                            </Select.Option>
                        ))}
                    </Select>
                </div>
            </div>

            <div className={cx('content')}>
                {loading ? (
                    <div className={cx('loading')}>
                        <Spin size="large" />
                    </div>
                ) : tours.length > 0 ? (
                    <>
                        <div className={cx('tours-grid')}>
                            {tours.map((tour) => (
                                <motion.div
                                    key={tour._id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTourClick(tour)}
                                >
                                    <Card
                                        hoverable
                                        className={cx('tour-card')}
                                        cover={
                                            <img
                                                alt={tour.name}
                                                src={tour.city?.images?.[0] || '/wimi1-img.png'}
                                                className={cx('tour-image')}
                                            />
                                        }
                                    >
                                        <Card.Meta
                                            title={<span className={cx('tour-title')}>{tour.name}</span>}
                                            description={
                                                <div className={cx('tour-info')}>
                                                    <div className={cx('tour-location')}>📍 {tour.city?.name}</div>
                                                    <div className={cx('tour-date')}>
                                                        📅 {formatDate(tour.duration?.starDay, tour.duration?.endDay)}
                                                    </div>
                                                    {tour.duration?.numDays && (
                                                        <div className={cx('tour-duration')}>
                                                            ⏱️ {tour.duration.numDays} ngày
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {totalItems > pageSize && (
                            <div className={cx('pagination')}>
                                <Pagination
                                    current={currentPage}
                                    total={totalItems}
                                    pageSize={pageSize}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    showQuickJumper
                                    showTotal={(total, range) => `${range[0]}-${range[1]} của ${total} lịch trình`}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className={cx('empty-state')}>
                        <Empty description="Chưa có lịch trình công khai nào" image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default PublicTours;
