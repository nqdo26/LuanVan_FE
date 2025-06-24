import React, { useState } from 'react';
import { Card, Image} from 'antd';
import classNames from 'classnames/bind';
import styles from './DestinationGallery.module.scss';
import { CameraOutlined } from '@ant-design/icons';
import GalleryModal from '../GalleryModal';

const cx = classNames.bind(styles);

const DestinationGallery = ({ type }) => {
    const [visible, setVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('all');

    const showAlbum = (category) => {
        setSelectedCategory('all');
        setVisible(true);
    };

    const categories = [
        { key: 'all', label: 'Tất cả', images: ['/wimi2-img.png', '/wimi3-img.png', '/wimi4-img.png'] },
        { key: 'space', label: 'Không gian', images: ['/wimi2-img.png'] },
        { key: 'food', label: 'Ẩm thực', images: ['/wimi3-img.png'] },
        {
            key: 'menu',
            label: type === 'restaurant' ? 'Thực đơn' : 'Nổi bật',
            images: [type === 'restaurant' ? '/wimi1-img.png' : '/wimi4-img.png'],
        },
    ];

    return (
        <div className={cx('gallery-container')}>
            <div className={cx('main-image-container')}>
                <Card
                    styles={{ body: { display: 'contents' } }}
                    onClick={() => showAlbum({ src: '/wimi3-img.png', label: 'Thư viện' })}
                    className={cx('main-image-card')}
                >
                    <Image preview={false} src="/wimi3-img.png" alt="Main View" className={cx('main-image')} />
                    <div className={cx('image-overlay')}>
                        <CameraOutlined className={cx('image-icon')} />
                        <span className={cx('image-count')}>50</span>
                    </div>
                </Card>
            </div>

            <div className={cx('category-container')}>
                {categories
                    .filter((item) => item.key !== 'all')
                    .map((item, index) => (
                        <Card
                            styles={{ body: { display: 'contents' } }}
                            onClick={() => showAlbum(item)}
                            key={index}
                            className={cx('category-card')}
                        >
                            <Image
                                preview={false}
                                src={item.images[0]}
                                alt={item.label}
                                className={cx('category-image')}
                            />
                            <div className={cx('category-overlay')}>
                                <span className={cx('category-label')}>{item.label}</span>
                                <span className={cx('category-count')}>{item.images.length}</span>
                            </div>
                        </Card>
                    ))}
            </div>

            <GalleryModal
                detinationName= "Wimi-Factory"
                visible={visible}
                onClose={() => setVisible(false)}
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />
        </div>
    );
};

export default DestinationGallery;
