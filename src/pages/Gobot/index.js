import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Drawer, Button, Select } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import styles from './Gobot.module.scss';
import AIChatPageIntro from '~/components/AIChatPageIntro';
import ChatHistorySidebar from '~/components/ChatHistorySidebar';

import {
    getCitiesApi,
    chatWithRAGApi,
    createNewChat,
    getChatHistoryApi,
    getChatByIdApi,
    getChatCompletionApi,
} from '~/utils/api';
import { useContext } from 'react';
import { AuthContext } from '~/components/Context/auth.context';
import RobotDestList from '~/components/RobotDestList';

const cx = classNames.bind(styles);

const MarkdownMessage = ({ content }) => {
    return <ReactMarkdown remarkPlugins={[remarkGfm]} children={content} />;
};

function Gobot() {
    const navigate = useNavigate();
    const { chat_id } = useParams();
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

            const res = await getChatHistoryApi(userId);
            let chats = res?.data || [];
            setChatHistory(chats);

            if (chat_id && chats.some((c) => c._id === chat_id)) {
                setActiveChatId(chat_id);

                let messagesLoaded = false;

                try {
                    const completionRes = await getChatCompletionApi(chat_id);

                    const chatWithDestinations = completionRes?.data?.data;

                    if (chatWithDestinations?.messages && chatWithDestinations.messages.length > 0) {
                        const messagesWithDestinations = chatWithDestinations.messages.map((m) => {
                            const processedDestinations = (m.destinations || []).map((dest) => {
                                if (typeof dest === 'string') {
                                    return { _id: dest, name: null };
                                } else if (dest && typeof dest === 'object') {
                                    return {
                                        _id: dest._id || dest.id,
                                        name: dest.name || dest.title,
                                        location: dest.location,
                                    };
                                }
                                return dest;
                            });

                            return {
                                message: m.content,
                                sender: m.role === 'user' ? 'user' : 'Gobot',
                                destinations: processedDestinations,
                            };
                        });
                        setMessages(messagesWithDestinations);

                        const destinationCount = messagesWithDestinations.filter(
                            (msg) => msg.destinations && msg.destinations.length > 0,
                        ).length;
                        console.log(
                            `📍 Initial load with destinations: ${destinationCount} messages have destinations`,
                        );
                        messagesLoaded = true;
                    }
                } catch (completionError) {
                    console.error('⚠️ getChatCompletionApi failed during init:', completionError);
                    console.log('🔄 Falling back to basic loading...');
                }

                if (!messagesLoaded) {
                    const chat = chats.find((c) => c._id === chat_id);

                    const chatMsgs =
                        chat?.messages?.map((m) => {
                            const processedDestinations = (m.destinations || []).map((dest) => {
                                if (typeof dest === 'string') {
                                    return { _id: dest, name: null };
                                } else if (dest && typeof dest === 'object') {
                                    return {
                                        _id: dest._id || dest.id,
                                        name: dest.name || dest.title,
                                        location: dest.location,
                                    };
                                }
                                return dest;
                            });

                            return {
                                message: m.content,
                                sender: m.role === 'user' ? 'user' : 'Gobot',

                                destinations: processedDestinations,
                            };
                        }) || [];

                    if (chatMsgs.length === 0) {
                        setMessages([
                            {
                                message:
                                    '👋 Xin chào! Tôi là Gobot – trợ lý du lịch của bạn đây 😎. Bạn muốn khám phá địa điểm nào hôm nay? 😄✨',
                                sender: 'Gobot',
                                destinations: [],
                            },
                        ]);
                    } else {
                        setMessages(chatMsgs);
                        console.log(`📄 Initial load with basic chat: ${chatMsgs.length} messages`);
                    }
                }
            } else {
                const newChat = await createNewChat({ userId });
                let chatObj = newChat?.data;
                if (chatObj) {
                    chats = [chatObj, ...chats.filter((c) => c._id !== chatObj._id)];
                    setChatHistory(chats);
                    setActiveChatId(chatObj._id);
                    setMessages([
                        {
                            message:
                                '👋 Xin chào! Tôi là Gobot – trợ lý du lịch của bạn đây 😎. Bạn muốn khám phá địa điểm nào hôm nay? 😄✨',
                            sender: 'Gobot',
                            destinations: [],
                        },
                    ]);

                    navigate(`/gobot-assistant/${chatObj._id}`, { replace: true });
                } else {
                    setActiveChatId(null);
                    setMessages([
                        {
                            message:
                                '👋 Xin chào! Tôi là Gobot – trợ lý du lịch của bạn đây 😎. Bạn muốn khám phá địa điểm nào hôm nay? 😄✨',
                            sender: 'Gobot',
                            destinations: [],
                        },
                    ]);
                }
            }
            setShowChat(true);
        };
        initChat();
        // eslint-disable-next-line
    }, [auth, chat_id]);

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

    const handleDestinationClick = (slugOrId) => {
        if (slugOrId) {
            window.open(`/destination/${slugOrId}`, '_blank');
        }
    };

    const handleSend = async (text) => {
        if (!activeChatId) {
            console.error('❌ No active chat ID');
            return;
        }

        if (activeChatId && chat_id !== activeChatId) {
            navigate(`/gobot-assistant/${activeChatId}`, { replace: true });
        }

        const capitalizeFirst = (str) => (str && str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : str);
        const userMsg = capitalizeFirst(text);
        const newMsgs = [...messages, { message: userMsg, sender: 'user', destinations: [] }];
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
            const destinations = res?.choices?.[0]?.message?.destinations || [];

            const formattedDestinations = destinations.map((dest) => {
                return {
                    _id: dest.destinationId,
                    name: dest.name || `Địa điểm ${dest.destinationId}`,
                    location: { address: dest.text || '' },
                };
            });

            const botReply = {
                message: botMsg,
                sender: 'Gobot',
                destinations: formattedDestinations,
            };

            const updatedMsgs = [...newMsgs, botReply];
            setMessages(updatedMsgs);

            setChatHistory((prev) =>
                prev.map((c) =>
                    c._id === activeChatId
                        ? {
                              ...c,
                              messages: [
                                  ...(c.messages || []),
                                  { role: 'user', content: userMsg },
                                  { role: 'assistant', content: botMsg, destinations: formattedDestinations },
                              ],
                          }
                        : c,
                ),
            );
        } catch (e) {
            const botReply = {
                message: 'Có lỗi xảy ra khi kết nối Gobot.',
                sender: 'Gobot',
                destinations: [],
            };
            setMessages((prev) => [...prev, botReply]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSelectChat = async (id) => {
        setActiveChatId(id);
        navigate(`/gobot-assistant/${id}`);

        let messagesLoaded = false;

        try {
            const completionRes = await getChatCompletionApi(id);
            const chatWithDestinations = completionRes?.data?.data;

            if (chatWithDestinations?.messages) {
                const messagesWithDestinations = chatWithDestinations.messages.map((m) => {
                    const processedDestinations = (m.destinations || []).map((dest) => {
                        if (typeof dest === 'string') {
                            return { _id: dest, name: null };
                        } else if (dest && typeof dest === 'object') {
                            return {
                                _id: dest._id || dest.id,
                                name: dest.name || dest.title,
                                location: dest.location,
                            };
                        }
                        return dest;
                    });

                    return {
                        message: m.content,
                        sender: m.role === 'user' ? 'user' : 'Gobot',
                        destinations: processedDestinations,
                    };
                });
                setMessages(messagesWithDestinations);

                const destinationCount = messagesWithDestinations.filter(
                    (msg) => msg.destinations && msg.destinations.length > 0,
                ).length;

                messagesLoaded = true;
            }
        } catch (completionError) {
            console.log('⚠️ getChatCompletionApi failed, falling back to basic chat loading');
        }

        // Fallback: load basic chat nếu completion API fail hoặc không có messages
        if (!messagesLoaded) {
            try {
                const res = await getChatByIdApi(id);
                const chat = res?.data;
                const basicMessages =
                    chat?.messages?.map((m) => {
                        // Chuyển đổi destinations nếu chúng là plain strings thành objects
                        const processedDestinations = (m.destinations || []).map((dest) => {
                            if (typeof dest === 'string') {
                                // Nếu destination là string ID, tạo object với _id và name sẽ được fetch sau
                                return { _id: dest, name: null };
                            } else if (dest && typeof dest === 'object') {
                                // Nếu đã là object, đảm bảo có _id hoặc id
                                return {
                                    _id: dest._id || dest.id,
                                    name: dest.name || dest.title,
                                    location: dest.location,
                                    rating: dest.statistics?.averageRating || 0,
                                };
                            }
                            return dest;
                        });

                        return {
                            message: m.content,
                            sender: m.role === 'user' ? 'user' : 'Gobot',
                            // Giữ destinations nếu có trong basic chat data
                            destinations: processedDestinations,
                        };
                    }) || [];

                setMessages(basicMessages);
            } catch (e) {
                console.error('Both APIs failed:', e);
                setMessages([]);
            }
        }
    };

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
                                        <div className={cx('message-content')}>
                                            <div className={cx(msg.sender === 'user' ? 'user-message' : 'ai-message')}>
                                                <MarkdownMessage content={msg.message} />
                                            </div>

                                            {msg.sender === 'Gobot' &&
                                                msg.destinations &&
                                                msg.destinations.length > 0 && (
                                                    <div className={cx('destinations-wrapper')}>
                                                        <div className={cx('destinations-title')}>
                                                            Địa điểm liên quan:
                                                        </div>
                                                        <RobotDestList
                                                            destinations={msg.destinations}
                                                            onDestinationClick={handleDestinationClick}
                                                        />
                                                    </div>
                                                )}
                                        </div>
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
                                if (!auth || !auth.user || !(auth.user._id || auth.user.id)) return;
                                const userId = auth.user._id || auth.user.id;
                                const newChat = await createNewChat({ userId });
                                if (newChat?.data) {
                                    setChatHistory((prev) => [newChat.data, ...prev]);
                                    setActiveChatId(newChat.data._id);
                                    setMessages([
                                        {
                                            message:
                                                '👋 Xin chào! Tôi là Gobot – trợ lý du lịch của bạn đây 😎. Bạn muốn khám phá địa điểm nào hôm nay? 😄✨',
                                            sender: 'Gobot',
                                            destinations: [],
                                        },
                                    ]);
                                    navigate(`/gobot-assistant/${newChat.data._id}`);
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
