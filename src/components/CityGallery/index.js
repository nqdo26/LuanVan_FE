import { useState } from 'react';
import classNames from 'classnames/bind';
import { Carousel, Image, Modal } from 'antd';
import { CameraOutlined } from '@ant-design/icons';
import styles from './CityGallery.module.scss';

const cx = classNames.bind(styles);

function CityGallery({
    city = {
        title: 'Hà Nội',
        description:
            'Hà Nội, thủ đô của Việt Nam,  một thành phố của truyền thống và lịch sử  một thành phố của truyền thống và lịch sử  một thành phố của truyền thống và lịch sử  một thành phố của truyền thống và lịch sử  một thành phố của truyền thống và lịch sử  một thành phố của truyền thống và lịch sử  một thành phố của truyền thống và lịch sử',
        time: 'THG 1 - THG 2',
        duration: '3 ngày',
        images: ['/wimi1-img.png', '/wimi2-img.png', '/wimi3-img.png', '/wimi4-img.png'],
    },
}) {
    const [currentBg, setCurrentBg] = useState(city.images[0]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleBeforeChange = (from, to) => {
        setCurrentBg(city.images[to]);
    };

    const handleOpenModal = () => {
        setIsModalVisible(true);
    };

    const handleCloseModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div
            className={cx('wrapper')}
            style={{
                backgroundImage: `url(${currentBg})`,
            }}
        >
            <div className={cx('inner')}>
                <div className={cx('content')}>
                    <h1 className={cx('title')}>{city.title}</h1>
                    <p className={cx('description')}>{city.description}</p>
                    <s className={cx('show-more')}>Xem thêm</s>

                    <div className={cx('best-time')}>
                        <div className={cx('item')}>
                            <p className={cx('time-title')}>Thời gian tuyệt nhất để đến</p>
                            <p>{city.time}</p>
                        </div>
                        <div className={cx('item')}>
                            <p className={cx('time-title')}>Thời lượng lý tưởng</p>
                            <p>{city.duration}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('carousel')}>
                    <Carousel
                        arrows
                        autoplay
                        autoplaySpeed={3000}
                        dots
                        className={cx('carousel-inner')}
                        beforeChange={handleBeforeChange}
                    >
                        {city.images.map((src, index) => (
                            <div key={index} className={cx('carousel-item')}>
                                <img src={src} alt={`city-${index}`} className={cx('carousel-image')} />
                            </div>
                        ))}
                    </Carousel>
                    <div className={cx('carousel-footer')} onClick={handleOpenModal}>
                        <CameraOutlined style={{ fontSize: '20px', color: 'white' }} />
                        <span>Thư viện</span>
                    </div>
                </div>
            </div>

            <Modal visible={isModalVisible} onCancel={handleCloseModal} footer={null} width={800}>
                <div className={cx('modal-header')}>
                    <h1 className={cx('modal-title')}>{city.title}</h1>
                </div>
                <div className={cx('modal-gallery')}>
                    <Image.PreviewGroup>
                        {city.images.map((src, index) => (
                            <div key={index} className={cx('modal-image')}>
                                <Image src={src} alt={`city-image-${index}`} className={cx('modal-image-item')} />
                            </div>
                        ))}
                    </Image.PreviewGroup>
                </div>
            </Modal>
        </div>
    );
}

export default CityGallery;
