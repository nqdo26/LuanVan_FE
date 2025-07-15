// Layouts
import { AdminLayout } from '~/components/Layouts';

// Pages
import AddTrip from '~/pages/AddTrip';
import Admin from '~/pages/Admin';
import AdminAddCity from '~/pages/AdminAddCity';
import AdminAddDestination from '~/pages/AdminAddDestination';
import AdminCategoriesManage from '~/pages/AdminCategoriesManage';
import AdminDestinationManage from '~/pages/AdminDestinationManage';
import AdminPlaceManage from '~/pages/AdminPlaceManage';
import AdminUserManage from '~/pages/AdminUserManage';
import CityDetail from '~/pages/CityDetail';
import DestinationDetails from '~/pages/DestinationDetails';
import EditCity from '~/pages/EditCity';
import EditDestination from '~/pages/EditDestination';
import Gobot from '~/pages/Gobot';
import Home from '~/pages/Home';
import MyTrip from '~/pages/MyTrip';
import Profile from '~/pages/Profile';

import Search from '~/pages/Search';
import TripDetail from '~/pages/TripDetail';
import WriteReview from '~/pages/WriteReview';

const privateRoutes = [
    { path: '/my-profile', component: Profile },
    { path: '/addtrip', component: AddTrip },
    { path: '/add-trip', component: AddTrip },
    { path: '/my-trip', component: MyTrip },
    { path: '/gobot-assistant', component: Gobot },
    { path: '/admin', component: Admin, layout: AdminLayout },
    { path: '/admin/users-management', component: AdminUserManage, layout: AdminLayout },
    { path: '/admin/destinations-management', component: AdminDestinationManage, layout: AdminLayout },
    { path: '/admin/citys-management', component: AdminPlaceManage, layout: AdminLayout },
    { path: '/admin/add-destination', component: AdminAddDestination, layout: AdminLayout },
    { path: '/admin/add-city', component: AdminAddCity, layout: AdminLayout },
    { path: '/admin/categories-management', component: AdminCategoriesManage, layout: AdminLayout },
    { path: '/admin/city/edit/:id', component: EditCity },
    { path: '/admin/destination/edit/:id', component: EditDestination },
    { path: '/write-review/:slug', component: WriteReview },
];

// Các route công khai
const publicRoutes = [
    { path: '/', component: Home },
    { path: 'search', component: Search },
    { path: '/destination/:slug', component: DestinationDetails },
    { path: 'city/:id', component: CityDetail },
    { path: '/trip-detail/:slug', component: TripDetail },
];

export { publicRoutes, privateRoutes };
