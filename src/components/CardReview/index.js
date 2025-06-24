import styles from './CardReview.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CardReview({
    destination = {
        title: 'Wimi-Factory',
        image: '/wimi2-img.png',
        location: '123 Đường ABC, Quận 1, TP.HCM',
    },
}) {
    return (
        <div className={cx('card')}>
            <img src={destination.image} alt={destination.title} className={cx('image')} />
            <div className={cx('info')}>
                <h3 className={cx('name')}>{destination.title}</h3>
                <p className={cx('location')}>{destination.location}</p>
            </div>
        </div>
    );
}

export default CardReview;
