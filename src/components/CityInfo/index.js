import classNames from 'classnames/bind';
import styles from './CityInfo.module.scss';

const cx = classNames.bind(styles);

function CityInfo({ city, tour }) {
    if (!city) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('general-info')}>
                    <h2 className={cx('section-title')}>Thông tin chung</h2>
                    <p>Chưa có thông tin thành phố</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('general-info')}>
                <h2 className={cx('section-title')}>Thông tin hữu ích</h2>

                {city.info && city.info.length > 0 && (
                    <div className={cx('info-grid')}>
                        {city.info.map((info, index) => {
                            return (
                                <div key={index}>
                                    <p className={cx('general-title')}>{info.title || info.name || 'Thông tin'}:</p>
                                    <p className={cx('general-content')}>
                                        {info.content || info.description || info.value || 'Không có thông tin'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {city.weather && city.weather.length > 0 && (
                <div className={cx('weather')}>
                    <h2 className={cx('section-title')}>Thời tiết địa phương</h2>
                    <p className={cx('weather-note')}>
                        💡 Đừng quên thông tin thời tiết trước khi lên đường nhé!
                    </p>
                    <div className={cx('seasons')}>
                        {city.weather.map((season, index) => (
                            <div key={index} className={cx('season')}>
                                <p className={cx('time')}>{season.title}</p>
                                <p className={cx('temp')}>
                                    {season.maxTemp}° <span>{season.minTemp}°</span>
                                </p>
                                <p className={cx('desc')}>{season.note}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CityInfo;
