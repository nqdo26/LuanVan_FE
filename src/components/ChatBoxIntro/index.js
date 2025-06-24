import { Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import classNames from 'classnames/bind';

import styles from './ChatBoxIntro.module.scss';

const cx = classNames.bind(styles);

function ChatBoxIntro() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/gobot-assistant');
        window.scrollTo(0, 0);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
        >
            <Card
                className={cx('wrapper')}
                style={{ width: '100%', textAlign: 'center', borderRadius: '12px' }}
                hoverable
            >
                <img alt="Gobot" src="/ai-img.png" className={cx('ai-img')} />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '10px' }}>
                    Gobot - Trợ lý du lịch AI của bạn!
                </h2>
                <p style={{ color: '#666', margin: '10px 0 20px' }}>
                    Bạn đang bối rối không biết đi đâu? Để Roberto Carlos giúp bạn lên lịch trình{' '}
                    <strong>"xịn sò"</strong> chỉ trong vài giây! 😉
                </p>

                <motion.button
                    className={cx('button')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClick}
                >
                    Trải nghiệm ngay →
                </motion.button>
            </Card>
        </motion.div>
    );
}

export default ChatBoxIntro;
