
import Login from "../component/account/Login/Login"
import ForgetPassword from "../component/account/ForgetPassword/ForgetPassword"
import OTP from "../component/account/OTP/OTP"
import ResetPassword from "../component/account/ResetPassword/ResetPassword"
import ChangePassword from "../component/account/ChangePassword/ChangePassword"
import Home from '../component/yumhub/Home/Home'
// public routes
const publicRoutes = [
    { path: '/', component: Login }, 
    { path: '/forgetPassword', component: ForgetPassword }, 
    { path: '/otp', component: OTP }, 
    { path: '/resetPassword', component: ResetPassword }, 
    { path: '/changePassword', component: ChangePassword }, 
]

const privateRoutes = [
    { path: '/', component: Home }, 
]

export { publicRoutes, privateRoutes } 