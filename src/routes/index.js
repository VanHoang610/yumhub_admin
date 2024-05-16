
import Login from "../component/users/Login/Login"
import ForgetPassword from "../component/users/ForgetPassword/ForgetPassword"
import OTP from "../component/users/OTP/OTP"
import ResetPassword from "../component/users/ResetPassword/ResetPassword"
import ChangePassword from "../component/users/ChangePassword/ChangePassword"
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