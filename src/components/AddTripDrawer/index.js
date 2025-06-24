import React, { useState } from 'react';
import classNames from 'classnames/bind';
import { Drawer, Button, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import styles from './AddTripDrawer.module.scss';
import CardSearchDrawer from '~/components/CardSearchDrawer';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);

function AddTripDrawer({ open, onClose, onAdd }) {
    const [tripName, setTripName] = useState('');
    const [destination, setDestination] = useState('');
    const navigate = useNavigate();

    const handleAddClick = () => {
        if (!tripName.trim()) {
            alert('Vui lòng nhập tên hành trình');
            return;
        }
        onAdd({ tripName, destination });
        setTripName('');
        setDestination('');
        navigate('/trip-detail/hehe');
    };

    const handleClose = () => {
        onClose();
        setTripName('');
        setDestination('');
    };

    return (
        <Drawer
            placement="right"
            onClose={handleClose}
            open={open}
            width={500}
            className={cx('drawer')}
            footer={
                <div className={cx('drawer-footer')}>
                    <Button className={cx('drawer-button')} onClick={handleClose}>
                        Hủy
                    </Button>
                    <Button className={cx('drawer-button', 'button-add')} onClick={handleAddClick} type="primary">
                        Tạo hành trình
                    </Button>
                </div>
            }
        >
            <div className={cx('drawer-inner')}>
                <p className={cx('drawer-title')}>Tạo hành trình mới</p>

                <div className={cx('drawer-group')}>
                    <p className={cx('drawer-label')}>Tên hành trình</p>
                    <Input
                        placeholder="Chuyến du lịch Cần Thơ cùng gia đình"
                        maxLength={80}
                        value={tripName}
                        onChange={(e) => setTripName(e.target.value)}
                        className={cx('drawer-input')}
                    />
                </div>

                <div className={cx('drawer-group')}>
                    <p className={cx('drawer-label')}>Địa điểm</p>
                    <Input
                        prefix={<SearchOutlined />}
                        placeholder="Chuyến du lịch Cần Thơ cùng gia đình"
                        maxLength={80}
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className={cx('drawer-input', 'drawer-search')}
                    />
                    <div className={cx('drawer-search-result')}>
                        <div className={cx('result-list')}>
                            <CardSearchDrawer
                                city="Cần Thơ"
                                region="Thành phố nước ngọt miền Tây"
                                image="/wimi2-img.png"
                            />
                            <CardSearchDrawer city="Hà Nội" region="Thủ đô nghìn năm văn hiến" image="/wimi2-img.png" />
                            <CardSearchDrawer city="Đà Nẵng" region="Thành phố đáng sống" image="/wimi2-img.png" />
                            <CardSearchDrawer city="Hà Nội" region="Thủ đô nghìn năm văn hiến" image="/wimi2-img.png" />
                            <CardSearchDrawer city="Hà Nội" region="Thủ đô nghìn năm văn hiến" image="/wimi2-img.png" />
                            <CardSearchDrawer city="Hà Nội" region="Thủ đô nghìn năm văn hiến" image="/wimi2-img.png" />
                            <CardSearchDrawer city="Hà Nội" region="Thủ đô nghìn năm văn hiến" image="/wimi2-img.png" />
                        </div>
                    </div>
                </div>
            </div>
        </Drawer>
    );
}

export default AddTripDrawer;
