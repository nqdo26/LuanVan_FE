import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './StepBasicInfo.module.scss';
import { X } from 'lucide-react';
import { getTagsApi, getCitiesApi } from '~/utils/api';

const cx = classNames.bind(styles);

function StepBasicInfo({ defaultData, onNext, isEditMode }) {
    const [form, setForm] = useState(defaultData);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [cities, setCities] = useState([]);
    // Removed destinationTypes state
    const [loading, setLoading] = useState(true);
    const [typeError, setTypeError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [tagError, setTagError] = useState(false);
    const [contactError, setContactError] = useState(false);
    const [addressError, setAddressError] = useState(false);
    const tagRef = useRef();

    useEffect(() => {
        function handleClickOutside(e) {
            if (tagRef.current && !tagRef.current.contains(e.target)) {
                setTagDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        fetchTagsAndCities();
    }, []);

    useEffect(() => {
        setForm(defaultData);
    }, [defaultData]);

    const fetchTagsAndCities = async () => {
        try {
            setLoading(true);
            const [tagsResponse, citiesResponse] = await Promise.all([getTagsApi(), getCitiesApi()]);

            if (tagsResponse && tagsResponse.EC === 0) {
                setTags(tagsResponse.data);
            }

            if (citiesResponse && citiesResponse.EC === 0) {
                setCities(citiesResponse.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleTagToggle = (tag) => {
        setForm((prev) => {
            const isSelected = prev.tags.some((t) => t._id === tag._id);
            return {
                ...prev,
                tags: isSelected ? prev.tags.filter((t) => t._id !== tag._id) : [...prev.tags, tag],
            };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let hasError = false;
        if (!form.type) {
            setTypeError(true);
            hasError = true;
        } else {
            setTypeError(false);
        }
        if (!form.city) {
            setCityError(true);
            hasError = true;
        } else {
            setCityError(false);
        }
        if (!form.tags || form.tags.length === 0) {
            setTagError(true);
            hasError = true;
        } else {
            setTagError(false);
        }

        if (!form.address || form.address.trim() === '') {
            setAddressError(true);
            hasError = true;
        } else {
            setAddressError(false);
        }

        if (
            (!form.phone || form.phone.trim() === '') &&
            (!form.website || form.website.trim() === '') &&
            (!form.facebook || form.facebook.trim() === '') &&
            (!form.instagram || form.instagram.trim() === '')
        ) {
            setContactError(true);
            hasError = true;
        } else {
            setContactError(false);
        }
        if (!form.title || form.title.trim() === '') hasError = true;
        if (hasError) return;
        onNext(form);
    };

    return (
        <div className={cx('form')}>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="title">Tên địa điểm</label>
                    <input
                        required
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Nhập tên địa điểm"
                    />
                </div>
            </div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="type">Loại địa điểm</label>
                    <select
                        id="type"
                        name="type"
                        value={form.type}
                        onChange={(e) => {
                            handleChange(e);
                            setTypeError(false);
                        }}
                        required
                        className={typeError ? cx('error') : ''}
                    >
                        <option className={cx('placeholder')} value="">
                            Chọn loại địa điểm
                        </option>
                        <option value="restaurant">Nhà hàng (quán ăn, quán nước,...)</option>
                        <option value="tourist">Địa điểm du lịch (di tích, khu vui chơi, công viên,...)</option>
                    </select>
                    {typeError && (
                        <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>Vui lòng chọn loại địa điểm!</div>
                    )}
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
                                    key={tag._id}
                                    className={cx('tag-item', 'selected')}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleTagToggle(tag);
                                    }}
                                >
                                    {tag.title}
                                    <span className={cx('close')}>
                                        <X size={13} />
                                    </span>
                                </span>
                            ))}
                        </div>
                    </div>
                    {tagDropdownOpen && (
                        <div className={cx('tag-dropdown-menu')}>
                            {loading ? (
                                <div className={cx('dropdown-item')}>Đang tải...</div>
                            ) : tags.length > 0 ? (
                                tags.map((tag) => (
                                    <div
                                        key={tag._id}
                                        className={cx(
                                            'dropdown-item',
                                            form.tags.some((t) => t._id === tag._id) && 'active',
                                        )}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        <span>{tag.title}</span>
                                        {form.tags.some((t) => t._id === tag._id) && (
                                            <span className={cx('tick')}>✓</span>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className={cx('dropdown-item')}>Không có thẻ nào</div>
                            )}
                        </div>
                    )}
                    {tagError && (
                        <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>Vui lòng chọn ít nhất 1 thẻ!</div>
                    )}
                </div>
            </div>
            <div className={cx('section-label')}>Thông tin địa chỉ</div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="address">Địa chỉ cụ thể</label>
                    <input
                        required
                        id="address"
                        name="address"
                        value={form.address}
                        onChange={(e) => {
                            handleChange(e);
                            setAddressError(false);
                        }}
                        placeholder="Ví dụ: 123 Lê Lợi, Quận 1"
                        className={addressError ? cx('error') : ''}
                    />
                    {addressError && (
                        <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>Vui lòng nhập địa chỉ cụ thể!</div>
                    )}
                </div>
                <div className={cx('form-group')}>
                    <label htmlFor="city">Thành phố</label>
                    <select
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={(e) => {
                            handleChange(e);
                            setCityError(false);
                        }}
                        required
                        className={cityError ? cx('error') : ''}
                    >
                        <option className={cx('placeholder')} value="">
                            Chọn thành phố
                        </option>
                        {loading ? (
                            <option disabled>Đang tải...</option>
                        ) : cities.length > 0 ? (
                            cities.map((city) => (
                                <option value={city._id} key={city._id}>
                                    {city.name}
                                </option>
                            ))
                        ) : (
                            <option disabled>Không có thành phố nào</option>
                        )}
                    </select>
                    {cityError && (
                        <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>Vui lòng chọn thành phố!</div>
                    )}
                </div>
            </div>
            <div className={cx('section-label')}>
                Liên hệ <span style={{ color: 'red' }}>*</span>
            </div>
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
            {contactError && (
                <div style={{ color: 'red', fontSize: 13, marginTop: 4, marginBottom: 8 }}>
                    Vui lòng nhập ít nhất một thông tin liên hệ!
                </div>
            )}
            {!isEditMode && (
                <button className={cx('submit-btn')} type="button" onClick={handleSubmit}>
                    Tiếp tục
                </button>
            )}
        </div>
    );
}

export default StepBasicInfo;
