// @material-ui/icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import SmsFailedIcon from '@mui/icons-material/SmsFailed';
import DetailsIcon from '@mui/icons-material/Details';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
// import LanguageIcon from '@mui/icons-material/Language';

// core components/pages for Admin layout
import Home from './pages/home/home.js';
import FailedOrders from './pages/failed-orders/failed-orders.js';
import OrderView from './pages/order-view/order-view.js';
import Settings from './pages/settings/settings.js';

// core components/views for RTL layout
// import RTLPage from 'views/RTLPage/RTLPage.js';

const dashboardRoutes = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    rtlName: 'Панель управления',
    icon: DashboardIcon,
    component: Home,
    layout: '/admin',
  },
  {
    path: '/failed-orders',
    name: 'Failed Orders',
    rtlName: 'Неуспешные заказы',
    icon: SmsFailedIcon,
    component: FailedOrders,
    layout: '/admin',
  },
  {
    path: '/order-view',
    name: 'Order View',
    rtlName: 'Заказ в подробностях',
    icon: DetailsIcon,
    component: OrderView,
    layout: '/admin',
  },
  {
    path: '/settings',
    name: 'Settings',
    rtlName: 'Таблица',
    icon: SettingsApplicationsIcon,
    component: Settings,
    layout: '/admin',
  },
  // {
  //   path: '/rtl-page',
  //   name: 'RTL Support',
  //   rtlName: 'На Русском',
  //   icon: LanguageIcon,
  //   component: RTLPage,
  //   layout: '/rtl',
  // },
];

export default dashboardRoutes;
