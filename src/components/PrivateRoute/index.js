import { useContext } from 'react';
import { AuthContext } from '~/components/Context/auth.context';
import { Navigate } from 'react-router-dom';
import { Spin, notification } from 'antd';

function PrivateRoute({ children }) {
    const { auth, appLoading } = useContext(AuthContext);

    if (appLoading) {
        return (
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 9999,
                    width: '100vw',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Spin size="large" />
            </div>
        );
    }

    if (!auth.isAuthenticated) {
        notification.warning({
            message: 'Yêu cầu đăng nhập',
            description: 'Vui lòng đăng nhập để sử dụng chức năng.',
        });
        return <Navigate to="/" replace />;
    }

    return children;
}

export default PrivateRoute;
