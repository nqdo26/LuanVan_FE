import classNames from 'classnames/bind';
import { Layout, Flex, Modal, Button, Avatar, Dropdown, Input, message, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState, useEffect, useContext } from 'react';
import styles from './HomeHeader.module.scss';
import { createUserApi, loginApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);
const { Header: AntHeader } = Layout;

function HomeHeader() {
    const navigate = useNavigate();

    const { auth, setAuth } = useContext(AuthContext);

    // ---- STATE ----
    // Login modal
    const [isModalLoginOpen, setIsModalLoginOpen] = useState(false);
    const [isModalRegisterOpen, setIsModalRegisterOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    // Register modal
    const [registerName, setRegisterName] = useState('');
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');
    const [registerLoading, setRegisterLoading] = useState(false);

    // ---- HANDLERS ----
    const handleNavigate = (path) => {
        navigate('/' + path);
        window.scrollTo(0, 0);
    };

    const handleMenuClick = ({ key }) => {
        if (key === 'logout') {
            localStorage.clear('access_token');
            notification.success({
                message: 'Đăng xuất thành công',
                description: 'Bạn đã đăng xuất khỏi tài khoản.',
            });
            setAuth({
                isAuthenticated: false,
                user: {
                    id: '',
                    email: '',
                    fullName: '',
                    avatar: '',
                    isAdmin: false,
                },
            });
            navigate('/');
        } else if (key === 'my-profile') {
            navigate(`/my-profile`);
            window.scrollTo(0, 0);
        } else {
            navigate('/' + key);
            window.scrollTo(0, 0);
        }
    };

    const handleSearchMenuClick = ({ key }) => {
        if (key === 'add-trip') navigate('/add-trip');
        else if (key === 'ai-plan') navigate('/gobot-assistant');
        else if (key === 'my-trip') navigate('/my-trip');
        window.scrollTo(0, 0);
    };

    const handleAdminClick = () => {
        navigate('/admin');
        window.scrollTo(0, 0);
    };

    const handleLoginSubmit = async () => {
        if (!email || !password) {
            notification.warning({
                message: 'Thiếu thông tin',
                description: 'Vui lòng nhập đầy đủ thông tin!',
            });
            return;
        }
        setLoginLoading(true);
        try {
            const res = await loginApi(email, password);
            console.log(res.access_token);
            if (res.EC === 0) {
                localStorage.setItem('access_token', res.access_token);
                notification.success({
                    message: 'Đăng nhập thành công',
                    description: `Chào mừng ${res.user.fullName} trở lại!`,
                });
                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: res?.user?.id ?? '',
                        email: res?.user?.email ?? '',
                        fullName: res?.user?.fullName ?? '',
                        avatar: res?.user?.avatar ?? '',
                        isAdmin: res?.user?.isAdmin ?? false,
                    },
                });
                setIsModalLoginOpen(false);
                setEmail('');
                setPassword('');
            } else if (res.EC === 1) {
                notification.error({
                    message: 'Đăng nhập thất bại',
                    description: 'Email hoặc mật khẩu không chính xác!',
                });
            } else {
                message.error(res.data.EM || 'Lỗi hệ thống!');
            }
        } catch (err) {
            message.error('Không kết nối được server!');
        }
        setLoginLoading(false);
    };

    // ---- Đăng ký tài khoản ----
    const handleRegisterSubmit = async () => {
        if (!registerName || !registerEmail || !registerPassword || !registerConfirmPassword) {
            notification.warning({
                message: 'Thiếu thông tin',
                description: 'Vui lòng nhập đầy đủ thông tin!',
            });
            return;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(registerEmail)) {
            notification.error({
                message: 'Địa chỉ email không đúng',
                description: 'Vui lòng nhập địa chỉ email hợp lệ!',
            });
            return;
        }
        if (registerPassword.length < 8) {
            notification.error({
                message: 'Mật khẩu không hợp lệ',
                description: 'Mật khẩu phải có ít nhất 8 ký tự!',
            });
            return;
        }
        if (registerPassword !== registerConfirmPassword) {
            notification.error({
                message: 'Nhập lại mật khẩu không khớp',
                description: 'Vui lòng kiểm tra lại mật khẩu!',
            });
            return;
        }
        setRegisterLoading(true);
        try {
            const res = await createUserApi(registerName, registerEmail, registerPassword);
            console.log(res);
            if (res.EC === 0) {
                notification.success({
                    message: 'Đăng ký thành công',
                });
                setIsModalRegisterOpen(false);
                setIsModalLoginOpen(true);
                setRegisterName('');
                setRegisterEmail('');
                setRegisterPassword('');
                setRegisterConfirmPassword('');
            } else if (res.EC === 1) {
                message.error('Email đã được sử dụng!');
            }
        } catch (err) {
            message.error('Không kết nối được server!');
        }
        setRegisterLoading(false);
    };

    useEffect(() => {
        if (isModalLoginOpen) {
            setEmail('');
            setPassword('');
        }
    }, [isModalLoginOpen]);

    useEffect(() => {
        if (isModalRegisterOpen) {
            setRegisterName('');
            setRegisterEmail('');
            setRegisterPassword('');
            setRegisterConfirmPassword('');
        }
    }, [isModalRegisterOpen]);

    const dropdownItems = [
        { key: 'my-profile', label: <span className={cx('menu-avt-item')}>Thông tin cá nhân</span> },
        { key: 'add-trip', label: <span className={cx('menu-avt-item')}>Lên lịch trình</span> },
        { type: 'divider' },
        { key: 'logout', label: <span className={cx('menu-avt-item')}>Đăng xuất</span> },
    ];

    const searchDropdownItems = [
        { key: 'add-trip', label: 'Tạo lịch trình mới' },
        { key: 'my-trip', label: 'Hành trình cá nhân' },
        { key: 'ai-plan', label: 'Tạo lịch trình với Gobot' },
    ];

    return (
        <AntHeader className={cx('wrapper')}>
            <Flex justify="space-between" className={cx('inner')}>
                <div className={cx('logo')} onClick={() => handleNavigate('')}>
                    <img className={cx('logo-icon')} src="/logo2.png" alt="GoOhNo" />
                    <span className={cx('title')}>GoOhNo</span>
                </div>

                <nav className={cx('menu')}>
                    {[
                        { label: 'Trang chủ', path: '' },
                        { label: 'Tìm kiếm', path: 'search' },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            className={cx('menu-item')}
                            onClick={() => handleNavigate(item.path)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {item.label}
                        </motion.div>
                    ))}

                    <Dropdown
                        trigger={['hover']}
                        placement="bottom"
                        menu={{ items: searchDropdownItems, onClick: handleSearchMenuClick }}
                    >
                        <motion.div
                            className={cx('menu-item')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ cursor: 'pointer' }}
                        >
                            Lịch trình
                        </motion.div>
                    </Dropdown>
                </nav>

                <div className={cx('button-group')}>
                    {auth.user.isAdmin && (
                        <motion.button
                            className={cx('admin-button')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAdminClick}
                        >
                            Mục quản lý
                        </motion.button>
                    )}

                    {!auth.isAuthenticated ? (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <button className={cx('login')} onClick={() => setIsModalLoginOpen(true)}>
                                Đăng nhập
                            </button>
                        </motion.div>
                    ) : (
                        <Dropdown
                            trigger={['hover']}
                            placement="bottomRight"
                            menu={{ items: dropdownItems, onClick: handleMenuClick }}
                            dropdownClassName={cx('dropdown-menu')}
                        >
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Avatar
                                    size={40}
                                    src={auth.user.avatar}
                                    className={cx('avatar')}
                                    style={{ cursor: 'pointer' }}
                                />
                            </motion.div>
                        </Dropdown>
                    )}
                </div>
            </Flex>

            {/* LOGIN MODAL */}
            <Modal
                open={isModalLoginOpen}
                onCancel={() => setIsModalLoginOpen(false)}
                footer={null}
                className={cx('login-modal')}
                centered
                destroyOnClose
                width={400}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={cx('modal-content')}
                >
                    <div className={cx('modal-logo')}>
                        <img className={cx('logo')} src="/logo.png" alt="GoOhNo" />
                        <span className={cx('title-modal')}>GoOhNo</span>
                    </div>
                    <p className={cx('modal-title')}>Đăng nhập</p>
                    <div className={cx('login-form')}>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onPressEnter={handleLoginSubmit}
                            className={cx('login-input')}
                            style={{ marginBottom: 20 }}
                        />
                        <Input.Password
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onPressEnter={handleLoginSubmit}
                            className={cx('login-input')}
                            style={{ marginBottom: 20 }}
                        />
                        <div
                            className={cx('register-link')}
                            onClick={() => {
                                setIsModalLoginOpen(false);
                                setIsModalRegisterOpen(true);
                            }}
                        >
                            <span>
                                Chưa có tài khoản? <strong>Đăng ký ngay</strong>
                            </span>
                        </div>
                        <Button
                            className={cx('login-button', 'submit')}
                            onClick={handleLoginSubmit}
                            loading={loginLoading}
                            block
                        >
                            Đăng nhập
                        </Button>
                    </div>
                </motion.div>
            </Modal>

            {/* REGISTER MODAL */}
            <Modal
                open={isModalRegisterOpen}
                onCancel={() => setIsModalRegisterOpen(false)}
                footer={null}
                className={cx('login-modal')}
                centered
                destroyOnClose
                width={400}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    className={cx('modal-content')}
                >
                    <div className={cx('modal-logo')}>
                        <img className={cx('logo')} src="/logo.png" alt="GoOhNo" />
                        <span className={cx('title-modal')}>GoOhNo</span>
                    </div>
                    <p className={cx('register-title')}>Đăng ký</p>
                    <div className={cx('login-form')}>
                        <Input
                            placeholder="Họ và tên"
                            className={cx('login-input')}
                            style={{ marginBottom: 20 }}
                            value={registerName}
                            onChange={(e) => setRegisterName(e.target.value)}
                            onPressEnter={handleRegisterSubmit}
                        />
                        <Input
                            placeholder="Email"
                            className={cx('login-input')}
                            style={{ marginBottom: 20 }}
                            value={registerEmail}
                            onChange={(e) => setRegisterEmail(e.target.value)}
                            onPressEnter={handleRegisterSubmit}
                        />
                        <Input.Password
                            placeholder="Mật khẩu"
                            className={cx('login-input')}
                            style={{ marginBottom: 20 }}
                            value={registerPassword}
                            onChange={(e) => setRegisterPassword(e.target.value)}
                            onPressEnter={handleRegisterSubmit}
                        />
                        <Input.Password
                            placeholder="Xác nhận mật khẩu"
                            className={cx('login-input')}
                            style={{ marginBottom: 30 }}
                            value={registerConfirmPassword}
                            onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                            onPressEnter={handleRegisterSubmit}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Button
                                block
                                style={{ flex: 1 }}
                                onClick={() => {
                                    setIsModalRegisterOpen(false);
                                    setIsModalLoginOpen(true);
                                }}
                                className={cx('back-button')}
                            >
                                Trở về đăng nhập
                            </Button>
                            <Button
                                className={cx('register-button')}
                                type="primary"
                                block
                                style={{ flex: 1 }}
                                loading={registerLoading}
                                onClick={handleRegisterSubmit}
                            >
                                Đăng ký
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </Modal>
        </AntHeader>
    );
}

export default HomeHeader;
