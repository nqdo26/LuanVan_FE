import { useState, useEffect } from 'react';
import { Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import { motion, AnimatePresence } from 'framer-motion';

import styles from './Search.module.scss';
import { Spin } from 'antd';
import SearchFilterTabs from '~/components/SearchFilterTabs';
import SearchSidebar from '~/components/SearchSidebar';
import ResultSorter from '~/components/ResultSorter';
import DestinationCard from '~/components/DestinationCard';
import { getDestinationsApi, getDestinationsByCityApi } from '~/utils/api';

const cx = classNames.bind(styles);

export default function Search() {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [currentPage, setCurrentPage] = useState(1);
    const [allDestinations, setAllDestinations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('Recommended');
    const pageSize = 9;
    const [query, setQuery] = useState('');
    const [cityDestinations, setCityDestinations] = useState(null);

    useEffect(() => {
        const updateQueryFromUrl = () => {
            const params = new URLSearchParams(window.location.search);
            setQuery(params.get('q') || '');
        };
        updateQueryFromUrl();

        const handleUrlChange = () => updateQueryFromUrl();
        window.addEventListener('popstate', handleUrlChange);
        const origPushState = window.history.pushState;
        const origReplaceState = window.history.replaceState;
        window.history.pushState = function (...args) {
            origPushState.apply(this, args);
            handleUrlChange();
        };
        window.history.replaceState = function (...args) {
            origReplaceState.apply(this, args);
            handleUrlChange();
        };
        return () => {
            window.removeEventListener('popstate', handleUrlChange);
            window.history.pushState = origPushState;
            window.history.replaceState = origReplaceState;
        };
    }, []);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [drawerOpen, query, selectedLocation, sortOption]);

    useEffect(() => {
        const fetchAllDestinations = async () => {
            setLoading(true);
            try {
                const response = await getDestinationsApi({ limit: 1000 });
                if (response && response.data) {
                    setAllDestinations(response.data);
                } else {
                    setAllDestinations([]);
                }
            } catch (error) {
                setAllDestinations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchAllDestinations();
    }, []);

    useEffect(() => {
        const fetchCityDestinations = async () => {
            if (!selectedLocation || !selectedLocation.slug) {
                setCityDestinations(null);
                return;
            }
            setLoading(true);
            try {
                const response = await getDestinationsByCityApi(selectedLocation.slug, { limit: 100 });
                if (response && response.EC === 0 && response.data?.destinations) {
                    setCityDestinations(response.data.destinations);
                } else {
                    setCityDestinations([]);
                }
            } catch (error) {
                setCityDestinations([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCityDestinations();
    }, [selectedLocation]);

    const getSortedResults = (data) => {
        let sorted = [...data];
        if (sortOption === 'Rate: Low to High') {
            sorted.sort((a, b) => (a.statistics?.averageRating || 0) - (b.statistics?.averageRating || 0));
        } else if (sortOption === 'Rate: High to Low') {
            sorted.sort((a, b) => (b.statistics?.averageRating || 0) - (a.statistics?.averageRating || 0));
        }
        return sorted;
    };

    function matchOpenHour(item, option) {
        const openHour = item.openHour;
        if (!openHour) return false;

        if (option === 'Cả ngày') {
            if (openHour.allday) return true;

            const monOpen = openHour.mon?.open;
            const monClose = openHour.mon?.close;
            if (monOpen && monClose) {
                if (monOpen <= '00:00' && monClose >= '21:59') return true;
            }
        }
        if (option === 'Chỉ mở ban ngày') {
            const monOpen = openHour.mon?.open;
            const monClose = openHour.mon?.close;
            if (monOpen && monClose) {
                if (monOpen <= '16:00' && monClose <= '18:00') return true;
            }
        }
        if (option === 'Chỉ mở ban đêm') {
            const monOpen = openHour.mon?.open;
            const monClose = openHour.mon?.close;
            if (monOpen && monClose) {
                if (monOpen >= '17:00' && monClose >= '21:59') return true;
            }
        }
        return false;
    }

    // Hàm loại bỏ dấu tiếng Việt
    function removeVietnameseTones(str) {
        return str
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    }

    const getFilteredResults = () => {
        let base = allDestinations;
        // Nếu có query tìm kiếm, lọc theo title địa điểm hoặc tag, không phân biệt hoa thường và dấu
        if (query && query.trim()) {
            const q = removeVietnameseTones(query.trim().toLowerCase());
            base = base.filter((item) => {
                const titleMatch = item.title && removeVietnameseTones(item.title.toLowerCase()).includes(q);
                const tagMatch =
                    Array.isArray(item.tags) &&
                    item.tags.some((tag) => tag.title && removeVietnameseTones(tag.title.toLowerCase()).includes(q));
                return titleMatch || tagMatch;
            });
        }
        if (selectedLocation && selectedLocation.slug) {
            base = base.filter((item) => item.location?.city?.slug === selectedLocation.slug);
        }
        let filtered = getSortedResults(base);
        if (selectedOptions.length > 0) {
            filtered = filtered.filter((item) => {
                return selectedOptions.some((option) => {
                    if (Array.isArray(item.tags) && item.tags.some((tag) => tag.title === option)) return true;

                    if (option.match(/sao$/)) {
                        const sao = parseInt(option);
                        if (Math.round(item.statistics?.averageRating || 0) === sao) return true;
                    }

                    if (['Cả ngày', 'Chỉ mở ban ngày', 'Chỉ mở ban đêm'].includes(option)) {
                        if (matchOpenHour(item, option)) return true;
                    }
                    return false;
                });
            });
        }
        return filtered;
    };

    // ...existing code...

    // Đặt sau khi đã khai báo getFilteredResults
    const filteredResults = getFilteredResults();
    const totalPages = Math.max(1, Math.ceil(filteredResults.length / pageSize));
    const pagedDestinations = filteredResults.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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
            <div className={cx('filtertab')}>
                <SearchFilterTabs className={cx('nav')} />
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
                        <SearchSidebar
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            allDestinations={allDestinations}
                        />
                    </div>

                    <Drawer
                        title="Bộ lọc"
                        placement="top"
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        styles={{
                            body: isMobile ? { paddingTop: 438, overflow: 'auto' } : { paddingTop: 0 },
                        }}
                        height="70vh"
                    >
                        <SearchSidebar
                            selectedLocation={selectedLocation}
                            setSelectedLocation={setSelectedLocation}
                            selectedOptions={selectedOptions}
                            setSelectedOptions={setSelectedOptions}
                            allDestinations={allDestinations}
                        />
                    </Drawer>

                    <div className={cx('content-wrapper')}>
                        <AnimatePresence mode="wait">
                            {loading ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '400px',
                                        width: '100%',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Spin tip="Đang tải kết quả..." size="large" />
                                </div>
                            ) : (
                                <motion.div
                                    variants={contentVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="hidden"
                                    className={cx('content')}
                                >
                                    <div className={cx('result-sorter')}>
                                        <ResultSorter sortOption={sortOption} setSortOption={setSortOption} />
                                    </div>

                                    <div className={cx('result-list')}>
                                        {pagedDestinations.length > 0 ? (
                                            pagedDestinations.map((item) => (
                                                <div key={item._id || item.id} className={cx('result-list-item')}>
                                                    <DestinationCard destination={item} />
                                                </div>
                                            ))
                                        ) : (
                                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                                Không có địa điểm phù hợp
                                            </div>
                                        )}
                                    </div>

                                    <div className={cx('pagination')}>
                                        <button
                                            disabled={currentPage === 1}
                                            onClick={() => setCurrentPage(currentPage - 1)}
                                        >
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
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
