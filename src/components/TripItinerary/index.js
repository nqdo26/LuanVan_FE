import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './TripItinerary.module.scss';
import { Space } from 'antd';
import DayPlanItem from '../DayPlanItem/DayPlanItem';

const cx = classNames.bind(styles);

const generateDays = (startDateStr, endDateStr, numDays) => {
    const result = [];

    if (numDays && numDays > 0) {
        for (let i = 1; i <= numDays; i++) {
            result.push({
                id: i,
                label: `Ngày ${i}`,
                date: null,
            });
        }
        return result;
    }

    if (startDateStr && endDateStr) {
        const start = new Date(startDateStr);
        const end = new Date(endDateStr);
        let current = new Date(start);
        let id = 1;

        while (current <= end) {
            const label = current.toLocaleDateString('vi-VN', {
                day: 'numeric',
                month: 'numeric',
            });
            result.push({ id: id++, label, date: new Date(current) });
            current.setDate(current.getDate() + 1);
        }
    }

    return result;
};

export default function TripItinerary({ tour, onTourUpdate, isExporting }) {
    const [selectedDay, setSelectedDay] = useState(1);
    const [days, setDays] = useState([]);
    const dayRefs = useRef({});

    useEffect(() => {
        let generated = [];

        if (tour?.duration?.starDay && tour?.duration?.endDay) {
            generated = generateDays(tour.duration.starDay, tour.duration.endDay);
        } else if (tour?.duration?.numDays) {
            generated = generateDays(null, null, tour.duration.numDays);
        } else if (tour?.itinerary?.length > 0) {
            generated = tour.itinerary.map((item, index) => ({
                id: index + 1,
                label: item.day || `Ngày ${index + 1}`,
                date: null,
            }));
        } else {
            generated = [];
        }

        setDays(generated);
        if (generated.length > 0) {
            setSelectedDay(generated[0]?.id || 1);
        }
    }, [tour]);

    const handleDayClick = (id) => {
        setSelectedDay(id);
        const element = dayRefs.current[id];
        if (element) {
            const yOffset = -85;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    return (
        <div id="trip-itinerary" className={cx('wrapper')}>
            <div className={cx('pdf-header', { 'show-pdf': isExporting })} >
                <div className={cx('logo')}>
                    <img className={cx('logo-icon')} src="/logo.png" alt="GoOhNo" />
                    <span className={cx('title')}>GoOhNo</span>
                </div>

                <h1 className={cx('trip-title')}>{tour?.name || 'Lịch trình'}</h1>
                <p className={cx('date')}>Ngày tạo: {new Date().toLocaleDateString('vi-VN')}</p>

                <div className={cx('meta')}>
                    {tour?.city?.name && (
                        <p>
                            <strong>Điểm đến:</strong> {tour.city.name}
                        </p>
                    )}
                    {(tour?.duration?.numDays || (tour?.duration?.starDay && tour?.duration?.endDay)) && (
                        <p>
                            <strong>Thời lượng chuyến đi:</strong>{' '}
                            {(tour.duration.numDays ||
                                Math.ceil(
                                    (new Date(tour.duration.endDay) - new Date(tour.duration.starDay)) /
                                        (1000 * 60 * 60 * 24) +
                                        1,
                                )) + ' ngày'}
                        </p>
                    )}
                    {tour?.duration?.starDay && (
                        <p>
                            <strong>Ngày bắt đầu:</strong> {new Date(tour.duration.starDay).toLocaleDateString('vi-VN')}
                        </p>
                    )}
                    {tour?.duration?.endDay && (
                        <p>
                            <strong>Ngày kết thúc:</strong> {new Date(tour.duration.endDay).toLocaleDateString('vi-VN')}
                        </p>
                    )}
                </div>

                {tour?.description && (
                    <p className={cx('description')}>
                        <strong>Mô tả:</strong> {tour.description}
                    </p>
                )}
            </div>

            {days.length === 0 ? (
                <div className={cx('empty-itinerary')}>
                    <h3>Chưa có lịch trình nào</h3>
                    <p>
                        Hãy thêm ngày bắt đầu và ngày kết thúc cho chuyến đi trong phần cài đặt để bắt đầu lên kế hoạch.
                    </p>
                </div>
            ) : (
                <>
                    <div className={cx('day-list')}>
                        <Space size={12} wrap>
                            {days.map(({ id, label }) => (
                                <div
                                    key={id}
                                    role="button"
                                    tabIndex={0}
                                    className={cx('day-button', { selected: selectedDay === id })}
                                    onClick={() => handleDayClick(id)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault();
                                            handleDayClick(id);
                                        }
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </Space>
                    </div>

                    <div className={cx('day-content')}>
                        {days.map(({ id, date }) => (
                            <div key={id} id={`day-${id}`} ref={(el) => (dayRefs.current[id] = el)}>
                                <DayPlanItem day={id} date={date} tour={tour} onTourUpdate={onTourUpdate} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
