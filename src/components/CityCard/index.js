import React from 'react';
import { Card } from 'antd';
import classNames from 'classnames/bind';
import styles from './CityCard.module.scss';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CityCard({ city }) {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/city/${city?.slug}`);
        window.scrollTo(0, 0);
    };

    const cityImage = city?.images?.[0];

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
                    <img alt={city?.name || 'City view'} src={cityImage} className={cx('card-image')} />
                    <div className={cx('card-title')}>{city.name}</div>
                </div>
            </Card>
        </div>
    );
}

export default CityCard;
