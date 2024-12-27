// components
import { Route, Routes } from "react-router-dom";
import ProtectedAppLayout from "./components/ProtectedAppLayout";
// pages
import Home from "./pages/Home";
import SignUp from "./pages/Signup";
import SignIn from "./pages/SignIn";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/UserProfile";

const App = () => {

	return (
		<div className="min-h-screen flex items-center justify-center">
			<Routes>
				<Route element={<ProtectedAppLayout />}>
					<Route index element={<Home />} />
					<Route path="profile" element={<UserProfile />} />
				</Route>
				<Route path="signin" element={<SignIn />} />
				<Route path="signup" element={<SignUp />} />
				<Route path="verify-email" element={<VerifyEmail />} />
				<Route path="forgot-password" element={<ForgotPassword />} />
				<Route path="reset-password/:resetToken" element={<ResetPassword />} />
			</Routes>
		</div>
	);
};

export default App;
