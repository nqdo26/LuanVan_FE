import classNames from 'classnames/bind';

import styles from './Home.module.scss';
import CustomTitle from '~/components/CustomTitle';
import SearchBar from '~/components/SearchBar';
import ImageCarousel from '~/components/ImageCarousel';
import ChatBoxIntro from '~/components/ChatBoxIntro';
import CustomCarousel from '~/components/CustomCarousel';
import DestinationCard from '~/components/DestinationCard';
import Category from '~/components/Category';
import CityCard from '~/components/CityCard';

const cx = classNames.bind(styles);

function Home() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <CustomTitle title={'Where to?'} size={55} />
                <div className={cx('search-bar')}>
                    <SearchBar />
                </div>
                <div className={cx('carousel')}>
                    <ImageCarousel />
                </div>
                <div className={cx('chatbox-intro')}>
                    <ChatBoxIntro />
                </div>
                <div className={cx('carousel')}>
                    <CustomCarousel title="Điểm đến phổ biến" number={4} card={<DestinationCard />} />
                </div>
                <div className={cx('category')}>
                    <Category />
                </div>
                <div className={cx('carousel')}>
                    <CustomCarousel
                        title="Địa điểm tiếp theo"
                        number={6}
                        card={<CityCard title="Bà Rịa Vũng Tàu Lao" />}
                    />
                </div>
            </div>
        </div>
    );
}

export default Home;
