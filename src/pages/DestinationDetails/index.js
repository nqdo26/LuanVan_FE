import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { Spin, notification, Tabs } from 'antd';
import styles from './DestinationDetails.module.scss';
import DestinationDetailPageHeader from '~/components/DestinationDetailPageHeader';
import DestinationGallery from '~/components/DestinationGallery';
import DestinationOverview from '~/components/DestinationOverview';
import CustomComment from '~/components/CustomComment';
import { getDestinationBySlugApi, addToFavoritesApi } from '~/utils/api';

const cx = classNames.bind(styles);

const items = [
    { key: 'description', label: 'Tổng quan' },
    { key: 'rate', label: 'Đánh giá' },
];

const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

function DestinationDetails() {
    const { slug } = useParams();
    const [destinationData, setDestinationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            fetchDestinationData();
        }
    }, [slug]);

    useEffect(() => {
        if (destinationData) {
            document.title = `${destinationData.title} - Du lịch Việt Nam`;
        }

        return () => {
            document.title = 'Du lịch Việt Nam';
        };
    }, [destinationData]);

    const fetchDestinationData = async () => {
        try {
            setLoading(true);
            const response = await getDestinationBySlugApi(slug);

            if (response && response.EC === 0) {
                setDestinationData(response.data);
            } else {
                notification.error({
                    message: 'Lỗi',
                    description: 'Không thể tải thông tin địa điểm',
                });
            }
        } catch (error) {
            console.error('Error fetching destination:', error);
            notification.error({
                message: 'Lỗi',
                description: 'Có lỗi xảy ra khi tải thông tin địa điểm',
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 9999,
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!destinationData) {
        return (
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    fontSize: '18px',
                }}
            >
                Không tìm thấy thông tin địa điểm
            </div>
        );
    }

    const handleAddComment = () => {
        navigate(`/write-review/${destinationData.slug}`);
    };

    const handleSave = async () => {
        try {
            const response = await addToFavoritesApi(destinationData._id);
            if (response && response.EC === 0) {
                notification.success({
                    description: 'Đã thêm địa điểm vào danh sách yêu thích',
                });
            } else {
                notification.warning({
                    description: response?.EM || 'Vui lòng đăng nhập để thêm vào yêu thích',
                });
            }
        } catch (error) {
            notification.error({
                description: 'Có lỗi xảy ra khi thêm vào yêu thích',
            });
        }
    };

    const handleShare = () => {
        const shareUrl = `${window.location.origin}/destination/${destinationData.slug}`;
        if (navigator.share) {
            navigator
                .share({
                    title: destinationData.title,
                    text: `Check out this destination: ${destinationData.title}`,
                    url: shareUrl,
                })

                .catch((error) => notification.error({ message: 'Lỗi khi chia sẻ', description: error.message }));
        } else {
            notification.info({
                message: 'Chia sẻ',
                description: `Sao chép liên kết để chia sẻ: ${shareUrl}`,
            });
        }
    };
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <DestinationDetailPageHeader
                        title={destinationData.title}
                        location={destinationData.location}
                        tags={destinationData.tags}
                        averageRating={destinationData.statistics.averageRating}
                        comments={destinationData.comments}
                        destinationType={destinationData.type}
                        handleAddComment={handleAddComment}
                        handleSave={handleSave}
                        handleShare={handleShare}
                    />
                </div>
                <div className={cx('body')}>
                    <DestinationGallery type={destinationData.type} album={destinationData.album} />
                    <Tabs
                        className={cx('tabs')}
                        onChange={scrollToSection}
                        items={items.map(({ key, label }) => ({
                            key,
                            label: <span className={cx('tab-item')}>{label}</span>,
                        }))}
                    />
                    <div id="description">
                        <DestinationOverview
                            destination={destinationData}
                            handleAddComment={handleAddComment}
                            handleSave={handleSave}
                            handleShare={handleShare}
                        />
                    </div>
                    <div id="rate">
                        {destinationData && destinationData._id ? (
                            <CustomComment
                                type={destinationData.type}
                                destinationId={destinationData._id}
                                handleAddComment={handleAddComment}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default DestinationDetails;
