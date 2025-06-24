import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CustomDrawer.module.scss';
import { Drawer, Button, TimePicker, Input } from 'antd';
import moment from 'moment';
import CardTrip from '../CardTrip';

const cx = classNames.bind(styles);

function CustomDrawer({ open, onClose, onSave, initialTime = '', initialNote = '' }) {
    const formatTime = 'HH:mm';
    const [selectedTime, setSelectedTime] = useState(null);
    const [note, setNote] = useState('');

    useEffect(() => {
        if (initialTime) {
            setSelectedTime(moment(initialTime, formatTime));
        } else {
            setSelectedTime(null);
        }
        setNote(initialNote || '');
    }, [initialTime, initialNote, open]);

    const handleSave = () => {
        onSave(selectedTime ? selectedTime.format(formatTime) : '', note);
    };

    return (
        <Drawer
            placement="right"
            onClose={onClose}
            open={open}
            width={600}
            className={cx('drawer')}
            footer={
                <div className={cx('drawer-footer')}>
                    <Button className={cx('drawer-button')} onClick={onClose}>
                        Hủy
                    </Button>
                    <Button className={cx('drawer-button', 'button-add')} onClick={handleSave}>
                        Lưu
                    </Button>
                </div>
            }
        >
            <div className={cx('drawer-inner')}>
                <h1 className={cx('drawer-title')}>Thêm ghi chú cho địa điểm</h1>
                <div className={cx('drawer-content')}>
                    <CardTrip
                        title="Wimi-Factory"
                        location="Hẻm 30 đường Lê Anh Xuân"
                        image="/wimi2-img.png"
                        showMenu={false}
                        hoverEffect={false}
                        clickEffect={false}
                    />

                    <div className={cx('drawer-item')}>
                        <label className={cx('drawer-label')}>Thời gian</label>

                        <TimePicker
                            placeholder={null}
                            format="HH:mm"
                            value={selectedTime}
                            onChange={setSelectedTime}
                            showNow={false}
                        />
                    </div>
                    <div className={cx('drawer-item')}>
                        <label className={cx('drawer-label')}>Ghi chú</label>
                        <Input.TextArea
                            rows={3}
                            maxLength={70}
                            placeholder="Thêm ghi chú tại đây"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </Drawer>
    );
}

export default CustomDrawer;
