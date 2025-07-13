import React, { useState } from 'react';
import { Card, Typography, Dropdown, Menu, message } from 'antd';
import { Ellipsis, Share2, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './MyTripCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { deleteTourApi } from '~/utils/api';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);
const { Text } = Typography;

function MyTripCard({ tour, onDelete }) {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    const handleMenuClick = ({ key, domEvent }) => {
        domEvent?.stopPropagation();

        switch (key) {
            case 'share':
                handleShare();
                break;
            case 'delete':
                handleDelete();
                break;
            default:
                break;
        }
    };

    const handleShare = () => {
        const url = `${window.location.origin}/trip-detail/${tour.slug}`;
        navigator.clipboard
            .writeText(url)
            .then(() => {
                message.success('Đã copy liên kết chuyến đi!');
            })
            .catch(() => {
                message.error('Không thể copy liên kết');
            });
    };

    const handleDelete = async () => {
        setLoading(true);
        try {
            const response = await deleteTourApi(tour._id);
            if (response && response.EC === 0) {
                message.success('Đã xóa chuyến đi thành công!');
                if (onDelete) {
                    onDelete();
                }
            } else {
                message.error('Có lỗi xảy ra khi xóa chuyến đi');
            }
        } catch (error) {
            console.error('Error deleting tour:', error);
            message.error('Có lỗi xảy ra khi xóa chuyến đi');
        } finally {
            setLoading(false);
        }
    };

    const handleCardClick = () => {
        navigate(`/trip-detail/${tour.slug}`);
    };

    const menuItems = [
        {
            key: 'share',
            label: 'Chia sẻ',
            icon: <Share2 size={16} />,
        },
        {
            key: 'delete',
            label: (
                <span
                    style={{
                        color: 'red',
                    }}
                >
                    Xóa
                </span>
            ),
            icon: <Trash2 color="red" size={16} />,
            danger: true,
            disabled: loading,
        },
    ];

    const formatDate = (startDate, endDate) => {
        if (startDate && endDate) {
            return `${dayjs(startDate).format('MMM D')} → ${dayjs(endDate).format('MMM D, YYYY')}`;
        }
        return 'Chưa thêm thông tin về thời gian';
    };
    return (
        <motion.div
            whileHover={{ scale: 1, boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)' }}
            transition={{ duration: 0.3 }}
            className={cx('destination-card')}
            onClick={handleCardClick}
        >
            <Card
                bordered={false}
                className={cx('trip-card')}
                hoverable={false}
                cover={
                    <img
                        alt="Trip thumbnail"
                        src={tour?.city?.images?.[0] || '/wimi1-img.png'}
                        className={cx('trip-image')}
                    />
                }
            >
                <div className={cx('trip-info')}>
                    <div className={cx('trip-header')}>
                        <div className={cx('title-wrapper')}>
                            <h1 level={5} className={cx('trip-title')}>
                                {tour?.name || 'Chưa có tên'}
                            </h1>
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                            <Dropdown
                                className={cx('icon-wrapper')}
                                overlay={<Menu items={menuItems} onClick={handleMenuClick} />}
                                trigger={['click']}
                                placement="bottomRight"
                                arrow
                            >
                                <div className={cx('icon-button')}>
                                    <Ellipsis size={20} />
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                    <div className={cx('trip-details')}>
                        <Text className={cx('trip-date')}>
                            {formatDate(tour?.duration?.starDay, tour?.duration?.endDay)}
                        </Text>
                        <Text className={cx('trip-location')}>{tour?.city?.name || 'Chưa thêm địa điểm'}</Text>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}

export default MyTripCard;
