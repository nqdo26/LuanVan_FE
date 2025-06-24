import React from 'react';
import classNames from 'classnames/bind';
import styles from './CustomScrollBar.module.scss';

const cx = classNames.bind(styles);

function CustomScrollBar({ children, className, maxHeight = '100%' }) {
    return (
        <div className={cx('scroll-wrapper', className)} style={{ maxHeight }}>
            {children}
        </div>
    );
}

export default CustomScrollBar;
