import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './CardDestGobot.module.scss';
import { Rate } from 'antd';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const cx = classNames.bind(styles);

function CardDestGobot({
    title,
    location,
    image,
    time = '',
    onClick,
    isSelected = false,
    hoverEffect = true,
    clickEffect = true,
    tags = [],
    rating = 0,
    handleClick,
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

    const displayTags = tags && tags.length > 0 ? tags : ['Văn hóa', 'Ẩm thực', 'Chụp hình'];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuVisible(false);
            }
        };

        if (menuVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuVisible]);


    const motionProps = {
        whileHover: hoverEffect ? { scale: 1.02 } : {},
        whileTap: clickEffect ? { scale: 0.97 } : {},
        style: { cursor: onClick ? 'pointer' : 'default' },
        onClick: onClick ? () => onClick() : undefined,
    };


    return (
        <div onClick={handleClick} className={cx('wrapper')}>
            {time && <p className={cx('time')}>{time}</p>}
            <motion.div className={cx('card', { selected: isSelected })} {...motionProps}>
                <img src={image} alt={title} className={cx('image')} />
                <div className={cx('info')}>
                    <div className={cx('header')}>
                        <div className={cx('title')}>{title}</div>
                    </div>

                    <div className={cx('rating')}>
                        {rating > 0 ? (
                            <Rate disabled allowHalf value={rating} />
                        ) : (
                            <span style={{ fontSize: '12px', color: '#999' }}>Chưa có đánh giá</span>
                        )}
                    </div>
                    {location && (
                        <div className={cx('location')}>
                            <MapPin size={15} />
                            <span>{location}</span>
                        </div>
                    )}
                </div>
            </motion.div>

         
        </div>
    );
}

export default CardDestGobot;
