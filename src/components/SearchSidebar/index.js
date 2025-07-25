import { useState, useEffect } from 'react';
import { Modal, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './SearchSidebar.module.scss';
import { getCitiesApi } from '~/utils/api';

const cx = classNames.bind(styles);

// categories sẽ được tạo động cho loại hình địa điểm (tag)

export default function SearchSidebar({
    selectedLocation,
    setSelectedLocation,
    selectedOptions,
    setSelectedOptions,
    allDestinations = [],
}) {
    const [cities, setCities] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);

    // Danh sách loại hình địa điểm cố định
    const fixedTagOptions = [
        'Nổi bật',
        'Đặc trưng',
        'Quán cà phê',
        'Quán ăn',
        'Nhà hàng',
        'Công viên',
        'Bảo tàng',
        'Quán lề đường',
        'Chợ',
    ];

    const categories = [
        {
            key: 'type',
            title: 'Loại hình địa điểm',
            options: fixedTagOptions,
        },
        {
            key: 'location',
            title: 'Khu vực/Vị trí',
            options: ['Trung tâm', 'Ngoại ô'],
        },
        { key: 'time', title: 'Thời gian hoạt động', options: ['Cả ngày', 'Chỉ mở ban ngày', 'Chỉ mở ban đêm'] },
        { key: 'rating', title: 'Đánh giá', options: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'] },
    ];

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await getCitiesApi();
                if (res && res.EC === 0) {
                    setCities(res.data);
                }
            } catch (err) {
                console.error('Error fetching cities:', err);
            }
        };
        fetchCities();
    }, []);

    const handleSelect = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
        );
    };

    const handleLocationSelect = (city) => {
        setSelectedLocation(city);
        setIsModalOpen(false);
    };

    const filteredCities = cities.filter((city) => city.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const displayedCities = showAll ? filteredCities : filteredCities.slice(0, 4);

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="categories"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } }}
                exit={{ opacity: 0, x: -30, transition: { duration: 0.3, ease: 'easeIn' } }}
                className={cx('inner')}
            >
                <div className={cx('category-wrapper')}>
                    <div className={cx('category-inner')}>
                        <div className={cx('category-title')}>Địa điểm</div>
                        <div className={cx('option-group')}>
                            <button
                                className={cx('location-button', { selected: selectedLocation })}
                                onClick={() => setIsModalOpen(true)}
                            >
                                {selectedLocation ? selectedLocation.name : 'Chọn địa điểm'}
                            </button>
                        </div>
                    </div>
                </div>

                {categories.map((category) => (
                    <div className={cx('category-wrapper')} key={category.key}>
                        <div className={cx('category-inner')}>
                            <div className={cx('category-title')}>{category.title}</div>
                            <div className={cx('option-group')}>
                                {category.options.map((option) => (
                                    <div
                                        key={option}
                                        className={cx('option-item', { selected: selectedOptions.includes(option) })}
                                        onClick={() => handleSelect(option)}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}

                <Modal
                    width={400}
                    title="Chọn địa điểm"
                    open={isModalOpen}
                    onCancel={() => setIsModalOpen(false)}
                    footer={null}
                    className={cx('custom-modal')}
                >
                    <Input
                        placeholder="Tìm kiếm địa điểm..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={cx('modal-search')}
                    />
                    <div className={cx('location-list')}>
                        {displayedCities.map((city) => (
                            <div
                                key={city._id}
                                className={cx('location-item')}
                                onClick={() => handleLocationSelect(city)}
                            >
                                {city.name}
                            </div>
                        ))}
                    </div>
                </Modal>
            </motion.div>
        </AnimatePresence>
    );
}
