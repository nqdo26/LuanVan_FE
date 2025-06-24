import classNames from 'classnames/bind';
import Header from '~/components/Layouts/components/Header';
import styles from './AdminLayout.module.scss';
import Sidebar from './Sidebar';
import { Layout } from 'antd';
import CustomFooter from '../components/Footer/CustomFooter';

function AdminLayout({ children }) {
    const { Content } = Layout;

    const cx = classNames.bind(styles);
    return (
        <Layout className={cx('wrapper')}>
            <Header className={cx('header')} />
            <Layout
                style={{
                    background: 'white',
                }}
            >
                <Sidebar className={cx('sidebar')} />
                <Content className={cx('content')}>{children}</Content>
            </Layout>
            <CustomFooter />
        </Layout>
    );
}

export default AdminLayout;
