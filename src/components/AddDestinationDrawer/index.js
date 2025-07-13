import React, { useState, useEffect, useCallback } from 'react';
import { Drawer, Button, Input, message, Spin } from 'antd';
import classNames from 'classnames/bind';
import styles from './AddDestinationDrawer.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import CardTrip from '../CardTrip';
import { getDestinationsApi } from '~/utils/api';

const { TextArea } = Input;
const cx = classNames.bind(styles);

function AddDestinationDrawer({ type, open, onClose, onAdd, title, handleAddNote }) {
    const [selectedTrip, setSelectedTrip] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [filteredDestinations, setFilteredDestinations] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const [noteTitle, setNoteTitle] = useState('');
    const [noteContent, setNoteContent] = useState('');

    useEffect(() => {
        const fetchDestinations = async () => {
            if (!open || type === 'note') return;

            setLoading(true);
            try {
                const response = await getDestinationsApi();

                if (response && response.EC === 0) {
                    setDestinations(response.data);
                    setFilteredDestinations(response.data.slice(0, 4));
                } else {
                    message.error('Không thể tải danh sách địa điểm');
                }
            } catch (error) {
                console.error('Error fetching destinations:', error);
                message.error('Lỗi khi tải danh sách địa điểm');
            } finally {
                setLoading(false);
            }
        };

        fetchDestinations();
    }, [open, type]);

    const debounceSearch = useCallback(
        (searchValue) => {
            const timeoutId = setTimeout(() => {
                if (searchValue.trim()) {
                    const filtered = destinations.filter(
                        (destination) =>
                            destination.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
                            destination.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
                            destination.address?.toLowerCase().includes(searchValue.toLowerCase()),
                    );
                    setFilteredDestinations(filtered.slice(0, 4));
                } else {
                    setFilteredDestinations(destinations.slice(0, 4));
                }
            }, 300);

            return () => clearTimeout(timeoutId);
        },
        [destinations],
    );

    useEffect(() => {
        const cleanup = debounceSearch(searchTerm);
        return cleanup;
    }, [searchTerm, debounceSearch]);

    const handleSelectTrip = (destination) => {
        setSelectedTrip(destination);
        onAdd(destination);
        setSelectedTrip(null);
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleClose = () => {
        setSearchTerm('');
        setSelectedTrip(null);
        setNoteTitle('');
        setNoteContent('');
        onClose();
    };

    const handleAddNoteClick = () => {
        const finalTitle = noteTitle.trim() || 'Tiêu đề ghi chú';
        const finalContent = noteContent.trim() || 'Đây là nội dung ghi chú mẫu.';

        handleAddNote(finalTitle, finalContent);
        handleClose();
    };

    return (
        <Drawer
            placement="right"
            onClose={handleClose}
            open={open}
            width={550}
            footer={
                <div className={cx('footer')}>
                    <Button className={cx('footer-btn')} onClick={handleClose}>
                        Hủy
                    </Button>
                    {type === 'note' && (
                        <Button
                            type="primary"
                            className={cx('footer-btn', 'add-note-btn')}
                            onClick={handleAddNoteClick}
                        >
                            Thêm ghi chú
                        </Button>
                    )}
                </div>
            }
        >
            <div className={cx('body')}>
                <h1 className={cx('title')}>Thêm {title}</h1>
                <div className={cx('content')}>
                    {type === 'note' ? (
                        <>
                            <div className={cx('note-item')}>
                                <p className={cx('note-title')}>Tiêu đề</p>
                                <Input
                                    placeholder="Nhập tiêu đề ghi chú"
                                    maxLength={80}
                                    value={noteTitle}
                                    onChange={(e) => setNoteTitle(e.target.value)}
                                />
                            </div>
                            <div className={cx('note-item')}>
                                <p className={cx('note-title')}>Nội dung ghi chú</p>
                                <TextArea
                                    placeholder="Nhập nội dung ghi chú"
                                    rows={4}
                                    className={cx('drawer-textarea')}
                                    value={noteContent}
                                    onChange={(e) => setNoteContent(e.target.value)}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Input
                                prefix={<SearchOutlined />}
                                placeholder="Tìm kiếm địa điểm du lịch..."
                                maxLength={80}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className={cx('drawer-input', 'drawer-search')}
                            />

                            <div className={cx('list-items')}>
                                {loading ? (
                                    <div style={{ textAlign: 'center', padding: '40px' }}>
                                        <Spin size="large" />
                                    </div>
                                ) : filteredDestinations.length > 0 ? (
                                    filteredDestinations.map((destination) => {
                                        const processedTags =
                                            destination.tags?.map((tag) => tag.title).filter(Boolean) || [];

                                        return (
                                            <CardTrip
                                                maxTags={2}
                                                key={destination._id}
                                                title={destination.title || 'Không có tên'}
                                                location={`${destination.location?.address || ''}, ${
                                                    destination.location?.city?.name || ''
                                                }`
                                                    .replace(/^,\s*/, '')
                                                    .replace(/,\s*$/, '')}
                                                image={
                                                    destination.album?.highlight?.[0] ||
                                                    destination.album?.space?.[0] ||
                                                    destination.album?.fnb?.[0] ||
                                                    destination.album?.extra?.[0] ||
                                                    '/wimi2-img.png'
                                                }
                                                tags={processedTags}
                                                rating={destination.statistics?.averageRating}
                                                type={destination.type}
                                                showMenu={false}
                                                onClick={() => handleSelectTrip(destination)}
                                                isSelected={selectedTrip?._id === destination._id}
                                            />
                                        );
                                    })
                                ) : (
                                    <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                                        {searchTerm ? 'Không tìm thấy địa điểm nào phù hợp' : 'Chưa có địa điểm nào'}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Drawer>
    );
}

export default AddDestinationDrawer;
