import React, { useEffect, useState } from 'react';
import { Button, Modal, Input, Tooltip, Upload, message, Spin } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './HeaderProfilePage.module.scss';
import { UserPen } from 'lucide-react';
import Password from 'antd/es/input/Password';
import { updateUserNameApi, updateUserPasswordApi, updateUserAvatarApi } from '~/utils/api';

const cx = classNames.bind(styles);

function HeaderProfilePage({ user, favouriteCount = 0, tourCount = 0, onUserUpdated }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);
    const showModal = () => setIsModalOpen(true);
    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    const showChangePasswordModal = () => setIsChangePassModalOpen(true);
    const handleChangePasswordOk = () => {
        setIsChangePassModalOpen(false);
    };
    const handleChangePasswordCancel = () => setIsChangePassModalOpen(false);

    const [name, setName] = useState(user.fullName);
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar || '/wimi1-img.png');
    const [passOld, setPassOld] = useState('');
    const [passNew, setPassNew] = useState('');
    const [passNew2, setPassNew2] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setName(user.fullName);
        setAvatarPreview(user.avatar || '/wimi1-img.png');
        setAvatarFile(null); // reset file sau khi reload user
    }, [user]);

    const handleAvatarChange = (info) => {
        if (info.file) {
            setAvatarFile(info.file);
            setAvatarPreview(URL.createObjectURL(info.file));
        } else {
            setAvatarFile(null);
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            let updated = false;
            let avatarRes = null;
            if (name !== user.fullName) {
                const res = await updateUserNameApi(name);
                if (res?.EC === 1 && res?.EM) {
                    message.error(res.EM);
                    setLoading(false);
                    return;
                }
                updated = true;
            }
            if (avatarFile) {
                avatarRes = await updateUserAvatarApi(avatarFile);
                if (avatarRes?.EC !== 0) {
                    message.error(avatarRes?.EM || 'Lỗi upload avatar');
                    if (avatarRes?.file !== undefined) {
                    }
                    setLoading(false);
                    return;
                }
                if (avatarRes?.file !== undefined) {
                }
                updated = true;
            }
            if (updated && onUserUpdated) onUserUpdated();
            setIsModalOpen(false);
        } catch (err) {
            const errorMsg = err?.EM || 'Có lỗi xảy ra khi cập nhật thông tin.';
            message.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!passOld || !passNew || !passNew2) return;
        if (passNew !== passNew2) return;
        setLoading(true);
        try {
            await updateUserPasswordApi(passOld, passNew);
            setIsChangePassModalOpen(false);
            setPassOld('');
            setPassNew('');
            setPassNew2('');
        } catch (err) {
            // handle error
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('avatar-section')}>
                    <img className={cx('avatar')} src={user.avatar || '/wimi1-img.png'} alt="avatar" />
                    <div className={cx('info')}>
                        <h2 className={cx('name')}>{user.fullName}</h2>
                        <span className={cx('username')}>{user.email}</span>
                    </div>
                </div>

                <Tooltip title="Chỉnh sửa thông tin cá nhân" placement="right">
                    <div onClick={showModal}>
                        <UserPen className={cx('edit-icon')} />
                    </div>
                </Tooltip>
            </div>

            <div className={cx('stats')}>
                <div className={cx('stat-item')}>
                    <strong>{favouriteCount}</strong>
                    <span>Địa điểm yêu thích</span>
                </div>
                <div className={cx('stat-item')}>
                    <strong>{tourCount}</strong>
                    <span>Lịch trình cá nhân</span>
                </div>
            </div>

            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isModalOpen}
                onOk={handleSave}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
                confirmLoading={loading}
                okButtonProps={{ className: cx('ok-btn') }}
                cancelButtonProps={{ className: cx('cancel-btn') }}
            >
                <Spin spinning={loading}>
                    <div className={cx('modal-body')} style={{ textAlign: 'center', marginBottom: 24 }}>
                        <img
                            src={avatarPreview}
                            alt="avatar"
                            style={{
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                marginBottom: 12,
                            }}
                        />
                        <br />
                        <Upload
                            showUploadList={false}
                            beforeUpload={() => false}
                            onChange={handleAvatarChange}
                            accept="image/*"
                        >
                            <Button className={cx('update-avt-btn')} icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
                        </Upload>
                    </div>

                    <Input
                        style={{ width: '280px', marginBottom: 12 }}
                        placeholder="Họ và tên"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className={cx('password-button')} onClick={showChangePasswordModal}>
                        <p className={cx('password-text')}>Đổi mật khẩu</p>
                    </div>
                </Spin>
            </Modal>

            <Modal
                title="Đổi mật khẩu"
                open={isChangePassModalOpen}
                onOk={handleChangePassword}
                onCancel={handleChangePasswordCancel}
                okText="Cập nhật"
                cancelText="Hủy"
                width={500}
                confirmLoading={loading}
                okButtonProps={{ className: cx('ok-btn') }}
                cancelButtonProps={{ className: cx('cancel-btn') }}
            >
                <Spin spinning={loading} tip="Đang cập nhật...">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <Password
                            placeholder="Mật khẩu hiện tại"
                            value={passOld}
                            onChange={(e) => setPassOld(e.target.value)}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                        <Password
                            placeholder="Mật khẩu mới"
                            value={passNew}
                            onChange={(e) => setPassNew(e.target.value)}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                        <Password
                            placeholder="Nhập lại mật khẩu mới"
                            value={passNew2}
                            onChange={(e) => setPassNew2(e.target.value)}
                            iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                    </div>
                </Spin>
            </Modal>
        </div>
    );
}

export default HeaderProfilePage;
