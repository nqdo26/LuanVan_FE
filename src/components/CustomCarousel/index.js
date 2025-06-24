import classNames from 'classnames/bind';
import { motion } from "framer-motion";
import { Carousel } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import CustomArrow from '../CustomArrow'; 
import styles from './Carousel.module.scss';

const cx = classNames.bind(styles);

function CustomCarousel({ title, card, number }) {
    const items = Array.from({ length: 8 }, (_, index) => ({
        id: index + 1,
    }));

    return (
        <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
         >
            <div className={cx('wrapper')}>
                <h2 className={cx('title')}>{title}</h2>
                <div className={cx('Custom')}>
                    <Carousel
                        slidesToShow={number}  
                        slidesToScroll={1}
                        centerMode={true}
                        arrows
                        dots={false}
                        prevArrow={<CustomArrow className={cx('prevArrow')} icon={<LeftOutlined />} />}
                        nextArrow={<CustomArrow className={cx('nextArrow')} icon={<RightOutlined />} />}
                        responsive={[
                            { breakpoint: 1600, settings: { slidesToShow: 3, slidesToScroll: 1 } }, 
                            { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } }, 
                            { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },  
                        ]}
                    >

                        {items.map((doc) => (
                            <div key={doc.id} className={cx('carousel-items')}>
                                {card}
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
    </motion.div>


      
    );
}

export default CustomCarousel;