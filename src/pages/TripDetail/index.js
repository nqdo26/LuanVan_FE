import classNames from 'classnames/bind';
import styles from './TripDetail.module.scss';
import { motion } from 'framer-motion';
import TripHeader from '~/components/TripHeader';
import CityInfo from '~/components/CityInfo';
import { List, Tabs } from 'antd';
import DestinationCard from '~/components/DestinationCard';
import TripNav from '~/components/TripNav';
import { useState } from 'react';
import TripItinerary from '~/components/TripItinerary';

const cx = classNames.bind(styles);

const items = [
    { key: 'trip', label: 'Lịch trình' },
    { key: 'suggest', label: 'Địa điểm nổi bật' },
];

const destinations = [
    { id: 1, title: 'Destination 1' },
    { id: 2, title: 'Destination 2' },
    { id: 3, title: 'Destination 3' },
    { id: 4, title: 'Destination 4' },
    { id: 5, title: 'Destination 5' },
    { id: 6, title: 'Destination 6' },
];

const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

function TripDetail() {
    const [activeTab, setActiveTab] = useState('trip');
    const [selectedIndexes, setSelectedIndexes] = useState([]);

    const trip = {
        title: 'Hành trình Đà Lạt 4 ngày',
        description: '',
        startDate: '2024-05-06',
        endDate: '2024-05-09',
        locations: 'Đà Lạt',
    };

    const handleToggle = (index) => {
        setSelectedIndexes((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('main')}>
                    <TripHeader trip={trip} />
                    <Tabs
                        className={cx('tabs')}
                        onChange={(key) => {
                            setActiveTab(key);
                            scrollToSection(key);
                        }}
                        items={items.map(({ key, label }) => ({
                            key,
                            label: <span className={cx('tab-item')}>{label}</span>,
                        }))}
                    />

                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'trip' && (
                            <div className={cx('trip')}>
                                <TripItinerary trip={trip} />
                            </div>
                        )}
                        {activeTab === 'suggest' && (
                            <div className={cx('suggest')}>
                                <TripNav
                                    options={[
                                        { label: 'Quán ăn & Nhà hàng' },
                                        { label: 'Quán cà phê' },
                                        { label: 'Công viên' },
                                        { label: 'Di tích lịch sử' },
                                        { label: 'Bảo tàng' },
                                    ]}
                                    selectedIndexes={selectedIndexes}
                                    onToggle={handleToggle}
                                />
                                <div className={cx('suggest-list')}>
                                    <List
                                        grid={{ gutter: 18, xs: 1, sm: 2, md: 3, lg: 3, xl: 4 }}
                                        dataSource={destinations}
                                        pagination={{ pageSize: 6 }}
                                        renderItem={(item) => (
                                            <List.Item style={{ }}>
                                                <DestinationCard
                                                    className={cx('destination-card')}
                                                    title={item.title}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
                <div className={cx('info')}>
                    <CityInfo />
                </div>
            </div>
        </motion.div>
    );
}

export default TripDetail;
