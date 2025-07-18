import React, { useState, useEffect } from 'react';

import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { Spin, message, Empty } from 'antd';
import styles from './MyTrip.module.scss';
import MyTripCard from '~/components/MyTripCard';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddTripDrawer from '~/components/AddTripDrawer';
import { getUserToursApi } from '~/utils/api';

const cx = classNames.bind(styles);
const MotionBox = motion.div;

function MyTrip() {
    const navigate = useNavigate();

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTours();
    }, []);

    const fetchTours = async () => {
        setLoading(true);
        try {
            const response = await getUserToursApi(1, 20);

            if (response && response.EC === 0) {
                setTours(response.DT.tours || []);
            } else {
                message.error('Có lỗi xảy ra khi tải danh sách tour');
            }
        } catch (error) {
            console.error('Error fetching tours:', error);
            message.error('Có lỗi xảy ra khi tải danh sách tour');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTrip = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleAddTrip = (newTour) => {
        if (newTour) {
            setTours((prev) => [newTour, ...prev]);
        }
        setIsDrawerOpen(false);
    };

    const handleCreateTripWithAI = () => {
        navigate('/gobot-assistant');
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={cx('wrapper')}
            >
                <h1 className={cx('title')}>Lịch trình của bạn</h1>

                <div className={cx('body')}>
                    <div className={cx('option')}>
                        <MotionBox
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={cx('option-box')}
                            onClick={handleCreateTrip}
                        >
                            <CirclePlus size={30} />
                            <span className={cx('option-text')}>Tạo lịch trình mới</span>
                        </MotionBox>

                        <MotionBox
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.99 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            className={cx('option-box')}
                            onClick={handleCreateTripWithAI}
                        >
                            <img alt="Gobot" src="/ai-img.png" className={cx('ai-img')} />
                            <span className={cx('option-text')}>Tạo lịch trình với Gobot AI</span>
                        </MotionBox>
                    </div>

                    <div className={cx('trip-list')}>
                        {loading ? (
                            <div className={cx('loading-container')}>
                                <Spin size="large" />
                            </div>
                        ) : tours.length > 0 ? (
                            tours.map((tour) => <MyTripCard key={tour._id} tour={tour} onDelete={fetchTours} />)
                        ) : (
                            <div className={cx('empty-message')}>
                                <p>Bạn chưa có lịch trình nào. Lên kế hoạch cho chuyến đi sắp tới thôi!</p>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <AddTripDrawer open={isDrawerOpen} onClose={handleCloseDrawer} onAdd={handleAddTrip} />
        </>
    );
}

export default MyTrip;
