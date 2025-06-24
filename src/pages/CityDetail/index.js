import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './CityDetail.module.scss';
import CityGallery from '~/components/CityGallery';
import CustomNav from '~/components/CustomNav';
import WeatherInfo from '~/components/WeatherInfo';
import CitySideBar from '~/components/CitySideBar';
import ResultSorter from '~/components/ResultSorter';
import DestinationCard from '~/components/DestinationCard';
import { List } from 'antd';

const cx = classNames.bind(styles);

const destinations = [
    { id: 1, title: 'Destination 1' },
    { id: 2, title: 'Destination 2' },
    { id: 3, title: 'Destination 3' },
    { id: 4, title: 'Destination 4' },
    { id: 5, title: 'Destination 5' },
    { id: 6, title: 'Destination 6' },
    { id: 7, title: 'Destination 7' },
    { id: 8, title: 'Destination 8' },
    { id: 9, title: 'Destination 9' },
];

function CityDetail() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('header')}>
                    <CityGallery />
                </div>
                <div className={cx('body')}>
                    <div className={cx('nav')}>
                        <CustomNav />
                    </div>
                    <h1 className={cx('title')}>Vài nét về Hà Nội</h1>
                    <div className={cx('info')}>
                        <p className={cx('description')}>
                            Hà Nội, thủ đô của Việt Nam, một thành phố của truyền thống và lịch sử một thành phố của
                            truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền
                            thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền thống và
                            lịch sử một thành phố của truyền thống và lịch sửHà Nội, thủ đô của Việt Nam, một thành phố
                            của truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của
                            truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền
                            thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền thống và
                            lịch sửHà Nội, thủ đô của Việt Nam, một thành phố của truyền thống và lịch sử một thành phố
                            của truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của
                            truyền thống và lịch sử một thành phố của truyền thống và lịch sử một thành phố của truyền
                            thống và lịch sử một thành phố của truyền thống và lịch sử
                        </p>
                    </div>
                    <h1 className={cx('title')}>Các địa điểm và tour du lịch ở Hà Nội</h1>
                    <div className={cx('destination')}>
                        <div className={'sidebar'}>
                            <CitySideBar />
                        </div>
                        <div className={cx('list')}>
                            <div className={cx('nav')}>
                                <ResultSorter />
                            </div>
                            <div className={cx('items')}>
                                <List
                                    grid={{ gutter: 20, xs: 2, sm: 2, md: 3, lg: 3, xl: 3 }}
                                    dataSource={destinations}
                                    pagination={{ pageSize: 15 }}
                                    renderItem={(item) => (
                                        <List.Item style={{ width: '100%' }}>
                                            <DestinationCard title={item.title} />
                                        </List.Item>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <h1 className={cx('title')}>Thông tin hữu ích</h1>
                    <div className={cx('weather')}>
                        <WeatherInfo />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default CityDetail;
