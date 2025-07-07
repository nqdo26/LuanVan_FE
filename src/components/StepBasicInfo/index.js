import React, { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './StepBasicInfo.module.scss';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { getTagsApi, getCitiesApi, getDestinationTypesApi } from '~/utils/api';

const cx = classNames.bind(styles);

function StepBasicInfo({ defaultData, onNext }) {
    const [form, setForm] = useState(defaultData);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const [tags, setTags] = useState([]);
    const [cities, setCities] = useState([]);
    const [destinationTypes, setDestinationTypes] = useState([]);
    const [loading, setLoading] = useState(true);
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

    const fetchTagsAndCities = async () => {
        try {
            setLoading(true);
            const [tagsResponse, citiesResponse, destinationTypesResponse] = await Promise.all([
                getTagsApi(),
                getCitiesApi(),
                getDestinationTypesApi(),
            ]);

            if (tagsResponse && tagsResponse.EC === 0) {
                setTags(tagsResponse.data);
            }

            if (citiesResponse && citiesResponse.EC === 0) {
                setCities(citiesResponse.data);
            }

            if (destinationTypesResponse && destinationTypesResponse.EC === 0) {
                setDestinationTypes(destinationTypesResponse.data);
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
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.includes(tag.title) ? prev.tags.filter((t) => t !== tag.title) : [...prev.tags, tag.title],
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
            </div>
            <div className={cx('form-row')}>
                <div className={cx('form-group')}>
                    <label htmlFor="type">Loại địa điểm</label>
                    <select id="type" name="type" value={form.type} onChange={handleChange}>
                        <option className={cx('placeholder')} value="">
                            Chọn loại địa điểm
                        </option>
                        {loading ? (
                            <option disabled>Đang tải...</option>
                        ) : destinationTypes.length > 0 ? (
                            destinationTypes.map((type) => (
                                <option value={type._id} key={type._id}>
                                    {type.title}
                                </option>
                            ))
                        ) : (
                            <option disabled>Không có loại địa điểm nào</option>
                        )}
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
                                        const tagObj = tags.find((t) => t.title === tag);
                                        if (tagObj) handleTagToggle(tagObj);
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
                            {loading ? (
                                <div className={cx('dropdown-item')}>Đang tải...</div>
                            ) : tags.length > 0 ? (
                                tags.map((tag) => (
                                    <div
                                        key={tag._id}
                                        className={cx('dropdown-item', form.tags.includes(tag.title) && 'active')}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        <span>{tag.title}</span>
                                        {form.tags.includes(tag.title) && <span className={cx('tick')}>✓</span>}
                                    </div>
                                ))
                            ) : (
                                <div className={cx('dropdown-item')}>Không có thẻ nào</div>
                            )}
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
