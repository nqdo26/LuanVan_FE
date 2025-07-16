import React, { useState } from 'react';
import { Button } from 'antd';
import classNames from 'classnames/bind';
import styles from './DestinationOverview.module.scss';
import {
    BulbFilled,
    CheckOutlined,
    ClockCircleOutlined,
    DollarCircleOutlined,
    EditOutlined,
    EnvironmentOutlined,
    FacebookFilled,
    FireFilled,
    GlobalOutlined,
    HeartOutlined,
    InstagramFilled,
    PhoneFilled,
    RiseOutlined,
    ShareAltOutlined,
    TagOutlined,
} from '@ant-design/icons';

const cx = classNames.bind(styles);

function DestinationOverview({ destination = {}, handleSave, handleAddComment, handleShare }) {
    const [showMore, setShowMore] = useState(false);

    const toggleShowMore = () => setShowMore((prev) => !prev);

    const isRestaurant = destination.type === 'restaurant';
    const details = destination.details || {};

    const renderList = (items, icon) => (
        <ul className={cx('list')}>
            {items?.map((item, index) => (
                <li key={index} className={cx('list-item')}>
                    {icon} {item}
                </li>
            ))}
        </ul>
    );

    const getOpenStatus = (hours) => {
        if (!hours) return { status: 'Không có thông tin', color: '#999' };

        if (hours.allday) {
            return { status: 'Mở cửa cả ngày', color: '#52c41a' };
        }

        const now = new Date();
        const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];
        const currentTime = now.getHours() * 60 + now.getMinutes();

        const todaySchedule = hours[currentDay];

        if (!todaySchedule || todaySchedule.open === 'Đóng cửa') {
            return { status: 'Đang đóng cửa', color: '#ff4d4f' };
        }

        const parseTime = (timeStr) => {
            const [h, m] = timeStr.split(':').map(Number);
            return h * 60 + m;
        };

        const openTime = parseTime(todaySchedule.open);
        const closeTime = parseTime(todaySchedule.close);

        if (closeTime > openTime) {
            if (currentTime >= openTime && currentTime <= closeTime) {
                return { status: 'Đang mở cửa', color: '#52c41a' };
            }
        } else {
            if (currentTime >= openTime || currentTime <= closeTime) {
                return { status: 'Đang mở cửa', color: '#52c41a' };
            }
        }

        return { status: 'Đang đóng cửa', color: '#ff4d4f' };
    };

    const renderOpenHours = (hours) => {
        if (!hours) return null;

        const days = {
            mon: 'Thứ hai',
            tue: 'Thứ ba',
            wed: 'Thứ tư',
            thu: 'Thứ năm',
            fri: 'Thứ sáu',
            sat: 'Thứ bảy',
            sun: 'Chủ nhật',
        };

        const todayKey = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][new Date().getDay()];
        const openStatus = getOpenStatus(hours);

        return (
            <ul className={cx('list-time-open')}>
                <li style={{ color: openStatus.color }} className={cx('list-time-open-item', 'opening-status')}>
                    <ClockCircleOutlined /> {openStatus.status}
                </li>
                {Object.entries(hours)
                    .filter(([key]) => key !== 'allday')
                    .map(([key, value]) => {
                        const isToday = key === todayKey;
                        const displayTime = hours.allday
                            ? 'Mở cửa cả ngày'
                            : value.open === 'Đóng cửa'
                            ? 'Đóng cửa'
                            : `${value.open} - ${value.close}`;

                        return (
                            <li key={key} className={cx('list-time-open-item')}>
                                <span className={cx('day-bold')}>{days[key]}:</span>{' '}
                                <span className={cx({ bold: isToday })}>{displayTime}</span>
                            </li>
                        );
                    })}
            </ul>
        );
    };

    const renderIntroduction = () => (
        <div className={cx('overview-item')}>
            <h2 className={cx('title')}>Giới thiệu</h2>
            <div className={cx('content', { expanded: showMore })}>{details.description || 'Chưa có mô tả'}</div>
            {details.description && details.description.length > 200 && (
                <button onClick={toggleShowMore} className={cx('show-more-btn')}>
                    {showMore ? 'Thu gọn' : 'Xem thêm'}
                </button>
            )}
        </div>
    );

    const renderHighlights = () => {
        if (!details.highlight?.length) return null;

        return (
            <div className={cx('overview-item')}>
                <h2 className={cx('title')}>Nổi bật</h2>
                {renderList(details.highlight, <FireFilled style={{ color: '#FF0000' }} />)}
            </div>
        );
    };

    const renderRestaurantContent = () => (
        <>
            {details.services?.length > 0 && (
                <div className={cx('overview-item')}>
                    <h2 className={cx('title')}>Dịch vụ tiện ích</h2>
                    {renderList(details.services, <CheckOutlined style={{ color: '#1890ff' }} />)}
                </div>
            )}
            {details.usefulInfo?.length > 0 && (
                <div className={cx('overview-item')}>
                    <h2 className={cx('title')}>Thông tin hữu ích</h2>
                    {renderList(details.usefulInfo, <BulbFilled style={{ color: '#FAAD14' }} />)}
                </div>
            )}
        </>
    );

    const renderTouristContent = () => (
        <>
            {details.cultureType?.length > 0 && (
                <div className={cx('overview-item')}>
                    <h2 className={cx('title')}>Loại hình văn hóa</h2>
                    {renderList(details.cultureType, <TagOutlined style={{ color: '#722ED1' }} />)}
                </div>
            )}
            {details.activities?.length > 0 && (
                <div className={cx('overview-item')}>
                    <h2 className={cx('title')}>Hoạt động đặc trưng</h2>
                    {renderList(details.activities, <RiseOutlined style={{ color: '#FA541C' }} />)}
                </div>
            )}
            {details.fee?.length > 0 && (
                <div className={cx('overview-item')}>
                    <h2 className={cx('title')}>Chi phí tham quan</h2>
                    {renderList(details.fee, <DollarCircleOutlined style={{ color: '#52c41a' }} />)}
                </div>
            )}
            {details.usefulInfo?.length > 0 && (
                <div className={cx('overview-item')}>
                    <h2 className={cx('title')}>Thông tin hữu ích</h2>
                    {renderList(details.usefulInfo, <BulbFilled style={{ color: '#FAAD14' }} />)}
                </div>
            )}
        </>
    );

    const renderContactInfo = () => (
        <div className={cx('overview-item')}>
            <h2 className={cx('title')}>Địa chỉ & Thông tin liên hệ</h2>
            <p className={cx('address')}>
                <EnvironmentOutlined style={{ color: 'black', marginRight: 4 }} />
                {destination.location?.address || 'Chưa có địa chỉ'}
                {destination.location?.city?.name && `, ${destination.location.city.name}`}
            </p>
            {destination.contactInfo && (
                <div className={cx('contact')}>
                    {destination.contactInfo.facebook && (
                        <p className={cx('contact-item')}>
                            <FacebookFilled style={{ color: '#4267B2' }} />
                            <a
                                href={destination.contactInfo.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'black', marginLeft: '8px' }}
                            >
                                Facebook
                            </a>
                        </p>
                    )}
                    {destination.contactInfo.instagram && (
                        <p className={cx('contact-item')}>
                            <InstagramFilled style={{ color: '#E4405F' }} />
                            <a
                                href={destination.contactInfo.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'black', marginLeft: '8px' }}
                            >
                                Instagram
                            </a>
                        </p>
                    )}
                    {destination.contactInfo.website && (
                        <p className={cx('contact-item')}>
                            <GlobalOutlined style={{ color: '#1890ff' }} />
                            <a
                                href={destination.contactInfo.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'black', marginLeft: '8px' }}
                            >
                                Website
                            </a>
                        </p>
                    )}
                    {destination.contactInfo.phone && (
                        <p className={cx('contact-item')}>
                            <PhoneFilled style={{ color: '#52c41a' }} />
                            <span style={{ marginLeft: '8px' }}>{destination.contactInfo.phone}</span>
                        </p>
                    )}
                </div>
            )}
        </div>
    );

    const renderActionButtons = () => (
        <div className={cx('action-items')}>
            <h2 className={cx('title')}>Tùy chọn với địa điểm</h2>
            <Button icon={<HeartOutlined />} onClick={handleSave} className={cx('button')} type="primary" size="large">
                Lưu địa điểm
            </Button>
            <Button
                icon={<EditOutlined />}
                onClick={handleAddComment}
                className={cx('button')}
                type="primary"
                size="large"
            >
                Viết đánh giá
            </Button>
            <Button
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                className={cx('button')}
                type="primary"
                size="large"
            >
                Chia sẻ địa điểm
            </Button>
        </div>
    );

    const renderOpeningHours = () => {
        if (!isRestaurant || !destination.openHour) return null;

        return (
            <div className={cx('action-items')}>
                <h2 className={cx('title')}>Thời gian mở cửa</h2>
                {renderOpenHours(destination.openHour)}
            </div>
        );
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('overview-and-action')}>
                <div className={cx('overview')}>
                    {renderIntroduction()}
                    {renderHighlights()}
                    {isRestaurant ? renderRestaurantContent() : renderTouristContent()}
                    {renderContactInfo()}
                </div>

                <div className={cx('action')}>
                    {renderActionButtons()}
                    {renderOpeningHours()}
                </div>
            </div>
        </div>
    );
}

export default DestinationOverview;
