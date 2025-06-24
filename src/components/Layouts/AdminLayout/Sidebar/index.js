import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import { Button, Layout, Menu, Avatar, Flex } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusOutlined, EnvironmentOutlined, GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { House } from 'lucide-react';

import styles from './Sidebar.module.scss';

function Sidebar() {
    const cx = classNames.bind(styles);
    const navigate = useNavigate();
    const location = useLocation();
    const { Sider } = Layout;

    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const handleResize = () => setCollapsed(window.innerWidth < 992);
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const menuItems = [
        { key: 'dashboard', label: 'Trang chủ', icon: <House size={18} />, path: '/admin' },
        {
            key: 'users-manage',
            label: 'Quản lý tài khoản người dùng',
            icon: <UserOutlined />,
            path: '/admin/users-manage',
        },
        { key: 'cities', label: 'Danh sách thành phố', icon: <EnvironmentOutlined />, path: '/admin/places-manage' },
        {
            key: 'destinations',
            label: 'Danh sách địa điểm',
            icon: <GlobalOutlined />,
            path: '/admin/destinations-manage',
        },
    ];
    const selectedKey = menuItems.find((item) => item.path === location.pathname)?.key;

    // Navigation
    const handleOnclick = (e) => {
        const item = menuItems.find((item) => item.key === e.key);
        if (item) {
            navigate(item.path);
            window.scrollTo(0, 0);
        }
    };
    const handleAddDestination = () => {
        navigate('/admin/add-destination');
        window.scrollTo(0, 0);
    };

    const handleAddCity = () => {
        navigate('/admin/add-city');
        window.scrollTo(0, 0);
    };

    return (
        <Sider
            style={{
                position: 'static',
                backgroundColor: '#ffffff',
                borderRight: '1px solid #e8e8e8',
                height: 'auto',
            }}
            width={300}
            collapsedWidth={64}
            collapsible
            collapsed={collapsed}
            trigger={null}
            className={cx('wrapper')}
        >
            <Flex vertical justify="space-between" style={{ height: '100%' }}>
                <div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            marginTop: '100px',
                            marginBottom: '16px',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Avatar src="/admin.png" size={collapsed ? 40 : 64} />
                        {!collapsed && <div style={{ marginTop: 8, fontWeight: 600, fontSize: 18 }}>Admin</div>}
                    </div>

                    {!collapsed && (
                        <div className={cx('action')}>
                            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    style={{ backgroundColor: '#1890ff', color: 'white', width: '200px' }}
                                    onClick={handleAddCity}
                                >
                                    <PlusOutlined /> Thêm thành phố mới
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.07 }} whileTap={{ scale: 0.98 }}>
                                <Button
                                    style={{ backgroundColor: '#52c41a', color: 'white', width: '200px' }}
                                    onClick={handleAddDestination}
                                >
                                    <PlusOutlined /> Thêm địa điểm mới
                                </Button>
                            </motion.div>
                        </div>
                    )}

                    <Menu
                        mode="inline"
                        items={menuItems}
                        onClick={handleOnclick}
                        selectedKeys={[selectedKey]}
                        inlineCollapsed={collapsed}
                        style={{ marginTop: 24 }}
                    />
                </div>
            </Flex>
        </Sider>
    );
}

export default Sidebar;
