import classNames from 'classnames/bind';
import styles from './WeatherInfo.module.scss';

const cx = classNames.bind(styles);

function WeatherInfo({ city = {} }) {
    const defaultWeather = [
        {
            title: 'THG 12 - THG 2',
            minTemp: 19,
            maxTemp: 25,
            note: 'Trời se lạnh - lý tưởng cho chuyến nghỉ dưỡng',
        },
        {
            title: 'THG 3 - THG 5',
            minTemp: 23,
            maxTemp: 32,
            note: 'Mát mẻ - thời gian tuyệt nhất để du lịch',
        },
        {
            title: 'THG 6 - THG 8',
            minTemp: 26,
            maxTemp: 34,
            note: 'Nóng ẩm - nên mang theo đồ chống nắng',
        },
        {
            title: 'THG 9 - THG 11',
            minTemp: 20,
            maxTemp: 28,
            note: 'Thu mát mẻ - thời tiết dễ chịu',
        },
    ];

    const weatherData = city?.weather || defaultWeather;
    const infoData = city?.info || [];
    return (
        <div className={cx('wrapper')}>
            <div className={cx('weather')}>
                <h2 className={cx('section-title')}>Thời tiết địa phương</h2>
                <div className={cx('seasons')}>
                    {weatherData.map((season, index) => (
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

            <div className={cx('general-info')}>
                <h2 className={cx('section-title')}>Thông tin chung</h2>
                {infoData.length > 0 ? (
                    <div className={cx('info-grid')}>
                        {infoData.map((info, index) => (
                            <div key={index}>
                                <p className={cx('general-title')}>{info.title}</p>
                                <p className={cx('general-content')}>{info.description}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Chưa có thông tin bổ sung</p>
                )}
            </div>
        </div>
    );
}

export default WeatherInfo;
