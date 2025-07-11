
import styles from './CardReview.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

function CardReview({ destination = {}, handleOnClick }) {

    const getFirstImage = () => {
        if (!destination.album) return '/placeholder-image.jpg';

        if (destination.album.space && destination.album.space.length > 0) {
            return destination.album.space[0];
        }
        if (destination.album.fnb && destination.album.fnb.length > 0) {
            return destination.album.fnb[0];
        }
        if (destination.album.extra && destination.album.extra.length > 0) {
            return destination.album.extra[0];
        }

        return '/placeholder-image.jpg';
    };

    const getLocationString = () => {
        if (!destination.location) return 'Chưa có địa chỉ';

        const { address, city } = destination.location;
        let locationStr = address || '';

        if (city && city.name) {
            locationStr += locationStr ? `, ${city.name}` : city.name;
        }

        return locationStr || 'Chưa có địa chỉ';
    };

    return (
        <div className={cx('card')} onClick={handleOnClick}>
            <img src={getFirstImage()} alt={destination.title || 'Destination image'} className={cx('image')} />
            <div className={cx('info')}>
                <h3 className={cx('name')}>{destination.title || 'Tên địa điểm'}</h3>
                <p className={cx('location')}>{getLocationString()}</p>
            </div>
        </div>
    );
}

export default CardReview;
