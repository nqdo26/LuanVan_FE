import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { Spin } from 'antd';
import styles from './RobotDestList.module.scss';
import CardDestGobot from '~/components/CardDestGobot';
import { getDestinationByIdApi } from '~/utils/api';

const cx = classNames.bind(styles);

const RobotDestList = ({ destinations, onDestinationClick }) => {
    const [destinationDetails, setDestinationDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    useEffect(() => {
        const fetchDestinationDetails = async () => {
            if (!destinations || destinations.length === 0) {
                setIsInitialLoading(false);
                setDestinationDetails({}); // Reset cache khi không có destinations
                return;
            }

            setIsInitialLoading(true);

            // Reset cache cho destinations mới
            const currentDestinationIds = destinations.map((dest) => dest._id || dest.id).filter(Boolean);
            setDestinationDetails((prev) => {
                const newDetails = {};
                // Chỉ giữ lại cache của destinations hiện tại
                currentDestinationIds.forEach((id) => {
                    if (prev[id]) {
                        newDetails[id] = prev[id];
                    }
                });
                return newDetails;
            });

            // Reset loading state cho destinations mới
            setLoadingDetails((prev) => {
                const newLoading = {};
                currentDestinationIds.forEach((id) => {
                    if (prev[id]) {
                        newLoading[id] = prev[id];
                    }
                });
                return newLoading;
            });

            const fetchPromises = [];

            for (const dest of destinations) {
                const destId = dest._id || dest.id;
                if (destId && !destinationDetails[destId] && !loadingDetails[destId]) {
                    setLoadingDetails((prev) => ({ ...prev, [destId]: true }));

                    const fetchPromise = getDestinationByIdApi(destId)
                        .then((response) => {
                            if (response && response.EC === 0) {
                                setDestinationDetails((prev) => ({
                                    ...prev,
                                    [destId]: response.data,
                                }));
                            } else {
                                console.log(`⚠️ API response not successful for ID ${destId}:`, response);
                            }
                        })
                        .catch((error) => {
                            console.error(`❌ Error fetching destination details for ID ${destId}:`, error);
                        })
                        .finally(() => {
                            setLoadingDetails((prev) => ({ ...prev, [destId]: false }));
                        });

                    fetchPromises.push(fetchPromise);
                } else if (!destId) {
                    console.warn('⚠️ Destination missing _id and id:', dest);
                }
            }

            // Chờ tất cả API calls hoàn thành
            await Promise.all(fetchPromises);
            setIsInitialLoading(false);
        };

        fetchDestinationDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destinations]);

    // Hiển thị loading cho toàn bộ component khi đang fetch destinations
    if (isInitialLoading && destinations && destinations.length > 0) {
        return (
            <div className={cx('destinations-cards')}>
                <div className={cx('loading-container')}>
                    <Spin size="large" />
                    <div className={cx('loading-text')}>Đang tải thông tin địa điểm...</div>
                </div>
            </div>
        );
    }

    // Loại bỏ các địa điểm trùng lặp dựa trên _id hoặc id
    const uniqueDestinations = destinations
        .filter((dest) => dest._id || dest.id)
        .filter((dest, index, array) => {
            const destId = dest._id || dest.id;
            return array.findIndex((d) => (d._id || d.id) === destId) === index;
        });

    return (
        <div className={cx('destinations-cards')}>
            {uniqueDestinations.map((dest, index) => {
                const destId = dest._id || dest.id;
                const details = destinationDetails[destId];
                const isLoading = loadingDetails[destId];

                if (isLoading) {
                    return (
                        <div key={destId || index} className={cx('card-loading')}>
                            <div className={cx('loading-text')}>Đang tải...</div>
                        </div>
                    );
                }

                return (
                    <CardDestGobot
                        key={destId || index}
                        title={
                            details?.title ||
                            details?.name ||
                            dest.name ||
                            (isLoading ? 'Đang tải...' : 'Địa điểm du lịch')
                        }
                        location={
                            [details?.location?.address, details?.location?.city?.name].filter(Boolean).join(', ') || ''
                        }
                        image={details?.images?.[0] || '/destination-img.png'}
                        rating={details?.statistics?.averageRating || 0}
                        type={details?.type || 'tourist'}
                        showMenu={false}
                        hoverEffect={true}
                        clickEffect={true}
                        onClick={() => onDestinationClick && onDestinationClick(details?.slug || destId)}
                        maxTags={2}
                    />
                );
            })}

            {uniqueDestinations.length === 0 && destinations.length > 0 && (
                <div className={cx('no-valid-destinations')}>
                    <div className={cx('warning-text')}>Không thể tải thông tin địa điểm</div>
                </div>
            )}
        </div>
    );
};

export default RobotDestList;
