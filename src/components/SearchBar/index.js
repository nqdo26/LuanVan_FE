import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import SearchResultCard from '../SearchResultCard';
import { searchDestinationsApi, getDestinationsApi } from '~/utils/api';

const cx = classNames.bind(styles);

function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [popularDestinations, setPopularDestinations] = useState([]);
    const searchRef = useRef(null);

    useEffect(() => {
        const loadPopularDestinations = async () => {
            try {
                const response = await getDestinationsApi({ limit: 4 });
                if (response && response.data) {
                    setPopularDestinations(response.data.slice(0, 4));
                }
            } catch (error) {
                console.error('Error loading popular destinations:', error);
            }
        };

        loadPopularDestinations();
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setResults(popularDestinations);
            return;
        }

        setIsLoading(true);
        const timeout = setTimeout(async () => {
            try {
                const response = await searchDestinationsApi(query.trim(), { limit: 8 });
                if (response && response.data) {
                    setResults(response.data);
                } else {
                    setResults([]);
                }
            } catch (error) {
                console.error('Search error:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, popularDestinations]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        setShowResults(false);
        window.scrollTo(0, 0);
    };

    const handleInputFocus = () => {
        setShowResults(true);
    };

    const handleInputChange = (e) => {
        setQuery(e.target.value);
        setShowResults(true);
    };

    const handleResultClick = (destination) => {
        navigate(`/destination/${destination.slug}`);
        setShowResults(false);
        setQuery('');
    };

    return (
        <div className={cx('search-wrapper')} ref={searchRef}>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{
                    y: -1,
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
                }}
                transition={{ type: 'spring', stiffness: 120, damping: 10 }}
                className={cx('search-bar')}
                onSubmit={handleSubmit}
            >
                <div className={cx('left')}>
                    <div className={cx('search-icon')}>
                        <SearchOutlined />
                    </div>
                    <input
                        type="text"
                        className={cx('search-input')}
                        placeholder="Tìm kiếm địa điểm, quán ăn, quán cà phê..."
                        value={query}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                    />
                </div>
                <button type="submit" className={cx('search-button')}>
                    <p>Tìm kiếm</p>
                </button>
            </motion.form>

            {showResults && (
                <div className={cx('search-results')}>
                    {isLoading ? (
                        <div className={cx('loading')}>
                            <div className={cx('loading-spinner')}></div>
                        </div>
                    ) : (
                        <>
                            {query.trim() && (
                                <div
                                    className={cx('show-all-results')}
                                    onClick={() => {
                                        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
                                        setShowResults(false);
                                        window.scrollTo(0, 0);
                                    }}
                                >
                                    Hiển thị tất cả kết quả cho "{query}"
                                </div>
                            )}

                            {results.length > 0 ? (
                                <>
                                    {!query.trim() && <div className={cx('section-title')}>Địa điểm phổ biến</div>}
                                    {results.map((destination, index) => (
                                        <SearchResultCard
                                            key={destination._id || index}
                                            destination={destination}
                                            onClick={() => handleResultClick(destination)}
                                        />
                                    ))}
                                </>
                            ) : (
                                <div className={cx('no-results')}>Không tìm thấy kết quả nào cho "{query}"</div>
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchBar;
