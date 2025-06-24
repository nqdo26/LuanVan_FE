import React, { useState } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames/bind';
import styles from './CitySideBar.module.scss';

const cx = classNames.bind(styles);

function CitySideBar() {
    const [checkedItems, setCheckedItems] = useState({});

    const allOptions = [
        'Quán ăn & Nhà hàng',
        'Quán cà phê',
        'Khu vui chơi',
        'Công viên',
        'Di tích lịch sử',
        'Bảo tàng',
    ];

    const toggleCheckbox = (label) => {
        setCheckedItems((prev) => ({
            ...prev,
            [label]: !prev[label],
        }));
    };

    return (
        <div className={cx('sidebar')}>
            <h3 className={cx('title')}>Danh mục</h3>
            <ul className={cx('list')}>
                {allOptions.map((label, index) => (
                    <li key={index}>
                        <label className={cx('checkbox-label')}>
                            <Checkbox checked={!!checkedItems[label]} onChange={() => toggleCheckbox(label)} />
                            {label}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CitySideBar;
