import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import classNames from 'classnames/bind';
import { Spin, notification } from 'antd';
import styles from './WriteReview.module.scss';
import CardReview from '~/components/CardReview';
import ReviewForm from '~/components/ReviewForm';
import { getDestinationBySlugApi } from '~/utils/api';


const cx = classNames.bind(styles);

function WriteReview() {
    const { slug } = useParams();
    const [destinationData, setDestinationData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            fetchDestinationData();
        }
    }, [slug]);

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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '100vh',
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

    const handleOnCardClick = () => {
        navigate(`/destination/${destinationData.slug}`);
        console.log('Card clicked:', destinationData.slug);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <div className={cx('side-bar')}>
                    <h1>Trải nghiệm của bạn như thế nào? Hãy chia sẻ cho mọi người biết nhé</h1>
                    <CardReview destination={destinationData} handleOnClick={handleOnCardClick} />
                </div>

                <div className={cx('content')}>
                    <ReviewForm
                        type={destinationData.type}
                        destinationId={destinationData._id}
                        destinationData={destinationData}
                    />
                </div>
            </div>
        </div>
    );
}

export default WriteReview;
