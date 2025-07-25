import React from 'react';
import classNames from 'classnames/bind';
import styles from './CustomFooter.module.scss';
import { Layout } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
    const cx = classNames.bind(styles);
    return (
        <Footer className={cx('wrapper')}>
            <p>© 2025 GoOhNo – Đồ án tốt nghiệp Đại học Cần Thơ</p>
            <p>Nguyễn Quang Độ – B2103496</p>
        </Footer>
    );
};

export default CustomFooter;
