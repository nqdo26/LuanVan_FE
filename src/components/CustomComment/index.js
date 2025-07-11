import React, { useState, useEffect } from 'react';
import { Avatar, Rate, List, Select, Progress, Button, Dropdown, Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './CustomComment.module.scss';
import { EditOutlined, EllipsisOutlined, LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CustomComment({ type = '', destinationId = null, handleAddComment }) {
    const [filter, setFilter] = useState('newest');
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (destinationId) {
        }
    }, [destinationId]);

    const ratingCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const totalReviews = reviews.length;

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'report') {
            navigate('/hehe');
            window.scrollTo(0, 0);
        }
    };

    const menuItems = [
        {
            key: 'report',
            label: <span>Báo cáo bình luận</span>,
        },
    ];

    const toggleDetails = () => {
        setIsDetailsVisible((prev) => !prev);
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Nhận xét & Đánh giá</h3>
            <div className={cx('custom-comment')}>
                <div className={cx('custom-comment-sidebar')}>
                    <div className={cx('custom-comment-rating')}>
                        <div className={cx('rating')}>
                            <span>0</span>
                            <Rate allowHalf disabled defaultValue={0} />
                        </div>
                        <p className={cx('total-review')}>({totalReviews})</p>
                    </div>

                    <div className={cx('rating-levels')}>
                        {Object.entries(ratingCount)
                            .reverse()
                            .map(([key, count]) => (
                                <div className={cx('rating-level-item')} key={key}>
                                    <p className={cx('rating-title')}>
                                        {key === '5'
                                            ? 'Rất tốt'
                                            : key === '4'
                                            ? 'Tốt'
                                            : key === '3'
                                            ? 'Bình thường'
                                            : key === '2'
                                            ? 'Tệ'
                                            : 'Rất tệ'}
                                    </p>
                                    <Progress
                                        className={cx('progress')}
                                        percent={totalReviews > 0 ? (count / totalReviews) * 100 : 0}
                                        showInfo={true}
                                        strokeColor={
                                            totalReviews > 0 && (count / totalReviews) * 100 >= 50
                                                ? '#4caf50'
                                                : '#f44336'
                                        }
                                        format={() => `${count} `}
                                    />
                                </div>
                            ))}
                    </div>
                </div>

                <div className={cx('custom-comment-content')}>
                    <div className={cx('custom-comment-filter')}>
                        <Select
                            defaultValue="all"
                            onChange={handleFilterChange}
                            className={cx('custom-comment-select')}
                        >
                            <Select.Option value="all">Tất cả</Select.Option>
                            <Select.Option value="mostliked">Nhiều lượt thích nhất</Select.Option>
                            <Select.Option value="newest">Mới nhất</Select.Option>
                            <Select.Option value="oldest">Cũ nhất</Select.Option>
                        </Select>

                        <Button
                            onClick={handleAddComment}
                            icon={<EditOutlined />}
                            className={cx('write-review-btn')}
                            type="primary"
                        >
                            Viết đánh giá
                        </Button>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                        </div>
                    ) : reviews.length > 0 ? (
                        <List
                            itemLayout="horizontal"
                            dataSource={reviews}
                            renderItem={(item) => (
                                <List.Item className={cx('custom-comment-item')}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.avatar} />}
                                        title={
                                            <span className={cx('title-wrapper')}>
                                                <strong className={cx('custom-comment-author')}>{item.author}</strong>
                                                <div className={cx('reaction')}>
                                                    <Button
                                                        icon={<LikeOutlined />}
                                                        className={cx('like-btn')}
                                                        type="text"
                                                    >
                                                        <span className={cx('like-count')}> {item.likes || 0}</span>
                                                    </Button>

                                                    <Dropdown
                                                        menu={{
                                                            items: menuItems,
                                                            onClick: handleMenuClick,
                                                        }}
                                                        trigger={['click']}
                                                        placement="bottomRight"
                                                        arrow={true}
                                                    >
                                                        <Button
                                                            icon={
                                                                <EllipsisOutlined
                                                                    style={{ fontSize: '23px', fontWeight: 'bold' }}
                                                                />
                                                            }
                                                            className={cx('more-btn')}
                                                            type="text"
                                                        />
                                                    </Dropdown>
                                                </div>
                                            </span>
                                        }
                                        description={
                                            <>
                                                <div className={cx('rating-and-reaction')}>
                                                    <Rate className={cx('rating-title')} disabled value={item.rating} />
                                                </div>
                                                <p className={cx('custom-comment-title')}>{item.title}</p>
                                                <p className={cx('custom-comment-visit-date')}>
                                                    Đã đến trải nghiệm vào: {item.visitDate}
                                                </p>
                                                <p className={cx('custom-comment-text')}>{item.content}</p>
                                                <div onClick={toggleDetails} className={cx('view-details-btn')}>
                                                    {isDetailsVisible ? 'Ẩn chi tiết' : 'Xem chi tiết đánh giá'}
                                                </div>

                                                {isDetailsVisible && (
                                                    <div className={cx('rating-details')}>
                                                        <table>
                                                            <tbody>
                                                                {type === 'restaurant' ? (
                                                                    <>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Đồ ăn/Thức uống:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={item.ratings?.food || 0}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Không gian:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={item.ratings?.space || 0}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Phục vụ:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={item.ratings?.service || 0}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Vệ sinh:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={
                                                                                        item.ratings?.cleanliness || 0
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Giá cả:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={item.ratings?.price || 0}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Độ thuận tiện đường đi:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={
                                                                                        item.ratings?.convenience || 0
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Cảnh quan:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={item.ratings?.landscape || 0}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Hoạt động trải nghiệm:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={
                                                                                        item.ratings?.activities || 0
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Chi phí tham quan:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={item.ratings?.price || 0}
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Vệ sinh:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={
                                                                                        item.ratings?.cleanliness || 0
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td className={cx('rating-label')}>
                                                                                Độ thuận tiện đường đi:
                                                                            </td>
                                                                            <td className={cx('rating-stars')}>
                                                                                <Rate
                                                                                    allowHalf
                                                                                    disabled
                                                                                    value={
                                                                                        item.ratings?.convenience || 0
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {item.images && item.images.length > 0 && (
                                                    <div className={cx('comment-images')}>
                                                        {item.images.slice(0, 4).map((img, idx) => (
                                                            <img
                                                                key={idx}
                                                                src={img}
                                                                alt={`review-img-${idx}`}
                                                                className={cx('comment-image')}
                                                            />
                                                        ))}
                                                    </div>
                                                )}

                                                <div className={cx('custom-comment-create-at')}>
                                                    Đánh giá vào lúc: {item.createAt}
                                                </div>
                                            </>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <p style={{ fontSize: '16px', color: '#666' }}>Chưa có đánh giá nào cho địa điểm này</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomComment;
