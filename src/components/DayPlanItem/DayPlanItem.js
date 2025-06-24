import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './DayPlanItem.module.scss';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Coffee, MapPin, NotebookPen, Utensils, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { Tooltip } from 'antd';
import CustomDrawer from '../CustomDrawer';
import CardTrip from '../CardTrip';
import AddDestinationDrawer from '../AddDestinationDrawer';

const cx = classNames.bind(styles);

function getVietnameseWeekday(date) {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[date.getDay()];
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    return `${day}/${month}`;
}

function DayPlanItem({ day, date }) {
    const [mainExpanded, setMainExpanded] = useState(day === 1);
    const [actionAddVisible, setActionAddVisible] = useState(false);
    const [timelineItems, setTimelineItems] = useState([]);
    const [tripTime, setTripTime] = useState('');
    const [tripNote, setTripNote] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addDrawerOpen, setAddDrawerOpen] = useState(false);

    const [selectedType, setSelectedType] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');

    const toggleMainExpanded = () => {
        setMainExpanded((prev) => !prev);
    };

    const toggleActionAddVisible = () => {
        setActionAddVisible((prev) => !prev);
    };

    const handleAddItem = (type, title) => {
        setSelectedType(type);
        setSelectedTitle(title);
        setAddDrawerOpen(true);
    };

    const handleAddDrawer = () => {
        if (selectedType) {
            setTimelineItems((prev) => [
                ...prev,
                {
                    type: selectedType,
                    title: selectedTitle || 'Tiêu đề địa điểm',
                    content: 'Mô tả địa điểm mẫu...',
                },
            ]);
        }
        setAddDrawerOpen(false);
    };

    const openDrawer = () => {
        setDrawerOpen(true);
    };

    const handleSaveDrawer = (time, note) => {
        setTripTime(time);
        setTripNote(note);
        setDrawerOpen(false);
    };

    const handleAddNote = () => {
        setTimelineItems((prev) => [
            ...prev,
            {
                type: 'note',
                title: 'Tiêu đề ghi chú',
                content: 'Đây là nội dung ghi chú mẫu.',
            },
        ]);
        setAddDrawerOpen(false);
    };

    const iconMap = {
        place: <MapPin size={18} />,
        restaurant: <Utensils size={18} />,
        coffee: <Coffee size={18} />,
        note: <NotebookPen size={18} />,
    };

    return (
        <div className={cx('day-plan-item')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>
                    {date ? `${getVietnameseWeekday(date)}, ${formatDate(date)}` : `Ngày ${day}`}
                </h3>
                {mainExpanded ? (
                    <ChevronUp
                        className={cx('toggle-icon')}
                        onClick={toggleMainExpanded}
                        size={20}
                        strokeWidth={2.5}
                        title="Đóng main-content"
                    />
                ) : (
                    <ChevronDown
                        className={cx('toggle-icon')}
                        onClick={toggleMainExpanded}
                        size={20}
                        strokeWidth={2.5}
                        title="Mở main-content"
                    />
                )}
            </div>

            <div
                className={cx('main-content', { expanded: mainExpanded })}
                aria-hidden={!mainExpanded}
                style={{
                    maxHeight: mainExpanded ? '1000px' : '0px',
                    opacity: mainExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    padding: mainExpanded ? '12px' : '0 12px',
                }}
            >
                <div className={cx('time-line')}>
                    {timelineItems.length === 0 ? (
                        <div className={cx('timeline-row')}>
                            <div className={cx('timeline-icon')}>
                                <Plus size={18} />
                            </div>
                            <div className={cx('add-box')}>
                                <p className={cx('description')}>Thêm điểm đến đầu tiên</p>
                            </div>
                        </div>
                    ) : (
                        timelineItems.map((item, index) => (
                            <div key={index} className={cx('timeline-row')}>
                                <div
                                    className={cx('timeline-icon')}
                                    data-last={index === timelineItems.length - 1 ? 'true' : 'false'}
                                >
                                    {iconMap[item.type]}
                                </div>

                                <div className={cx('card-trip-wrapper')}>
                                    {item.type === 'note' ? (
                                        <div className={cx('note-box')}>
                                            <h4 className={cx('note-title')}>{item.title}</h4>
                                            <p className={cx('note-content')}>{item.content}</p>
                                        </div>
                                    ) : (
                                        <CardTrip
                                            title={item.title}
                                            location="Hẻm 30 đường Lê Anh Xuân"
                                            image="/wimi2-img.png"
                                            showMenu={true}
                                            time={tripTime}
                                            note={tripNote}
                                            onEdit={openDrawer}
                                            hoverEffect={false}
                                            clickEffect={false}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {mainExpanded && (
                    <div className={cx('action-add')}>
                        {actionAddVisible ? (
                            <button
                                className={cx('toggle-button')}
                                onClick={toggleActionAddVisible}
                                aria-label="Toggle Action Add"
                            >
                                <PlusOutlined className={cx('icon')} />
                                <span className={cx('toggle-text')}>Điểm đến</span>
                            </button>
                        ) : (
                            <div className={cx('actions')}>
                                <Tooltip title="Địa điểm">
                                    <button
                                        className={cx('action-btn')}
                                        aria-label="place"
                                        onClick={(e) =>
                                            handleAddItem(e.currentTarget.getAttribute('aria-label'), 'Địa điểm')
                                        }
                                    >
                                        <MapPin size={22} />
                                    </button>
                                </Tooltip>
                                <Tooltip title="Quán ăn/Nhà hàng">
                                    <button
                                        className={cx('action-btn')}
                                        aria-label="restaurant"
                                        onClick={(e) =>
                                            handleAddItem(
                                                e.currentTarget.getAttribute('aria-label'),
                                                'Quán ăn/Nhà hàng',
                                            )
                                        }
                                    >
                                        <Utensils size={20} />
                                    </button>
                                </Tooltip>
                                <Tooltip title="Quán nước">
                                    <button
                                        className={cx('action-btn')}
                                        aria-label="coffee"
                                        onClick={(e) =>
                                            handleAddItem(e.currentTarget.getAttribute('aria-label'), 'Quán nước')
                                        }
                                    >
                                        <Coffee size={22} />
                                    </button>
                                </Tooltip>
                                <Tooltip title="Ghi chú">
                                    <button
                                        className={cx('action-btn')}
                                        aria-label="note"
                                        onClick={(e) =>
                                            handleAddItem(e.currentTarget.getAttribute('aria-label'), 'Ghi chú')
                                        }
                                    >
                                        <NotebookPen size={20} />
                                    </button>
                                </Tooltip>
                                <button
                                    className={cx('action-btn', 'exit-btn')}
                                    onClick={toggleActionAddVisible}
                                    aria-label="Close"
                                >
                                    <CloseOutlined />
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <CustomDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                onSave={handleSaveDrawer}
                initialTime={tripTime}
                initialNote={tripNote}
            />

            <AddDestinationDrawer
                open={addDrawerOpen}
                onAdd={handleAddDrawer}
                onClose={() => setAddDrawerOpen(false)}
                title={selectedTitle}
                type={selectedType}
                handleAddNote={handleAddNote}
            />
        </div>
    );
}

export default DayPlanItem;
