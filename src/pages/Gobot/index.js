// src/pages/Gobot.jsx
import { motion } from 'framer-motion';
import { useEffect, useState, useContext } from 'react';

import { ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Drawer, Button } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './Gobot.module.scss';
import AIChatPageIntro from '~/components/AIChatPageIntro';
import ChatHistorySidebar from '~/components/ChatHistorySidebar';

const cx = classNames.bind(styles);

const fakeChatHistory = [
    {
        id: 1,
        title: 'Chat khởi động',
        messages: [{ message: 'Chào bạn! Tôi là Gobot...', sender: 'Gobot' }],
    },
    {
        id: 2,
        title: 'Lên kế hoạch Đà Nẵng',
        messages: [
            { message: 'Mình đi Đà Nẵng dịp nào hợp lý?', sender: 'user' },
            { message: 'Tháng 8 thời tiết đẹp nhất.', sender: 'Gobot' },
        ],
    },
    {
        id: 3,
        title: 'Tư vấn khách sạn',
        messages: [
            { message: 'Có khách sạn nào gần biển không?', sender: 'user' },
            { message: 'Bạn có thể thử SeaView Hotel.', sender: 'Gobot' },
        ],
    },
    {
        id: 4,
        title: 'Hỏi thời tiết Hà Nội',
        messages: [
            { message: 'Thời tiết Hà Nội hôm nay ra sao?', sender: 'user' },
            { message: 'Trời nắng nhẹ, khoảng 30°C.', sender: 'Gobot' },
        ],
    },
    {
        id: 5,
        title: 'Gợi ý phim',
        messages: [
            { message: 'Mình nên xem phim gì tối nay?', sender: 'user' },
            { message: 'Bạn có thể thử xem "The Wandering Earth".', sender: 'Gobot' },
        ],
    },
    {
        id: 6,
        title: 'Gợi ý sách',
        messages: [
            { message: 'Đề xuất sách phát triển bản thân?', sender: 'user' },
            { message: 'Hãy đọc "7 Thói Quen Hiệu Quả".', sender: 'Gobot' },
        ],
    },
    {
        id: 7,
        title: 'Tìm quán cà phê',
        messages: [
            { message: 'Quán cà phê đẹp tại Sài Gòn?', sender: 'user' },
            { message: 'Bạn thử check The Workshop.', sender: 'Gobot' },
        ],
    },
    {
        id: 8,
        title: 'Lịch trình công việc',
        messages: [
            { message: 'Lịch họp tuần này thế nào?', sender: 'user' },
            { message: 'Bạn có 3 cuộc họp vào sáng thứ 3, 5 và 6.', sender: 'Gobot' },
        ],
    },
    {
        id: 9,
        title: 'Mã khuyến mãi',
        messages: [
            { message: 'Có mã giảm giá nào cho Lazada?', sender: 'user' },
            { message: 'Mã XMAS20 giảm 20%.', sender: 'Gobot' },
        ],
    },
    {
        id: 10,
        title: 'Tư vấn dinh dưỡng',
        messages: [
            { message: 'Gợi ý bữa tối healthy?', sender: 'user' },
            { message: 'Salad cá hồi và rau xanh nhé.', sender: 'Gobot' },
        ],
    },
    {
        id: 11,
        title: 'Học lập trình',
        messages: [
            { message: 'Nên học React hay Vue?', sender: 'user' },
            { message: 'React phổ biến, Vue đơn giản học nhanh.', sender: 'Gobot' },
        ],
    },
    {
        id: 12,
        title: 'Giữ sức khỏe',
        messages: [
            { message: 'Tập thể dục mỗi ngày như thế nào?', sender: 'user' },
            { message: 'Chạy bộ 30 phút buổi sáng.', sender: 'Gobot' },
        ],
    },
    {
        id: 13,
        title: 'Lập kế hoạch tài chính',
        messages: [
            { message: 'Làm sao tiết kiệm tiền hiệu quả?', sender: 'user' },
            { message: 'Áp dụng quy tắc 50/30/20.', sender: 'Gobot' },
        ],
    },
];

function Gobot() {
    const [messages, setMessages] = useState(fakeChatHistory[0].messages);
    const [isTyping, setIsTyping] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const [chatHistory, setChatHistory] = useState(fakeChatHistory);
    const [activeChatId, setActiveChatId] = useState(fakeChatHistory[0].id);

    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowChat(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleSend = (text) => {
        const newMsgs = [...messages, { message: text, sender: 'user' }];
        setMessages(newMsgs);
        setIsTyping(true);
        setChatHistory((h) => h.map((c) => (c.id === activeChatId ? { ...c, messages: newMsgs } : c)));
        setTimeout(() => {
            const botReply = { message: 'Hehe', sender: 'Gobot' };
            setMessages((prev) => [...prev, botReply]);
            setChatHistory((h) =>
                h.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, botReply] } : c)),
            );
            setIsTyping(false);
        }, 1500);
    };

    const handleSelectChat = (id) => {
        const sel = chatHistory.find((c) => c.id === id);
        if (sel) {
            setMessages(sel.messages);
            setActiveChatId(id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            {!showChat ? (
                <div className={cx('intro')}>
                    <img src="/ai-img.png" alt="Gobot" className={cx('intro-icon')} />
                    <AIChatPageIntro text=" Xin chào, tôi là Gobot!" />
                </div>
            ) : (
                <>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className={cx('chat-wrapper')}
                    >
                        <div className={cx('header')}>
                            <Button
                                type="text"
                                icon={<MenuOutlined />}
                                className={cx('menu-button')}
                                onClick={() => setIsDrawerVisible(true)}
                            />
                            <h1 className={cx('title')}>Gobot-AI</h1>
                        </div>
                        <ChatContainer className={cx('chat-container')}>
                            <MessageList
                                className={cx('message-list')}
                                typingIndicator={
                                    isTyping ? <TypingIndicator color="black" content="Gobot đang nghĩ..." /> : null
                                }
                            >
                                {messages.map((msg, i) => (
                                    <div
                                        key={i}
                                        className={cx('message-wrapper', msg.sender === 'Gobot' ? 'gobot' : 'user')}
                                    >
                                        {msg.sender === 'Gobot' && (
                                            <img src="/ai-img.png" alt="Gobot" className={cx('avatar')} />
                                        )}
                                        <Message
                                            model={{
                                                message: msg.message,
                                                sentTime: 'just now',
                                                sender: msg.sender,
                                                direction: msg.sender === 'user' ? 'outgoing' : 'incoming',
                                                position: 'single',
                                            }}
                                        />
                                    </div>
                                ))}
                            </MessageList>

                            <MessageInput
                                className={cx('message-input')}
                                placeholder="Nói cho Gobot biết mong muốn của bạn đi..."
                                onSend={handleSend}
                            />
                        </ChatContainer>
                    </motion.div>

                    <Drawer
                        title="Lịch sử trò chuyện"
                        placement="left"
                        closable
                        onClose={() => setIsDrawerVisible(false)}
                        visible={isDrawerVisible}
                        styles={{ body: { padding: 0 } }}
                    >
                        <ChatHistorySidebar
                            chats={chatHistory}
                            activeChatId={activeChatId}
                            onSelectChat={(id) => {
                                handleSelectChat(id);
                                setIsDrawerVisible(false);
                            }}
                            onNewChat={() => setIsDrawerVisible(false)}
                        />
                    </Drawer>
                </>
            )}
        </motion.div>
    );
}

export default Gobot;
