import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import styles from './CityEditForm.module.scss';
import { getCityTypesApi } from '~/utils/api';

const cx = classNames.bind(styles);

const FIXED_SEASONS = ['THG 12 - THG 2', 'THG 3 - THG 5', 'THG 6 - THG 8', 'THG 9 - THG 11'];

function CityEditForm({ defaultData = {}, onSubmit, loading = false }) {
    const [typeOptions, setTypeOptions] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [form, setForm] = useState({
        title: defaultData.title || '',
        description: defaultData.description || '',
        type: defaultData.type || [],
        images: defaultData.images || [],
        weather: FIXED_SEASONS.map((season, i) => ({
            title: season,
            minTemp: defaultData.weather?.[i]?.minTemp || '',
            maxTemp: defaultData.weather?.[i]?.maxTemp || '',
            note: defaultData.weather?.[i]?.note || '',
        })),
        info: defaultData.info || [],
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTypes = async () => {
            const res = await getCityTypesApi();
            if (Array.isArray(res.data)) {
                setTypeOptions(res.data.map((t) => ({ value: t._id, label: t.title })));
            }
        };
        fetchTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleTypeChange = (typeId) => {
        setForm((prev) => {
            const currentTypes = prev.type || [];
            const isSelected = currentTypes.includes(typeId);
            return {
                ...prev,
                type: isSelected ? currentTypes.filter((id) => id !== typeId) : [...currentTypes, typeId],
            };
        });
        setError('');
    };

    const handleWeatherChange = (index, field, value) => {
        const newWeather = [...form.weather];
        newWeather[index][field] = value;
        setForm((prev) => ({ ...prev, weather: newWeather }));
    };

    const handleInfoChange = (index, field, value) => {
        const newInfo = [...form.info];
        newInfo[index][field] = value;
        setForm((prev) => ({ ...prev, info: newInfo }));
    };

    const handleAddInfo = () => {
        if (form.info.length >= 4) return;
        setForm((prev) => ({ ...prev, info: [...prev.info, { title: '', description: '' }] }));
    };

    const handleRemoveInfo = (index) => {
        setForm((prev) => ({ ...prev, info: prev.info.filter((_, i) => i !== index) }));
    };

    const handleImageChange = ({ fileList }) => {
        if (fileList.length > 4) return;
        setForm((prev) => ({ ...prev, images: fileList }));
    };

    const handlePreview = async (file) => {
        const src = file.url || file.preview || URL.createObjectURL(file.originFileObj);
        setPreviewImage(src);
        setPreviewVisible(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { title, description, type, images, weather } = form;
        const hasImage = images.length > 0;
        const weatherValid = weather.every(
            (item) => item.title && item.minTemp.trim() !== '' && item.maxTemp.trim() !== '' && item.note.trim() !== '',
        );

        if (!title || !description || !type.length) {
            setError('Vui lòng điền đầy đủ thông tin và chọn ít nhất một phân loại.');
            return;
        }

        if (!hasImage) {
            alert('Vui lòng tải lên ít nhất 1 ảnh.');
            return;
        }

        if (!weatherValid) {
            alert('Vui lòng điền đầy đủ thông tin thời tiết cho tất cả các mùa.');
            return;
        }

        const processedWeather = weather.map((item) => ({
            ...item,
            minTemp: parseFloat(item.minTemp),
            maxTemp: parseFloat(item.maxTemp),
        }));

        const finalData = {
            ...form,
            weather: processedWeather,
        };

        onSubmit(finalData);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="title">Tên thành phố</label>
                    <input className={cx('input')} id="title" name="title" value={form.title} onChange={handleChange} />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="description">Mô tả</label>
                    <textarea
                        id="description"
                        name="description"
                        className={cx('input')}
                        rows={3}
                        value={form.description}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label>Phân loại</label>
                    <div className={cx('checkbox-group')}>
                        {typeOptions.map((opt) => (
                            <label key={opt.value} className={cx('checkbox-item')}>
                                <input
                                    type="checkbox"
                                    checked={form.type.includes(opt.value)}
                                    onChange={() => handleTypeChange(opt.value)}
                                />
                                <span>{opt.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <div className={cx('form-group')}>
                <label>Hình ảnh thành phố</label>
                <Upload
                    listType="picture-card"
                    multiple
                    fileList={form.images}
                    onChange={handleImageChange}
                    onPreview={handlePreview}
                    beforeUpload={() => false}
                >
                    {form.images.length < 4 && (
                        <div>
                            <PlusOutlined /> <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                        </div>
                    )}
                </Upload>
                <Modal open={previewVisible} footer={null} onCancel={() => setPreviewVisible(false)}>
                    <img alt="preview" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>

            <div className={cx('section-label')}>Thời tiết</div>
            {form.weather.map((item, index) => (
                <div key={index} className={cx('form-group')} style={{ marginBottom: '24px' }}>
                    <div className={cx('title')} style={{ marginBottom: 6 }}>
                        {item.title}
                    </div>
                    <div className={cx('form-row')}>
                        <input
                            className={cx('input')}
                            placeholder="Nhiệt độ thấp nhất"
                            value={item.minTemp}
                            onChange={(e) => handleWeatherChange(index, 'minTemp', e.target.value)}
                        />
                        <input
                            className={cx('input')}
                            placeholder="Nhiệt độ cao nhất"
                            value={item.maxTemp}
                            onChange={(e) => handleWeatherChange(index, 'maxTemp', e.target.value)}
                        />
                    </div>
                    <textarea
                        className={cx('textarea')}
                        placeholder="Ghi chú"
                        value={item.note}
                        onChange={(e) => handleWeatherChange(index, 'note', e.target.value)}
                    />
                </div>
            ))}

            <div className={cx('section-label')}>Thông tin hữu ích</div>
            {form.info.map((item, index) => (
                <div key={index} className={cx('form-row')}>
                    <button className={cx('delete-btn')} type="button" onClick={() => handleRemoveInfo(index)}>
                        X
                    </button>
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
                </div>
            ))}
            {form.info.length < 4 && (
                <button type="button" className={cx('add-info-btn')} onClick={handleAddInfo}>
                    + Thêm thông tin
                </button>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className={cx('btns')}>
                <button type="submit" className={cx('back-btn')} disabled={loading}>
                    Hủy
                </button>
                <button type="submit" className={cx('submit-btn')} disabled={loading}>
                    {loading ? 'Đang lưu...' : 'Lưu thông tin'}
                </button>
            </div>
        </form>
    );
}

export default CityEditForm;
