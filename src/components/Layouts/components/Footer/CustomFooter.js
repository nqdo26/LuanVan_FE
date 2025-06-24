import React from 'react';
import classNames from 'classnames/bind';
import styles from './CustomFooter.module.scss';
import { Layout } from 'antd';

const { Footer } = Layout;

const CustomFooter = () => {
    const cx = classNames.bind(styles);
    return (
        <Footer className={cx('wrapper')}>
            <p>Đây là footer</p>
        </Footer>
    );
};

export default CustomFooter;
