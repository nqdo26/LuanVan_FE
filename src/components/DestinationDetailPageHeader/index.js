import { Button, Rate } from 'antd';
import { HeartOutlined, EnvironmentOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './DestinationDetailPageHeader.module.scss';

const cx = classNames.bind(styles);

const badges = ['Văn hóa', 'Ẩm thực', 'Chụp hình'];

function DestinationDetailPageHeader({ title }) {
    return (
        <div className={cx('destination-header')}>
            <div className={cx('location')}>
                <EnvironmentOutlined className={cx('location-icon')} />
                <span className={cx('location-name')}>Thành phố Cần Thơ</span>
            </div>
            <div className={cx('title-save')}>
                <h2 className={cx('title')}>{title}</h2>
                <div className={cx('action')}>
                    <Button icon={<HeartOutlined />} className={cx('save-btn')}>
                        Lưu
                    </Button>
                    <Button icon={<ShareAltOutlined />} className={cx('share-btn')}>
                        Chia sẻ
                    </Button>
                </div>
            </div>

            <div className={cx('badge-container')}>
                {badges.map((badge, index) => (
                    <span key={index} className={cx('badge')}>
                        {badge}
                    </span>
                ))}
            </div>

            <div className={cx('review-section')}>
                <div className={cx('rating-location')}>
                    <Rate disabled defaultValue={5} className={cx('rating')} />
                    <span className={cx('review-count')}>2,930 đánh giá</span>
                </div>
                <div className={cx('review-btn')}>
                    <EditOutlined />
                    <span>Viết đánh giá</span>
                </div>
            </div>
        </div>
    );
}

export default DestinationDetailPageHeader;
