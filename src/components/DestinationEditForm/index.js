import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './DestinationEditForm.module.scss';
import AlbumUploader from '~/components/AlbumUploader';
import { getCitiesApi, getTagsApi } from '~/utils/api';

const cx = classNames.bind(styles);

const defaultOpenHour = {
    monday: { open: '', close: '', allDay: false },
    tuesday: { open: '', close: '', allDay: false },
    wednesday: { open: '', close: '', allDay: false },
    thursday: { open: '', close: '', allDay: false },
    friday: { open: '', close: '', allDay: false },
    saturday: { open: '', close: '', allDay: false },
    sunday: { open: '', close: '', allDay: false },
};

function DestinationEditForm({ initialData, onSave, loading }) {
    const [form, setForm] = useState({ ...initialData.form, ...initialData.detail });
    const [cities, setCities] = useState([]);
    const [tags, setTags] = useState([]);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const tagRef = useRef(null);

    useEffect(() => {
        if (initialData) {
            console.log('Dữ liệu nhận từ API:', initialData);
            const updatedForm = {
                ...initialData.form,
                ...initialData.detail,
                address: initialData.form.address || '',
                contactInfo: {
                    phone: initialData.form.phone || '',
                    website: initialData.form.website || '',
                    facebook: initialData.form.facebook || '',
                    instagram: initialData.form.instagram || '',
                },
                openHour: initialData.detail.openHour || defaultOpenHour,
                album: {
                    space: initialData.detail.album?.space || [],
                    fnb: initialData.detail.album?.fnb || [],
                    extra: initialData.detail.album?.extra || [],
                },
            };
            console.log('Dữ liệu được set vào form:', updatedForm);
            setForm(updatedForm);
        }
    }, [initialData]);

    useEffect(() => {
        getCitiesApi().then((res) => {
            if (res && res.EC === 0) {
                setCities(res.data);
            }
        });
    }, []);

    useEffect(() => {
        getTagsApi().then((res) => {
            if (res && res.EC === 0) {
                setTags(res.data);
            }
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tagRef.current && !tagRef.current.contains(event.target)) {
                setTagDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Thay đổi trường ${name}:`, value); // Log giá trị thay đổi
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleListChange = (key, index, value) => {
        const updated = [...form[key]];
        updated[index] = value;
        setForm((prev) => ({ ...prev, [key]: updated }));
    };

    const handleListAdd = (key) => {
        setForm((prev) => ({ ...prev, [key]: [...prev[key], ''] }));
    };

    const handleListRemove = (key, index) => {
        setForm((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
    };

    const handleAlbumAdd = (key, files) => {
        setForm((prev) => ({
            ...prev,
            album: { ...prev.album, [key]: [...prev.album[key], ...files] },
        }));
    };

    const handleAlbumRemove = (key, index) => {
        setForm((prev) => ({
            ...prev,
            album: { ...prev.album, [key]: prev.album[key].filter((_, i) => i !== index) },
        }));
    };

    const handleOpenHourChange = (day, field, value) => {
        console.log(`Thay đổi giờ mở cửa cho ${day} - ${field}:`, value); // Log thay đổi giờ mở cửa
        setForm((prev) => ({
            ...prev,
            openHour: {
                ...prev.openHour,
                [day]: {
                    ...prev.openHour[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleTagToggle = (tag) => {
        setForm((prev) => {
            const isSelected = prev.tags.some((t) => t._id === tag._id);
            const updatedTags = isSelected ? prev.tags.filter((t) => t._id !== tag._id) : [...prev.tags, tag];
            return { ...prev, tags: updatedTags };
        });
    };

    const handleAllDayToggle = (isAllDay) => {
        const updatedOpenHour = Object.keys(form.openHour).reduce((acc, day) => {
            acc[day] = isAllDay
                ? { open: '00:00', close: '23:59', allDay: true }
                : { open: '', close: '', allDay: false };
            return acc;
        }, {});
        setForm((prev) => ({ ...prev, openHour: updatedOpenHour }));
    };

    const handleCloseDay = (day) => {
        setForm((prev) => ({
            ...prev,
            openHour: {
                ...prev.openHour,
                [day]: { open: 'Đóng cửa', close: 'Đóng cửa', allDay: false },
            },
        }));
    };

    const handleToggleDay = (day) => {
        setForm((prev) => {
            const isClosed = prev.openHour[day]?.open === 'Đóng cửa';
            return {
                ...prev,
                openHour: {
                    ...prev.openHour,
                    [day]: isClosed
                        ? { open: '', close: '', allDay: false }
                        : { open: 'Đóng cửa', close: 'Đóng cửa', allDay: false },
                },
            };
        });
    };

    const renderListField = (label, key) => (
        <div className={cx('form-group')}>
            <label>{label}</label>
            {form[key].map((item, index) => (
                <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                    <input
                        type="text"
                        value={item}
                        onChange={(e) => handleListChange(key, index, e.target.value)}
                        style={{ flex: 1 }}
                    />
                    <button type="button" onClick={() => handleListRemove(key, index)}>
                        Xóa
                    </button>
                </div>
            ))}
            <button type="button" onClick={() => handleListAdd(key)}>
                + Thêm {label.toLowerCase()}
            </button>
        </div>
    );

    const renderOpenHourField = () => (
        <div className={cx('form-group')}>
            <label>Giờ mở cửa</label>
            <button type="button" onClick={() => handleAllDayToggle(true)}>
                Mở cả ngày
            </button>
            {Object.keys(form.openHour)
                .filter((day) => day !== 'allday') // Loại bỏ mục allDay khỏi danh sách hiển thị
                .map((day) => (
                    <div key={day} className={cx('open-hour-row')}>
                        <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                        <input
                            type="time"
                            value={form.openHour[day]?.open || ''}
                            onChange={(e) => handleOpenHourChange(day, 'open', e.target.value)}
                            disabled={form.openHour[day]?.open === 'Đóng cửa'}
                        />
                        <input
                            type="time"
                            value={form.openHour[day]?.close || ''}
                            onChange={(e) => handleOpenHourChange(day, 'close', e.target.value)}
                            disabled={form.openHour[day]?.close === 'Đóng cửa'}
                        />
                        <button type="button" onClick={() => handleToggleDay(day)}>
                            {form.openHour[day]?.open === 'Đóng cửa' ? 'Mở cửa' : 'Đóng cửa'}
                        </button>
                    </div>
                ))}
        </div>
    );

    const renderTagField = () => (
        <div className={cx('form-group')} style={{ position: 'relative' }} ref={tagRef}>
            <label>Thẻ</label>
            <div className={cx('tag-multiselect')} tabIndex={0} onClick={() => setTagDropdownOpen((open) => !open)}>
                <div className={cx('selected-tags')}>
                    {form.tags.length === 0 && <span className={cx('placeholder')}>Chọn thẻ...</span>}
                    {form.tags.map((tag) => (
                        <span
                            key={tag._id}
                            className={cx('tag-item', 'selected')}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleTagToggle(tag);
                            }}
                        >
                            {tag.title}
                            <span className={cx('close')}>✕</span>
                        </span>
                    ))}
                </div>
            </div>
            {tagDropdownOpen && (
                <div className={cx('tag-dropdown-menu')}>
                    {tags.length > 0 ? (
                        tags.map((tag) => (
                            <div
                                key={tag._id}
                                className={cx('dropdown-item', form.tags.some((t) => t._id === tag._id) && 'active')}
                                onClick={() => handleTagToggle(tag)}
                            >
                                <span>{tag.title}</span>
                                {form.tags.some((t) => t._id === tag._id) && <span className={cx('tick')}>✓</span>}
                            </div>
                        ))
                    ) : (
                        <div className={cx('dropdown-item')}>Không có thẻ nào</div>
                    )}
                </div>
            )}
        </div>
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            ...form,
            tags: form.tags.map((tag) => (typeof tag === 'object' ? tag._id : tag)),
            openHour: { ...form.openHour }, // Đảm bảo gửi dưới dạng object
            album: {
                space: form.album.space,
                fnb: form.album.fnb,
                extra: form.album.extra,
            },
            contactInfo: { ...form.contactInfo }, // Đảm bảo gửi dưới dạng object
            details: {
                description: form.description,
                highlight: form.highlight,
                services: form.services,
                cultureType: form.cultureType,
                activities: form.activities,
                fee: form.fee,
                usefulInfo: form.usefulInfo,
            },
        };
        console.log('Payload gửi lên backend:', payload); // Log dữ liệu gửi lên backend
        onSave(payload);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label>Tên địa điểm</label>
                    <input name="title" value={form.title} onChange={handleChange} required />
                </div>
                <div className={cx('form-group')}>
                    <label>Loại địa điểm</label>
                    <select name="type" value={form.type} onChange={handleChange} required>
                        <option value="">Chọn loại</option>
                        <option value="restaurant">Nhà hàng</option>
                        <option value="tourist">Địa điểm du lịch</option>
                    </select>
                </div>
            </div>
            {renderTagField()}
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label>Thành phố</label>
                    <select name="city" value={form.city} onChange={handleChange} required>
                        <option value="">Chọn thành phố</option>
                        {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                                {city.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('form-group')}>
                    <label>Địa chỉ</label>
                    <input name="address" value={form.address} onChange={handleChange} />
                </div>
            </div>

            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label>Điện thoại</label>
                    <input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <div className={cx('form-group')}>
                    <label>Website</label>
                    <input name="website" value={form.website} onChange={handleChange} />
                </div>
                <div className={cx('form-group')}>
                    <label>Facebook</label>
                    <input name="facebook" value={form.facebook} onChange={handleChange} />
                </div>
                <div className={cx('form-group')}>
                    <label>Instagram</label>
                    <input name="instagram" value={form.instagram} onChange={handleChange} />
                </div>
            </div>

            <div className={cx('form-group')}>
                <label>Giới thiệu</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>

            {renderListField('Nổi bật', 'highlight')}
            {renderListField('Thông tin hữu ích', 'usefulInfo')}

            {form.type === 'restaurant' && <>{renderListField('Dịch vụ tiện ích', 'services')}</>}

            {form.type === 'tourist' && (
                <>
                    {renderListField('Loại hình văn hóa', 'cultureType')}
                    {renderListField('Chi phí tham quan', 'fee')}
                    {renderListField('Hoạt động đặc trưng', 'activities')}
                </>
            )}

            {form.type !== 'tourist' && renderOpenHourField()}

            <div className={cx('section-label')}>Album ảnh</div>
            <div className={cx('form-row')}>
                <AlbumUploader
                    label="Không gian"
                    files={form.album.space}
                    onAdd={(files) => handleAlbumAdd('space', files)}
                    onRemove={(i) => handleAlbumRemove('space', i)}
                />
                <AlbumUploader
                    label="Ẩm thực"
                    files={form.album.fnb}
                    onAdd={(files) => handleAlbumAdd('fnb', files)}
                    onRemove={(i) => handleAlbumRemove('fnb', i)}
                />
                <AlbumUploader
                    label="Khác"
                    files={form.album.extra}
                    onAdd={(files) => handleAlbumAdd('extra', files)}
                    onRemove={(i) => handleAlbumRemove('extra', i)}
                />
            </div>

            <button type="submit" className={cx('submit-btn')} disabled={loading}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}

export default DestinationEditForm;
