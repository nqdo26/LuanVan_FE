import React, { useEffect, useState, useContext } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AdminUserManage.module.scss';
import { Button, Table, Switch, Popconfirm, message, notification } from 'antd';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { getUsersApi, updateUserAdminApi, deleteUserApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

function AdminUserManage() {
    const { auth } = useContext(AuthContext);
    const currentUserId = auth?.user?.id; // id của user đang đăng nhập

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 7;
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState({});

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            const res = await getUsersApi();
            if (!res?.message) {
                setUsers(res);
            } else {
                notification.error({
                    message: 'Chưa xác thực',
                    description: res.message,
                });
            }
            setLoading(false);
        };

        fetchUser();
    }, []);

    const handleToggleAdmin = async (record) => {
        setActionLoading((prev) => ({ ...prev, [record._id]: true }));
        try {
            const res = await updateUserAdminApi(record._id, !record.isAdmin);
            if (res?.EC === 0) {
                setUsers((prev) =>
                    prev.map((user) => (user._id === record._id ? { ...user, isAdmin: !user.isAdmin } : user)),
                );
                message.success(
                    !record.isAdmin
                        ? 'Đã cấp quyền quản trị cho tài khoản này!'
                        : 'Đã hủy quyền quản trị tài khoản này!',
                );
            } else {
                notification.error({
                    message: 'Cập nhật quyền quản trị thất bại',
                    description: res?.EM || 'Có lỗi khi cập nhật quyền quản trị.',
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi mạng',
                description: 'Không thể kết nối tới server!',
            });
        }
        setActionLoading((prev) => ({ ...prev, [record._id]: false }));
    };

    const handleDeleteUser = async (record) => {
        setActionLoading((prev) => ({ ...prev, [record._id]: true }));
        try {
            const res = await deleteUserApi(record._id);
            if (res?.EC === 0) {
                setUsers((prev) => prev.filter((user) => user._id !== record._id));
                message.success('Xóa tài khoản thành công!');
            } else {
                notification.error({
                    message: 'Xóa tài khoản thất bại',
                    description: res?.EM || 'Có lỗi khi xóa tài khoản.',
                });
            }
        } catch (err) {
            notification.error({
                message: 'Lỗi mạng',
                description: 'Không thể kết nối tới server!',
            });
        }
        setActionLoading((prev) => ({ ...prev, [record._id]: false }));
    };

    const handleAccessUser = (record) => {
        alert(`Truy cập người dùng: ${record.fullName}`);
    };

    const columns = [
        {
            title: 'STT',
            key: 'index',
            width: 60,
            render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
        },
        {
            title: 'Tên tài khoản',
            dataIndex: 'email',
        },
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            render: (createdAt) => {
                if (!createdAt) return '';
                const d = new Date(createdAt);
                return d.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            },
        },
        {
            title: 'Ngày chỉnh sửa',
            dataIndex: 'updatedAt',
            render: (updatedAt) => {
                if (!updatedAt) return '';
                const d = new Date(updatedAt);
                return d.toLocaleString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                });
            },
        },
        {
            title: 'Quản trị',
            key: 'admin',
            render: (record) => {
                const isCurrentUser = record._id === currentUserId;
                return (
                    <Popconfirm
                        title={`Bạn có chắc muốn ${
                            record.isAdmin ? 'hủy quyền' : 'cấp quyền'
                        } quản trị cho tài khoản này?`}
                        onConfirm={() => handleToggleAdmin(record)}
                        okText="Đồng ý"
                        cancelText="Hủy"
                        disabled={isCurrentUser}
                    >
                        <Switch
                            checked={record.isAdmin}
                            loading={!!actionLoading[record._id]}
                            disabled={!!actionLoading[record._id] || isCurrentUser}
                        />
                    </Popconfirm>
                );
            },
            width: 100,
        },
        {
            title: 'Tùy chọn',
            key: 'action',
            render: (record) => {
                const isCurrentUser = record._id === currentUserId;
                return (
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                            type="primary"
                            icon={<EyeOutlined />}
                            onClick={() => handleAccessUser(record)}
                            disabled={isCurrentUser}
                        ></Button>
                        <Popconfirm
                            title="Bạn có chắc chắn muốn xóa tài khoản này?"
                            onConfirm={() => handleDeleteUser(record)}
                            okText="Đồng ý"
                            cancelText="Hủy"
                            disabled={isCurrentUser}
                        >
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                loading={!!actionLoading[record._id]}
                                disabled={!!actionLoading[record._id] || isCurrentUser}
                            />
                        </Popconfirm>
                    </div>
                );
            },
            width: 160,
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
                    <h1 className={cx('title')}>Quản lý tài khoản người dùng</h1>
                    <div className={cx('section-1-items')}>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Tổng số tài khoản:</p>
                            <p className={cx('small-card-value')}>{users.length}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Tài khoản quản trị:</p>
                            <p className={cx('small-card-value')}>{users.filter((u) => u.isAdmin).length}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('table-wrapper')}>
                    <h1 className={cx('table-title')}>Danh sách tài khoản người dùng</h1>
                    <Table
                        scroll={{ x: 768 }}
                        loading={loading}
                        dataSource={users}
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

export default AdminUserManage;
