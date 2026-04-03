import { createBrowserRouter } from "react-router";
import LoginPage from "@/pages/auth/LoginPage";
import { APITester } from "@/APITester";
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PricingPage from "@/pages/PricingPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <LandingPage />,
	},
	{
		path: "/pricing",
		element: <PricingPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/api-tester",
		element: <APITester />,
	},
]);
