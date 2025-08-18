import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';
import { Spin } from 'antd';
import styles from './Categories.module.scss';
import CityCard from '~/components/CityCard';
import { getCitiesByTypeApi } from '~/utils/api';

const cx = classNames.bind(styles);

function Categories() {
    const { type } = useParams();
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 9;

    const toDisplayName = (str) => {
        if (str === 'bien') return 'Biển';
        if (str === 'nui') return 'Núi';
        if (str === 'van-hoa') return 'Văn hóa';
        return str;
    };

    const bgMap = {
        bien: '/categories/bien.png',
        nui: '/categories/nui.png',
        'van-hoa': '/categories/vanhoa.png',
    };
    const backgroundImageUrl = bgMap[type] || '/categories/bien.png';

    useEffect(() => {
        async function fetchCities() {
            setLoading(true);
            const res = await getCitiesByTypeApi(type);
            console.log('Fetched cities:', res);
            if (res && res.EC === 0) {
                setCities(res.data.data || []);
            }
            setLoading(false);
        }
        fetchCities();
    }, [type]);

    const totalPages = Math.ceil(cities.length / pageSize);
    const pagedData = cities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const contentVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.1, ease: 'easeOut', delay: 0.1 },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('header')} style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
                <div className={cx('overlay')}>
                    <div className={cx('text-content')}>
                        <h1 className={cx('title')}>{toDisplayName(type)}</h1>
                        <p className={cx('description')}>Danh sách các thành phố thuộc danh mục du lịch về {toDisplayName(type)} của hệ thống.</p>
                    </div>
                </div>
            </div>

            <div className={cx('content')}>
                <Spin spinning={loading} size="large">
                    <AnimatePresence mode="wait">
                        <div
                            variants={contentVariants}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            className={cx('content-inner')}
                        >
                            <div className={cx('result-list')}>
                                {pagedData.length > 0 ? (
                                    pagedData.map((item) => (
                                        <div key={item._id || item.id} className={cx('result-list-item')}>
                                            <CityCard city={item} />
                                        </div>
                                    ))
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px' }}></div>
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
                        </div>
                    </AnimatePresence>
                </Spin>
            </div>
        </motion.div>
    );
}

export default Categories;
