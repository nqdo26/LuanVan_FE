import { Card, Rate } from 'antd';
import { motion } from 'framer-motion';
import { HeartOutlined } from '@ant-design/icons';
import { AiOutlineEnvironment, AiOutlineClockCircle } from 'react-icons/ai';
import { useState } from 'react';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';

import styles from './DestinationCard.module.scss';
const cx = classNames.bind(styles);

function DestinationCard() {
    const navigate = useNavigate();
    const [liked, setLiked] = useState(false);

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

    const handleCardClick = () => {
        navigate('/destination/wimi-factory');
        window.scrollTo(0, 0);
    };

    const rating = 3.5;
    const badges = ['Chụp hình', 'Học bài', 'Cà phê ngon', 'Sống ảo', 'View đẹp'];
    const maxBadgesToShow = 2;

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
                        <img alt="WIMI-Factory" src="/destination-img.png" className={cx('card-image')} />
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
                    Cần Thơ
                </div>
                <h3 className={cx('title')}>Wimi-Factory Wimi-Factory Wimi-Factory Wimi-Factory Wimi-Factory</h3>

                <div className={cx('badge-container')}>
                    {badges.slice(0, maxBadgesToShow).map((badge, index) => (
                        <div key={index} className={cx('badge')} title={badge}>
                            {truncateText(badge, 11)}
                        </div>
                    ))}
                    {badges.length > maxBadgesToShow && <div className={cx('badge')}>...</div>}
                </div>

                <div className={cx('info')}>
                    <AiOutlineClockCircle style={{ color: 'black', marginRight: '5px' }} />
                    <span>Hoạt động cả ngày</span>
                </div>

                <div className={cx('rating-container')}>
                    <Rate disabled allowHalf value={rating} />
                    <span className={cx('rating-value')}>{rating}</span>
                    <span className={cx('rating-count')}>(300)</span>
                </div>
            </Card>
        </motion.div>
    );
}

export default DestinationCard;
