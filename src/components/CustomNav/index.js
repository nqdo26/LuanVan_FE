import { InfoCircleTwoTone, EnvironmentTwoTone } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './CustomNav.module.scss';

const cx = classNames.bind(styles);
const navItems = [
    { id: 'info', icon: <InfoCircleTwoTone twoToneColor="#52c41a" className={cx('icon')} />, label: 'Giới thiệu' },
    {
        id: 'destination',
        icon: <EnvironmentTwoTone twoToneColor="#fa541c" className={cx('icon')} />,
        label: 'Địa điểm',
    },
    {
        id: 'weather',
        icon: <InfoCircleTwoTone twoToneColor="#40a9ff" className={cx('icon')} />,
        label: 'Thông tin hữu ích',
    },
];

function CustomNav() {
    const handleClick = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className={cx('wrapper')}>
            {navItems.map((item, index) => (
                <div key={index} className={cx('item')} onClick={() => handleClick(item.id)}>
                    {item.icon}
                    <span className={cx('label')}>{item.label}</span>
                </div>
            ))}
        </div>
    );
}

export default CustomNav;
