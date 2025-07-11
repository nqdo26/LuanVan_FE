import React, { useState } from 'react';
import { Card, Typography, Dropdown, Menu, message } from 'antd';
import { Ellipsis, Share2, Trash2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './MyTripCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { updateTourApi, deleteTourApi } from '~/utils/api';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);
const { Text } = Typography;

function MyTripCard({ tour, onDelete }) {
    const navigate = useNavigate();
    const [isPublic, setIsPublic] = useState(tour?.isPublic || false);
    const [loading, setLoading] = useState(false);

    const handleMenuClick = ({ key, domEvent }) => {
        domEvent?.stopPropagation();

        switch (key) {
            case 'togglePublic':
                handleTogglePublic();
                break;
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

    const handleTogglePublic = async () => {
        setLoading(true);
        try {
            const response = await updateTourApi(tour._id, { isPublic: !isPublic });
            if (response && response.EC === 0) {
                setIsPublic(!isPublic);
                message.success(`Đã chuyển lịch trình sang ${!isPublic ? 'Công khai' : 'Riêng tư'}`);
            } else {
                message.error('Có lỗi xảy ra khi cập nhật trạng thái');
            }
        } catch (error) {
            console.error('Error updating tour:', error);
            message.error('Có lỗi xảy ra khi cập nhật trạng thái');
        } finally {
            setLoading(false);
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
            key: 'togglePublic',
            label: isPublic ? 'Riêng tư' : 'Công khai',
            icon: isPublic ? <EyeOff size={16} /> : <Eye size={16} />,
            disabled: loading,
        },
        {
            key: 'share',
            label: 'Chia sẻ',
            icon: <Share2 size={16} />,
        },
        {
            key: 'delete',
            label: 'Xóa',
            icon: <Trash2 size={16} />,
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
            whileHover={{ scale: 0.99, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)' }}
            style={{ borderRadius: '12px' }}
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

                            {isPublic ? (
                                <Eye size={16} style={{ color: 'green' }} title="Công khai" />
                            ) : (
                                <EyeOff size={16} style={{ color: 'red' }} title="Riêng tư" />
                            )}
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
