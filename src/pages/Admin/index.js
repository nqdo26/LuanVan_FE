import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './Admin.module.scss';
import { Button, Table, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined, StarFilled } from '@ant-design/icons';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

// DATA GIẢ: Địa điểm
const fakePlaces = Array.from({ length: 20 }, (_, i) => ({
    _id: `d${i + 1}`,
    name: `Địa điểm ${i + 1}`,
    city: `Thành phố ${Math.floor(i / 3) + 1}`,
    statistics: {
        views: Math.floor(Math.random() * 5000) + 1000,
        totalSave: Math.floor(Math.random() * 300) + 10,
        averageRating: +(Math.random() * 5).toFixed(1),
    },
    commentCount: Math.floor(Math.random() * 40) + 3,
    createdAt: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs()
        .subtract(Math.floor(i / 2), 'hour')
        .format('YYYY-MM-DD HH:mm'),
}));

// DATA GIẢ: Thành phố
const fakeCities = Array.from({ length: 20 }, (_, i) => ({
    _id: `c${i + 1}`,
    city: `Thành phố ${i + 1}`,
    numberOfDestinations: Math.floor(Math.random() * 100) + 1,
    views: Math.floor(Math.random() * 5000) + 1000,
    createdAt: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs()
        .subtract(Math.floor(i / 2), 'hour')
        .format('YYYY-MM-DD HH:mm'),
}));

function Admin() {
    // Hiển thị đúng 5 item đầu tiên của mỗi bảng, không phân trang
    const [places, setPlaces] = useState(fakePlaces.slice(0, 5));
    const [cities, setCities] = useState(fakeCities.slice(0, 5));

    const handleDeletePlace = (record) => {
        setPlaces((prev) => prev.filter((item) => item._id !== record._id));
        message.success('Xóa địa điểm thành công!');
    };

    const handleAccessPlace = (record) => {
        alert(`Truy cập địa điểm: ${record.name}`);
    };

    const handleEditPlace = (record) => {
        alert(`Chỉnh sửa địa điểm: ${record.name}`);
    };

    const columnsPlaces = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            width: 60,
        },
        {
            title: 'Tên địa điểm',
            dataIndex: 'name',
        },
        {
            title: 'Thành phố',
            dataIndex: 'city',
        },
        {
            title: 'Chỉ số',
            key: 'metrics',
            render: (record) => (
                <div style={{ minWidth: 120, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span>
                        Lượt xem: <b>{record.statistics.views}</b>
                    </span>
                    <span>
                        Lượt lưu: <b>{record.statistics.totalSave}</b>
                    </span>
                    <span>
                        Bình luận: <b>{record.commentCount}</b>
                    </span>
                </div>
            ),
        },
        {
            title: 'Đánh giá',
            key: 'rating',
            width: 100,
            align: 'center',
            render: (record) => (
                <span
                    style={{
                        fontWeight: 600,
                        color: '#faad14',
                        fontSize: 16,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {record.statistics.averageRating}
                    <StarFilled style={{ marginLeft: 4, color: '#faad14' }} />
                </span>
            ),
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 140,
            render: (val) => <span>{val}</span>,
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            width: 140,
            render: (val) => <span>{val}</span>,
        },
        {
            title: 'Tùy chọn',
            key: 'action',
            render: (record) => (
                <div style={{ display: 'flex', gap: 10 }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleAccessPlace(record)}
                        title="Xem chi tiết"
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditPlace(record)}
                        title="Chỉnh sửa địa điểm"
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa địa điểm này?"
                        onConfirm={() => handleDeletePlace(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
            width: 180,
        },
    ];

    const handleDeleteCity = (record) => {
        setCities((prev) => prev.filter((item) => item._id !== record._id));
        message.success('Xóa thành phố thành công!');
    };

    const handleAccessCity = (record) => {
        alert(`Truy cập thành phố: ${record.city}`);
    };

    const handleEditCity = (record) => {
        alert(`Chỉnh sửa thành phố: ${record.city}`);
    };

    const columnsCity = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index) => index + 1,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            width: 60,
        },
        {
            title: 'Tên thành phố',
            dataIndex: 'city',
        },
        {
            title: 'Số lượng địa điểm',
            dataIndex: 'numberOfDestinations',
            render: (val) => <b>{val}</b>,
            width: 160,
        },
        {
            title: 'Chỉ số',
            key: 'metrics',
            render: (record) => (
                <div>
                    Lượt xem: <b>{record.views}</b>
                </div>
            ),
            width: 120,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 140,
            render: (val) => <span>{val}</span>,
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            width: 140,
            render: (val) => <span>{val}</span>,
        },
        {
            title: 'Tùy chọn',
            key: 'action',
            render: (record) => (
                <div style={{ display: 'flex', gap: 10 }}>
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => handleAccessCity(record)}
                        title="Xem chi tiết"
                    />
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditCity(record)}
                        title="Chỉnh sửa thành phố"
                    />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa thành phố này?"
                        onConfirm={() => handleDeleteCity(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
            width: 180,
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('section-1')}>
                    <h1 className={cx('title')}>Báo cáo thống kê</h1>
                    <div className={cx('section-1-items')}>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Tài khoản người dùng:</p>
                            <p className={cx('small-card-value')}>1,234</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Tài khoản admin:</p>
                            <p className={cx('small-card-value')}>5</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Thành phố:</p>
                            <p className={cx('small-card-value')}>{cities.length}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Địa điểm:</p>
                            <p className={cx('small-card-value')}>{places.length}</p>
                        </div>
                    </div>
                </div>

                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách địa điểm</h1>
                    <Table dataSource={places} columns={columnsPlaces} bordered rowKey="_id" pagination={false} />
                </div>

                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách thành phố</h1>
                    <Table dataSource={cities} columns={columnsCity} bordered rowKey="_id" pagination={false} />
                </div>
            </div>
        </motion.div>
    );
}

export default Admin;
