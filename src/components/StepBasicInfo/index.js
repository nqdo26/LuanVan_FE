import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './StepBasicInfo.module.scss';
import { X } from 'lucide-react';
import { useEffect } from 'react';

const cx = classNames.bind(styles);

const TYPE_OPTIONS = [
    { value: 'restaurant', label: 'Nhà hàng' },
    { value: 'tourist', label: 'Địa điểm tham quan' },
];

const TAG_OPTIONS = [
    'Phong cảnh đẹp',
    'Không gian lớn',
    'Thức ăn ngon',
    'Giá hợp lý',
    'Phục vụ chuyên nghiệp',
    'Gần trung tâm',
    'Thích hợp gia đình',
];

const CITY_OPTIONS = [
    { value: 'hcm', label: 'Hồ Chí Minh' },
    { value: 'hn', label: 'Hà Nội' },
    { value: 'dn', label: 'Đà Nẵng' },
    { value: 'ct', label: 'Cần Thơ' },
    { value: 'hue', label: 'Huế' },
];

function StepBasicInfo({ defaultData, onNext }) {
    const [form, setForm] = useState(defaultData);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const tagRef = useRef();

    useEffect (() => {
        function handleClickOutside(e) {
            if (tagRef.current && !tagRef.current.contains(e.target)) {
                setTagDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagToggle = (tag) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onNext(form);
    };

    return (
        <form className={cx('form')} onSubmit={handleSubmit}>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="title">
                        Tên địa điểm<span>*</span>
                    </label>
                    <input
                        required
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Nhập tên địa điểm"
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="aiDescription">Mô tả AI</label>
                    <textarea
                        id="aiDescription"
                        name="aiDescription"
                        value={form.aiDescription}
                        onChange={handleChange}
                        placeholder="Mô tả ngắn về địa điểm"
                        rows={3}
                    />
                </div>
            </div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="type">Loại địa điểm</label>
                    <select id="type" name="type" value={form.type} onChange={handleChange}>
                        {TYPE_OPTIONS.map((opt) => (
                            <option value={opt.value} key={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={cx('form-group')} ref={tagRef} style={{ position: 'relative' }}>
                    <label>Thẻ</label>
                    <div
                        className={cx('tag-multiselect')}
                        tabIndex={0}
                        onClick={() => setTagDropdownOpen((open) => !open)}
                    >
                        <div className={cx('selected-tags')}>
                            {form.tags.length === 0 && <span className={cx('placeholder')}>Chọn thẻ...</span>}
                            {form.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className={cx('tag-item', 'selected')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTagToggle(tag);
                                    }}
                                >
                                    {tag}
                                    <span className={cx('close')}>
                                        <X size={13} />
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                    {tagDropdownOpen && (
                        <div className={cx('tag-dropdown-menu')}>
                            {TAG_OPTIONS.map((tag) => (
                                <div
                                    key={tag}
                                    className={cx('dropdown-item', form.tags.includes(tag) && 'active')}
                                    onClick={() => handleTagToggle(tag)}
                                >
                                    <span>{tag}</span>
                                    {form.tags.includes(tag) && <span className={cx('tick')}>✓</span>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className={cx('section-label')}>Thông tin địa chỉ</div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="address">Địa chỉ cụ thể</label>
                    <input
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        placeholder="Ví dụ: 123 Lê Lợi, Quận 1"
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="city">Thành phố</label>
                    <select id="city" name="city" value={form.city} onChange={handleChange}>
                        {CITY_OPTIONS.map((opt) => (
                            <option value={opt.value} key={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className={cx('section-label')}>Liên hệ</div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="phone">Điện thoại</label>
                    <input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="website">Website</label>
                    <input
                        id="website"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        placeholder="Nhập website"
                    />
                </div>
            </div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="facebook">Facebook</label>
                    <input
                        id="facebook"
                        name="facebook"
                        value={form.facebook}
                        onChange={handleChange}
                        placeholder="Nhập link Facebook"
                    />
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="instagram">Instagram</label>
                    <input
                        id="instagram"
                        name="instagram"
                        value={form.instagram}
                        onChange={handleChange}
                        placeholder="Nhập link Instagram"
                    />
                </div>
            </div>
            <button className={cx('submit-btn')} type="submit">
                Tiếp tục
            </button>
        </form>
    );
}

export default StepBasicInfo;
