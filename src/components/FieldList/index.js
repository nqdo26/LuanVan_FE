import React from 'react';
import classNames from 'classnames/bind';
import styles from './FieldList.module.scss';
import { Plus } from 'lucide-react';

const cx = classNames.bind(styles);

function FieldList({ label, value, newValue, onAdd, onRemove, onInput }) {
    return (
        <div className={cx('form-group')}>
            <label className={cx('title')}>{label}</label>
            <div className={cx('dynamic-list')}>
                {value.map((item, idx) => (
                    <div className={cx('dynamic-item')} key={idx}>
                        <span>{item}</span>
                        <span className={cx('remove')} onClick={() => onRemove(idx)}>
                            ×
                        </span>
                    </div>
                ))}
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <input
                        value={newValue}
                        onChange={onInput}
                        placeholder={`Thêm ${label.toLowerCase()}...`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                onAdd();
                            }
                        }}
                        className={cx('input-add')}
                        style={{ flex: 1 }}
                    />
                    <button type="button" className={cx('add-btn')} onClick={onAdd}>
                        <Plus />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default FieldList;
