
import Login from "../component/layouts/account/Login/Login"
import ForgetPassword from "../component/layouts/account/ForgetPassword/ForgetPassword"
import OTP from "../component/layouts/account/OTP/OTP"
import ResetPassword from "../component/layouts/account/ResetPassword/ResetPassword"
import ChangePassword from "../component/layouts/account/ChangePassword/ChangePassword"
import Home from '../component/layouts/yumhub/Home/Home'


import DefaultLayout from "../component/layouts/defaultLayout/defaultLayout"
import NewMerchant from '../component/layouts/yumhub/NewMerchant/NewMerchant'
import AllMerchant from '../component/layouts/yumhub/AllMerchant/AllMerchan'
import AllVoucher from "../component/layouts/yumhub/AllVoucher/AllVoucher"
import AddVoucher from "../component/layouts/yumhub/AddVoucher/AddVoucher"

// public routes
const publicRoutes = [
    { path: "/", component: Login, layout: null },
    { path: '/forgetPassword', component: ForgetPassword }, 
    { path: '/otp', component: OTP}, 
    { path: '/resetPassword', component: ResetPassword}, 
    { path: '/changePassword', component: ChangePassword }, 
]

const privateRoutes = [
    { path: "/home", component: Home, layout: DefaultLayout },
    { path: "/all-vouchers", component: AllVoucher, layout: DefaultLayout },
    { path: "/add-voucher", component: AddVoucher, layout: DefaultLayout },
    { path: '/newMerchant', component: NewMerchant, layout: DefaultLayout  },
    { path: '/allMerchant', component: AllMerchant, layout: DefaultLayout  },
]

export { publicRoutes, privateRoutes } 