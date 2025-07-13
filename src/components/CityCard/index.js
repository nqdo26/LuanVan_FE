import React, { useRef } from 'react';
import { Card } from 'antd';
import classNames from 'classnames/bind';
import styles from './CityCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { incrementCityViewsApi } from '~/utils/api';
import viewTracker from '~/utils/viewTracker';

const cx = classNames.bind(styles);

function CityCard({ city }) {
    const navigate = useNavigate();
    const isProcessing = useRef(false);

    const handleClick = async (e) => {
        if (isProcessing.current) {
            return;
        }

        e.preventDefault();
        e.stopPropagation();

        isProcessing.current = true;

        try {
            if (city?._id && viewTracker.canIncrement('city', city._id)) {
                try {
                    await incrementCityViewsApi(city._id);
                } catch (error) {
                    console.error('Lỗi khi tăng lượt xem city:', error);
                }
            } else if (city?._id) {
                console.log('City view increment skipped (cooldown):', city._id);
            }

            navigate(`/city/${city?.slug}`);
            window.scrollTo(0, 0);
        } finally {
            setTimeout(() => {
                isProcessing.current = false;
            }, 1000);
        }
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
