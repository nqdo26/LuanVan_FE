// src/pages/Gobot.jsx
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Drawer, Button, Select } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';

import styles from './Gobot.module.scss';
import AIChatPageIntro from '~/components/AIChatPageIntro';
import ChatHistorySidebar from '~/components/ChatHistorySidebar';
import { getCitiesApi, chatWithRAGApi } from '~/utils/api';

const cx = classNames.bind(styles);

const fakeChatHistory = [
    {
        id: 1,
        title: 'Chat khởi động',
        messages: [{ message: 'Chào bạn! Tôi là Gobot...', sender: 'Gobot' }],
    },
];

function Gobot() {
    const [messages, setMessages] = useState(fakeChatHistory[0].messages);
    const [isTyping, setIsTyping] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatHistory, setChatHistory] = useState(fakeChatHistory);
    const [activeChatId, setActiveChatId] = useState(fakeChatHistory[0].id);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowChat(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setCitiesLoading(true);
                const response = await getCitiesApi();

                if (response && response.EC === 0) {
                    setCities(
                        response.data.map((city) => ({
                            label: city.name,
                            value: city._id, // luôn dùng _id làm cityId
                        })),
                    );
                }
            } catch (error) {
            } finally {
                setCitiesLoading(false);
            }
        };
        fetchCities();
    }, []);

    // cityId mặc định lấy từ cities[0] nếu có, hoặc bạn có thể lưu state cityId khi chọn
    const [selectedCityId, setSelectedCityId] = useState(null);

    const handleSend = async (text) => {
        const newMsgs = [...messages, { message: text, sender: 'user' }];
        setMessages(newMsgs);
        setIsTyping(true);
        setChatHistory((h) => h.map((c) => (c.id === activeChatId ? { ...c, messages: newMsgs } : c)));

        try {
            // cityId chỉ gửi nếu đã chọn thành phố, nếu không thì bỏ khỏi payload
            const payload = {
                messages: newMsgs.map((m) => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.message,
                })),
                isUseKnowledge: true,
            };
            if (selectedCityId) {
                payload.cityId = selectedCityId;
            }
            console.log('Payload gửi đi:', payload);
            const res = await chatWithRAGApi(payload);
            const botMsg = res?.choices?.[0]?.message?.content || 'Xin lỗi, Gobot không trả lời được.';
            const botReply = { message: botMsg, sender: 'Gobot' };
            setMessages((prev) => [...prev, botReply]);
            setChatHistory((h) =>
                h.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, botReply] } : c)),
            );
        } catch (e) {
            const botReply = { message: 'Có lỗi xảy ra khi kết nối Gobot.', sender: 'Gobot' };
            setMessages((prev) => [...prev, botReply]);
            setChatHistory((h) =>
                h.map((c) => (c.id === activeChatId ? { ...c, messages: [...c.messages, botReply] } : c)),
            );
        } finally {
            setIsTyping(false);
        }
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
                            <div className={cx('header-inner')}>
                                <Button
                                    type="text"
                                    icon={<MenuOutlined />}
                                    className={cx('menu-button')}
                                    onClick={() => setIsDrawerVisible(true)}
                                />
                                <h1 className={cx('title')}>Gobot-AI</h1>

                                <div className={cx('header-select')}>
                                    <Select
                                        placeholder="Chọn thành phố"
                                        style={{ width: 160, marginLeft: 'auto' }}
                                        options={cities}
                                        loading={citiesLoading}
                                        value={selectedCityId}
                                        onChange={(value) => setSelectedCityId(value)}
                                    />
                                </div>
                            </div>
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
                                            className={cx(msg.sender === 'user' ? 'user-message' : 'ai-message')}
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
