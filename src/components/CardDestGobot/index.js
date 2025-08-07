import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './CardDestGobot.module.scss';
import { Rate } from 'antd';
import { Ellipsis, MapPin, Pencil, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cx = classNames.bind(styles);

function CardDestGobot({
    title,
    location,
    image,
    time = '',
    note = '',
    showMenu = true,
    onEdit,
    onDelete,
    onClick,
    isSelected = false,
    hoverEffect = true,
    clickEffect = true,
    tags = [],
    rating = 0,
    type = 'tourist',
    handleClick,
    maxTags = 3, // thêm prop này
}) {
    const [menuVisible, setMenuVisible] = useState(false);
    const menuRef = useRef(null);

    const displayTags = tags && tags.length > 0 ? tags : ['Văn hóa', 'Ẩm thực', 'Chụp hình'];
    const visibleTags = displayTags.slice(0, maxTags);
    const hasMore = displayTags.length > maxTags;

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

    const toggleMenu = (e) => {
        e.stopPropagation();
        setMenuVisible((prev) => !prev);
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        setMenuVisible(false);
        if (onEdit) onEdit();
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        setMenuVisible(false);
        if (onDelete) onDelete();
    };

    const motionProps = {
        whileHover: hoverEffect ? { scale: 1.02 } : {},
        whileTap: clickEffect ? { scale: 0.97 } : {},
        style: { cursor: onClick ? 'pointer' : 'default' },
        onClick: onClick ? () => onClick() : undefined,
    };

    const getBadgeClass = () => {
        return type === 'restaurant' ? 'badge-restaurant' : 'badge-tourist';
    };

    return (
        <div onClick={handleClick} className={cx('wrapper')}>
            {time && <p className={cx('time')}>{time}</p>}
            <motion.div className={cx('card', { selected: isSelected })} {...motionProps}>
                <img src={image} alt={title} className={cx('image')} />
                <div className={cx('info')}>
                    <div className={cx('header')}>
                        <div className={cx('title')}>{title}</div>

                        {showMenu && (
                            <div className={cx('action')} onClick={toggleMenu} ref={menuRef}>
                                <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                    <Ellipsis size={20} />
                                </motion.div>

                                <AnimatePresence>
                                    {menuVisible && (
                                        <motion.div
                                            className={cx('menu')}
                                            initial={{ opacity: 0, y: -5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className={cx('menu-item')} onClick={handleEdit}>
                                                <Pencil size={16} />
                                                <span>Thêm ghi chú</span>
                                            </div>

                                            <div className={cx('menu-item', 'delete')} onClick={handleDelete}>
                                                <Trash2 size={16} />
                                                <span>Xóa</span>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    <div className={cx('rating')}>
                        {rating > 0 ? (
                            <Rate disabled allowHalf value={rating} />
                        ) : (
                            <span style={{ fontSize: '14px', color: '#999' }}>Chưa có đánh giá</span>
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

            <p className={cx('note')}>{note}</p>
        </div>
    );
}

export default CardDestGobot;
