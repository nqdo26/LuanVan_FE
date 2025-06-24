import React, { useState } from 'react';
import { Avatar, Rate, List, Select, Progress, Button, Dropdown } from 'antd';
import classNames from 'classnames/bind';
import styles from './CustomComment.module.scss';
import { EditOutlined, EllipsisOutlined, LikeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function CustomComment({ type = 'restauran' }) {
    const [filter, setFilter] = useState('newest');
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const navigate = useNavigate();

    const reviews = [
        {
            author: 'Độ đẹp trai',
            avatar: 'https://via.placeholder.com/50',
            rating: 5,
            landscape: 4.5,
            service: 5,
            price: 2,
            cleanliness: 1.5,
            convenience: 2,
            activities: 4,
            createAt: '20/4/2025',
            title: 'Nước ngon',
            content: 'Quán này không có gì đặc biệt, chỉ là một quán ăn bình thường thôi',
            visitDate: '02/06/2003',
            images: ['/wimi2-img.png', '/wimi3-img.png', '/wimi4-img.png', '/wimi1-img.png'],
        },
        {
            author: 'Nguyễn Văn A',
            avatar: 'https://via.placeholder.com/50',
            rating: 4,
            landscape: 4.0,
            service: 4.5,
            price: 4.5,
            cleanliness: 4.5,
            convenience: 4.5,
            activities: 4.5,
            createAt: '30/2/2024',
            title: 'Tôi thích quán này',
            content: 'Ghế ngồi quá đã',
            visitDate: '02/06/2023',
            images: [],
        },
    ];

    const ratingCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

    reviews.forEach((review) => {
        const roundedRating = Math.round(review.rating);
        ratingCount[roundedRating]++;
    });

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

    const handleWriteReview = () => {
        navigate('/write-review');
        window.scrollTo(0, 0);
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
                            <span>4.3</span>
                            <Rate allowHalf disabled defaultValue={4.5} />
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
                                        percent={(count / totalReviews) * 100}
                                        showInfo={true}
                                        strokeColor={(count / totalReviews) * 100 >= 50 ? '#4caf50' : '#f44336'}
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
                            onClick={handleWriteReview}
                            icon={<EditOutlined />}
                            className={cx('write-review-btn')}
                            type="primary"
                        >
                            Viết đánh giá
                        </Button>
                    </div>

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
                                                <Button icon={<LikeOutlined />} className={cx('like-btn')} type="text">
                                                    <span className={cx('like-count')}> 30</span>
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
                                                            {/* Cập nhật tiêu chí cho restaurant */}
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
                                                                                value={item.convenience}
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
                                                                                value={item.landscape}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className={cx('rating-label')}>Phục vụ:</td>
                                                                        <td className={cx('rating-stars')}>
                                                                            <Rate
                                                                                allowHalf
                                                                                disabled
                                                                                value={item.service}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className={cx('rating-label')}>Vệ sinh:</td>
                                                                        <td className={cx('rating-stars')}>
                                                                            <Rate
                                                                                allowHalf
                                                                                disabled
                                                                                value={item.cleanliness}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className={cx('rating-label')}>Giá cả:</td>
                                                                        <td className={cx('rating-stars')}>
                                                                            <Rate
                                                                                allowHalf
                                                                                disabled
                                                                                value={item.price}
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
                                                                                value={item.convenience}
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
                                                                                value={item.landscape}
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
                                                                                value={item.activities}
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
                                                                                value={item.price}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className={cx('rating-label')}>Vệ sinh:</td>
                                                                        <td className={cx('rating-stars')}>
                                                                            <Rate
                                                                                allowHalf
                                                                                disabled
                                                                                value={item.cleanliness}
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
                                                                                value={item.convenience}
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
                </div>
            </div>
        </div>
    );
}

export default CustomComment;
