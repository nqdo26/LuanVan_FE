import React from 'react';
import { Card } from 'antd';
import classNames from 'classnames/bind';
import styles from './CityCard.module.scss';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CityCard({ title }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/city/hehe');
        window.scrollTo(0, 0); 
    };

    return (
        <div className={cx('place-card')}>
            <Card
                onClick={handleClick}
                hoverable
                className={cx('custom-card')}
                styles={{
                    width: '100%',
                    height: 250,
                    body: {
                        padding: 0,
                    },
                }}
            >
                <div className={cx('image-container')}>
                    <img
                        alt={title}
                        src="/wimi2-img.png"
                        className={cx('card-image')}
                    />
                    <div className={cx('card-title')}>{title}</div>
                </div>
            </Card>
        </div>
    );
}

export default CityCard;
