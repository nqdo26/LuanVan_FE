import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Drawer, Button, Input, message, notification } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './AddTripDrawer.module.scss';
import CardSearchDrawer from '~/components/CardSearchDrawer';
import { useNavigate } from 'react-router-dom';
import { createTourApi, getCitiesApi } from '~/utils/api';

const cx = classNames.bind(styles);

function AddTripDrawer({ open, onClose, onAdd }) {
    const [tripName, setTripName] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const response = await getCitiesApi();

                if (response && response.EC === 0) {
                    setCities(response.data);
                    setFilteredCities(response.data);
                } else {
                    message.error('Không thể tải danh sách thành phố');
                }
            } catch (error) {
                console.error('Error fetching cities:', error);
                message.error('Lỗi khi tải danh sách thành phố');
            }
        };

        if (open) {
            fetchCities();
        }
    }, [open]);

    useEffect(() => {
        if (destination && destination.trim()) {
            const filtered = cities.filter(
                (city) => city.name && city.name.toLowerCase().includes(destination.toLowerCase()),
            );
            setFilteredCities(filtered);
        } else {
            setFilteredCities(cities);
        }
    }, [destination, cities]);

    const handleAddClick = async () => {
        if (!tripName || !tripName.trim()) {
            notification.info({
                message: 'Thiếu thông tin',
                description: 'Vui lòng nhập tên hành trình',
            });
            return;
        }

        if (!selectedCity) {
            notification.info({
                message: 'Thiếu thông tin',
                description: 'Vui lòng chọn điểm đến',
            });
            return;
        }

        setLoading(true);
        try {
            const tourData = {
                name: tripName,
                city: selectedCity._id,
                description: '',
                isPublic: false,
                itinerary: [],
            };

            const response = await createTourApi(tourData);
            console.log('Create tour response:', response);

            if (response && response.EC === 0) {
                notification.success({
                    message: 'Thành công',
                    description: 'Hành trình đã được tạo thành công!',
                });
                const tour = response.DT;

                if (onAdd) {
                    onAdd(tour);
                }

                setTripName('');
                setDestination('');
                setSelectedCity(null);

                navigate(`/trip-detail/${tour.slug}`);
                onClose();
            } else {
                notification.warning({
                    message: 'Thất bại',
                    description: response.EM || 'Không thể tạo hành trình',
                });
            }
        } catch (error) {
            console.error('Error creating tour:', error);
            message.error('Có lỗi xảy ra khi tạo hành trình');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setTripName('');
        setDestination('');
        setSelectedCity(null);
    };

    const handleCitySelect = (city) => {
        if (city && city._id && city.name) {
            setSelectedCity(city);
            setDestination(city.name);
        }
    };

    return (
        <Drawer
            placement="right"
            onClose={handleClose}
            open={open}
            width={500}
            className={cx('drawer')}
            footer={
                <div className={cx('drawer-footer')}>
                    <Button className={cx('drawer-button')} onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button
                        className={cx('drawer-button', 'button-add')}
                        onClick={handleAddClick}
                        type="primary"
                        loading={loading}
                    >
                        Tạo hành trình
                    </Button>
                </div>
            }
        >
            <div className={cx('drawer-inner')}>
                <p className={cx('drawer-title')}>Tạo hành trình mới</p>

                <div className={cx('drawer-group')}>
                    <p className={cx('drawer-label')}>Tên hành trình</p>
                    <Input
                        placeholder="Chuyến du lịch Cần Thơ cùng gia đình"
                        maxLength={80}
                        value={tripName}
                        onChange={(e) => setTripName(e.target.value)}
                        className={cx('drawer-input')}
                    />
                </div>

                <div className={cx('drawer-group')}>
                    <p className={cx('drawer-label')}>Địa điểm</p>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Tìm kiếm thành phố..."
                        maxLength={80}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className={cx('drawer-input', 'drawer-search')}
                    />
                    <div className={cx('drawer-search-result')}>
                        <div className={cx('result-list')}>
                            {filteredCities && filteredCities.length > 0 ? (
                                filteredCities
                                    .slice(0, 4)
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
                            ) : cities.length === 0 ? (
                                <div className={cx('no-results')}>Đang tải danh sách thành phố...</div>
                            ) : (
                                <div className={cx('no-results')}>
                                    {destination ? 'Không tìm thấy thành phố nào phù hợp' : 'Không có thành phố nào'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}

export default AddTripDrawer;
