import { List } from 'antd';
import classNames from 'classnames/bind';
import { useState } from 'react';
import { Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './Search.module.scss';
import SearchFilterTabs from '~/components/SearchFilterTabs';
import SearchSidebar from '~/components/SearchSidebar';
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
    { id: 10, title: 'Destination 10' },
    { id: 11, title: 'Destination 10' },
    { id: 12, title: 'Destination 10' },
    { id: 13, title: 'Destination 10' },
    { id: 14, title: 'Destination 10' },
    { id: 15, title: 'Destination 10' },
    { id: 16, title: 'Destination 10' },
    { id: 17, title: 'Destination 10' },
];

const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.1,
            ease: 'easeOut',
            delay: 0.1,
        },
    },
};

function Search() {
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('filtertab')}>
                <SearchFilterTabs className={cx('nav')} searchTitle="Wimi Factory" />
            </div>
            <div className={cx('inner-wrapper')}>
                <div className={cx('inner')}>
                    <Button
                        className={cx('sidebar-toggle')}
                        icon={<MenuOutlined />}
                        onClick={() => setShowSidebar(!showSidebar)}
                    >
                        Bộ lọc
                    </Button>
                    <div className={cx('sidebar')}>
                        <SearchSidebar />
                    </div>
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
                                    <List
                                        grid={{ gutter: 18, xs: 1, sm: 2, md: 3, lg: 3, xl: 3 }}
                                        dataSource={destinations}
                                        pagination={{ pageSize: 15 }}
                                        renderItem={(item) => (
                                            <List.Item
                                                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                                            >
                                                <DestinationCard title={item.title} />
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Search;
