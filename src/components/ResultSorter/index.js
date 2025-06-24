import { useState } from 'react';
import { Select } from 'antd';
import classNames from 'classnames/bind';
import styles from './ResultSorter.module.scss';

const cx = classNames.bind(styles);

function ResultSorter() {
    const [sortOption, setSortOption] = useState('Recommended');

    return (
        <div className={cx('wrapper')}>
            <div className={cx('sortContainer')}>
                <span className={cx('sortLabel')}>Sắp xếp theo</span>
                <Select value={sortOption} onChange={setSortOption} className={cx('sortSelect')}>
                    <Select.Option value="Recommended">Phổ biến</Select.Option>
                    <Select.Option value="Price: Low to High">Giá thấp đến cao</Select.Option>
                    <Select.Option value="Price: High to Low">Giá cao đến thấp</Select.Option>
                </Select>
            </div>
        </div>
    );
}

export default ResultSorter;
