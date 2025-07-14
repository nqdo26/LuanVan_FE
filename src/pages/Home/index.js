import React, { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import CustomTitle from '~/components/CustomTitle';
import SearchBar from '~/components/SearchBar';
import ImageCarousel from '~/components/ImageCarousel';
import ChatBoxIntro from '~/components/ChatBoxIntro';
import CustomCarousel from '~/components/CustomCarousel';
import Category from '~/components/Category';
import CityCarousel from '~/components/CityCarousel';
import { getCitiesApi, getPopularDestinationsApi } from '~/utils/api';

const cx = classNames.bind(styles);

function Home() {
    const [cities, setCities] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [citiesLoading, setCitiesLoading] = useState(false);
    const [destinationsLoading, setDestinationsLoading] = useState(false);

    useEffect(() => {
        fetchCities();
        fetchDestinations();
    }, []);

    const fetchCities = async () => {
        try {
            setCitiesLoading(true);
            const response = await getCitiesApi();

            if (response && response.EC === 0) {
                setCities(response.data);
            }
        } catch (error) {
            console.error('Error fetching cities:', error);
        } finally {
            setCitiesLoading(false);
        }
    };

    const fetchDestinations = async () => {
        try {
            setDestinationsLoading(true);
            const response = await getPopularDestinationsApi();

            if (response && response.EC === 0) {
                setDestinations(response.data);
            }
        } catch (error) {
            console.error('Error fetching destinations:', error);
        } finally {
            setDestinationsLoading(false);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <p className={cx('deployment-notice')}>🚀 Trang web đang trong quá trình hoàn thiện</p>
                <CustomTitle title={'Where to?'} size={55} />

                <div className={cx('search-bar')}>
                    <SearchBar />
                </div>
                <div className={cx('carousel1')}>
                    <ImageCarousel />
                </div>
                <div className={cx('category')}>
                    <Category />
                </div>

                <div className={cx('carousel')}>
                    <CustomCarousel
                        title="Điểm đến phổ biến"
                        number={4}
                        destinations={destinations}
                        loading={destinationsLoading}
                    />
                </div>
                <div className={cx('chatbox-intro')}>
                    <ChatBoxIntro />
                </div>

                <div className={cx('carousel')}>
                    <CityCarousel title="Địa điểm tiếp theo" number={6} cities={cities} loading={citiesLoading} />
                </div>
            </div>
        </div>
    );
}

export default Home;
