import React, { useState } from 'react';
import { Card, Typography, Dropdown, Menu } from 'antd';
import { Ellipsis, Share2, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './MyTripCard.module.scss';

const cx = classNames.bind(styles);
const { Text } = Typography;

function MyTripCard() {
    const [isPublic, setIsPublic] = useState(false);

    const menuItems = [
        {
            key: 'togglePublic',
            label: isPublic ? 'Riêng tư' : 'Công khai',
            icon: isPublic ? <EyeOff size={16} /> : <Eye size={16} />,
            onClick: () => {
                setIsPublic(!isPublic);
                alert(`Đã chuyển lịch trình sang ${!isPublic ? 'Công khai' : 'Riêng tư'}`);
            },
        },
        {
            key: 'share',
            label: 'Chia sẻ',
            icon: <Share2 size={16} />,
            onClick: () => {
                alert('Đã copy liên kết chuyến đi!');
            },
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 size={16} />,
            onClick: () => {
                alert('Đã xóa chuyến đi này!');
            },
            danger: true,
        },
    ];

    return (
        <motion.div
            whileHover={{ scale: 0.99, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            style={{ borderRadius: '12px' }}
        >
            <Card
                bordered={false}
                className={cx('trip-card')}
                hoverable={false}
                cover={<img alt="Trip thumbnail" src="/wimi1-img.png" className={cx('trip-image')} />}
            >
                <div className={cx('trip-info')}>
                    <div className={cx('trip-header')}>
                        <div className={cx('title-wrapper')}>
                            <h1 level={5} className={cx('trip-title')}>
                                Du lịch vui ver
                            </h1>

                            {isPublic ? (
                                <Eye size={16} style={{ color: 'green' }} title="Công khai" />
                            ) : (
                                <EyeOff size={16} style={{ color: 'red' }} title="Riêng tư" />
                            )}
                        </div>
                        <Dropdown
                            className={cx('icon-wrapper')}
                            overlay={<Menu items={menuItems} />}
                            trigger={['click']}
                            placement="bottomRight"
                            arrow
                        >
                            <div className={cx('icon-button')} onClick={(e) => e.stopPropagation()}>
                                <Ellipsis size={20} />
                            </div>
                        </Dropdown>
                    </div>
                    <div className={cx('trip-details')}>
                        <Text className={cx('trip-date')}>May 6 → May 9, 2025</Text>
                        <Text className={cx('trip-location')}>Hanoi, Amsterdam, & 4 more</Text>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

export default MyTripCard;
