import React, { useState } from 'react';
import { Drawer, Button, Input } from 'antd';
import classNames from 'classnames/bind';
import styles from './AddDestinationDrawer.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import CardTrip from '../CardTrip';

const { TextArea } = Input;
const cx = classNames.bind(styles);

function AddDestinationDrawer({ type, open, onClose, onAdd, title, handleAddNote }) {
    const [selectedTrip, setSelectedTrip] = useState(null);

    const handleSelectTrip = (trip) => {
        setSelectedTrip(trip);
        onAdd(trip);
        setSelectedTrip(null);
    };

    const trips = [
        { title: 'Wimi-Factory 1', location: 'Hẻm 30 đường Lê Anh Xuân', image: '/wimi2-img.png' },
        { title: 'Wimi-Factory 2', location: 'Hẻm 30 đường Lê Anh Xuân', image: '/wimi1-img.png' },
        { title: 'Wimi-Factory 3', location: 'Hẻm 30 đường Lê Anh Xuân', image: '/wimi3-img.png' },
        { title: 'Wimi-Factory 4', location: 'Hẻm 30 đường Lê Anh Xuân', image: '/wimi4-img.png' },
    ];

    return (
        <Drawer
            placement="right"
            onClose={onClose}
            open={open}
            width={550}
            footer={
                <div className={cx('footer')}>
                    <Button className={cx('footer-btn')} onClick={onClose}>
                        Hủy
                    </Button>
                    {type === 'note' && (
                        <Button type="primary" className={cx('footer-btn', 'add-note-btn')} onClick={handleAddNote}>
                            Thêm ghi chú
                        </Button>
                    )}
                </div>
            }
        >
            <div className={cx('body')}>
                <h1 className={cx('title')}>Thêm {title}</h1>
                <div className={cx('content')}>
                    {type === 'note' ? (
                        <>
                            <div className={cx('note-item')}>
                                <p className={cx('note-title')}>Tiêu đề</p>
                                <Input placeholder="Nhập tiêu đề ghi chú" maxLength={80} />
                            </div>
                            <div className={cx('note-item')}>
                                <p className={cx('note-title')}>Nội dung ghi chú</p>
                                <TextArea
                                    placeholder="Nhập nội dung ghi chú"
                                    rows={4}
                                    className={cx('drawer-textarea')}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="Chuyến du lịch Cần Thơ cùng gia đình"
                                maxLength={80}
                                className={cx('drawer-input', 'drawer-search')}
                            />

                            <div className={cx('list-items')}>
                                {trips.map((trip, index) => (
                                    <CardTrip
                                        key={index}
                                        title={trip.title}
                                        location={trip.location}
                                        image={trip.image}
                                        showMenu={false}
                                        onClick={() => handleSelectTrip(trip)}
                                        isSelected={selectedTrip === trip}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Drawer>
    );
}

export default AddDestinationDrawer;
