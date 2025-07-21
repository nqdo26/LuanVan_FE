// src/components/ChatHistorySidebar.jsx
import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './ChatHistorySidebar.module.scss';
import { Trash2 } from 'lucide-react';

const cx = classNames.bind(styles);

export default function ChatHistorySidebar({ chats = [], activeChatId, onSelectChat, onNewChat, handleDeleteChat }) {
    return (
        <aside className={cx('sidebar')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Thêm cuộc trò chuyện mới</h3>

                <Button
                    className={cx('new-chat-button')}
                    type="dashed"
                    danger
                    icon={<PlusOutlined className={cx('icon')} />}
                    size="small"
                    onClick={onNewChat}
                />
            </div>
            <ul className={cx('list')}>
                {chats.map((chat) => (
                    <li
                        key={chat._id}
                        className={cx('item', { active: chat._id === activeChatId })}
                        onClick={() => onSelectChat(chat._id)}
                    >
                        {chat.title}

                        <Trash2
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteChat(chat._id);
                            }}
                            size={16}
                            className={cx('delete-icon')}
                        />
                    </li>
                ))}
            </ul>
        </aside>
    );
}
