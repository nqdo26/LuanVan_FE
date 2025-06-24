import React, { useState } from 'react';
import { Button, Modal, Input, Tooltip, Upload } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone, UploadOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './HeaderProfilePage.module.scss';
import { UserPen } from 'lucide-react';
import Password from 'antd/es/input/Password';

const cx = classNames.bind(styles);

function HeaderProfilePage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isChangePassModalOpen, setIsChangePassModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleOk = () => setIsModalOpen(false);
    const handleCancel = () => setIsModalOpen(false);

    const showChangePasswordModal = () => setIsChangePassModalOpen(true);
    const handleChangePasswordOk = () => {
        // TODO: Xử lý đổi mật khẩu ở đây
        setIsChangePassModalOpen(false);
    };
    const handleChangePasswordCancel = () => setIsChangePassModalOpen(false);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('avatar-section')}>
                    <img className={cx('avatar')} src="/wimi1-img.png" alt="avatar" />
                    <div className={cx('info')}>
                        <h2 className={cx('name')}>Nguyễn Quang Độ</h2>
                        <span className={cx('username')}>nguoideptrainhatthegioi@gmail.com</span>
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
                    <strong>0</strong>
                    <span>Lượt đánh giá</span>
                </div>
                <div className={cx('stat-item')}>
                    <strong>0</strong>
                    <span>Lượt yêu thích</span>
                </div>
                <div className={cx('stat-item')}>
                    <strong>0</strong>
                    <span>Lịch trình cá nhân</span>
                </div>
            </div>

            <Modal
                title="Chỉnh sửa thông tin cá nhân"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="Lưu"
                cancelText="Hủy"
                width={600}
            >
                <div className={cx('modal-body')} style={{ textAlign: 'center', marginBottom: 24 }}>
                    <img
                        src="/wimi1-img.png"
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
                    <Upload showUploadList={false}>
                        <Button icon={<UploadOutlined />}>Thay đổi ảnh đại diện</Button>
                    </Upload>
                </div>

                <Input
                    style={{ width: '280px', marginBottom: 12 }}
                    placeholder="Họ và tên"
                    defaultValue="Nguyễn Quang Độ"
                />

                <div className={cx('password-button')} onClick={showChangePasswordModal}>
                    <p className={cx('password-text')}>Đổi mật khẩu</p>
                </div>
            </Modal>

            {/* Modal đổi mật khẩu */}
            <Modal
                title="Đổi mật khẩu"
                open={isChangePassModalOpen}
                onOk={handleChangePasswordOk}
                onCancel={handleChangePasswordCancel}
                okText="Cập nhật"
                cancelText="Hủy"
                width={500}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <Password
                        placeholder="Mật khẩu hiện tại"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <Password
                        placeholder="Mật khẩu mới"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                    <Password
                        placeholder="Nhập lại mật khẩu mới"
                        iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                    />
                </div>
            </Modal>
        </div>
    );
}

export default HeaderProfilePage;
