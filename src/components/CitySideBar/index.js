import React, { useState } from 'react';
import { Checkbox } from 'antd';
import classNames from 'classnames/bind';
import styles from './CitySideBar.module.scss';

const cx = classNames.bind(styles);

function CitySideBar({ categoryFilters, setCategoryFilters }) {
    // Danh sách tag dạng id-title
    const allOptions = [
        { id: '68832d6d145e65b0c52e10f4', title: 'Quán ăn' },
        { id: '6871ed5bf51c778fcf9ae5a5', title: 'Nhà hàng' },
        { id: '6871ed7ff51c778fcf9ae5b5', title: 'Quán cà phê' },
        { id: '68751cf7d9606247d89f335b', title: 'Khu vui chơi' },
        { id: '6871ed6bf51c778fcf9ae5ad', title: 'Công viên' },
        { id: '6871ed65f51c778fcf9ae5a9', title: 'Di tích lịch sử' },
        { id: '6871ed6ff51c778fcf9ae5b1', title: 'Bảo tàng' },
    ];

    const handleChange = (id) => {
        if (categoryFilters.includes(id)) {
            setCategoryFilters(categoryFilters.filter((item) => item !== id));
        } else {
            setCategoryFilters([...categoryFilters, id]);
        }
    };

    return (
        <div className={cx('sidebar')}>
            <h3 className={cx('title')}>Danh mục</h3>
            <ul className={cx('list')}>
                {allOptions.map((option) => (
                    <li key={option.id}>
                        <label className={cx('checkbox-label')}>
                            <Checkbox
                                checked={categoryFilters.includes(option.id)}
                                onChange={() => handleChange(option.id)}
                            />
                            {option.title}
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CitySideBar;
