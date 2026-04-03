import type { App } from "server";
import "./index.css";
import { RouterProvider } from "react-router/dom";
import { router } from "./routes/router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

function createQueryClient() {
	try {
		return new (QueryClient as unknown as new () => QueryClient)();
	} catch {
		return (QueryClient as unknown as () => QueryClient)();
	}
}

export function App() {
	const [queryClient] = useState(() => createQueryClient());
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	);
}

export default App;
