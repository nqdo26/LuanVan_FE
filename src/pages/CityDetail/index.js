import { useState } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './CityDetail.module.scss';
import CityGallery from '~/components/CityGallery';
import CustomNav from '~/components/CustomNav';
import WeatherInfo from '~/components/WeatherInfo';
import CitySideBar from '~/components/CitySideBar';
import ResultSorter from '~/components/ResultSorter';
import DestinationCard from '~/components/DestinationCard';

const cx = classNames.bind(styles);

const destinations = [
    { id: 1, title: 'Destination 1' },
    { id: 2, title: 'Destination 2' },
    { id: 3, title: 'Destination 3' },
    { id: 4, title: 'Destination 4' },
    { id: 5, title: 'Destination 5' },
    { id: 6, title: 'Destination 6' },
    { id: 7, title: 'Destination 7' },
    { id: 8, title: 'Destination 8' },
    { id: 9, title: 'Destination 9' },
];

function CityDetail() {
    // Pagination state
    const pageSize = 6;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(destinations.length / pageSize);
    const pagedDestinations = destinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <CityGallery />
                </div>
                <div className={cx('body')}>
                    <div className={cx('nav')}>
                        <CustomNav />
                    </div>
                    <h1 className={cx('title')}>Vài nét về Hà Nội</h1>
                    <div className={cx('info')}>
                        <p className={cx('description')}>
                            Hà Nội, thủ đô của Việt Nam, một thành phố của truyền thống và lịch sử một thành phố của
                            truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền
                            thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền thống và
                            lịch sử một thành phố của truyền thống và lịch sửHà Nội, thủ đô của Việt Nam, một thành phố
                            của truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của
                            truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền
                            thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền thống và
                            lịch sửHà Nội, thủ đô của Việt Nam, một thành phố của truyền thống và lịch sử một thành phố
                            của truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của
                            truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền
                            thống và lịch sử một thành phố của truyền thống và lịch sử
                        </p>
                    </div>
                    <h1 className={cx('title')}>Các địa điểm và tour du lịch ở Hà Nội</h1>
                    <div className={cx('destination')}>
                        <div className={'sidebar'}>
                            <CitySideBar />
                        </div>
                        <div className={cx('list')}>
                            <div className={cx('nav')}>
                                <ResultSorter />
                            </div>
                            <div className={cx('items')}>
                                <div className={cx('result-list')}>
                                    {pagedDestinations.map((item) => (
                                        <div key={item.id} className={cx('result-list-item')}>
                                            <DestinationCard title={item.title} />
                                        </div>
                                    ))}
                                </div>
                                <div className={cx('pagination')}>
                                    <button
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    >
                                        {'<'}
                                    </button>
                                    <span>
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    >
                                        {'>'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <h1 className={cx('title')}>Thông tin hữu ích</h1>
                    <div className={cx('weather')}>
                        <WeatherInfo />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CityDetail;
