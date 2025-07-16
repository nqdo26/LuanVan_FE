import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Rate, List, Select, Progress, Button, Dropdown, Spin, message, Modal, Image } from 'antd';
import classNames from 'classnames/bind';
import styles from './CustomComment.module.scss';
import { EditOutlined, EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { getCommentsByDestinationApi, deleteCommentApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

function CustomComment({ type = '', destinationId = null, handleAddComment }) {
    const [filter, setFilter] = useState('newest');
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalComments: 0 });
    const [expandedComments, setExpandedComments] = useState({});
    const [showAll, setShowAll] = useState(false);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (destinationId) {
            fetchComments();
        }
    }, [destinationId]);

    const fetchComments = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getCommentsByDestinationApi(destinationId, page, 10);
            if (response && response.EC === 0) {
                setReviews(response.data.comments);
                setPagination(response.data.pagination);
            } else {
                console.error('Error fetching comments:', response?.EM);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
            message.error('Có lỗi xảy ra khi tải bình luận');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = (commentId) => {
        Modal.confirm({
            title: 'Xác nhận xóa bình luận',
            content: 'Bạn có chắc chắn muốn xóa bình luận này không?',
            okText: 'Xóa',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    const response = await deleteCommentApi(commentId);
                    if (response && response.EC === 0) {
                        message.success('Xóa bình luận thành công');
                        fetchComments(pagination.currentPage);
                    } else {
                        message.error(response?.EM || 'Có lỗi xảy ra khi xóa bình luận');
                    }
                } catch (error) {
                    console.error('Error deleting comment:', error);
                    message.error('Có lỗi xảy ra khi xóa bình luận');
                }
            },
        });
    };

    const averageRating =
        reviews.length > 0
            ? (
                  reviews.reduce((sum, review) => {
                      if (review.detail) {
                          const avg =
                              Object.values(review.detail).reduce((s, v) => s + v, 0) /
                              Object.keys(review.detail).length;
                          return sum + avg;
                      }
                      return sum;
                  }, 0) / reviews.length
              ).toFixed(1)
            : 0;

    const ratingCount = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((review) => {
        if (review.detail) {
            const avg = Object.values(review.detail).reduce((sum, v) => sum + v, 0) / Object.keys(review.detail).length;
            ratingCount[Math.round(avg)]++;
        }
    });

    const handleFilterChange = (value) => {
        setFilter(value);
    };

    const handleMenuClick = ({ key }, commentId) => {
        if (key === 'report') {
            message.info('Chức năng báo cáo đang phát triển');
        } else if (key === 'delete') {
            handleDeleteComment(commentId);
        }
    };

    const getMenuItems = (comment) => {
        const items = [];
        if (auth.isAuthenticated && (auth.user.id === comment.userId._id || auth.user.role === 'admin')) {
            items.push({
                key: 'delete',
                label: (
                    <span style={{ color: '#ff4d4f' }}>
                        <DeleteOutlined /> Xóa bình luận
                    </span>
                ),
            });
        }
        return items;
    };

    const toggleCommentDetails = (commentId) => {
        setExpandedComments((prev) => ({
            ...prev,
            [commentId]: !prev[commentId],
        }));
    };

    const getFilteredReviews = () => {
        let filtered = [...reviews];
        if (filter === 'newest') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (filter === 'oldest') {
            filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        }
        if (!showAll) {
            return filtered.slice(0, 2);
        }
        return filtered;
    };

    return (
        <div className={cx('wrapper')}>
            <h3 className={cx('title')}>Nhận xét & Đánh giá</h3>
            <div className={cx('custom-comment')}>
                <div className={cx('custom-comment-sidebar')}>
                    <div className={cx('custom-comment-rating')}>
                        <div className={cx('rating')}>
                            <span>{averageRating}</span>
                            <Rate allowHalf disabled value={Number(averageRating)} />
                        </div>
                        <p className={cx('total-review')}>({reviews.length})</p>
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
                                        percent={reviews.length > 0 ? (count / reviews.length) * 100 : 0}
                                        showInfo
                                        strokeColor={{
                                            '0%': '#64c5ff',
                                            '100%': '#1c1f4a', 
                                        }}
                                        format={() => `${count}`}
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
                            dataSource={getFilteredReviews()}
                            renderItem={(item) => (
                                <List.Item className={cx('custom-comment-item')}>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.userId?.avatar || '/default-avatar.png'} />}
                                        title={
                                            <span className={cx('title-wrapper')}>
                                                <strong className={cx('custom-comment-author')}>
                                                    {item.userId?.fullName || 'Ẩn danh'}
                                                </strong>
                                                <div className={cx('reaction')}>
                                                    {auth.isAuthenticated &&
                                                        (auth.user.id === item.userId._id ||
                                                            auth.user.role === 'admin') && (
                                                            <Dropdown
                                                                menu={{
                                                                    items: getMenuItems(item),
                                                                    onClick: (info) => handleMenuClick(info, item._id),
                                                                }}
                                                                trigger={['click']}
                                                                placement="bottomRight"
                                                                arrow
                                                            >
                                                                <Button
                                                                    icon={
                                                                        <EllipsisOutlined
                                                                            style={{
                                                                                fontSize: '23px',
                                                                                fontWeight: 'bold',
                                                                            }}
                                                                        />
                                                                    }
                                                                    className={cx('more-btn')}
                                                                    type="text"
                                                                />
                                                            </Dropdown>
                                                        )}
                                                </div>
                                            </span>
                                        }
                                        description={
                                            <>
                                                <div className={cx('rating-and-reaction')}>
                                                    <Rate
                                                        allowHalf
                                                        className={cx('rating-title')}
                                                        disabled
                                                        value={
                                                            Object.values(item.detail || {}).reduce(
                                                                (a, b) => a + b,
                                                                0,
                                                            ) / (Object.keys(item.detail || {}).length || 1)
                                                        }
                                                    />
                                                </div>
                                                <p className={cx('custom-comment-title')}>{item.title}</p>
                                                <p className={cx('custom-comment-visit-date')}>
                                                    Đã đến trải nghiệm vào:{' '}
                                                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                                <p className={cx('custom-comment-text')}>{item.content}</p>
                                                <div
                                                    onClick={() => toggleCommentDetails(item._id)}
                                                    className={cx('view-details-btn')}
                                                >
                                                    {expandedComments[item._id]
                                                        ? 'Ẩn chi tiết'
                                                        : 'Xem chi tiết đánh giá'}
                                                </div>
                                                {expandedComments[item._id] && (
                                                    <div className={cx('rating-details')}>
                                                        <table>
                                                            <tbody>
                                                                {Object.entries(
                                                                    type === 'restaurant'
                                                                        ? {
                                                                              criteria1: 'Đồ ăn/Thức uống',
                                                                              criteria2: 'Không gian',
                                                                              criteria3: 'Dịch vụ',
                                                                              criteria4: 'Vệ sinh',
                                                                              criteria5: 'Giá cả',
                                                                              criteria6: 'Độ thuận tiện',
                                                                          }
                                                                        : {
                                                                              criteria1: 'Cảnh quan',
                                                                              criteria2: 'Hoạt động trải nghiệm',
                                                                              criteria3: 'Nét đặc trưng',
                                                                              criteria4: 'Vệ sinh',
                                                                              criteria5: 'Chi phí tham quan',
                                                                              criteria6: 'Độ thuận tiện',
                                                                          },
                                                                ).map(([criteriaKey, label]) => (
                                                                    <tr key={criteriaKey}>
                                                                        <td className={cx('rating-label')}>{label}:</td>
                                                                        <td>
                                                                            <Rate
                                                                                allowHalf
                                                                                disabled
                                                                                value={item.detail?.[criteriaKey] || 0}
                                                                            />
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {item.images && item.images.length > 0 && (
                                                    <div className={cx('comment-images')}>
                                                        {item.images.slice(0, 4).map((img, idx) => (
                                                            <Image
                                                                key={idx}
                                                                src={img}
                                                                alt={`review-img-${idx}`}
                                                                className={cx('comment-image')}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                                <div className={cx('custom-comment-create-at')}>
                                                    Đánh giá vào lúc: {''}
                                                    {new Date(item.createdAt).toLocaleTimeString('vi-VN', {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}{' '}
                                                    {''}
                                                    {new Date(item.createdAt).toLocaleDateString('vi-VN')}
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

                    {!showAll && reviews.length > 2 && (
                        <div style={{ textAlign: 'center', margin: '16px 0' }}>
                            <Button className={cx('show-all-btn')} type="link" onClick={() => setShowAll(true)}>
                                <p> Xem tất cả bình luận</p>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CustomComment;
