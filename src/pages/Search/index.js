import { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './Search.module.scss';
import SearchFilterTabs from '~/components/SearchFilterTabs';
import SearchSidebar from '~/components/SearchSidebar';
import ResultSorter from '~/components/ResultSorter';
import DestinationCard from '~/components/DestinationCard';

const cx = classNames.bind(styles);

const destinations = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    title: `Destination ${i + 1}`,
}));

const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.1, ease: 'easeOut', delay: 0.1 },
    },
};

export default function Search() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('filtertab')}>
                <SearchFilterTabs className={cx('nav')} searchTitle="Wimi Factory" />
            </div>

            <div className={cx('inner-wrapper')}>
                <div className={cx('inner')}>
                    <button
                        className={cx('sidebar-toggle')}
                        icon={<MenuOutlined />}
                        onClick={() => setDrawerOpen(true)}
                    >
                        Bộ lọc
                    </button>

                    <div className={cx('sidebar')}>
                        <SearchSidebar />
                    </div>

                    <Drawer
                        title="Bộ lọc"
                        placement="top"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        bodyStyle={isMobile ? { paddingTop: 438, overflow: 'auto' } : { paddingTop: 0 }}
                        height="70vh"
                    >
                        <SearchSidebar />
                    </Drawer>

                    <div className={cx('content-wrapper')}>
                        <AnimatePresence mode="wait">
                            <motion.div
                                variants={contentVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden"
                                className={cx('content')}
                            >
                                <div className={cx('result-sorter')}>
                                    <ResultSorter />
                                </div>
                                <div className={cx('result-list')}>
                                    {destinations.map((item) => (
                                        <div key={item.id} className={cx('result-list-item')}>
                                            <DestinationCard title={item.title} />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
