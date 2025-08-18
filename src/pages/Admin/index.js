import React, { useState, useEffect, useContext } from 'react';
import { Spin } from 'antd';
import classNames from 'classnames/bind';
import { motion } from 'framer-motion';
import styles from './Admin.module.scss';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts';
import { getAdminStatisticsApi } from '~/utils/api';
import { AuthContext } from '~/components/Context/auth.context';
import { useNavigate } from 'react-router-dom';

const cx = classNames.bind(styles);
const COLORS = ['#64c5ff', '#1c1f4a', '#ffc658', '#ff8042'];

function Admin() {
    const navigate = useNavigate();
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const { auth } = useContext(AuthContext);

    useEffect(() => {
        if (auth && auth.user && !auth.user.isAdmin) {
            if (navigate) {
                navigate('/');
            } else if (window.location) {
                navigate = window.location;
            }
        }
    }, [auth]);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const res = await getAdminStatisticsApi();

                setStatistics(res);
            } catch (err) {
                setStatistics(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                <Spin size="large" />
            </div>
        );
    }
    if (!statistics) {
        return (
            <div style={{ textAlign: 'center', padding: '40px', color: 'red' }}>Không thể tải dữ liệu thống kê!</div>
        );
    }

    const { userCount, adminCount, cityCount, destinationCount, placeStats, cityStats, recentUsers } = statistics;

    const topPlaceStats = [...(placeStats || [])].sort((a, b) => b.statistics.views - a.statistics.views).slice(0, 5);

    const topCityStats = [...(cityStats || [])].sort((a, b) => b.totalViews - a.totalViews).slice(0, 5);

    // Tính toán range động cho biểu đồ tổng user
    const maxUsers = Math.max(...(recentUsers || []).map((item) => item.users), 1);
    const minUsers = Math.min(...(recentUsers || []).map((item) => item.users), 0);
    const yAxisDomain = [Math.max(minUsers - 5, 0), maxUsers + 10];

    // Tạo ticks động dựa trên range
    const range = yAxisDomain[1] - yAxisDomain[0];
    const tickCount = Math.min(Math.max(Math.ceil(range / 20), 5), 10);
    const yAxisTicks = Array.from({ length: tickCount }, (_, i) =>
        Math.round(yAxisDomain[0] + (i * range) / (tickCount - 1)),
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={cx('wrapper')}
        >
            <div className={cx('inner')}>
                <div className={cx('section-1')}>
                    <h1 className={cx('title')}>Báo cáo thống kê</h1>
                    <div className={cx('section-1-items')}>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Tài khoản người dùng:</p>
                            <p className={cx('small-card-value')}>{userCount}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Tài khoản admin:</p>
                            <p className={cx('small-card-value')}>{adminCount}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Thành phố:</p>
                            <p className={cx('small-card-value')}>{cityCount}</p>
                        </div>
                        <div className={cx('small-card')}>
                            <p className={cx('small-card-title')}>Địa điểm:</p>
                            <p className={cx('small-card-value')}>{destinationCount}</p>
                        </div>
                    </div>
                </div>

                <div className={cx('charts')}>
                    <div className={cx('chart-1')}>
                        <div className={cx('chart-item')}>
                            <h2>Thống kê địa điểm theo lượt xem và lượt đánh giá</h2>
                            <BarChart
                                width={800}
                                height={300}
                                data={topPlaceStats}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis yAxisId="left" domain={[0, 100]} ticks={[0, 10, 20, 50, 100]} />
                                <YAxis yAxisId="right" orientation="right" domain={[0, 5]} />
                                <Tooltip />
                                <Legend />
                                <Bar yAxisId="left" dataKey="statistics.views" name="Lượt xem" fill="#64c5ff" />
                                <Bar
                                    yAxisId="right"
                                    dataKey="statistics.averageRating"
                                    name="Đánh giá"
                                    fill="#1c1f4a"
                                />
                            </BarChart>
                        </div>
                        <div className={cx('chart-item')}>
                            <h2>Thống kê thành phố theo lượt xem</h2>
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={topCityStats}
                                    dataKey="totalViews"
                                    nameKey="city"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {topCityStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </div>
                    </div>

                    <div className={cx('chart-item')}>
                        <h2>Tổng số tài khoản trong hệ thống (7 ngày gần nhất)</h2>
                        <LineChart
                            width={800}
                            height={300}
                            data={recentUsers}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis domain={yAxisDomain} ticks={yAxisTicks} />
                            <Tooltip
                                formatter={(value, name) => [`${value} tài khoản`, 'Tổng số user']}
                                labelFormatter={(label) => `Ngày: ${label}`}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="users"
                                stroke="#1c1f4a"
                                activeDot={{ r: 8 }}
                                name="Tổng số user"
                                strokeWidth={2}
                            />
                        </LineChart>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Admin;
