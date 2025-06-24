import React from 'react';
import classNames from 'classnames/bind';
import styles from './CardSearchDrawer.module.scss';

const cx = classNames.bind(styles);

function CardSearchDrawer({ city, region, image }) {
    return (
        <div className={cx('card')}>
            <img src={image} alt={city} className={cx('image')} />
            <div className={cx('info')}>
                <div className={cx('city-name')}>{city}</div>
                <div className={cx('region')}>{region}</div>
            </div>
        </div>
    );
}

export default CardSearchDrawer;
