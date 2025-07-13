import React, { useState, useEffect, useRef } from 'react';
import { Button, Tooltip, Modal, Input, DatePicker, message } from 'antd';
import {
    ShareAltOutlined,
    SettingOutlined,
    CalendarOutlined,
    EnvironmentOutlined,
    MinusOutlined,
    SearchOutlined,
} from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './TripHeader.module.scss';
import CardSearchDrawer from '../CardSearchDrawer';
import { updateTourApi, getCitiesApi, getTagsApi } from '~/utils/api';

import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import locale from 'antd/es/date-picker/locale/vi_VN';

const cx = classNames.bind(styles);

function TripHeader({ tour, onTourChange }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [tags, setTags] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [tagDropdownOpen, setTagDropdownOpen] = useState(false);
    const tagRef = useRef(null);
    const [editedTour, setEditedTour] = useState({
        name: tour?.name || '',
        city: tour?.city?.name || '',
        duration: tour?.duration || {},
        description: tour?.description || '',
        tags: tour?.tags || [],
    });

    useEffect(() => {
        setEditedTour({
            name: tour?.name || '',
            city: tour?.city?.name || '',
            duration: tour?.duration || {},
            description: tour?.description || '',
            tags: tour?.tags || [],
        });
        setSelectedCity(tour?.city || null);
        setSelectedTags(tour?.tags || []);
    }, [tour]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isModalOpen) return;

            try {
                const citiesResponse = await getCitiesApi();
              
                if (citiesResponse && citiesResponse.EC === 0) {
                    setCities(citiesResponse.data);
                    setFilteredCities(citiesResponse.data);
                } else {
                    message.error('Không thể tải danh sách thành phố');
                }

                const tagsResponse = await getTagsApi();
            
                if (tagsResponse && tagsResponse.EC === 0) {
                    setTags(tagsResponse.data);
                } else {
                    message.error('Không thể tải danh sách tags');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                message.error('Lỗi khi tải dữ liệu');
            }
        };

        fetchData();
    }, [isModalOpen]);

    useEffect(() => {
        if (editedTour.city && editedTour.city.trim()) {
            const filtered = cities.filter(
                (city) => city.name && city.name.toLowerCase().includes(editedTour.city.toLowerCase()),
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities(cities);
        }
    }, [editedTour.city, cities]);

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

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleCitySelect = (city) => {
        if (city && city._id && city.name) {
            setSelectedCity(city);
            setEditedTour({ ...editedTour, city: city.name });
        }
    };

    const handleTagToggle = (tag) => {
        const isSelected = selectedTags.some((t) => t._id === tag._id);
        let updatedTags;

        if (isSelected) {
            updatedTags = selectedTags.filter((t) => t._id !== tag._id);
        } else {
            updatedTags = [...selectedTags, tag];
        }

        setSelectedTags(updatedTags);
        setEditedTour({ ...editedTour, tags: updatedTags });
    };

    const handleDelete = () => {
        console.log('Xóa chuyến đi');
        setIsModalOpen(false);
    };

    const handleSave = async () => {
        if (!editedTour.name || !editedTour.name.trim()) {
            message.error('Tên chuyến đi không được để trống');
            return;
        }

        if (!selectedCity) {
            message.error('Vui lòng chọn thành phố');
            return;
        }

        setSaving(true);
        try {
            const updateData = {
                name: editedTour.name.trim(),
                description: editedTour.description?.trim() || '',
                duration: editedTour.duration,
                city: selectedCity._id,
                tags: selectedTags.map((tag) => tag._id),
            };

            const response = await updateTourApi(tour._id, updateData);

            if (response && response.EC === 0) {
                message.success('Cập nhật thông tin thành công!');
                onTourChange && onTourChange(response.DT);
                setIsModalOpen(false);
            } else {
                message.error(response?.EM || 'Có lỗi xảy ra khi cập nhật');
            }
        } catch (error) {
            console.error('Error updating tour:', error);
            message.error('Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e, field) => {
        const value = e.target.value;
        setEditedTour({ ...editedTour, [field]: value });
    };

    return (
        <div className={cx('trip-header')}>
            <div className={cx('wrapper')}>
                <img
                    src={tour.city?.images?.[0] || '/wimi1-img.png'}
                    alt="Trip Background"
                    className={cx('background')}
                />
                <div className={cx('content')}>
                    <div className={cx('header')}>
                        <div className={cx('actions')}>
                            <Tooltip title="Chia sẻ">
                                <Button shape="circle" icon={<ShareAltOutlined />} className={cx('actionBtn')} />
                            </Tooltip>
                            <Tooltip title="Cài đặt">
                                <Button
                                    shape="circle"
                                    icon={<SettingOutlined />}
                                    className={cx('actionBtn')}
                                    onClick={handleOpenModal}
                                />
                            </Tooltip>
                        </div>
                    </div>
                    <div className={cx('subInfo')}>
                        <h2 className={cx('title')}>{tour.name}</h2>

                        <div className={cx('subItems')}>
                            {tour.duration?.starDay && tour.duration?.endDay && (
                                <div className={cx('item')}>
                                    <CalendarOutlined className={cx('label')} />
                                    <span className={cx('value')}>
                                        {dayjs(tour.duration.starDay).format('DD/MM/YYYY')}{' '}
                                        <MinusOutlined className={cx('dash')} />
                                        {dayjs(tour.duration.endDay).format('DD/MM/YYYY')}
                                    </span>
                                </div>
                            )}
                            <div className={cx('item')}>
                                <EnvironmentOutlined className={cx('label')} />
                                <span className={cx('value')}>{tour.city?.name || 'Chưa xác định'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal className={cx('modal')} width={550} open={isModalOpen} onCancel={handleCloseModal} footer={null}>
                    <div className={cx('modal-content')}>
                        <h3 className={cx('modal-title')}>Thông tin chuyến đi</h3>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Tên chuyến đi:</label>
                            <Input
                                className={cx('form-input')}
                                value={editedTour.name}
                                onChange={(e) => handleChange(e, 'name')}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Điểm đến:</label>
                            <Input
                                className={cx('search-input')}
                                prefix={<SearchOutlined className={cx('search-icon')} />}
                                maxLength={80}
                                placeholder="Tìm kiếm thành phố..."
                                value={editedTour.city}
                                onChange={(e) => handleChange(e, 'city')}
                            />
                            <div className={cx('city-search-result')}>
                                {filteredCities && filteredCities.length > 0 ? (
                                    filteredCities
                                        .slice(0, 6)
                                        .map((city) =>
                                            city && city._id ? (
                                                <CardSearchDrawer
                                                    key={city._id}
                                                    city={city.name || 'Không có tên'}
                                                    region={city.description || 'Thành phố xinh đẹp'}
                                                    image={city.images?.[0] || '/wimi2-img.png'}
                                                    onClick={() => handleCitySelect(city)}
                                                    isSelected={selectedCity?._id === city._id}
                                                />
                                            ) : null,
                                        )
                                ) : (
                                    <div className={cx('no-cities')}>
                                        {cities.length === 0 ? 'Đang tải...' : 'Không tìm thấy thành phố nào'}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Thẻ:</label>
                            <div className={cx('tag-section')} ref={tagRef}>
                                <div
                                    className={cx('tag-multiselect')}
                                    onClick={() => setTagDropdownOpen(!tagDropdownOpen)}
                                >
                                    <div className={cx('selected-tags')}>
                                        {selectedTags.length === 0 && (
                                            <span className={cx('placeholder')}>Chọn thẻ...</span>
                                        )}
                                        {selectedTags.map((tag) => (
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
                                                    className={cx(
                                                        'dropdown-item',
                                                        selectedTags.some((t) => t._id === tag._id) && 'active',
                                                    )}
                                                    onClick={() => handleTagToggle(tag)}
                                                >
                                                    <span>{tag.title}</span>
                                                    {selectedTags.some((t) => t._id === tag._id) && (
                                                        <span className={cx('tick')}>✓</span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <div className={cx('dropdown-item')}>Không có tag nào</div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Số ngày hoặc độ dài chuyến đi:</label>
                            <DatePicker.RangePicker
                                className={cx('form-input')}
                                locale={locale}
                                format="DD/MM/YYYY"
                                value={
                                    editedTour.duration?.starDay && editedTour.duration?.endDay
                                        ? [dayjs(editedTour.duration.starDay), dayjs(editedTour.duration.endDay)]
                                        : null
                                }
                                onChange={(dates) => {
                                    if (dates) {
                                        setEditedTour({
                                            ...editedTour,
                                            duration: {
                                                ...editedTour.duration,
                                                starDay: dates[0].format('YYYY-MM-DD'),
                                                endDay: dates[1].format('YYYY-MM-DD'),
                                            },
                                        });
                                    } else {
                                        setEditedTour({
                                            ...editedTour,
                                            duration: {
                                                ...editedTour.duration,
                                                starDay: null,
                                                endDay: null,
                                            },
                                        });
                                    }
                                }}
                            />
                        </div>

                        <div className={cx('form-item')}>
                            <label className={cx('form-label')}>Mô tả:</label>
                            <Input.TextArea
                                className={cx('form-input')}
                                rows={3}
                                maxLength={500}
                                placeholder="Ghi lại vài dòng về kế hoạch, cảm hứng hay điểm đặc biệt của chuyến đi này..."
                                value={editedTour.description}
                                onChange={(e) => handleChange(e, 'description')}
                                showCount
                            />
                        </div>
                    </div>

                    <div className={cx('modal-actions')}>
                        <Button onClick={handleDelete} className={cx('modal-btn', 'delete')}>
                            Xóa chuyến đi
                        </Button>
                        <Button onClick={handleSave} className={cx('modal-btn', 'save')} loading={saving}>
                            Lưu
                        </Button>
                    </div>
                </Modal>
            </div>
            <div onClick={handleOpenModal} className={cx('trip-description')}>
                {tour?.description || 'Ghi lại vài dòng về kế hoạch, cảm hứng hay điểm đặc biệt của chuyến đi này..'}
            </div>
        </div>
    );
}

export default TripHeader;
