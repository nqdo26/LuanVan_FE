import { Button, Rate } from 'antd';
import { HeartOutlined, EnvironmentOutlined, EditOutlined, ShareAltOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './DestinationDetailPageHeader.module.scss';

const cx = classNames.bind(styles);

function DestinationDetailPageHeader({
    title = '',
    location = {},
    tags = [],
    averageRating = 0,
    comments = [],
    updated = '',
    handleAddComment,
    handleSave,
    handleShare,
    destinationType = 'tourist',
}) {
    const getBadgeClass = () => {
        return destinationType === 'restaurant' ? 'badge-restaurant' : 'badge-tourist';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Không xác định';

        try {
            const date = new Date(dateString);
            const day = date.getDate().toString().padStart(2, '0');
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${day}/${month}/${year}`;
        } catch (error) {
            return 'Không xác định';
        }
    };

    return (
        <div className={cx('destination-header')}>
            <div className={cx('location')}>
                <EnvironmentOutlined className={cx('location-icon')} />
                <span className={cx('location-name')}>{location?.city?.name || 'Không xác định'}</span>
            </div>
            <div className={cx('title-save')}>
                <h2 className={cx('title')}>{title}</h2>
                <div className={cx('action')}>
                    <Button onClick={handleSave} icon={<HeartOutlined />} className={cx('save-btn')}>
                        Lưu
                    </Button>
                    <Button onClick={handleShare} icon={<ShareAltOutlined />} className={cx('share-btn')}>
                        Chia sẻ
                    </Button>
                </div>
            </div>

            <div className={cx('badge-container')}>
                {Array.isArray(tags) &&
                    tags.length > 0 &&
                    tags.map((tag) => (
                        <span key={tag._id} className={cx('badge', getBadgeClass())}>
                            {tag.title}
                        </span>
                    ))}
            </div>

            <div className={cx('review-section')}>
                <div className={cx('rating-location')}>
                    <Rate allowHalf disabled defaultValue={averageRating} className={cx('rating')} />
                    <span className={cx('review-count')}>
                        {comments.length === 0 ? 'Chưa có đánh giá' : `${comments.length} đánh giá`}
                    </span>
                    |<span className={cx('review-count')}>Ngày cập nhật gần nhất: {formatDate(updated)}</span>
                </div>
                <div onClick={handleAddComment} className={cx('review-btn')}>
                    <EditOutlined />
                    <span>Viết đánh giá</span>
                </div>
            </div>
        </div>
    );
}

export default DestinationDetailPageHeader;
