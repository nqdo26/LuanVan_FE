import React from 'react';
import { Modal, Image, Card } from 'antd';
import classNames from 'classnames/bind';
import styles from './GalleryModal.module.scss';

const cx = classNames.bind(styles);

function GalleryModal({ detinationName, visible, onClose, categories, selectedCategory, setSelectedCategory }) {
    const selectedImages = categories.find((cat) => cat.key === selectedCategory)?.images || [];

    return (
        <Modal open={visible} onCancel={onClose} footer={null} className={cx('gallery-modal')} width={1000}>
            <div className={cx('modal-container')}>
                <div className={cx('modal-header')}>
                    <h2>{detinationName}</h2>
                </div>
                <div className={cx('modal-body')}>
                    <div className={cx('modal-sidebar')}>
                        {categories.map((category) => (
                            <Card
                                key={category.key}
                                onClick={() => setSelectedCategory(category.key)}
                                className={cx('sidebar-card', { active: selectedCategory === category.key })}
                                styles={{ body: { padding: 0 } }}
                            >
                                <Image preview={false} src={category.images[0]} className={cx('sidebar-image')} />
                                <div className={cx('sidebar-info')}>
                                    <span className={cx('sidebar-label')}>{category.label}</span>
                                    <span className={cx('sidebar-count')}>{category.images.length}</span>
                                </div>
                            </Card>
                        ))}
                    </div>

                    <div className={cx('modal-content')}>
                        <Image.PreviewGroup>
                            <div className={cx('image-grid')}>
                                {selectedImages.map((img, index) => (
                                    <Image  key={index} src={img} alt="Gallery Image" className={cx('gallery-image')} />
                                ))}
                            </div>
                        </Image.PreviewGroup>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default GalleryModal;
