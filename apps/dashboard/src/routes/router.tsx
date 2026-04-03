import { createBrowserRouter } from "react-router";
import LoginPage from "@/pages/auth/LoginPage";
import { APITester } from "@/APITester";
import LandingPage from "@/pages/LandingPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import PricingPage from "@/pages/PricingPage";
import AppLayout from "@/pages/app/AppLayout";
import OverviewPage from "@/pages/app/OverviewPage";
import ApiKeysPage from "@/pages/app/ApiKeysPage";
import CreditsPage from "@/pages/app/CreditsPage";
import AccountPage from "@/pages/app/AccountPage";

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
		path: "/app",
		element: <AppLayout />,
		children: [
			{
				index: true,
				element: <OverviewPage />,
			},
			{
				path: "api-keys",
				element: <ApiKeysPage />,
			},
			{
				path: "credits",
				element: <CreditsPage />,
			},
			{
				path: "account",
				element: <AccountPage />,
			},
		],
	},
	{
		path: "/api-tester",
		element: <APITester />,
	},
]);
