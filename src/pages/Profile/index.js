import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Spin, message } from 'antd';
import classNames from 'classnames/bind';
import styles from './Profile.module.scss';
import HeaderProfilePage from '~/components/HeaderProfilePage';
import MyTripCard from '~/components/MyTripCard';
import DestinationCard from '~/components/DestinationCard';
import { getUserByIdApi, getUserToursApi, getUserFavoritesApi, removeFromFavoritesApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

function Profile() {
    const { auth, setAuth } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [tours, setTours] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toursLoading, setToursLoading] = useState(true);
    const [favoritesLoading, setFavoritesLoading] = useState(true);

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
            console.log(auth.user);
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

        const fetchUserTours = async () => {
            if (!auth.isAuthenticated || !auth.user.id) {
                setToursLoading(false);
                return;
            }

            try {
                setToursLoading(true);
                const response = await getUserToursApi(1, 20);

                if (response && response.EC === 0) {
                    setTours(response.DT.tours || []);
                } else {
                    message.error(response?.EM || 'Không thể lấy danh sách tour');
                    setTours([]);
                }
            } catch (error) {
                console.error('Error fetching tours:', error);
                message.error('Có lỗi xảy ra khi tải danh sách tour');
                setTours([]);
            } finally {
                setToursLoading(false);
            }
        };

        const fetchUserFavorites = async () => {
            if (!auth.isAuthenticated || !auth.user.id) {
                setFavoritesLoading(false);
                return;
            }

            try {
                setFavoritesLoading(true);
                const response = await getUserFavoritesApi();

                if (response && response.EC === 0) {
                    setFavorites(response.data || []);
                } else {
                    console.error('Cannot fetch user favorites:', response?.EM);
                    setFavorites([]);
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
                setFavorites([]);
            } finally {
                setFavoritesLoading(false);
            }
        };

        if (auth.isAuthenticated && auth.user.id) {
            fetchUserData();
            fetchUserTours();
            fetchUserFavorites();
        } else if (auth.isAuthenticated === false) {
            setLoading(false);
            setToursLoading(false);
            setFavoritesLoading(false);
        }
    }, [auth.isAuthenticated, auth.user.id]);

    const handleTourDeleted = () => {
        const fetchUserTours = async () => {
            if (!auth.isAuthenticated || !auth.user.id) {
                return;
            }

            try {
                setToursLoading(true);
                const response = await getUserToursApi(1, 20);

                if (response && response.EC === 0) {
                    setTours(response.DT.tours || []);
                } else {
                    console.error('Cannot fetch user tours:', response?.EM);
                    setTours([]);
                }
            } catch (error) {
                console.error('Error fetching user tours:', error);
                setTours([]);
            } finally {
                setToursLoading(false);
            }
        };

        fetchUserTours();
    };

    const handleFavoriteRemoved = async (destination) => {
        try {
            const response = await removeFromFavoritesApi(destination._id);
            if (response.EC === 0) {
                setFavorites((prev) => prev.filter((fav) => fav._id !== destination._id));
                message.success('Đã xóa khỏi danh sách yêu thích');
            } else {
                message.error('Có lỗi xảy ra khi xóa khỏi yêu thích');
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            message.error('Có lỗi xảy ra khi xóa khỏi yêu thích');
        }
    };

    const reloadUser = async () => {
        if (!auth.isAuthenticated || !auth.user.id) return;
        try {
            const response = await getUserByIdApi(auth.user.id);
            if (response && response.EC === 0) {
                setUser(response.data);

                setAuth((prev) => {
                    const newAuth = {
                        ...prev,
                        user: {
                            ...prev.user,
                            avatar: response.data.avatar,
                            fullName: response.data.fullName,
                        },
                    };

                    localStorage.setItem('user', JSON.stringify(newAuth.user));
                    return newAuth;
                });
            }
        } catch {}
    };

    if (loading || toursLoading || favoritesLoading) {
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
                <HeaderProfilePage
                    user={user}
                    favouriteCount={favorites.length}
                    tourCount={tours.length}
                    onUserUpdated={reloadUser}
                />
            </div>
            <div className={cx('body')}>
                <div className={cx('item')}>
                    <h2 className={cx('title')}>Địa điểm yêu thích</h2>
                    {favorites && favorites.length > 0 ? (
                        <div className={cx('result-list')}>
                            {favorites.map((destination, index) => (
                                <DestinationCard
                                    key={destination._id || index}
                                    destination={destination}
                                    showRemoveMode={true}
                                    onRemove={handleFavoriteRemoved}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={cx('empty-message')}>
                            <p>Bạn chưa thêm địa điểm yêu thích nào. Hãy khám phá và lưu lại nhé!</p>
                        </div>
                    )}
                </div>
                <div className={cx('item')}>
                    <h2 className={cx('title')}>Lịch trình của bạn</h2>
                    <div className={cx('my-trip-list')}>
                        {tours && tours.length > 0 ? (
                            tours.map((tour, index) => (
                                <MyTripCard key={tour._id || index} tour={tour} onDelete={handleTourDeleted} />
                            ))
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
