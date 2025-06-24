import React from 'react';
import classNames from 'classnames/bind';
import styles from './AlbumUploader.module.scss';
import { X } from 'lucide-react';

const cx = classNames.bind(styles);

function AlbumUploader({ label, files, onAdd, onRemove }) {
    const id = React.useId();
    const maxFiles = 5;
    const canAdd = files.length < maxFiles;

    const handleAdd = (selectedFiles) => {
        const left = maxFiles - files.length;
        if (left <= 0) return;
        const filesToAdd = selectedFiles.slice(0, left);
        onAdd(filesToAdd);
    };

    return (
        <div className={cx('album-box')}>
            <div className={cx('album-label')}>
                {label} <span className={cx('album-count')}>({files.length}/5)</span>
            </div>
            <input
                type="file"
                accept="image/*"
                multiple
                disabled={!canAdd}
                onChange={(e) => handleAdd(Array.from(e.target.files))}
                className={cx('album-input')}
                id={id}
                style={{ display: 'none' }}
            />
            <label
                htmlFor={id}
                className={cx('album-add-btn', !canAdd && 'disabled')}
                style={{ pointerEvents: canAdd ? 'auto' : 'none', opacity: canAdd ? 1 : 0.6 }}
                tabIndex={canAdd ? 0 : -1}
            >
                + Thêm ảnh
            </label>
            {!canAdd && <div className={cx('album-limit-msg')}>Tối đa 5 ảnh</div>}
            <div className={cx('album-preview')}>
                {files.map((img, idx) => (
                    <div className={cx('album-thumb')} key={idx}>
                        <img src={typeof img === 'string' ? img : URL.createObjectURL(img)} alt="" />
                        <span className={cx('remove')} onClick={() => onRemove(idx)}>
                            <X size={16} />
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AlbumUploader;
