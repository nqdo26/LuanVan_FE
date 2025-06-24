import { useState } from 'react';
import { Modal, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames/bind';
import styles from './SearchSidebar.module.scss';

const cx = classNames.bind(styles);

const categories = [
    {
        key: '0',
        title: 'Địa điểm',
        type: 'select',
        options: ['Hà Nội', 'TP. Hồ Chí Minh', 'Đà Nẵng', 'Huế', 'Nha Trang', 'Đà Lạt', 'Hải Phòng', 'Cần Thơ'],
    },
    {
        key: '1',
        title: 'Loại hình địa điểm',
        options: [
            'Danh lam thắng cảnh',
            'Quán cà phê',
            'Nhà hàng/quán ăn',
            'Khu vui chơi, giải trí',
            'Di tích lịch sử',
        ],
    },
    {
        key: '2',
        title: 'Khu vực/Vị trí',
        options: [
            'Trung tâm thành phố',
            'Ven sông',
            'Gần chợ, trung tâm thương mại',
            'Xa trung tâm (khu sinh thái, resort)',
        ],
    },
    {
        key: '3',
        title: 'Thời gian hoạt động',
        options: ['Cả ngày', 'Chỉ mở ban ngày', 'Chỉ mở ban đêm'],
    },
    {
        key: '4',
        title: 'Giá cả',
        options: ['Miễn phí', 'Bình dân', 'Trung cấp', 'Cao cấp'],
    },
    {
        key: '5',
        title: 'Đánh giá',
        options: ['5 sao', '4 sao', '3 sao', '2 sao', '1 sao'],
    },
];

const sidebarVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.3, ease: 'easeIn' } },
};

function SearchSidebar() {
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAll, setShowAll] = useState(false);
    const MAX_VISIBLE_LOCATIONS = 4;

    const dataToShow = categories;

    const handleSelect = (option) => {
        setSelectedOptions((prev) =>
            prev.includes(option) ? prev.filter((item) => item !== option) : [...prev, option],
        );
    };

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleLocationSelect = (location) => {
        setSelectedLocation(location);
        handleCloseModal();
    };

    const filteredLocations = dataToShow[0].options.filter((location) =>
        location.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const displayedLocations = showAll ? filteredLocations : filteredLocations.slice(0, MAX_VISIBLE_LOCATIONS);

    return (
        <div className={cx('wrapper')}>
            <AnimatePresence mode="wait">
                <motion.div
                    key="categories"
                    variants={sidebarVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className={cx('inner')}
                >
                    {dataToShow.map((category) => (
                        <div className={cx('category-wrapper')} key={category.key}>
                            <div className={cx('category-inner')}>
                                <div className={cx('category-title')}>{category.title}</div>
                                <div className={cx('option-group')}>
                                    {category.type === 'select' ? (
                                        <button
                                            className={cx('location-button', { selected: selectedLocation })}
                                            onClick={handleOpenModal}
                                        >
                                            {selectedLocation || 'Chọn địa điểm'}
                                        </button>
                                    ) : (
                                        category.options.map((option) => (
                                            <div
                                                key={option}
                                                className={cx('option-item', {
                                                    selected: selectedOptions.includes(option),
                                                })}
                                                onClick={() => handleSelect(option)}
                                            >
                                                {option}
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </AnimatePresence>

            <Modal
                width={400}
                title="Chọn địa điểm"
                open={isModalOpen}
                onCancel={handleCloseModal}
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
                    {displayedLocations.map((location) => (
                        <div
                            key={location}
                            className={cx('location-item')}
                            onClick={() => handleLocationSelect(location)}
                        >
                            {location}
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
}

export default SearchSidebar;
