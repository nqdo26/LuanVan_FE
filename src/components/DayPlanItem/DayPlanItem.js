import React, { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './DayPlanItem.module.scss';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { MapPin, NotebookPen, Plus, ChevronUp, ChevronDown, Trash2, Ellipsis } from 'lucide-react';
import { Tooltip, message, Spin } from 'antd';
import CustomDrawer from '../CustomDrawer';
import CardTrip from '../CardTrip';
import AddDestinationDrawer from '../AddDestinationDrawer';
import { motion, AnimatePresence } from 'framer-motion';
import {
    addDestinationToTourApi,
    addNoteToTourApi,
    updateDestinationInTourApi,
    removeDestinationFromTourApi,
    removeNoteFromTourApi,
    getDestinationByIdApi,
    updateNoteInTourApi,
} from '~/utils/api';
import { useNavigate } from 'react-router-dom';

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

function DayPlanItem({ day, date, tour, onTourUpdate }) {
    const navigate = useNavigate();
    const noteMenuRef = useRef(null);

    const [mainExpanded, setMainExpanded] = useState(day === 1);
    const [actionAddVisible, setActionAddVisible] = useState(false);
    const [timelineItems, setTimelineItems] = useState([]);
    const [tripTime, setTripTime] = useState('');
    const [tripNote, setTripNote] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addDrawerOpen, setAddDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [destinationLoading, setDestinationLoading] = useState(false);
    const [editingNoteIndex, setEditingNoteIndex] = useState(null);
    const [editingNote, setEditingNote] = useState(null);

    const [selectedType, setSelectedType] = useState('');
    const [selectedTitle, setSelectedTitle] = useState('');
    const [editingItemIndex, setEditingItemIndex] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [noteMenuIndex, setNoteMenuIndex] = useState(null);
    const [deletingItemIndex, setDeletingItemIndex] = useState(null);

    const dayId = useMemo(() => `day-${day}`, [day]);
    useEffect(() => {
        const loadDestinationDetails = async () => {
            setDestinationLoading(true);
            if (tour?.itinerary) {
                const dayData = tour.itinerary.find((item) => item.day === dayId);

                if (dayData) {
                    const items = [];

                    if (dayData.items !== undefined && dayData.items !== null) {
                        if (dayData.items.length > 0) {
                            const sortedItems = dayData.items.sort((a, b) => (a.order || 0) - (b.order || 0));
                            let noteCounter = 0;

                            for (let index = 0; index < sortedItems.length; index++) {
                                const item = sortedItems[index];

                                if (item.type === 'destination') {
                                    let destinationInfo = item.destinationId;

                                    if (destinationInfo && typeof destinationInfo === 'string') {
                                        try {
                                            const response = await getDestinationByIdApi(destinationInfo);
                                    
                                            let fetchedData = null;
                                            if (response.EC === 0 && response.data) {
                                                fetchedData = response.data;
                                            } else if (response.data?.EC === 0) {
                                                fetchedData = response.data.DT || response.data.data;
                                            } else if (response.data) {
                                                fetchedData = response.data;
                                            }
                                            if (fetchedData && (fetchedData.name || fetchedData.title)) {
                                                destinationInfo = {
                                                    ...fetchedData,
                                                };
                                            }
                                        } catch (error) {
                                            console.error('Error fetching destination:', error);
                                            message.error('Không thể tải thông tin địa điểm');
                                            return;
                                        }
                                    }

                                    const iconType = 'place';
                                    const descriptionIndex = -1;

                                    items.push({
                                        id: `dest-new-${index}`,
                                        type: iconType,
                                        title: destinationInfo?.title,
                                        content: item.content || '',
                                        time: item.time || '',
                                        address: (() => {
                                            const address =
                                                destinationInfo?.location?.address || destinationInfo?.address || '';
                                            const city = destinationInfo?.location?.city?.name || '';
                                            if (address && city) {
                                                return `${address}, ${city}`;
                                            } else if (address) {
                                                return address;
                                            } else if (city) {
                                                return city;
                                            }
                                            return 'Chưa có địa chỉ';
                                        })(),
                                        image:
                                            destinationInfo?.album?.space?.[0] || destinationInfo?.images?.[0] || null,
                                        destinationId: item.destinationId || destinationInfo?._id,
                                        itemId: item._id,
                                        descriptionIndex: descriptionIndex,
                                        tags: destinationInfo?.tags?.map((tag) => tag.title).filter(Boolean) || [],
                                        destinationType: destinationInfo?.type || 'tourist',
                                        slug: destinationInfo?.slug,
                                        order: item.order || index,
                                        itemType: 'destination',
                                        rating: destinationInfo?.statistics?.averageRating || 0,
                                    });
                                } else if (item.type === 'note') {
                                    items.push({
                                        id: `note-new-${index}`,
                                        type: 'note',
                                        title: item.title || 'Ghi chú',
                                        content: item.content || '',
                                        noteIndex: noteCounter,
                                        order: item.order || index,
                                        itemType: 'note',
                                    });
                                    noteCounter++;
                                }
                            }
                        }
                    } else {
                        for (let index = 0; index < (dayData.descriptions?.length || 0); index++) {
                            const desc = dayData.descriptions[index];
                            let destinationInfo = desc.destinationId;

                            if (destinationInfo && typeof destinationInfo === 'string') {
                                try {
                                    const response = await getDestinationByIdApi(destinationInfo);

                                    let fetchedData = null;
                                    if (response.EC === 0 && response.data) {
                                        fetchedData = response.data;
                                    } else if (response.data?.EC === 0) {
                                        fetchedData = response.data.DT || response.data.data;
                                    } else if (response.data) {
                                        fetchedData = response.data;
                                    }

                                    if (fetchedData && (fetchedData.name || fetchedData.title)) {
                                        destinationInfo = {
                                            ...fetchedData,
                                        };
                                    }
                                } catch (error) {
                                    console.error('Error fetching destination (else branch):', error);
                                    message.error('Không thể tải thông tin địa điểm');
                                    return;
                                }
                            }

                            const iconType = 'place';

                            items.push({
                                id: `dest-${index}`,
                                type: iconType,
                                title: destinationInfo?.title,
                                content: desc.note || '',
                                time: desc.time || '',
                                address: (() => {
                                    const address =
                                        destinationInfo?.location?.address || destinationInfo?.address || '';
                                    const city = destinationInfo?.location?.city?.name || '';
                                    if (address && city) {
                                        return `${address}, ${city}`;
                                    } else if (address) {
                                        return address;
                                    } else if (city) {
                                        return city;
                                    }
                                    return 'Chưa có địa chỉ';
                                })(),
                                image: destinationInfo?.album?.space?.[0] || destinationInfo?.images?.[0] || null,
                                destinationId: destinationInfo?._id,
                                descriptionIndex: index,
                                tags: destinationInfo?.tags?.map((tag) => tag.title).filter(Boolean) || [],
                                destinationType: destinationInfo?.type || 'tourist',
                                slug: destinationInfo?.slug,
                                order: index,
                                itemType: 'destination',
                                rating: destinationInfo?.statistics?.averageRating || 0,
                            });
                        }

                        dayData.notes?.forEach((note, index) => {
                            items.push({
                                id: `note-${index}`,
                                type: 'note',
                                title: note.title || 'Ghi chú',
                                content: note.content || '',
                                noteIndex: index,
                                order: (dayData.descriptions?.length || 0) + index,
                                itemType: 'note',
                            });
                        });

                        items.sort((a, b) => a.order - b.order);
                    }

                    setTimelineItems(items);
                } else {
                    setTimelineItems([]);
                }
            } else {
                setTimelineItems([]);
            }
            setDestinationLoading(false);
        };

        loadDestinationDetails();
    }, [tour?.itinerary, dayId, day]);

    const toggleMainExpanded = () => {
        setMainExpanded((prev) => !prev);
    };

    const toggleActionAddVisible = () => {
        setActionAddVisible((prev) => !prev);
    };

    const handleAddItem = (type, title) => {
        setSelectedType(type);
        setSelectedTitle(title);
        setEditingItemIndex(null);
        setAddDrawerOpen(true);
    };

    const handleAddDestination = async (destinationId) => {
        if (!destinationId || !tour?._id) {
            message.error('Thiếu thông tin cần thiết');
            return;
        }

        setLoading(true);
        try {
            const response = await addDestinationToTourApi(tour._id, {
                dayId,
                destinationId,
                note: '',
                time: '',
            });

            if (response && response.EC === 0) {
                message.success('Thêm địa điểm thành công');

                onTourUpdate?.(response.DT);
            } else {
                message.error(response.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi thêm địa điểm');
        } finally {
            setLoading(false);
            setAddDrawerOpen(false);
        }
    };
    const handleAddNote = async (title = 'Tiêu đề ghi chú', content = 'Đây là nội dung ghi chú mẫu.') => {
        if (!tour?._id) {
            message.error('Không tìm thấy thông tin tour');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                dayId,
                title,
                content,
            };

            const response = await addNoteToTourApi(tour._id, requestData);

            if (response && response.EC === 0) {
                message.success('Thêm ghi chú thành công');
                onTourUpdate?.(response.DT);
            } else {
                message.error(response.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi thêm ghi chú');
        } finally {
            setLoading(false);
            setAddDrawerOpen(false);
        }
    };
    const handleEditNote = (itemIndex) => {
        const item = timelineItems[itemIndex];
        if (item && item.type === 'note') {
            setTripNote(item.content || '');
            setEditingNoteIndex(itemIndex);
            setEditingNote(item);
            setTripTime(''); // Đảm bảo initialTime là rỗng khi chỉnh sửa ghi chú
            setDrawerOpen(true);
        }
    };

    const handleSaveNoteEdit = (_unusedTime, note, _noteTitle) => {
        if (editingNoteIndex === null || !tour?._id) {
            message.error('Không tìm thấy thông tin ghi chú');
            return;
        }
        const item = timelineItems[editingNoteIndex];
        if (!item || item.type !== 'note') {
            message.error('Không tìm thấy ghi chú');
            return;
        }
        setLoading(true);
        const requestData = {
            dayId,
            noteIndex: item.noteIndex,
            content: note,
            title: _noteTitle, // Include the title in the request data
        };
        updateNoteInTourApi(tour._id, requestData)
            .then((response) => {
                if (response && response.EC === 0) {
                    message.success('Cập nhật ghi chú thành công');
                    setTripNote(note);
                    onTourUpdate?.(response.DT);
                    setDrawerOpen(false);
                    setEditingNoteIndex(null);
                    setEditingNote(null);
                } else {
                    message.error(response.EM || 'Có lỗi xảy ra khi cập nhật ghi chú');
                }
            })
            .catch(() => {
                message.error('Có lỗi xảy ra khi cập nhật ghi chú');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const openDrawer = (itemIndex) => {
        const item = timelineItems[itemIndex];
        if (item && item.type !== 'note') {
            setTripTime(item.time || '');
            setTripNote(item.content || '');
            setEditingItemIndex(itemIndex);
            setEditingItem(item);
            setDrawerOpen(true);
        }
    };

    const handleSaveDrawer = async (time, note) => {
        if (editingItemIndex === null || !tour?._id) {
            message.error('Không tìm thấy thông tin cần thiết');
            return;
        }

        const item = timelineItems[editingItemIndex];

        if (!item) {
            message.error('Không tìm thấy thông tin địa điểm');
            return;
        }

        if (!item.itemId) {
            message.error('Không tìm thấy thông tin địa điểm trong cấu trúc dữ liệu');
            return;
        }

        setLoading(true);
        try {
            const requestData = {
                dayId,
                descriptionIndex: item.descriptionIndex,
                note,
                time,
            };

            if (!item.itemId) {
                message.error('Không tìm thấy ID địa điểm');
                setLoading(false);
                return;
            }
            requestData.itemId = item.itemId;

            const response = await updateDestinationInTourApi(tour._id, requestData);
            if (response && response.EC === 0) {
                message.success('Cập nhật thành công');
                setTripTime(time);
                setTripNote(note);
                onTourUpdate?.(response.DT);
                setDrawerOpen(false);
            } else {
                message.error(response.EM || 'Có lỗi xảy ra');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDestination = async (itemIndex) => {
        const item = timelineItems[itemIndex];
        if (!item || item.type !== 'place') {
            message.error('Không thể xóa item này');
            return;
        }

        if (!tour?._id) {
            message.error('Thiếu thông tin tour');
            return;
        }

        setDeletingItemIndex(itemIndex);
        try {
            const removeData = {
                dayId,
                itemId: item.itemId,
                destinationId: item.destinationId,
            };

            const response = await removeDestinationFromTourApi(tour._id, removeData);
            if (response && response.EC === 0) {
                message.success('Xóa địa điểm thành công');

                onTourUpdate?.(response.DT);
            } else {
                message.error(response.EM || 'Có lỗi xảy ra khi xóa địa điểm');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa địa điểm');
        } finally {
            setDeletingItemIndex(null);
        }
    };

    const handleDeleteNote = async (itemIndex) => {
        const item = timelineItems[itemIndex];
        console.log('Deleting note:', { itemIndex, item, noteIndex: item?.noteIndex });

        if (!item || item.type !== 'note') {
            message.error('Không thể xóa item này');
            return;
        }

        if (!tour?._id) {
            message.error('Thiếu thông tin tour');
            return;
        }

        setDeletingItemIndex(itemIndex);
        try {
            const removeData = {
                dayId,
                noteIndex: item.noteIndex,
            };
            console.log('Sending remove data:', removeData);

            const response = await removeNoteFromTourApi(tour._id, removeData);

            if (response && response.EC === 0) {
                message.success('Xóa ghi chú thành công');
                onTourUpdate?.(response.DT);
                setNoteMenuIndex(null);
            } else {
                message.error(response.EM || 'Có lỗi xảy ra khi xóa ghi chú');
            }
        } catch (error) {
            console.error('Error deleting note:', error);
            message.error('Có lỗi xảy ra khi xóa ghi chú');
        } finally {
            setDeletingItemIndex(null);
        }
    };

    const iconMap = {
        place: <MapPin size={18} />,
        note: <NotebookPen size={18} />,
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (noteMenuRef.current && !noteMenuRef.current.contains(event.target)) {
                setNoteMenuIndex(null);
            }
        };

        if (noteMenuIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [noteMenuIndex]);

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
                    maxHeight: mainExpanded ? '10000000px' : '0px',
                    opacity: mainExpanded ? 1 : 0,
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    padding: mainExpanded ? '12px' : '0 12px',
                }}
            >
                <Spin spinning={destinationLoading || deletingItemIndex !== null}>
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
                                <div key={item.id || index} className={cx('timeline-row')}>
                                    <div
                                        className={cx('timeline-icon')}
                                        data-last={index === timelineItems.length - 1 ? 'true' : 'false'}
                                    >
                                        {iconMap[item.type]}
                                    </div>

                                    <div className={cx('card-trip-wrapper')}>
                                        <Spin spinning={deletingItemIndex === index}>
                                            {item.type === 'note' ? (
                                                <div className={cx('note-box')}>
                                                    <div className={cx('note-header')}>
                                                        <h4 className={cx('note-title')}>{item.title}</h4>
                                                        <div
                                                            className={cx('action')}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (deletingItemIndex !== index) {
                                                                    setNoteMenuIndex(
                                                                        index === noteMenuIndex ? null : index,
                                                                    );
                                                                }
                                                            }}
                                                            ref={noteMenuRef}
                                                            style={{
                                                                pointerEvents:
                                                                    deletingItemIndex === index ? 'none' : 'auto',
                                                                opacity: deletingItemIndex === index ? 0.5 : 1,
                                                            }}
                                                        >
                                                            <motion.div
                                                                whileHover={{ scale: 1.2 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Ellipsis size={20} />
                                                            </motion.div>
                                                            <AnimatePresence>
                                                                {noteMenuIndex === index && (
                                                                    <motion.div
                                                                        className={cx('menu')}
                                                                        initial={{ opacity: 0, y: -5 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        exit={{ opacity: 0, y: -5 }}
                                                                        transition={{ duration: 0.2 }}
                                                                    >
                                                                        <div
                                                                            className={cx('menu-item', 'edit')}
                                                                            onClick={() => {
                                                                                if (deletingItemIndex !== index) {
                                                                                    setNoteMenuIndex(null);
                                                                                    handleEditNote(index);
                                                                                }
                                                                            }}
                                                                        >
                                                                            <span>Chỉnh sửa</span>
                                                                        </div>
                                                                        <div
                                                                            className={cx('menu-item', 'delete', {
                                                                                disabled: deletingItemIndex === index,
                                                                            })}
                                                                            onClick={() => {
                                                                                if (deletingItemIndex !== index) {
                                                                                    handleDeleteNote(index);
                                                                                }
                                                                            }}
                                                                            style={{
                                                                                pointerEvents:
                                                                                    deletingItemIndex === index
                                                                                        ? 'none'
                                                                                        : 'auto',
                                                                                opacity:
                                                                                    deletingItemIndex === index
                                                                                        ? 0.5
                                                                                        : 1,
                                                                            }}
                                                                        >
                                                                            <Trash2
                                                                                className={'delete-icon'}
                                                                                size={16}
                                                                            />
                                                                            <span>
                                                                                {deletingItemIndex === index
                                                                                    ? 'Đang xóa...'
                                                                                    : 'Xóa'}
                                                                            </span>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>
                                                    </div>
                                                    <p className={cx('note-content')}>{item.content}</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {console.log('Rendering CardTrip for item:', item)}
                                                    <CardTrip
                                                        maxTags={6}
                                                        title={item.title}
                                                        location={item.address || 'Chưa có địa chỉ'}
                                                        image={item.image || '/wimi2-img.png'}
                                                        showMenu={deletingItemIndex !== index}
                                                        time={item.time}
                                                        note={item.content}
                                                        tags={item.tags || []}
                                                        type={item.destinationType || 'tourist'}
                                                        rating={item.rating || 0}
                                                        onEdit={() => {
                                                            if (deletingItemIndex !== index) {
                                                                openDrawer(index);
                                                            }
                                                        }}
                                                        onDelete={() => {
                                                            if (deletingItemIndex !== index) {
                                                                handleDeleteDestination(index);
                                                            }
                                                        }}
                                                        hoverEffect={false}
                                                        clickEffect={false}
                                                        handleClick={() => {
                                                            if (deletingItemIndex === index) return;

                                                            const slug = item.slug;
                                                            if (slug && slug !== 'undefined') {
                                                                navigate(`/destination/${slug}`);
                                                            } else {
                                                                message.warning(
                                                                    'Địa điểm này chưa có đường dẫn chi tiết',
                                                                );
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </Spin>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </Spin>

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
                                        onClick={() => handleAddItem('place', 'Địa điểm')}
                                    >
                                        <MapPin size={22} />
                                    </button>
                                </Tooltip>
                                <Tooltip title="Ghi chú">
                                    <button
                                        className={cx('action-btn')}
                                        aria-label="note"
                                        onClick={() => handleAddItem('note', 'Ghi chú')}
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
                onClose={() => {
                    setDrawerOpen(false);
                    setEditingNoteIndex(null);
                    setEditingNote(null);
                }}
                onSave={editingNoteIndex !== null ? handleSaveNoteEdit : handleSaveDrawer}
                initialTime={editingNoteIndex !== null ? '' : tripTime}
                initialNote={tripNote}
                editingItem={editingNoteIndex !== null ? editingNote : editingItem}
                isNoteEdit={editingNoteIndex !== null}
            />

            <AddDestinationDrawer
                open={addDrawerOpen}
                onAdd={handleAddDestination}
                onClose={() => setAddDrawerOpen(false)}
                title={selectedTitle}
                type={selectedType}
                handleAddNote={handleAddNote}
            />
        </div>
    );
}

export default DayPlanItem;
