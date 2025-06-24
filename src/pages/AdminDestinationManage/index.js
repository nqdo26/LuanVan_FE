import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminDestinationManage.module.scss';
import { Button, Table, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined, StarFilled, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

const fakeDestinations = Array.from({ length: 20 }, (_, i) => ({
    _id: `d${i + 1}`,
    name: `Địa điểm ${i + 1}`,
    city: `Thành phố ${Math.floor(i / 3) + 1}`,
    statistics: {
        views: Math.floor(Math.random() * 5000) + 1000,
        totalSave: Math.floor(Math.random() * 300) + 10,
        totalRate: Math.floor(Math.random() * 100) + 5,
        totalReview: Math.floor(Math.random() * 120) + 5,
        averageRating: +(Math.random() * 5).toFixed(1),
    },
    commentCount: Math.floor(Math.random() * 40) + 3,
    createdAt: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs()
        .subtract(Math.floor(i / 2), 'hour')
        .format('YYYY-MM-DD HH:mm'),
}));

function AdminDestinationManage() {
    const [data, setData] = useState(fakeDestinations);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    const handleDelete = (record) => {
        setData((prev) => prev.filter((item) => item._id !== record._id));
        message.success('Xóa địa điểm thành công!');
    };

    const handleAccess = (record) => {
        alert(`Truy cập địa điểm: ${record.name}`);
    };

    const handleEdit = (record) => {
        alert(`Chỉnh sửa địa điểm: ${record.name}`);
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 60,
            align: 'center',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            width: 80,
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
                        onClick={() => handleAccess(record)}
                        title="Xem chi tiết"
                    />
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} title="Chỉnh sửa địa điểm" />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa địa điểm này?"
                        onConfirm={() => handleDelete(record)}
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
                    <h1 className={cx('title')}>Quản lý địa điểm</h1>
                    <div className={cx('section-1-items')}>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Địa điểm:</p>
                            <p className={cx('small-card-value')}>{data.length}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Lượt đánh giá:</p>
                            <p className={cx('small-card-value')}>
                                {data.reduce((sum, d) => sum + d.statistics.totalReview, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách địa điểm</h1>
                    <Table
                        dataSource={data}
                        columns={columns}
                        bordered
                        rowKey="_id"
                        pagination={{
                            pageSize,
                            current: currentPage,
                            onChange: (page) => setCurrentPage(page),
                            showSizeChanger: false,
                        }}
                    />
                </div>
            </div>
        </motion.div>
    );
}

export default AdminDestinationManage;
