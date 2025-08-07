import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Spin } from 'antd';
import styles from './StepDetailTourist.module.scss';
import FieldList from '~/components/FieldList';
import AlbumUploader from '~/components/AlbumUploader';

const cx = classNames.bind(styles);

function StepDetailTourist({ defaultData, onPrev, onSubmit, loading }) {
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

    // Thời gian mở cửa/đóng cửa
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
            setError('Vui lòng nhập giới thiệu về địa điểm.');
            return;
        }
        if (!data.highlight.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Nổi bật.');
            return;
        }
        if (!data.cultureType.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Loại hình văn hóa.');
            return;
        }
        if (!data.fee.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Chi phí tham quan.');
            return;
        }
        if (!data.usefulInfo.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Thông tin hữu ích.');
            return;
        }
        if (!data.activities.length) {
            setError('Vui lòng nhập ít nhất 1 giá trị cho Hoạt động đặc trưng.');
            return;
        }
        // Validate openHour
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
            setError('Album Nổi bật phải có ít nhất 1 ảnh.');
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
        <Spin spinning={loading} size="large">
            <form className={cx('form')} onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <div className={cx('form-group')}>
                    <label className={cx('title')}>Giới thiệu ({data.description.length}/400 ký tự)</label>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length <= 400) {
                                handleInput('description', value);
                            }
                        }}
                        placeholder="Giới thiệu về địa điểm..."
                        maxLength={400}
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
                    label="Loại hình văn hóa"
                    value={data.cultureType}
                    newValue={data.newCultureType || ''}
                    onAdd={() => addToList('cultureType', data.newCultureType || '')}
                    onRemove={(i) => removeFromList('cultureType', i)}
                    onInput={(e) => handleInput('newCultureType', e.target.value)}
                />
                <FieldList
                    label="Chi phí tham quan"
                    value={data.fee}
                    newValue={data.newFee || ''}
                    onAdd={() => addToList('fee', data.newFee || '')}
                    onRemove={(i) => removeFromList('fee', i)}
                    onInput={(e) => handleInput('newFee', e.target.value)}
                />
                <FieldList
                    label="Thông tin hữu ích"
                    value={data.usefulInfo}
                    newValue={data.newUsefulInfo || ''}
                    onAdd={() => addToList('usefulInfo', data.newUsefulInfo || '')}
                    onRemove={(i) => removeFromList('usefulInfo', i)}
                    onInput={(e) => handleInput('newUsefulInfo', e.target.value)}
                />
                <FieldList
                    label="Hoạt động đặc trưng"
                    value={data.activities}
                    newValue={data.newActivities || ''}
                    onAdd={() => addToList('activities', data.newActivities || '')}
                    onRemove={(i) => removeFromList('activities', i)}
                    onInput={(e) => handleInput('newActivities', e.target.value)}
                />

                {/* Thời gian mở cửa/đóng cửa */}
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
                        label="Không gian"
                        files={data.album.space}
                        onAdd={(files) => handleAlbumAdd('space', files)}
                        onRemove={(idx) => handleAlbumRemove('space', idx)}
                    />
                    <AlbumUploader
                        label="Ẩm thực"
                        files={data.album.fnb}
                        onAdd={(files) => handleAlbumAdd('fnb', files)}
                        onRemove={(idx) => handleAlbumRemove('fnb', idx)}
                    />
                    <AlbumUploader
                        label="Nổi bật"
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

export default StepDetailTourist;
