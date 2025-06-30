import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './StepDetailCity.module.scss';

const cx = classNames.bind(styles);

const FIXED_SEASONS = ['THG 12 - THG 2', 'THG 3 - THG 5', 'THG 6 - THG 8', 'THG 9 - THG 11'];

function StepDetailCity({ defaultData, onPrev, onSubmit, loading }) {
    const [data, setData] = useState(() => ({
        images: defaultData.images || [],
        weather: FIXED_SEASONS.map((season, i) => ({
            title: season,
            minTemp: defaultData.weather?.[i]?.minTemp || '',
            maxTemp: defaultData.weather?.[i]?.maxTemp || '',
            note: defaultData.weather?.[i]?.note || '',
        })),
        info: defaultData.info || [],
    }));

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');

    const handleWeatherChange = (index, field, value) => {
        const newWeather = [...data.weather];
        newWeather[index][field] = value;
        setData((prev) => ({ ...prev, weather: newWeather }));
    };

    const handleInfoChange = (index, field, value) => {
        const newInfo = [...data.info];
        newInfo[index][field] = value;
        setData((prev) => ({ ...prev, info: newInfo }));
    };

    const handleAddInfo = () => {
        if (data.info.length >= 4) return;
        setData((prev) => ({ ...prev, info: [...prev.info, { title: '', description: '' }] }));
    };

    const handleRemoveInfo = (index) => {
        setData((prev) => ({ ...prev, info: prev.info.filter((_, i) => i !== index) }));
    };

    const handleImageChange = ({ fileList }) => {
        if (fileList.length > 4) return;
        setData((prev) => ({ ...prev, images: fileList }));
    };

    const handlePreview = async (file) => {
        const src = file.url || file.preview || URL.createObjectURL(file.originFileObj);
        setPreviewImage(src);
        setPreviewVisible(true);
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const hasImage = data.images.length > 0;
        const weatherValid = data.weather.every(
            (item) => item.title && item.minTemp.trim() !== '' && item.maxTemp.trim() !== '' && item.note.trim() !== '',
        );

        if (!hasImage) {
            alert('Vui lòng tải lên ít nhất 1 ảnh.');
            return;
        }

        if (!weatherValid) {
            alert('Vui lòng điền đầy đủ thông tin thời tiết cho tất cả các mùa.');
            return;
        }

        // Convert weather temp to numbers
        const processedWeather = data.weather.map((item) => ({
            ...item,
            minTemp: parseFloat(item.minTemp),
            maxTemp: parseFloat(item.maxTemp),
        }));

        const submittedData = {
            ...data,
            weather: processedWeather,
        };
        onSubmit(submittedData);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <div className={cx('form-group')}>
                <label>Hình ảnh thành phố</label>
                <Upload
                    listType="picture-card"
                    multiple
                    fileList={data.images}
                    onChange={handleImageChange}
                    onPreview={handlePreview}
                    beforeUpload={() => false}
                >
                    {data.images.length < 4 && (
                        <div>
                            <PlusOutlined /> <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                    )}
                </Upload>
                <Modal
                    style={{
                        padding: 0,
                    }}
                    open={previewVisible}
                    footer={null}
                    onCancel={() => setPreviewVisible(false)}
                >
                    <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>

            <div className={cx('section-label')}>Thời tiết</div>
            {data.weather.map((item, index) => (
                <div key={index} className={cx('form-group')} style={{ marginBottom: '24px' }}>
                    <div className={cx('title')} style={{ marginBottom: 6 }}>
                        {item.title}
                    </div>
                    <div className={cx('form-row')}>
                        <input
                            className={cx('input')}
                            placeholder="Nhiệt độ thấp nhất"
                            value={item.minTemp || ''}
                            onChange={(e) => handleWeatherChange(index, 'minTemp', e.target.value)}
                        />
                        <input
                            className={cx('input')}
                            placeholder="Nhiệt độ cao nhất"
                            value={item.maxTemp || ''}
                            onChange={(e) => handleWeatherChange(index, 'maxTemp', e.target.value)}
                        />
                    </div>
                    <textarea
                        className={cx('textarea')}
                        placeholder="Ghi chú"
                        value={item.note || ''}
                        onChange={(e) => handleWeatherChange(index, 'note', e.target.value)}
                    />
                </div>
            ))}

            <div className={cx('section-label')}>Thông tin hữu ích</div>
            {data.info.map((item, index) => (
                <div key={index} className={cx('form-row')}>
                    <input
                        className={cx('input')}
                        placeholder="Tiêu đề"
                        value={item.title || ''}
                        onChange={(e) => handleInfoChange(index, 'title', e.target.value)}
                    />
                    <input
                        className={cx('input')}
                        placeholder="Nội dung"
                        value={item.description || ''}
                        onChange={(e) => handleInfoChange(index, 'description', e.target.value)}
                    />
                    <button type="button" onClick={() => handleRemoveInfo(index)}>
                        Xoá
                    </button>
                </div>
            ))}
            {data.info.length < 4 && (
                <button type="button" className={cx('add-info-btn')} onClick={handleAddInfo}>
                    + Thêm thông tin
                </button>
            )}

            <div className={cx('btns')}>
                <button type="button" className={cx('back-btn')} onClick={onPrev}>
                    Quay lại
                </button>
                <button type="submit" className={cx('submit-btn')} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
            </div>
        </form>
    );
}

export default StepDetailCity;
