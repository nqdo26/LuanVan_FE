import { Select } from 'antd';
import classNames from 'classnames/bind';
import styles from './ResultSorter.module.scss';

const cx = classNames.bind(styles);

function ResultSorter({ sortOption, setSortOption }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('sortContainer')}>
                <span className={cx('sortLabel')}>Sắp xếp theo</span>
                <Select
                    value={sortOption}
                    onChange={setSortOption}
                    className={cx('sortSelect')}
                    options={[
                        { value: 'Recommended', label: 'Tất cả' },
                        { value: 'Rate: Low to High', label: 'Đánh giá thấp đến cao' },
                        { value: 'Rate: High to Low', label: 'Đánh giá cao đến thấp' },
                    ]}
                />
            </div>
        </div>
    );
}

export default ResultSorter;
