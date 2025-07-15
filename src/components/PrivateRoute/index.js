import { useContext } from 'react';
import { AuthContext } from '~/components/Context/auth.context';
import { Navigate } from 'react-router-dom';
import { notification } from 'antd';

function PrivateRoute({ children }) {
    const { auth } = useContext(AuthContext);

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
