import React from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import HeaderProfilePage from '~/components/HeaderProfilePage';
import MyTripCard from '~/components/MyTripCard';
import DestinationCard from '~/components/DestinationCard';

const cx = classNames.bind(styles);

function Profile() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('header')}>
                <HeaderProfilePage />
            </div>
            <div className={cx('body')}>
                <div className={cx('item')}>
                    <h2 className={cx('title')}>Địa điểm yêu thích</h2>
                    <div className={cx('my-favourite-list')}>
                        <DestinationCard />
                        <DestinationCard />
                    </div>
                </div>
                <div className={cx('item')}>
                    <h2 className={cx('title')}>Lịch trình của bạn</h2>
                    <div className={cx('my-trip-list')}>
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                        <MyTripCard />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Profile;
