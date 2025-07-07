import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminPlaceManage.module.scss';
import { Button, Table, Popconfirm, message, Spin } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getCitiesApi, deleteCityApi } from '~/utils/api';

const cx = classNames.bind(styles);

function AdminPlaceManage() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;

    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            setLoading(true);
            const response = await getCitiesApi();
    
            if (response && response.EC === 0) {
                setCities(response.data);
            } else {
                message.error('Không thể tải danh sách thành phố');
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
            message.error('Có lỗi xảy ra khi tải danh sách thành phố');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCity = async (record) => {
        try {
            const response = await deleteCityApi(record._id);
            if (response && response.EC === 0) {
                setCities((prev) => prev.filter((city) => city._id !== record._id));
                message.success('Xóa thành phố thành công!');
            } else {
                message.error(response?.EM || 'Xóa thành phố thất bại');
            }
        } catch (error) {
            console.error('Error deleting city:', error);
            message.error('Có lỗi xảy ra khi xóa thành phố');
        }
    };

    const handleAccessCity = (record) => {
        window.open(`/city/${record.slug}`, '_blank');
    };

    const handleEditCity = (record) => {
        window.open(`/admin/city/edit/${record._id}`);
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 30,
            align: 'center',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            width: 50,
        },
        {
            title: 'Tên thành phố',
            dataIndex: 'name',
            width: 200,
            render: (text, record) => (
                <div>
                    <div style={{ fontWeight: 500 }}>{text}</div>
                    {record.type && record.type.length > 0 && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                            {record.type.map((t) => t.title).join(', ')}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Địa điểm',
            key: 'numberOfPlaces',
            render: () => <b>{Math.floor(Math.random() * 100) + 1}</b>,
            width: 120,
        },
        {
            title: 'Lượt xem',
            key: 'metrics',
            render: (record) => (
                <div>
                    <b>{record.views || 0}</b>
                </div>
            ),
            width: 50,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            width: 140,
            render: (val) => <span>{val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-'}</span>,
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            width: 140,
            render: (val) => <span>{val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-'}</span>,
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            width: 120,
            render: (user) => (
                <div>
                    {user ? (
                        <div>
                            <div style={{ fontWeight: 500, fontSize: '13px' }}>{user.fullName}</div>
                            <div style={{ fontSize: '11px', color: '#666' }}>{user.email}</div>
                        </div>
                    ) : (
                        <span style={{ color: '#999' }}>-</span>
                    )}
                </div>
            ),
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
                                {cities.reduce((sum, city) => sum + (Math.floor(Math.random() * 100) + 1), 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách thành phố</h1>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            dataSource={cities}
                            columns={columns}
                            bordered
                            rowKey="_id"
                            scroll={{ x: 768 }}
                            pagination={{
                                pageSize,
                                current: currentPage,
                                onChange: (page) => setCurrentPage(page),
                                showSizeChanger: false,
                            }}
                        />
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default AdminPlaceManage;
