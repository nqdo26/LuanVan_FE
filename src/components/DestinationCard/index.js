import { Card, Rate, message } from 'antd';
import { motion } from 'framer-motion';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { AiOutlineEnvironment, AiOutlineClockCircle } from 'react-icons/ai';
import { useState, useRef, useContext, useEffect } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './DestinationCard.module.scss';
import { incrementDestinationViewsApi, addToFavoritesApi, removeFromFavoritesApi } from '~/utils/api';
import viewTracker from '~/utils/viewTracker';
import { Trash2 } from 'lucide-react';
import { AuthContext } from '~/components/Context/auth.context';
const cx = classNames.bind(styles);

function DestinationCard({ destination = {}, showRemoveMode = false, onRemove, onFavoriteChange }) {
    const navigate = useNavigate();
    const { auth } = useContext(AuthContext);
    const [isInFavorites, setIsInFavorites] = useState(false);
    const isProcessing = useRef(false);

    const toggleLike = async (e) => {
        e.stopPropagation();

        if (!auth.isAuthenticated) {
            message.warning('Vui lòng đăng nhập để thêm vào yêu thích');
            return;
        }

        try {
            if (isInFavorites) {
                const response = await removeFromFavoritesApi(destination._id);
                if (response.EC === 0) {
                    setIsInFavorites(false);
                    message.success('Đã xóa khỏi danh sách yêu thích');
                    if (onFavoriteChange) onFavoriteChange();
                } else {
                    message.error('Có lỗi xảy ra khi xóa khỏi yêu thích');
                }
            } else {
                const response = await addToFavoritesApi(destination._id);
                if (response.EC === 0) {
                    setIsInFavorites(true);
                    message.success('Đã thêm vào danh sách yêu thích');
                    if (onFavoriteChange) onFavoriteChange();

                    const button = e.currentTarget;
                    for (let i = 0; i < 10; i++) {
                        const particle = document.createElement('span');
                        particle.className = cx('heart-particles');

                        particle.style.setProperty('--x', `${Math.random() * 80 - 40}px`);
                        particle.style.setProperty('--y', `${Math.random() * 80 - 40}px`);

                        button.appendChild(particle);

                        setTimeout(() => {
                            particle.remove();
                        }, 700);
                    }
                } else if (response.EC === 1 && response.EM === 'Destination already in favorites') {
                    message.warning('Địa điểm này đã có trong danh sách yêu thích');
                }
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    const handleCardClick = async (e) => {
        if (isProcessing.current) {
            return;
        }

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        isProcessing.current = true;

        try {
            if (destination._id && viewTracker.canIncrement('destination', destination._id)) {
                try {
                    await incrementDestinationViewsApi(destination._id);
                    console.log('Destination view incremented:', destination._id);
                } catch (error) {
                    console.error('Lỗi khi tăng lượt xem:', error);
                }
            } else if (destination._id) {
                console.log('Destination view increment skipped (cooldown):', destination._id);
            }

            navigate(`/destination/${destination.slug || 'unknown'}`);
            window.scrollTo(0, 0);
        } finally {
            setTimeout(() => {
                isProcessing.current = false;
            }, 1000);
        }
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onRemove && typeof onRemove === 'function') {
            onRemove(destination);
        }
    };

    const getFirstImage = () => {
        if (!destination.album) return '/destination-img.png';

        if (destination.album.space && destination.album.space.length > 0) {
            return destination.album.space[0];
        }
        if (destination.album.fnb && destination.album.fnb.length > 0) {
            return destination.album.fnb[0];
        }
        if (destination.album.extra && destination.album.extra.length > 0) {
            return destination.album.extra[0];
        }

        return '/destination-img.png';
    };

    const getOpenTimeText = () => {
        if (destination.type !== 'restaurant' || !destination.openHour) {
            return 'Đang mở cửa';
        }

        const openHour = destination.openHour;

        if (openHour.allday) {
            return 'Đang mở cửa';
        }

        const now = new Date();
        const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todaySchedule = openHour[currentDay];

        if (!todaySchedule || todaySchedule.open === 'Đóng cửa') {
            return 'Đang đóng cửa';
        }

        const parseTime = (timeStr) => {
            const [hours, minutes] = timeStr.split(':').map(Number);
            return hours * 60 + minutes;
        };

        const openTime = parseTime(todaySchedule.open);
        const closeTime = parseTime(todaySchedule.close);

        if (closeTime > openTime) {
            if (currentTime >= openTime && currentTime <= closeTime) {
                return 'Đang mở cửa';
            }
        } else {
            if (currentTime >= openTime || currentTime <= closeTime) {
                return 'Đang mở cửa';
            }
        }

        return 'Đang đóng cửa';
    };

    const getBadgeClass = () => {
        return destination.type === 'restaurant' ? 'badge-restaurant' : 'badge-tourist';
    };

    const badges = destination.tags?.map((tag) => tag.title || tag.name || tag) || [];
    const maxBadgesToShow = 2;

    const rating = destination.statistics?.averageRating || 0;
    const commentCount = destination.comments?.length || 0;

    const isOpen = getOpenTimeText() === 'Đang mở cửa';

    return (
        <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
            transition={{ duration: 0.3 }}
            className={cx('destination-card')}
        >
            <Card
                onClick={handleCardClick}
                styles={{
                    body: { padding: '16px' },
                }}
                hoverable
                cover={
                    <div className={cx('image-container')}>
                        <img
                            alt={destination.title || 'Destination'}
                            src={getFirstImage()}
                            className={cx('card-image')}
                        />
                        <button
                            className={cx('favorite-btn', { 'remove-btn': showRemoveMode })}
                            onClick={showRemoveMode ? handleRemove : toggleLike}
                        >
                            {showRemoveMode ? (
                                <Trash2 className={cx('remove-icon')} style={{ fontSize: '22px', color: '#ff4d4f' }} />
                            ) : isInFavorites ? (
                                <HeartFilled
                                    className={cx('favourite-icon', 'liked')}
                                    style={{ fontSize: '22px', color: '#ff4d4f', transition: 'color 0.3s ease' }}
                                />
                            ) : (
                                <HeartOutlined
                                    className={cx('favourite-icon')}
                                    style={{ fontSize: '22px', transition: 'color 0.3s ease' }}
                                />
                            )}
                        </button>
                    </div>
                }
                className={cx('card')}
            >
                <div className={cx('location')}>
                    <AiOutlineEnvironment className={cx('icon-location')} />
                    {destination.location?.city?.name || 'Chưa có thông tin'}
                </div>
                <h3 className={cx('title')}>{destination.title || 'Tên địa điểm'}</h3>

                <div className={cx('badge-container')}>
                    {badges.slice(0, maxBadgesToShow).map((badge, index) => (
                        <div key={index} className={cx('badge', getBadgeClass())} title={badge}>
                            {truncateText(badge, 11)}
                        </div>
                    ))}
                    {badges.length > maxBadgesToShow && <div className={cx('badge', getBadgeClass())}>...</div>}
                </div>

                <div className={cx('info')}>
                    <AiOutlineClockCircle
                        style={{
                            color: isOpen ? '#52c41a' : '#ff4d4f',
                            marginRight: '5px',
                        }}
                    />
                    <span style={{ color: isOpen ? '#50b81c' : '#ff4d4f' }}>{getOpenTimeText()}</span>
                </div>

                <div className={cx('rating-container')}>
                    <Rate disabled allowHalf value={rating} />
                    <span className={cx('rating-value')}>{rating.toFixed(1)}</span>
                    <span className={cx('rating-count')}>({commentCount})</span>
                </div>
            </Card>
        </motion.div>
    );
}

export default DestinationCard;
