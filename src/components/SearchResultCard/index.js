import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { AiOutlineEnvironment } from 'react-icons/ai';

import styles from './SearchResultCard.module.scss';
import { incrementDestinationViewsApi } from '~/utils/api';
import viewTracker from '~/utils/viewTracker';
const cx = classNames.bind(styles);

function SearchResultCard({ destination = {}, onClick }) {
    const navigate = useNavigate();
    const isProcessing = useRef(false);

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
            // Tăng lượt xem khi click vào search result - sử dụng viewTracker
            if (destination._id && viewTracker.canIncrement('destination', destination._id)) {
                try {
                    await incrementDestinationViewsApi(destination._id);
                    console.log('Search result view incremented:', destination._id);
                } catch (error) {
                    console.error('Lỗi khi tăng lượt xem:', error);
                }
            } else if (destination._id) {
                console.log('Search result view increment skipped (cooldown):', destination._id);
            }

            if (onClick) {
                onClick(destination);
            } else {
                navigate(`/destination/${destination.slug || 'unknown'}`);
                window.scrollTo(0, 0);
            }
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

    return (
        <motion.div className={cx('search-result-card')} onClick={handleCardClick}>
            <div className={cx('image-container')}>
                <img alt={destination.title || 'Destination'} src={getFirstImage()} className={cx('card-image')} />
            </div>
            <div className={cx('card-info')}>
                <h3 className={cx('title')}>{destination.title || 'Tên địa điểm'}</h3>
                <div className={cx('location')}>
                    <AiOutlineEnvironment className={cx('icon-location')} />
                    {destination.location?.city?.name || 'Chưa có thông tin'}
                </div>
            </div>
        </motion.div>
    );
}

export default SearchResultCard;
