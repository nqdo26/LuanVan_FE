import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Spin } from 'antd';
import FieldList from '~/components/FieldList';
import AlbumUploader from '~/components/AlbumUploader';

import styles from './StepDetailRestaurant.module.scss';

const cx = classNames.bind(styles);

function StepDetailRestaurant({ defaultData, onPrev, onSubmit, loading }) {
    const [data, setData] = useState(defaultData);
    const [error, setError] = useState('');

    const addToList = (key, value) => {
        if (value.trim()) setData((prev) => ({ ...prev, [key]: [...prev[key], value], ['new' + key]: '' }));
    };
    const removeFromList = (key, idx) => {
        setData((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));
    };

    const handleAlbumAdd = (albumKey, files) => {
        setData((prev) => ({
            ...prev,
            album: { ...prev.album, [albumKey]: [...prev.album[albumKey], ...files] },
        }));
    };
    const handleAlbumRemove = (albumKey, idx) => {
        setData((prev) => ({
            ...prev,
            album: { ...prev.album, [albumKey]: prev.album[albumKey].filter((_, i) => i !== idx) },
        }));
    };

    const handleInput = (key, value) => setData((prev) => ({ ...prev, [key]: value }));

    const handleOpenHourChange = (day, field, value) => {
        setData((prev) => ({
            ...prev,
            openHour: {
                ...prev.openHour,
                [day]: { ...prev.openHour[day], [field]: value },
            },
        }));
    };
    const handleAllDayChange = () => {
        setData((prev) => {
            const newAllDay = !prev.openHour.allday;
            const newOpenHour = { ...prev.openHour, allday: newAllDay };

            if (newAllDay) {
                ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].forEach((day) => {
                    newOpenHour[day] = { open: '00:00', close: '23:59' };
                });
            }

            return {
                ...prev,
                openHour: newOpenHour,
            };
        });
    };
    const handleClosedDay = (day) => {
        setData((prev) => ({
            ...prev,
            openHour: {
                ...prev.openHour,
                [day]: { open: 'Đóng cửa', close: 'Đóng cửa' },
            },
        }));
    };

    const handleOpenDay = (day) => {
        setData((prev) => ({
            ...prev,
            openHour: {
                ...prev.openHour,
                [day]: { open: '', close: '' },
            },
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        if (!data.description.trim()) {
            setError('Vui lòng nhập giới thiệu về nhà hàng.');
            return;
        }
        if (!data.highlight.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Nổi bật.');
            return;
        }
        if (!data.services.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Dịch vụ tiện ích.');
            return;
        }
        if (!data.usefulInfo.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Thông tin hữu ích.');
            return;
        }

        if (!data.openHour.allday) {
            const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
            for (let day of days) {
                const oh = data.openHour[day];
                if (oh.open === 'Đóng cửa' && oh.close === 'Đóng cửa') {
                    continue;
                }
                if (!oh.open || !oh.close) {
                    setError('Vui lòng nhập đầy đủ thời gian mở cửa cho tất cả các ngày hoặc chọn Mở cả ngày.');
                    return;
                }
            }
        }
        if (!data.album.space.length) {
            setError('Album Không gian phải có ít nhất 1 ảnh.');
            return;
        }
        if (!data.album.fnb.length) {
            setError('Album Ẩm thực phải có ít nhất 1 ảnh.');
            return;
        }
        if (!data.album.extra.length) {
            setError('Album Thực đơn phải có ít nhất 1 ảnh.');
            return;
        }
        onSubmit(data);
    };

    const getDayLabel = (day) => {
        const map = {
            mon: 'Thứ 2',
            tue: 'Thứ 3',
            wed: 'Thứ 4',
            thu: 'Thứ 5',
            fri: 'Thứ 6',
            sat: 'Thứ 7',
            sun: 'Chủ nhật',
        };
        return map[day] || day;
    };

    return (
        <Spin size="large" spinning={loading}>
            <form className={cx('form')} onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <div className={cx('form-group')}>
                    <label>Giới thiệu</label>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => handleInput('description', e.target.value)}
                        placeholder="Giới thiệu về nhà hàng..."
                    />
                </div>
                <FieldList
                    label="Nổi bật"
                    value={data.highlight}
                    newValue={data.newHighlight || ''}
                    onAdd={() => addToList('highlight', data.newHighlight || '')}
                    onRemove={(i) => removeFromList('highlight', i)}
                    onInput={(e) => handleInput('newHighlight', e.target.value)}
                />
                <FieldList
                    label="Dịch vụ tiện ích"
                    value={data.services}
                    newValue={data.newServices || ''}
                    onAdd={() => addToList('services', data.newServices || '')}
                    onRemove={(i) => removeFromList('services', i)}
                    onInput={(e) => handleInput('newServices', e.target.value)}
                />
                <FieldList
                    label="Thông tin hữu ích"
                    value={data.usefulInfo}
                    newValue={data.newUsefulInfo || ''}
                    onAdd={() => addToList('usefulInfo', data.newUsefulInfo || '')}
                    onRemove={(i) => removeFromList('usefulInfo', i)}
                    onInput={(e) => handleInput('newUsefulInfo', e.target.value)}
                />
                <div className={cx('openhour-section')}>
                    <label>Thời gian mở cửa</label>
                    <div style={{ marginBottom: 8 }}>
                        <label>
                            <input
                                type="checkbox"
                                checked={data.openHour.allday}
                                onChange={handleAllDayChange}
                                style={{ marginRight: 8 }}
                            />
                            Mở cả ngày
                        </label>
                    </div>
                    {!data.openHour.allday && (
                        <div className={cx('openhour-table')}>
                            {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map((day) => (
                                <div key={day} className={cx('openhour-row')}>
                                    <span className={cx('oh-day')}>{getDayLabel(day)}:</span>
                                    {data.openHour[day].open === 'Đóng cửa' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ color: '#999' }}>Đóng cửa</span>
                                            <button
                                                type="button"
                                                className={cx('open-btn')}
                                                onClick={() => handleOpenDay(day)}
                                            >
                                                Mở cửa
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <input
                                                type="time"
                                                value={data.openHour[day].open}
                                                onChange={(e) => handleOpenHourChange(day, 'open', e.target.value)}
                                            />
                                            <span style={{ margin: '0 3px' }}>đến</span>
                                            <input
                                                type="time"
                                                value={data.openHour[day].close}
                                                onChange={(e) => handleOpenHourChange(day, 'close', e.target.value)}
                                            />
                                            <button
                                                type="button"
                                                className={cx('close-btn')}
                                                onClick={() => handleClosedDay(day)}
                                            >
                                                Đóng cửa
                                            </button>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className={cx('section-label')}>Album ảnh</div>
                <div className={cx('album-wrap')}>
                    <AlbumUploader
                        label="Không gian "
                        files={data.album.space}
                        onAdd={(files) => handleAlbumAdd('space', files)}
                        onRemove={(idx) => handleAlbumRemove('space', idx)}
                    />
                    <AlbumUploader
                        label="Ẩm thực "
                        files={data.album.fnb}
                        onAdd={(files) => handleAlbumAdd('fnb', files)}
                        onRemove={(idx) => handleAlbumRemove('fnb', idx)}
                    />
                    <AlbumUploader
                        label="Thực đơn "
                        files={data.album.extra}
                        onAdd={(files) => handleAlbumAdd('extra', files)}
                        onRemove={(idx) => handleAlbumRemove('extra', idx)}
                    />
                </div>
                <div className={cx('btns')}>
                    <button type="button" className={cx('back-btn')} onClick={onPrev} disabled={loading}>
                        Quay lại
                    </button>
                    <button type="submit" className={cx('submit-btn')} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                    </button>
                </div>
            </form>
        </Spin>
    );
}

export default StepDetailRestaurant;
