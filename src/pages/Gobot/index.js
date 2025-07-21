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
import { getCitiesApi, chatWithRAGApi, createNewChat, getChatHistoryApi, getChatByIdApi } from '~/utils/api';
import { useContext } from 'react';
import { AuthContext } from '~/components/Context/auth.context';

const cx = classNames.bind(styles);

// Không dùng fakeChatHistory nữa

function Gobot() {
    const { auth } = useContext(AuthContext);
    const [isTyping, setIsTyping] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [chatHistory, setChatHistory] = useState([]);
    const [activeChatId, setActiveChatId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    const [cities, setCities] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);

    useEffect(() => {
        const initChat = async () => {
            setShowChat(false);
            if (!auth || !auth.user || !(auth.user._id || auth.user.id)) return;
            const userId = auth.user._id || auth.user.id;
            // Luôn tạo mới 1 chat khi vào trang
            const newChat = await createNewChat({ userId });
            let chatObj = newChat?.data;
            // Sau khi tạo mới, lấy lại toàn bộ lịch sử chat
            const res = await getChatHistoryApi(userId);
            let chats = res?.data || [];
            // Đảm bảo chat mới luôn ở đầu danh sách
            if (chatObj) {
                chats = [chatObj, ...chats.filter((c) => c._id !== chatObj._id)];
            }
            setChatHistory(chats);
            if (chatObj) {
                const helloMsg = { message: 'Hello! Tôi là Gobot, bạn cần hỗ trợ gì?', sender: 'Gobot' };
                setActiveChatId(chatObj._id);
                setMessages([helloMsg]);
            } else {
                setActiveChatId(null);
                setMessages([]);
            }
            setShowChat(true);
        };
        initChat();
        // eslint-disable-next-line
    }, [auth]);

    useEffect(() => {
        const fetchCities = async () => {
            try {
                setCitiesLoading(true);
                const response = await getCitiesApi();

                if (response && response.EC === 0) {
                    setCities(
                        response.data.map((city) => ({
                            label: city.name,
                            value: city._id,
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

    const [selectedCityId, setSelectedCityId] = useState(null);

    const handleSend = async (text) => {
        if (!activeChatId) return;
        const newMsgs = [...messages, { message: text, sender: 'user' }];
        setMessages(newMsgs);
        setIsTyping(true);
        try {
            const payload = {
                messages: newMsgs.map((m) => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.message,
                })),
                isUseKnowledge: true,
                chatId: activeChatId,
            };
            if (selectedCityId) payload.cityId = selectedCityId;
            if (auth && auth.user && (auth.user._id || auth.user.id)) payload.userId = auth.user._id || auth.user.id;
            const res = await chatWithRAGApi(payload);
            const botMsg = res?.choices?.[0]?.message?.content || 'Xin lỗi, Gobot không trả lời được.';
            const botReply = { message: botMsg, sender: 'Gobot' };
            const updatedMsgs = [...newMsgs, botReply];
            setMessages(updatedMsgs);
            // Cập nhật lại chatHistory
            setChatHistory((prev) =>
                prev.map((c) =>
                    c._id === activeChatId
                        ? {
                              ...c,
                              messages: [
                                  ...(c.messages || []),
                                  { role: 'user', content: text },
                                  { role: 'assistant', content: botMsg },
                              ],
                          }
                        : c,
                ),
            );
        } catch (e) {
            const botReply = { message: 'Có lỗi xảy ra khi kết nối Gobot.', sender: 'Gobot' };
            setMessages((prev) => [...prev, botReply]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSelectChat = async (id) => {
        setActiveChatId(id);
        try {
            const res = await getChatByIdApi(id);
            const chat = res?.data;
            setMessages(
                chat?.messages?.map((m) => ({ message: m.content, sender: m.role === 'user' ? 'user' : 'Gobot' })) ||
                    [],
            );
        } catch (e) {
            setMessages([]);
        }
    };

    // Xóa chat
    const handleDeleteChat = async (chatId) => {
        if (!auth || !auth.user || !(auth.user._id || auth.user.id)) return;

        try {
            await import('~/utils/api').then(({ deleteChat }) => deleteChat(chatId));
            setChatHistory((prev) => prev.filter((c) => c._id !== chatId));

            setTimeout(() => {
                setChatHistory((prev) => {
                    if (prev.length === 0) {
                        setActiveChatId(null);
                        setMessages([]);
                        return prev;
                    }
                    if (chatId === activeChatId) {
                        setActiveChatId(prev[0]._id);
                        handleSelectChat(prev[0]._id);
                    }
                    return prev;
                });
            }, 0);
        } catch (e) {}
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
                            onNewChat={async () => {
                                // Tạo chat mới
                                if (!auth || !auth.user || !(auth.user._id || auth.user.id)) return;
                                const userId = auth.user._id || auth.user.id;
                                const newChat = await createNewChat({ userId });
                                if (newChat?.data) {
                                    setChatHistory((prev) => [newChat.data, ...prev]);
                                    setActiveChatId(newChat.data._id);
                                    const helloMsg = {
                                        message: 'Hello! Tôi là Gobot, bạn cần hỗ trợ gì?',
                                        sender: 'Gobot',
                                    };
                                    setMessages([helloMsg]);
                                }
                                setIsDrawerVisible(false);
                            }}
                            handleDeleteChat={handleDeleteChat}
                        />
                    </Drawer>
                </>
            )}
        </motion.div>
    );
}

export default Gobot;
