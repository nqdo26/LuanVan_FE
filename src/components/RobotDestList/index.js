import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './RobotDestList.module.scss';
import CardDestGobot from '~/components/CardDestGobot';
import { getDestinationByIdApi } from '~/utils/api';

const cx = classNames.bind(styles);

const RobotDestList = ({ destinations, onDestinationClick }) => {
    const [destinationDetails, setDestinationDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState({});

    useEffect(() => {
        const fetchDestinationDetails = async () => {
            for (const dest of destinations) {
                const destId = dest._id || dest.id;
                if (destId && !destinationDetails[destId] && !loadingDetails[destId]) {
                    setLoadingDetails((prev) => ({ ...prev, [destId]: true }));

                    try {
                        const response = await getDestinationByIdApi(destId);
                        if (response && response.EC === 0) {
                            setDestinationDetails((prev) => ({
                                ...prev,
                                [destId]: response.data,
                            }));
                        } else {
                            console.log(`⚠️ API response not successful for ID ${destId}:`, response);
                        }
                    } catch (error) {
                        console.error(`❌ Error fetching destination details for ID ${destId}:`, error);
                    } finally {
                        setLoadingDetails((prev) => ({ ...prev, [destId]: false }));
                    }
                } else if (!destId) {
                    console.warn('⚠️ Destination missing _id and id:', dest);
                }
            }
        };

        if (destinations && destinations.length > 0) {
            fetchDestinationDetails();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [destinations]);

    return (
        <div className={cx('destinations-cards')}>
            {destinations
                .filter((dest) => dest._id || dest.id)
                .slice(0, 3)
                .map((dest, index) => {
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
                            location={dest.location?.address || details?.location?.address || ''}
                            image={details?.images?.[0] || '/destination-img.png'}
                            tags={details?.tags?.map((tag) => tag.title) || ['Văn hóa', 'Du lịch']}
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

            {destinations.filter((dest) => dest._id || dest.id).length === 0 && destinations.length > 0 && (
                <div className={cx('no-valid-destinations')}>
                    <div className={cx('warning-text')}>Không thể tải thông tin địa điểm</div>
                </div>
            )}
        </div>
    );
};

export default RobotDestList;
