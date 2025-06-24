import classNames from 'classnames/bind';
import styles from './TripNav.module.scss';
import { DownOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function TripNav({ options = [], selectedIndexes = [], onToggle }) {
    const handleClick = (index) => {
        onToggle?.(index);
    };

    return (
        <div className={cx('nav-container')}>
            {options.map((option, index) => (
                <button
                    key={index}
                    className={cx('nav-item', { selected: selectedIndexes.includes(index) })}
                    onClick={() => handleClick(index)}
                >
                    {option.icon && <span className={cx('icon')}>{option.icon}</span>}
                    {option.label}
                    {option.hasDropdown && <DownOutlined className={cx('dropdown-icon')} />}
                </button>
            ))}
        </div>
    );
}

export default TripNav;
