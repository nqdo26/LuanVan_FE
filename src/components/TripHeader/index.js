import React, { useState } from 'react';
import { Button, Tooltip, Modal, Input, DatePicker } from 'antd';
import {
    ShareAltOutlined,
    SettingOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    MinusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './TripHeader.module.scss';
import CardSearchDrawer from '../CardSearchDrawer';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const cx = classNames.bind(styles);

function TripHeader({ trip, onTripChange }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editedTrip, setEditedTrip] = useState({ ...trip });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleDelete = () => {
        console.log('Xóa chuyến đi');
        setIsModalOpen(false);
    };

    const handleSave = () => {
        onTripChange(editedTrip);
        setIsModalOpen(false);
    };

    const handleChange = (e, field) => {
        setEditedTrip({ ...editedTrip, [field]: e.target.value });
    };

    return (
        <div className={cx('trip-header')}>
            <div className={cx('wrapper')}>
                <img src="/wimi1-img.png" alt="Trip Background" className={cx('background')} />
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <div className={cx('actions')}>
                            <Tooltip title="Chia sẻ">
                                <Button shape="circle" icon={<ShareAltOutlined />} className={cx('actionBtn')} />
                            </Tooltip>
                            <Tooltip title="Cài đặt">
                                <Button
                                    shape="circle"
                                    icon={<SettingOutlined />}
                                    className={cx('actionBtn')}
                                    onClick={handleOpenModal}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={cx('subInfo')}>
                        <h2 className={cx('title')}>{trip.title}</h2>

                        <div className={cx('subItems')}>
                            <div className={cx('item')}>
                                <CalendarOutlined className={cx('label')} />
                                <span className={cx('value')}>
                                    {dayjs(trip.startDate).format('DD/MM/YYYY')}{' '}
                                    <MinusOutlined className={cx('dash')} />
                                    {dayjs(trip.endDate).format('DD/MM/YYYY')}
                                </span>
                            </div>
                            <div className={cx('item')}>
                                <EnvironmentOutlined className={cx('label')} />
                                <span className={cx('value')}>{trip.locations}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal className={cx('modal')} width={550} open={isModalOpen} onCancel={handleCloseModal} footer={null}>
                    <div className={cx('modal-content')}>
                        <h3 className={cx('modal-title')}>Thông tin chuyến đi</h3>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Tên chuyến đi:</label>
                            <Input
                                className={cx('form-input')}
                                value={editedTrip.title}
                                onChange={(e) => handleChange(e, 'title')}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Điểm đến:</label>
                            <Input
                                className={cx('search-input')}
                                prefix={<SearchOutlined className={cx('search-icon')} />}
                                maxLength={80}
                                value={editedTrip.locations}
                                onChange={(e) => handleChange(e, 'locations')}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <CardSearchDrawer
                                city="Cần Thơ"
                                region="Thành phố nực nhất miền Tây"
                                image="/wimi2-img.png"
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Số ngày hoặc độ dài chuyến đi:</label>
                            <DatePicker.RangePicker
                                className={cx('form-input')}
                                locale={locale}
                                format="DD/MM/YYYY"
                                value={[dayjs(editedTrip.startDate), dayjs(editedTrip.endDate)]}
                                onChange={(dates) => {
                                    if (dates) {
                                        setEditedTrip({
                                            ...editedTrip,
                                            startDate: dates[0].format('YYYY-MM-DD'),
                                            endDate: dates[1].format('YYYY-MM-DD'),
                                        });
                                    }
                                }}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Mô tả:</label>
                            <Input.TextArea
                                className={cx('form-input')}
                                rows={2}
                                value={editedTrip.description}
                                onChange={(e) => handleChange(e, 'description')}
                            />
                        </div>
                    </div>

                    <div className={cx('modal-actions')}>
                        <Button onClick={handleDelete} className={cx('modal-btn', 'delete')}>
                            Xóa chuyến đi
                        </Button>
                        <Button onClick={handleSave} className={cx('modal-btn', 'save')}>
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </div>
            <div onClick={handleOpenModal} className={cx('trip-description')}>
                {trip.description || 'Ghi lại vài dòng về kế hoạch, cảm hứng hay điểm đặc biệt của chuyến đi này..'}
            </div>
        </div>
    );
}

export default TripHeader;
