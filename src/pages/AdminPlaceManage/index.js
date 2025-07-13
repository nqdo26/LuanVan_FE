import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminPlaceManage.module.scss';
import { Button, Table, message, Spin, Modal } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import {
    deleteCityApi,
    getCityDeletionInfoApi,
    getCitiesWithDestinationCountApi,
    incrementCityViewsApi,
} from '~/utils/api';
import viewTracker from '~/utils/viewTracker';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function AdminPlaceManage() {
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;

    const navigate = useNavigate();
    useEffect(() => {
        fetchCities();
    }, []);

    const fetchCities = async () => {
        try {
            setLoading(true);
            const response = await getCitiesWithDestinationCountApi();

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
            const infoResponse = await getCityDeletionInfoApi(record._id);

            if (infoResponse && infoResponse.EC === 0) {
                const { cityName, destinationCount, destinations } = infoResponse.data;

                let confirmMessage = `Bạn có chắc chắn muốn xóa thành phố "${cityName}"?`;
                let modalContent = null;

                if (destinationCount > 0) {
                    confirmMessage = `Thành phố "${cityName}" có ${destinationCount} địa điểm liên quan. Nếu xóa thành phố, tất cả các địa điểm này cũng sẽ bị xóa.`;
                    modalContent = (
                        <div>
                            <p style={{ marginBottom: 16, fontWeight: 500, color: '#ff4d4f' }}>{confirmMessage}</p>
                            <p style={{ marginBottom: 8, fontWeight: 500 }}>Danh sách địa điểm sẽ bị xóa:</p>
                            <ul style={{ marginLeft: 16, maxHeight: 200, overflowY: 'auto' }}>
                                {destinations.map((dest, index) => (
                                    <li key={dest.id} style={{ marginBottom: 4 }}>
                                        {index + 1}. {dest.title}
                                    </li>
                                ))}
                            </ul>
                            <p style={{ marginTop: 16, color: '#ff4d4f', fontWeight: 500 }}>
                                Bạn có chắc chắn muốn tiếp tục?
                            </p>
                        </div>
                    );
                }

                Modal.confirm({
                    title: 'Xác nhận xóa thành phố',
                    content: modalContent || confirmMessage,
                    okText: 'Xóa',
                    okType: 'danger',
                    cancelText: 'Hủy',
                    width: destinationCount > 0 ? 400 : 300,

                    onOk: async () => {
                        try {
                            const response = await deleteCityApi(record._id);
                            if (response && response.EC === 0) {
                                setCities((prev) => prev.filter((city) => city._id !== record._id));
                                message.success(response.EM || 'Xóa thành phố thành công!');
                            } else {
                                message.error(response?.EM || 'Xóa thành phố thất bại');
                            }
                        } catch (error) {
                            console.error('Error deleting city:', error);
                            message.error('Có lỗi xảy ra khi xóa thành phố');
                        }
                    },
                });
            } else {
                message.error('Không thể kiểm tra thông tin thành phố');
            }
        } catch (error) {
            console.error('Error checking city deletion info:', error);
            message.error('Có lỗi xảy ra khi kiểm tra thông tin thành phố');
        }
    };

    const handleAccessCity = async (record) => {
        // Tăng lượt xem khi admin access city - sử dụng viewTracker
        if (record._id && viewTracker.canIncrement('city', record._id)) {
            try {
                await incrementCityViewsApi(record._id);
                console.log('Admin city access view incremented:', record._id);
            } catch (error) {
                console.error('Lỗi khi tăng lượt xem city:', error);
            }
        } else if (record._id) {
            console.log('Admin city access view increment skipped (cooldown):', record._id);
        }

        navigate(`/city/${record.slug}`);
    };

    const handleEditCity = (record) => {
        navigate(`/admin/city/edit/${record._id}`);
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
            dataIndex: 'destinationCount',
            render: (count) => <b>{count || 0}</b>,
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
            render: (val) => <span>{val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-'}</span>,
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            width: 140,
            render: (val) => <span>{val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-'}</span>,
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            width: 120,
            render: (creator) => <span>{creator || '-'}</span>,
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
                    <Button
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteCity(record)}
                        title="Xóa thành phố"
                    />
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
                                {cities.reduce((sum, city) => sum + (city.destinationCount || 0), 0)}
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
