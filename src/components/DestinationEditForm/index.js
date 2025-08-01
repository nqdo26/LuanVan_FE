import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './DestinationEditForm.module.scss';
import AlbumUploader from '~/components/AlbumUploader';
import { getCitiesApi, getTagsApi } from '~/utils/api';
import { LoadingOutlined } from '@ant-design/icons';
import { PlusIcon } from 'lucide-react';

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
            let cleanOpenHour = defaultOpenHour;
            if (initialData.detail.openHour) {
                const dayMapping = {
                    mon: 'monday',
                    tue: 'tuesday',
                    wed: 'wednesday',
                    thu: 'thursday',
                    fri: 'friday',
                    sat: 'saturday',
                    sun: 'sunday',
                };

                cleanOpenHour = {};
                Object.keys(dayMapping).forEach((shortDay) => {
                    const fullDay = dayMapping[shortDay];
                    if (initialData.detail.openHour[shortDay]) {
                        cleanOpenHour[fullDay] = {
                            open: initialData.detail.openHour[shortDay].open || '',
                            close: initialData.detail.openHour[shortDay].close || '',
                            allDay: initialData.detail.openHour[shortDay].allDay || false,
                        };
                    } else {
                        cleanOpenHour[fullDay] = { open: '', close: '', allDay: false };
                    }
                });
            }

            const updatedForm = {
                // Thông tin cơ bản từ form
                title: initialData.form?.title || '',
                type: initialData.form?.type || '',
                tags: initialData.form?.tags || [],
                address: initialData.form?.address || '',
                city: initialData.form?.city || '',
                createdBy: initialData.form?.createdBy || '',

                // Thông tin liên hệ từ form
                phone: initialData.form?.phone || '',
                website: initialData.form?.website || '',
                facebook: initialData.form?.facebook || '',
                instagram: initialData.form?.instagram || '',

                // Thông tin chi tiết từ detail (đã được mapped trong EditDestination)
                description: initialData.detail?.description || '',
                highlight: initialData.detail?.highlight || [],
                services: initialData.detail?.services || [],
                cultureType: initialData.detail?.cultureType || [],
                activities: initialData.detail?.activities || [],
                fee: initialData.detail?.fee || [],
                usefulInfo: initialData.detail?.usefulInfo || [],

                // Giờ mở cửa
                openHour: cleanOpenHour,

                // Album ảnh
                album: {
                    space: initialData.detail?.album?.space || [],
                    fnb: initialData.detail?.album?.fnb || [],
                    extra: initialData.detail?.album?.extra || [],
                },

                // ContactInfo từ form hoặc detail
                contactInfo: {
                    phone: initialData.form?.phone || '',
                    website: initialData.form?.website || '',
                    facebook: initialData.form?.facebook || '',
                    instagram: initialData.form?.instagram || '',
                },
            };

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
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleListChange = (key, index, value) => {
        const updated = [...(form[key] || [])];
        updated[index] = value;
        setForm((prev) => ({ ...prev, [key]: updated }));
    };

    const handleListAdd = (key) => {
        setForm((prev) => ({ ...prev, [key]: [...(prev[key] || []), ''] }));
    };

    const handleListRemove = (key, index) => {
        setForm((prev) => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== index) }));
    };

    const handleAlbumAdd = (key, files) => {
        setForm((prev) => ({
            ...prev,
            album: {
                ...prev.album,
                [key]: [...(prev.album?.[key] || []), ...files],
            },
        }));
    };

    const handleAlbumRemove = (key, index) => {
        setForm((prev) => ({
            ...prev,
            album: {
                ...prev.album,
                [key]: (prev.album?.[key] || []).filter((_, i) => i !== index),
            },
        }));
    };

    const handleOpenHourChange = (day, field, value) => {
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

    const renderListField = (label, key) => {
        const items = form[key] || [];
        return (
            <div className={cx('form-group')}>
                <label>{label}</label>
                <button className={cx('add-button')} type="button" onClick={() => handleListAdd(key)}>
                    <PlusIcon size={20} /> Thêm {label.toLowerCase()}
                </button>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                        <input
                            type="text"
                            value={item}
                            onChange={(e) => handleListChange(key, index, e.target.value)}
                            style={{ flex: 1 }}
                        />
                        <button className={cx('delete-btn')} type="button" onClick={() => handleListRemove(key, index)}>
                            Xóa
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    const renderOpenHourField = () => (
        <div className={cx('form-group')}>
            <label>Giờ mở cửa</label>
            <button className={cx('add-button')} type="button" onClick={() => handleAllDayToggle(true)}>
                Mở cả ngày
            </button>
            {Object.keys(form.openHour)
                .filter((day) => day !== 'allday' && day !== 'open' && day !== 'close' && day !== 'allDay')
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
            openHour: { ...form.openHour },
            album: {
                space: form.album.space,
                fnb: form.album.fnb,
                extra: form.album.extra,
            },
            contactInfo: { ...form.contactInfo },
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
                    <label>Địa chỉ</label>
                    <input name="address" value={form.address} onChange={handleChange} />
                </div>
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
                <textarea name="description" value={form.description || ''} onChange={handleChange} rows={3} />
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
                    label={form.type === 'restaurant' ? 'Thực đơn' : form.type === 'tourist' ? 'Nổi bật' : 'Thực đơn'}
                    files={form.album.extra}
                    onAdd={(files) => handleAlbumAdd('extra', files)}
                    onRemove={(i) => handleAlbumRemove('extra', i)}
                />
            </div>

            <button type="submit" className={cx('submit-btn')} disabled={loading}>
                {loading && <LoadingOutlined style={{ marginRight: 8 }} />}
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
        </form>
    );
}

export default DestinationEditForm;
