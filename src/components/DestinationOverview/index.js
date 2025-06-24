import { Button } from 'antd';
import { useState } from 'react';
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
    PlusCircleOutlined,
    RiseOutlined,
    ShareAltOutlined,
    TagOutlined,
} from '@ant-design/icons';

const cx = classNames.bind(styles);

function DestinationOverview({
    destination = {
        title: 'Wimi-Factory',
        description:
            'Wimi-Factory là một không gian cà phê sáng tạo và hiện đại, kết hợp phong cách công nghiệp với thiên nhiên. Không gian được chia thành nhiều khu vực, phù hợp để học tập, làm việc hoặc thư giãn Wimi-Factory là một không gian cà phê sáng tạo và hiện đại, kết hợp phong cách công nghiệp với thiên nhiên. Không gian được chia thành nhiều khu vực, phù hợp để học tập, làm việc hoặc thư giãn Wimi-Factory là một không gian cà phê sáng tạo và hiện đại, kết hợp phong cách công nghiệp với thiên nhiên. Không gian được chia thành nhiều khu vực, phù hợp để học tập, làm việc hoặc thư giãn.',
        type: 'restaura',
        tag: [],
        location: '123 Đường ABC, Quận 1, TP.HCM',
        createAt: new Date(),
        detail: {
            highlight: ['Không gian sáng tạo', 'Thiết kế hiện đại'],
            type: ['Quán cà phê', 'Không gian làm việc'],
            activities: ['Đọc sách', 'Làm việc nhóm'],
            services: ['Wifi miễn phí', 'Đỗ xe miễn phí', 'Thẻ thành viên'],
            usefulInfo: ['Khoảng giá: 20.000 - 100.000 VNĐ', 'Thời điểm lý tưởng: Buổi sáng'],
        },
        openHour: {
            mon: { open: '08:00', close: '22:00' },
            tue: { open: '08:00', close: '22:00' },
            wed: { open: '08:00', close: '22:00' },
            thu: { open: '08:00', close: '22:00' },
            fri: { open: '08:00', close: '22:00' },
            sat: { open: '09:00', close: '23:00' },
            sun: { open: '09:00', close: '23:00' },
        },
        contactInfo: {
            phone: '0123 456 789',
            website: 'https://wimi-factory.com',
            facebook: 'https://facebook.com/wimifactory',
            instagram: 'https://instagram.com/wimifactory',
        },
    },
}) {
    const [showMore, setShowMore] = useState(false);
    const toggleShowMore = () => setShowMore((prev) => !prev);
    const isRestaurant = destination.type === 'restaurant';

    const renderList = (items, icon) => (
        <ul className={cx('list')}>
            {items?.map((item, index) => (
                <li key={index} className={cx('list-item')}>
                    {icon} {item}
                </li>
            ))}
        </ul>
    );

    const renderOpenHours = (hours) => {
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

        return (
            <ul className={cx('list-time-open')}>
                <li style={{ color: '#52c41a' }} className={cx('list-time-open-item', 'opening-status')}>
                    <ClockCircleOutlined /> Đang mở cửa
                </li>
                {Object.entries(hours).map(([key, value]) => {
                    const isToday = key === todayKey;
                    return (
                        <li key={key} className={cx('list-time-open-item')}>
                            <span className={cx('day-bold')}>{days[key]}:</span>{' '}
                            <span className={cx({ bold: isToday })}>
                                {value.open} - {value.close}
                            </span>
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('overview-and-action')}>
                <div className={cx('overview')}>
                    <div className={cx('overview-item')}>
                        <h2 className={cx('title')}>Giới thiệu</h2>
                        <div className={cx('content', { expanded: showMore })}>{destination.description}</div>
                        <button onClick={toggleShowMore} className={cx('show-more-btn')}>
                            {showMore ? 'Thu gọn' : 'Xem thêm'}
                        </button>
                    </div>

                    {destination.detail.highlight?.length > 0 && (
                        <div className={cx('overview-item')}>
                            <h2 className={cx('title')}>Nổi bật</h2>
                            {renderList(destination.detail.highlight, <FireFilled style={{ color: '#FF0000' }} />)}
                        </div>
                    )}

                    {isRestaurant ? (
                        <>
                            {destination.detail.services?.length > 0 && (
                                <div className={cx('overview-item')}>
                                    <h2 className={cx('title')}>Dịch vụ tiện ích</h2>
                                    {renderList(
                                        destination.detail.services,
                                        <CheckOutlined style={{ color: '#1890ff' }} />,
                                    )}
                                </div>
                            )}
                            {destination.detail.usefulInfo?.length > 0 && (
                                <div className={cx('overview-item')}>
                                    <h2 className={cx('title')}>Thông tin hữu ích</h2>
                                    {renderList(
                                        destination.detail.usefulInfo,
                                        <BulbFilled style={{ color: '#FAAD14' }} />,
                                    )}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className={cx('overview-item')}>
                                <h2 className={cx('title')}>Loại hình văn hóa</h2>
                                {renderList(destination.detail.type, <TagOutlined style={{ color: '#722ED1' }} />)}
                            </div>
                            <div className={cx('overview-item')}>
                                <h2 className={cx('title')}>Hoạt động đặc trưng</h2>
                                {renderList(
                                    destination.detail.activities,
                                    <RiseOutlined style={{ color: '#FA541C' }} />,
                                )}
                            </div>
                            <div className={cx('overview-item')}>
                                <h2 className={cx('title')}>Chi phí tham quan</h2>
                                {renderList(
                                    destination.detail.services,
                                    <DollarCircleOutlined style={{ color: '#52c41a' }} />,
                                )}
                            </div>

                            <div className={cx('overview-item')}>
                                <h2 className={cx('title')}>Thông tin hữu ích</h2>
                                {renderList(destination.detail.usefulInfo, <BulbFilled style={{ color: '#FAAD14' }} />)}
                            </div>
                        </>
                    )}

                    <div className={cx('overview-item')}>
                        <h2 className={cx('title')}>Địa chỉ & Thông tin liên hệ</h2>
                        <p className={cx('address')}>
                            <EnvironmentOutlined style={{ color: 'black' }} /> {destination.location}
                        </p>
                        <div className={cx('contact')}>
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
                            <p className={cx('contact-item')}>
                                <PhoneFilled style={{ color: '#52c41a' }} /> {destination.contactInfo.phone}
                            </p>
                        </div>
                    </div>
                </div>

                <div className={cx('action')}>
                    <div className={cx('action-items')}>
                        <h2 className={cx('title')}>Thêm địa điểm vào lịch trình của bạn</h2>
                        <Button icon={<PlusCircleOutlined />} className={cx('button')} type="primary" size="large">
                            Thêm địa điểm
                        </Button>
                    </div>
                    <div className={cx('action-items')}>
                        <Button icon={<HeartOutlined />} className={cx('button')} type="primary" size="large">
                            Lưu địa điểm
                        </Button>
                        <Button icon={<EditOutlined />} className={cx('button')} type="primary" size="large">
                            Viết đánh giá
                        </Button>
                        <Button icon={<ShareAltOutlined />} className={cx('button')} type="primary" size="large">
                            Chia sẻ địa điểm
                        </Button>
                    </div>
                    <div className={cx('action-items')}>
                        <h2 className={cx('title')}>Thời gian mở cửa</h2>
                        {renderOpenHours(destination.openHour)}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DestinationOverview;
