
import Login from "../component/layouts/account/Login/Login"
import ForgetPassword from "../component/layouts/account/ForgetPassword/ForgetPassword"
import OTP from "../component/layouts/account/OTP/OTP"
import ResetPassword from "../component/layouts/account/ResetPassword/ResetPassword"
import Home from '../component/layouts/yumhub/Home/Home'

import DefaultLayout from "../component/layouts/defaultLayout/defaultLayout"
import NewMerchant from '../component/layouts/yumhub/NewMerchant/NewMerchant'
import AllMerchant from '../component/layouts/yumhub/AllMerchant/AllMerchant'
import AllVoucher from "../component/layouts/yumhub/AllVoucher/AllVoucher"
import AddVoucher from "../component/layouts/yumhub/AddVoucher/AddVoucher"
import AllShipper from "../component/layouts/yumhub/AllShipper/AllShipper"
import AddShipper from "../component/layouts/yumhub/AddShipper/AddShipper"
import Infomation from "../component/layouts/yumhub/Infomation/Info"
import ChangePassword from "../component/layouts/yumhub/ChangePassword/ChangePassword"
import AllCustomer from "../component/layouts/yumhub/AllCustomer/AllCustomer"
import FoodRequet from "../component/layouts/yumhub/FoodRequet/FoodRequet"


// public routes
const publicRoutes = [
    { path: "/", component: Login, layout: null },
    { path: '/forgetPassword', component: ForgetPassword, layout: null  }, 
    { path: '/otp', component: OTP, layout: null }, 
    { path: '/resetPassword', component: ResetPassword, layout: null }, 

]

const privateRoutes = [
    { path: "/home", component: Home, layout: DefaultLayout },
    { path: "/all-vouchers", component: AllVoucher, layout: DefaultLayout },
    { path: "/add-voucher", component: AddVoucher, layout: DefaultLayout },
    { path: '/new-merchant', component: NewMerchant, layout: DefaultLayout  },
    { path: '/all-merchants', component: AllMerchant, layout: DefaultLayout  },
    { path: '/all-shippers', component: AllShipper, layout: DefaultLayout  },
    { path: '/new-shipper', component: AddShipper, layout: DefaultLayout  },
    { path: '/infomation', component: Infomation, layout: DefaultLayout  },
    { path: '/change-password', component: ChangePassword, layout: DefaultLayout },
    { path: '/all-customers', component: AllCustomer, layout: DefaultLayout },
    { path: '/food-request', component: FoodRequet, layout: DefaultLayout },

]

export { publicRoutes, privateRoutes } 