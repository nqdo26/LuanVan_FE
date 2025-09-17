import classNames from 'classnames/bind';

import styles from './HomeLayout.module.scss';
import { Layout } from 'antd';

import HomeHeader from './HomeHeader';

function HomeLayout({ children }) {
    const cx = classNames.bind(styles);
    return (
        <Layout
            style={{
                backgroundColor: 'white',
            }}
            className={cx('wrapper')}
        >
            <HomeHeader />
            {children}
        </Layout>
    );
}

export default HomeLayout;
