import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminPlaceManage.module.scss';
import { Button, Table, Popconfirm, message } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const cx = classNames.bind(styles);

// DATA GIẢ: 20 thành phố, có ngày tạo và ngày chỉnh sửa
const fakeCities = Array.from({ length: 20 }, (_, i) => ({
    _id: `c${i + 1}`,
    cityName: `Thành phố ${i + 1}`,
    numberOfPlaces: Math.floor(Math.random() * 100) + 1,
    views: Math.floor(Math.random() * 5000) + 1000,
    createdAt: dayjs().subtract(i, 'day').format('YYYY-MM-DD HH:mm'),
    updatedAt: dayjs()
        .subtract(Math.floor(i / 2), 'hour')
        .format('YYYY-MM-DD HH:mm'),
}));

function AdminPlaceManage() {
    const [cities, setCities] = useState(fakeCities);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    const handleDeleteCity = (record) => {
        setCities((prev) => prev.filter((city) => city._id !== record._id));
        message.success('Xóa thành phố thành công!');
    };

    const handleAccessCity = (record) => {
        alert(`Truy cập thành phố: ${record.cityName}`);
    };

    const handleEditCity = (record) => {
        alert(`Chỉnh sửa thành phố: ${record.cityName}`);
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
            title: 'Tên thành phố',
            dataIndex: 'cityName',
        },
        {
            title: 'Địa điểm',
            dataIndex: 'numberOfPlaces',
            render: (val) => <b>{val}</b>,
            width: 120,
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
                    <Button icon={<EditOutlined />} onClick={() => handleEditCity(record)} title="Chỉnh sửa địa điểm" />
                    <Popconfirm
                        title="Bạn có chắc chắn muốn xóa địa điểm này?"
                        onConfirm={() => handleDeleteCity(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </div>
            ),
            width: 200,
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
                    <h1 className={cx('title')}>Quản lý thành phố</h1>
                    <div className={cx('section-1-items')}>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Thành phố:</p>
                            <p className={cx('small-card-value')}>{cities.length}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Địa điểm:</p>
                            <p className={cx('small-card-value')}>
                                {cities.reduce((sum, city) => sum + city.numberOfPlaces, 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách thành phố</h1>
                    <Table
                        dataSource={cities}
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

export default AdminPlaceManage;
