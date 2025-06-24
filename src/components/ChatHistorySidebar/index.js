// src/components/ChatHistorySidebar.jsx
import React from 'react';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import classNames from 'classnames/bind';
import styles from './ChatHistorySidebar.module.scss';

const cx = classNames.bind(styles);

export default function ChatHistorySidebar({ chats = [], activeChatId, onSelectChat, onNewChat }) {
    return (
        <aside className={cx('sidebar')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Thêm cuộc trò chuyện mới</h3>

                <Button type="dashed" danger icon={<PlusOutlined />} size="small" onClick={onNewChat} />
            </div>
            <ul className={cx('list')}>
                {chats.map((chat) => (
                    <li
                        key={chat.id}
                        className={cx('item', { active: chat.id === activeChatId })}
                        onClick={() => onSelectChat(chat.id)}
                    >
                        {chat.title}
                    </li>
                ))}
            </ul>
        </aside>
    );
}
