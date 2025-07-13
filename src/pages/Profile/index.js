import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Spin, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import HeaderProfilePage from '~/components/HeaderProfilePage';
import MyTripCard from '~/components/MyTripCard';
import DestinationCard from '~/components/DestinationCard';
import { getUserByIdApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

function Profile() {
    const { auth } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!auth.isAuthenticated) {
                return;
            }

            if (!auth.user.id) {
                message.error('Vui lòng đăng nhập để xem thông tin cá nhân');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                const response = await getUserByIdApi(auth.user.id);

                if (response && response.EC === 0) {
                    setUser(response.data);
                } else {
                    message.error(response?.EM || 'Không thể lấy thông tin người dùng');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                console.error('Error details:', error.response?.data || error.message);
                message.error('Có lỗi xảy ra khi tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        if (auth.isAuthenticated && auth.user.id) {
            fetchUserData();
        } else if (auth.isAuthenticated === false) {
            setLoading(false);
        }
    }, [auth.isAuthenticated, auth.user.id]);

    if (loading) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    fontSize: '18px',
                }}
            ></div>
        );
    }
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('header')}>
                <HeaderProfilePage user={user} />
            </div>
            <div className={cx('body')}>
                <div className={cx('item')}>
                    <h2 className={cx('title')}>Địa điểm yêu thích</h2>
                    {user.favortites && user.favortites.length > 0 ? (
                        user.favortites.map((destination, index) => (
                            <div className={cx('result-list')}>
                                <DestinationCard key={destination._id || index} destination={destination} />
                            </div>
                        ))
                    ) : (
                        <div className={cx('empty-message')}>
                            <p>Bạn chưa thêm địa điểm yêu thích nào. Hãy khám phá và lưu lại nhé!</p>
                        </div>
                    )}
                </div>
                <div className={cx('item')}>
                    <h2 className={cx('title')}>Lịch trình của bạn</h2>
                    <div className={cx('my-trip-list')}>
                        {user.tours && user.tours.length > 0 ? (
                            user.tours.map((tour, index) => <MyTripCard key={tour._id || index} tour={tour} />)
                        ) : (
                            <div className={cx('empty-message')}>
                                <p>Bạn chưa có lịch trình nào. Lên kế hoạch cho chuyến đi sắp tới thôi!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Profile;
