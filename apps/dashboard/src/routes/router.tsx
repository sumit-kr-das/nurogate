import { createBrowserRouter } from "react-router";
import LoginPage from "@/pages/auth/LoginPage";

export const router = createBrowserRouter([
	{
		path: "/login",
		element: <LoginPage />,
	},
]);
