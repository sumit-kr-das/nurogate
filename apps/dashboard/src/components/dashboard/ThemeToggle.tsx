import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getInitialTheme() {
	const saved = localStorage.getItem("theme");
	if (saved === "light" || saved === "dark") return saved;
	return "dark";
}

export function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") root.classList.add("dark");
		else root.classList.remove("dark");
		localStorage.setItem("theme", theme);
	}, [theme]);

	return (
		<Button
			variant="ghost"
			size="icon"
			onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
			aria-label="Toggle theme"
		>
			{theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
		</Button>
	);
}
