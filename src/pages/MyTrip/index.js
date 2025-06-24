import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './MyTrip.module.scss';
import MyTripCard from '~/components/MyTripCard';
import { CirclePlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AddTripDrawer from '~/components/AddTripDrawer';

const cx = classNames.bind(styles);
const MotionBox = motion.div;

function MyTrip() {
    const navigate = useNavigate();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleCreateTrip = () => {
        setIsDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };

    const handleAddTrip = () => {
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
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                    </div>
                </div>
            </motion.div>

            <AddTripDrawer open={isDrawerOpen} onClose={handleCloseDrawer} onAdd={handleAddTrip} />
        </>
    );
}

export default MyTrip;
