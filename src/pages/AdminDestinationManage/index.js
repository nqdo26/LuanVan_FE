import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminDestinationManage.module.scss';
import { Button, Table, Popconfirm, message, notification } from 'antd';
import { EyeOutlined, DeleteOutlined, StarFilled, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { deleteDestinationApi, getDestinationsApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

function AdminDestinationManage() {
    const { auth } = useContext(AuthContext);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 5;
    const navigate = useNavigate();

    useEffect(() => {
        if (auth && auth.user && !auth.user.isAdmin) {
            navigate('/');
        }
    }, [auth, navigate]);

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async () => {
        setLoading(true);
        try {
            const res = await getDestinationsApi();

            if (res && res.data && Array.isArray(res.data)) {
                setData(res.data);
            } else if (res && res.data && Array.isArray(res.data.data)) {
                setData(res.data.data);
            } else if (res && res.EC === 0 && Array.isArray(res.data)) {
                setData(res.data);
            } else if (res && res.EC === 0 && Array.isArray(res.data?.data)) {
                setData(res.data.data);
            } else {
                message.error('Không thể tải danh sách địa điểm');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi tải danh sách địa điểm');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (record) => {
        try {
            const res = await deleteDestinationApi(record._id);
            console.log('Delete response:', res);
            if (res && res.EC === 0) {
                setData((prev) => prev.filter((item) => item._id !== record._id));
                notification.success({
                    message: 'Thành công',
                    description: 'Xóa địa điểm thành công!',
                });
            } else {
                message.error(res?.data?.EM || 'Xóa địa điểm thất bại!');
            }
        } catch (error) {
            message.error('Có lỗi xảy ra khi xóa địa điểm!');
        }
    };

    const handleAccess = (record) => {
        navigate(`/destination/${record.slug}`);
    };

    const handleEdit = (record) => {
        if (record && record._id) {
            navigate(`/admin/destination/edit/${record._id}`);
        }
    };

    const columns = [
        {
            title: 'STT',
            key: 'stt',
            width: 50,
            align: 'center',
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'ID',
            dataIndex: '_id',
            width: 50,
        },
        {
            title: 'Tên địa điểm',
            dataIndex: 'title',
            width: 200,
        },
        {
            title: 'Thành phố',
            dataIndex: ['location', 'city'],
            width: 150,
            render: (city, record) => {
                if (typeof city === 'object' && city !== null) {
                    return city.name || city.title || city._id || '';
                }
                return city || '';
            },
        },
        {
            title: 'Người tạo',
            dataIndex: 'createdBy',
            render: (val) => val || '',
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
                        Lượt đánh giá: <b>{record.statistics.totalRate}</b>
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
            render: (val) => <span>{val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-'}</span>,
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            width: 140,
            render: (val) => <span>{val ? dayjs(val).format('DD/MM/YYYY HH:mm') : '-'}</span>,
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
                                {data.reduce((sum, d) => sum + (d.statistics?.totalRate || 0), 0)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách địa điểm</h1>
                    <Table
                        scroll={{ x: 768 }}
                        loading={loading}
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
