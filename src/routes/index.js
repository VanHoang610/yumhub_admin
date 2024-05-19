
import Login from "../component/layouts/account/Login/Login"
import ForgetPassword from "../component/layouts/account/ForgetPassword/ForgetPassword"
import OTP from "../component/layouts/account/OTP/OTP"
import ResetPassword from "../component/layouts/account/ResetPassword/ResetPassword"
import ChangePassword from "../component/layouts/account/ChangePassword/ChangePassword"
import Home from '../component/layouts/yumhub/Home/Home'
import Header from '../component/layouts/header/header'
import Sidebar from '../component/layouts/sidebar/sidebar'
// public routes
const publicRoutes = [
    { path: '/', component: Login }, 
    { path: '/forgetPassword', component: ForgetPassword }, 
    { path: '/otp', component: OTP }, 
    { path: '/resetPassword', component: ResetPassword }, 
    { path: '/changePassword', component: ChangePassword }, 
    { path: '/header', component: Header },
    { path: '/sidebar', component: Sidebar },
]

const privateRoutes = [
    { path: '/', component: Home }, 
]

export { publicRoutes, privateRoutes } 