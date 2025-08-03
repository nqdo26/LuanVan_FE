import React, { useState, useEffect } from 'react';
// ...existing code...
import classNames from 'classnames/bind';
import styles from './CustomDrawer.module.scss';
import { Drawer, Button, TimePicker, Input } from 'antd';
import moment from 'moment';
import CardTrip from '../CardTrip';

const cx = classNames.bind(styles);

function CustomDrawer({ open, onClose, onSave, initialTime = '', initialNote = '', editingItem = null }) {
    // Thêm nhận prop isNoteEdit
    const isNoteEdit = typeof arguments[0]?.isNoteEdit !== 'undefined' ? arguments[0].isNoteEdit : false;
    const formatTime = 'HH:mm';
    const [selectedTime, setSelectedTime] = useState(null);
    const [note, setNote] = useState('');
    const [noteTitleInput, setNoteTitleInput] = useState(
        isNoteEdit ? editingItem?.title || editingItem?.name || editingItem?.noteTitle || '' : '',
    );
    // Lấy tiêu đề ghi chú nếu có
    const noteTitle = isNoteEdit ? editingItem?.title || editingItem?.name || editingItem?.noteTitle || '' : '';

    useEffect(() => {
        if (initialTime) {
            setSelectedTime(moment(initialTime, formatTime));
        } else {
            setSelectedTime(null);
        }
        setNote(initialNote || '');
        if (isNoteEdit) {
            setNoteTitleInput(editingItem?.title || editingItem?.name || editingItem?.noteTitle || '');
        }
    }, [initialTime, initialNote, open, isNoteEdit, editingItem]);

    const handleSave = () => {
        if (isNoteEdit) {
            onSave(selectedTime ? selectedTime.format(formatTime) : '', note, noteTitleInput);
        } else {
            onSave(selectedTime ? selectedTime.format(formatTime) : '', note);
        }
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
                <h1 className={cx('drawer-title')}>{isNoteEdit ? 'Chỉnh sửa ghi chú' : 'Thêm ghi chú cho địa điểm'}</h1>
                {isNoteEdit && (
                    <div className={cx('drawer-item')}>
                        <label className={cx('drawer-label')}>Tiêu đề</label>
                        <Input
                            value={noteTitleInput}
                            maxLength={40}
                            placeholder="Nhập tiêu đề ghi chú"
                            onChange={(e) => setNoteTitleInput(e.target.value)}
                        />
                    </div>
                )}
                <div className={cx('drawer-content')}>
                    {!isNoteEdit && (
                        <CardTrip
                            maxTags={2}
                            title={editingItem?.title || 'Wimi-Factory'}
                            location={editingItem?.address || editingItem?.location || 'Hẻm 30 đường Lê Anh Xuân'}
                            image={editingItem?.image || '/wimi2-img.png'}
                            showMenu={false}
                            hoverEffect={false}
                            clickEffect={false}
                            tags={editingItem?.tags || []}
                            type={editingItem?.destinationType || editingItem?.type || 'tourist'}
                            rating={editingItem?.rating || 0}
                        />
                    )}
                    {!isNoteEdit && (
                        <div className={cx('drawer-item')}>
                            <label className={cx('drawer-label')}>Thời gian</label>
                            <TimePicker
                                allowClear
                                placeholder={null}
                                format="HH:mm"
                                value={selectedTime}
                                onChange={setSelectedTime}
                                showNow={false}
                            />
                        </div>
                    )}
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
