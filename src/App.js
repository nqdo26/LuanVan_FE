import { Fragment, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { publicRoutes } from '~/routes';
import { DefaultLayout } from '~/components/Layouts';
import { AuthContext } from './components/Context/auth.context';
import { Spin } from 'antd';
import { getAccountApi } from './utils/api';

function App() {
    const { setAuth, appLoading, setAppLoading } = useContext(AuthContext);

    useEffect(() => {
        const featchAccount = async () => {
            setAppLoading(true);
            const res = await getAccountApi();
            if (res && !res.message) {
                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: res.id,
                        email: res.email,
                        fullName: res.fullName,
                        avatar: res.avatar,
                        isAdmin: res.isAdmin,
                    },
                });
            }

            setAppLoading(false);
        };

        featchAccount();
    }, [setAppLoading, setAuth]);

    return (
        <>
            {appLoading && (
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
            )}

            <Router>
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;
                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }

                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                    </Routes>
                </div>
            </Router>
        </>
    );
}

export default App;
