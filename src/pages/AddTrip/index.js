import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './AddTrip.module.scss';
import CustomTitle from '~/components/CustomTitle';
import { AimOutlined, EnvironmentOutlined, HeartOutlined, TeamOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import AddTripDrawer from '~/components/AddTripDrawer';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const cx = classNames.bind(styles);

const features = [
    {
        icon: <AimOutlined />,
        lines: ['Lên lịch trình cá nhân', 'cùng trợ lý AI thông minh'],
    },
    {
        icon: <HeartOutlined />,
        lines: ['Lưu lại khách sạn, nhà hàng', 'và điểm đến yêu thích'],
    },
    {
        icon: <EnvironmentOutlined />,
        lines: ['Xem thông tin chi tiết của những điểm đến'],
    },
    {
        icon: <TeamOutlined />,
        lines: ['Chia sẻ & đồng hành', 'cùng bạn bè trong mỗi chuyến đi'],
    },
];

function AddTrip() {
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();

    const handleAddTrip = ({ tripName, destination }) => {
        navigate('/trip-detail/hehe');
        window.scrollTo(0, 0);
        setOpenDrawer(false);
    };

    const handleCreateTripWithAI = () => {
        navigate('/gobot-assistant');
        window.scrollTo(0, 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <CustomTitle title={'Tạo hành trình khám phá riêng của bạn'} size={45} />
                <div className={cx('description')}>
                    <p className={cx('description-text')}>
                        Bạn có thể để AI giúp lên kế hoạch chuyến đi nhanh chóng, hoặc tự tay tạo hành trình theo cách
                        của riêng mình. Dù chọn cách nào, bạn cũng có hơn 8 triệu điểm đến để khám phá và hơn một tỷ
                        đánh giá từ những du khách khác để tham khảo, tha hồ tìm cảm hứng và chuẩn bị cho chuyến đi
                        tuyệt vời sắp tới!
                    </p>
                </div>
                <div className={cx('feature')}>
                    {features.map((item, index) => (
                        <div key={index} className={cx('feature-item')}>
                            <div className={cx('feature-icon')}>{item.icon}</div>
                            <div className={cx('feature-text')}>
                                {item.lines.map((line, i) => (
                                    <div key={i}>{line}</div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={cx('option')}>
                    <div className={cx('option-item')}>
                        <div className={cx('option-inner')}>
                            <img alt="error" src="/addtrip-img.png" className={cx('option-img')} />
                            <p className={cx('option-title')}>Tự mình lên hành trình</p>
                            <p className={cx('option-description')}>
                                Tạo hành trình khám phá riêng của bạn với những điểm đến yêu thích.
                            </p>
                            <Button type="primary" className={cx('option-button')} onClick={() => setOpenDrawer(true)}>
                                Bắt đầu ngay
                            </Button>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#dcc8ff' }} className={cx('option-item')}>
                        <div className={cx('option-inner')}>
                            <img alt="error" src="/addtrip-img2.png" className={cx('option-img')} />
                            <p className={cx('option-title')}>Để AI hỗ trợ bạn</p>
                            <p className={cx('option-description')}>
                                Để AI giúp bạn lên kế hoạch cho chuyến đi của mình một cách nhanh chóng và dễ dàng.
                            </p>
                            <Button
                                onClick={handleCreateTripWithAI}
                                type="primary"
                                className={cx('option-button', 'button-ai')}
                            >
                                Sử dụng AI ngay
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <AddTripDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} onAdd={handleAddTrip} />
        </motion.div>
    );
}

export default AddTrip;
