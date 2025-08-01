import classNames from 'classnames/bind';
import styles from './SearchFilterTabs.module.scss';
import CustomTitle from '../CustomTitle';
import SearchBar from '../SearchBar';

const cx = classNames.bind(styles);

function SearchFilterTabs() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <CustomTitle title={'Khám phá địa điểm & hành trình'} size={35} />
                    <div className={cx('search-bar')}>
                        <SearchBar />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SearchFilterTabs;
