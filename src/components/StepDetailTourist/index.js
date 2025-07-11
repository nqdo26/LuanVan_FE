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

    return (
        <Spin spinning={loading} size="large">
            <form className={cx('form')} onSubmit={handleSubmit}>
                {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
                <div className={cx('form-group')}>
                    <label className={cx('title')}>Giới thiệu</label>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => handleInput('description', e.target.value)}
                        placeholder="Giới thiệu về địa điểm..."
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
