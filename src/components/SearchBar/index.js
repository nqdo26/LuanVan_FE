// SearchBar.jsx
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './SearchBar.module.scss';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const cx = classNames.bind(styles);

function SearchBar() {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!query.trim()) return;
        navigate(`/search?q=${encodeURIComponent(query.trim())}`);
        window.scrollTo(0, 0);
    };

    return (
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
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <button type="submit" className={cx('search-button')}>
                <p>Tìm kiếm</p>
            </button>
        </motion.form>
    );
}

export default SearchBar;
