import classNames from 'classnames/bind';
import styles from './CityInfo.module.scss';

const cx = classNames.bind(styles);

function CityInfo() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('general-info')}>
                <h2 className={cx('section-title')}>Thông tin chung</h2>
                <div className={cx('info-grid')}>
                    <div>
                        <p className={cx('general-title')}>Thời gian tuyệt nhất để đến:</p>
                        <p className={cx('general-content')}>THG 5 - Lễ hội Khinh khí cầu Quốc tế</p>
                    </div>
                    <div>
                        <p className={cx('general-title')}>Thời lượng lý tưởng:</p>
                        <p className={cx('general-content')}>4 ngày 3 đêm</p>
                    </div>
                    <div>
                        <p className={cx('general-title')}>Nét đặt trưng:</p>
                        <p className={cx('general-content')}>
                            Phố cổ rêu phong, ẩm thực phong phú và không khí mùa thu lãng mạn.
                        </p>
                    </div>
                    <div>
                        <p className={cx('general-title')}>Nhịp sống & không khí:</p>
                        <p className={cx('general-content')}>Hoạt động sôi nổi vào ban ngày lẫn ban đêm</p>
                    </div>
                </div>
            </div>
            <div className={cx('weather')}>
                <h2 className={cx('section-title')}>Thời tiết địa phương</h2>
                <div className={cx('seasons')}>
                    <div className={cx('season')}>
                        <p className={cx('time')}>THG 12 - THG 2</p>
                        <p className={cx('temp')}>
                            25° <span>19°</span>
                        </p>
                        <p className={cx('desc')}>Trời se lạnh - lý tưởng cho chuyến nghỉ dưỡng</p>
                    </div>
                    <div className={cx('season')}>
                        <p className={cx('time')}>THG 3 - THG 5</p>
                        <p className={cx('temp')}>
                            32°
                            <span>23°</span>
                        </p>
                        <p className={cx('desc')}>Mát mẻ - thời gian tuyệt nhất để du lịch </p>
                    </div>
                    <div className={cx('season')}>
                        <p className={cx('time')}>THG 6 - THG 8</p>
                        <p className={cx('temp')}>
                            34° <span>26°</span>
                        </p>
                        <p className={cx('desc')}>Thời tiết nắng nóng - thích hợp để đi biển</p>
                    </div>
                    <div className={cx('season')}>
                        <p className={cx('time')}>THG 9 - THG 11</p>
                        <p className={cx('temp')}>
                            30° <span>23°</span>
                        </p>
                        <p className={cx('desc')}>Mùa mưa - khả năng cao có bão hay mưa to</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CityInfo;
