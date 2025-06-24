import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './TripItinerary.module.scss';
import { Space } from 'antd';
import DayPlanItem from '../DayPlanItem/DayPlanItem';

const cx = classNames.bind(styles);

const generateDays = (startDateStr, endDateStr) => {
    const result = [];
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

    return result;
};

export default function TripItinerary({ trip }) {
    const [selectedDay, setSelectedDay] = useState(1);
    const [days, setDays] = useState([]);
    const dayRefs = useRef({});

    useEffect(() => {
        if (trip?.startDate && trip?.endDate) {
            const generated = generateDays(trip.startDate, trip.endDate);
            setDays(generated);
            setSelectedDay(generated[0]?.id || 1);
        }
    }, [trip]);

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
        <div className={cx('wrapper')}>
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
                        <DayPlanItem day={id} date={date} />
                    </div>
                ))}
            </div>
        </div>
    );
}
