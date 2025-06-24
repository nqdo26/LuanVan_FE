import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChatContainer, MessageList, Message, MessageInput, TypingIndicator } from '@chatscope/chat-ui-kit-react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import classNames from 'classnames/bind';

import styles from './Gobot.module.scss';
import AIChatPageIntro from '~/components/AIChatPageIntro';
const cx = classNames.bind(styles);

function Gobot() {
    const [messages, setMessages] = useState([
        {
            message: 'Chào bạn! Tôi là Gobot, trợ lý du lịch của bạn. Bạn muốn đi đâu hôm nay?',
            sender: 'Gobot',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowChat(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    const handleSend = (message) => {
        const newMessages = [...messages, { message, sender: 'user' }];
        setMessages(newMessages);
        setIsTyping(true);
        setTimeout(() => {
            setMessages((prev) => [...prev, { message: `Con cặc đéo`, sender: 'Gobot' }]);
            setIsTyping(false);
        }, 1500);
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
                    <AIChatPageIntro AIChatPageIntro text=" Xin chào, tôi là Gobot!" />
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className={cx('chat-wrapper')}
                >
                    <div className={cx('header')}>
                        <h1 className={cx('title')}>Gobot-AI</h1>
                    </div>
                    <ChatContainer className={cx('chat-container')}>
                        <MessageList
                            className={cx('message-list')}
                            typingIndicator={
                                isTyping ? (
                                    <TypingIndicator
                                        color="black"
                                        className={cx('hehe')}
                                        content="Gobot đang nghĩ..."
                                    />
                                ) : null
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
            )}
        </motion.div>
    );
}

export default Gobot;
