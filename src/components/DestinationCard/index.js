import { Card, Rate } from 'antd';
import { motion } from 'framer-motion';
import { HeartOutlined } from '@ant-design/icons';
import { AiOutlineEnvironment, AiOutlineClockCircle } from 'react-icons/ai';
import { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './DestinationCard.module.scss';
import { incrementDestinationViewsApi } from '~/utils/api';
import viewTracker from '~/utils/viewTracker';
const cx = classNames.bind(styles);

function DestinationCard({ destination = {} }) {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);
    const isProcessing = useRef(false);

    const toggleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);

        if (!liked) {
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
        }
    };

    const truncateText = (text, maxLength) => {
        return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
    };
    const handleCardClick = async (e) => {
        // Prevent multiple executions
        if (isProcessing.current) {
            return;
        }

        // Prevent event bubbling and default behavior
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        isProcessing.current = true;

        try {
            // Tăng lượt xem khi click vào destination card - sử dụng viewTracker
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
            // Reset processing flag after delay
            setTimeout(() => {
                isProcessing.current = false;
            }, 1000);
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

    // Lấy badge class dựa trên type
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
                        <button className={cx('favorite-btn')} onClick={toggleLike}>
                            <HeartOutlined
                                className={cx('favourite-icon', { liked })}
                                style={{ fontSize: '22px', transition: 'color 0.3s ease' }}
                            />
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
