// Layouts
import { AdminLayout } from '~/components/Layouts';

// Pages
import AddTrip from '~/pages/AddTrip';
import Admin from '~/pages/Admin';
import AdminAddDestination from '~/pages/AdminAddDestination';
import AdminDestinationManage from '~/pages/AdminDestinationManage';
import AdminPlaceManage from '~/pages/AdminPlaceManage';
import AdminUserManage from '~/pages/AdminUserManage';
import CityDetail from '~/pages/CityDetail';
import DestinationDetails from '~/pages/DestinationDetails';
import Gobot from '~/pages/Gobot';
import Home from '~/pages/Home';
import MyTrip from '~/pages/MyTrip';
import Profile from '~/pages/Profile';

import Search from '~/pages/Search';
import TripDetail from '~/pages/TripDetail';
import WriteReview from '~/pages/WriteReview';

// Private routes
const privateRoutes = [{ path: '/', component: Home }];

// Public routes
const publicRoutes = [
    { path: '/', component: Home },
    { path: 'search', component: Search },

    { path: '/profile', component: Profile },
    { path: '/addtrip', component: AddTrip },

    { path: '/admin', component: Admin, layout: AdminLayout },
    { path: '/admin/users-manage', component: AdminUserManage, layout: AdminLayout },
    { path: '/admin/destinations-manage', component: AdminDestinationManage, layout: AdminLayout },
    { path: '/admin/places-manage', component: AdminPlaceManage, layout: AdminLayout },
    { path: '/admin/add-destination', component: AdminAddDestination, layout: AdminLayout },

    { path: '/destination/wimi-factory', component: DestinationDetails },
    { path: '/write-review', component: WriteReview },
    { path: 'city/hehe', component: CityDetail },
    { path: '/add-trip', component: AddTrip },
    { path: '/trip-detail/:id', component: TripDetail },
    { path: '/my-trip', component: MyTrip },
    { path: '/gobot-assistant', component: Gobot },
];

export { publicRoutes, privateRoutes };
