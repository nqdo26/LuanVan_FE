import { useState } from 'react';
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Categories.module.scss';
import ResultSorter from '~/components/ResultSorter';
import DestinationCard from '~/components/DestinationCard';
import CityCard from '~/components/CityCard';

const cx = classNames.bind(styles);

function Categories() {
    const backgroundImageUrl = '/categories/bien.png';

    // Fake data
    const fakeDestinations = Array.from({ length: 18 }).map((_, i) => ({
        id: i + 1,
        name: `Địa điểm ${i + 1}`,
        image: '/categories/bien.png',
    }));

    const pageSize = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOption, setSortOption] = useState('Recommended');

    const totalPages = Math.ceil(fakeDestinations.length / pageSize);

    const pagedData = fakeDestinations.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const contentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.1, ease: 'easeOut', delay: 0.1 },
        },
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')} style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className={cx('overlay')}>
                    <div className={cx('text-content')}>
                        <h1 className={cx('title')}>Title ở đây</h1>
                        <p className={cx('description')}>Mô tả ngắn gọn của bạn nằm ở đây</p>
                    </div>
                </div>
            </div>

            <div className={cx('content')}>
                <AnimatePresence mode="wait">
                    <motion.div
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className={cx('content-inner')}
                    >
                        <div className={cx('result-sorter')}>
                            <ResultSorter sortOption={sortOption} setSortOption={setSortOption} />
                        </div>

                        <div className={cx('result-list')}>
                            {pagedData.length > 0 ? (
                                pagedData.map((item) => (
                                    <div key={item.id} className={cx('result-list-item')}>
                                        <CityCard city={item} />
                                    </div>
                                ))
                            ) : (
                                <div style={{ textAlign: 'center', padding: '40px' }}>Không có địa điểm phù hợp</div>
                            )}
                        </div>

                        <div className={cx('pagination')}>
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
                                {'<'}
                            </button>
                            <span>
                                Trang {currentPage} / {totalPages}
                            </span>
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                {'>'}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Categories;
