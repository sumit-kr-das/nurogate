import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, EyeOff, Eye, Lock, Mail, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Link, useNavigate } from "react-router";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z
		.string()
		.min(8, "Must be at least 8 characters")
		.max(16, "Must be at most 16 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

type SignInVariables = LoginForm & { rememberMe: boolean };

const LoginPage = () => {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(true);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});

	const signInMutation = useMutation<string, Error, SignInVariables>({
		mutationFn: async ({ email, password }) => {
			const apiBaseUrl =
				(import.meta as unknown as { env?: Record<string, string | undefined> })
					.env?.BUN_PUBLIC_API_URL ?? "http://localhost:3000";

			const res = await fetch(`${apiBaseUrl}/auth/sign-in`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, password }),
				credentials: "include",
			});

			if (!res.ok) {
				const contentType = res.headers.get("content-type") ?? "";
				let message: string | null = null;

				if (contentType.includes("application/json")) {
					const json = await res.json().catch(() => null);
					if (typeof json === "string") message = json;
					if (json && typeof json === "object" && "message" in json) {
						const maybeMessage = (json as { message?: unknown }).message;
						if (typeof maybeMessage === "string") message = maybeMessage;
					}
				}

				if (!message) {
					message = (await res.text().catch(() => "")) || null;
				}

				throw new Error(message ?? "Invalid username or password");
			}

			const json = await res.json().catch(() => null);
			const token =
				json && typeof json === "object"
					? (json as { token?: unknown }).token
					: null;

			if (typeof token !== "string" || token.length === 0) {
				throw new Error("Invalid response from server");
			}

			return token;
		},
		onSuccess: (token, variables) => {
			const storage = variables.rememberMe ? localStorage : sessionStorage;
			storage.setItem("authToken", token);
			navigate("/app", { replace: true });
		},
	});

	const onSubmit = (data: LoginForm) => {
		signInMutation.reset();
		signInMutation.mutate({ ...data, rememberMe });
	};

	const loading = signInMutation.isPending;
	const submitError = signInMutation.error?.message ?? null;
	return (
		<div className="dark">
			<div className="min-h-screen bg-background text-foreground">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.30),transparent_60%)] blur-2xl" />
					<div className="absolute -bottom-40 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.20),transparent_60%)] blur-2xl" />
				</div>

				<div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-6 py-10">
					<div className="grid w-full gap-10 lg:grid-cols-12 lg:items-center">
						<div className="lg:col-span-5">
							<Link
								to="/"
								className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="size-4" />
								Back to home
							</Link>

							<div className="mt-8 flex items-center gap-3">
								<img src={Logo} alt="NeuroGate" className="h-10 w-10" />
								<div>
									<div className="text-sm font-semibold tracking-wide">
										NeuroGate
									</div>
									<div className="text-sm text-muted-foreground">
										Sign in to your dashboard
									</div>
								</div>
							</div>

							<div className="mt-8 space-y-4 text-sm text-muted-foreground">
								<div className="flex items-start gap-3">
									<Lock className="mt-0.5 size-4 text-primary" />
									<div>
										<div className="text-foreground">Secure sessions</div>
										<div>
											HTTP-only cookies on the server with a client token stored
											locally.
										</div>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Mail className="mt-0.5 size-4 text-primary" />
									<div>
										<div className="text-foreground">Use your work email</div>
										<div>Keep access aligned with your team.</div>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-7 lg:flex lg:justify-end">
							<Card className="w-full max-w-md bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="text-lg">Sign in</CardTitle>
								</CardHeader>
								<CardContent>
									{submitError && (
										<div className="mb-4 rounded-lg border border-red-200/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
											{submitError}
										</div>
									)}
									<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
										<div>
											<label className="mb-1 block text-sm text-muted-foreground">
												Email
											</label>
											<input
												type="email"
												placeholder="you@company.com"
												{...register("email")}
												className={`w-full rounded-lg border bg-background/40 px-3 py-2 text-sm outline-none ring-0 transition focus:border-ring focus:ring-2 focus:ring-ring/30 ${
													errors.email
														? "border-red-400/70"
														: "border-border/70"
												}`}
											/>
											{errors.email && (
												<p className="mt-1 text-xs text-red-200">
													{errors.email.message}
												</p>
											)}
										</div>

										<div>
											<div className="mb-1 flex justify-between">
												<label className="text-sm text-muted-foreground">
													Password
												</label>
												<span className="text-sm text-muted-foreground">
													Forgot password?
												</span>
											</div>
											<div className="relative">
												<input
													type={showPassword ? "text" : "password"}
													placeholder="Enter password"
													{...register("password")}
													className={`w-full rounded-lg border bg-background/40 px-3 py-2 pr-10 text-sm outline-none ring-0 transition focus:border-ring focus:ring-2 focus:ring-ring/30 ${
														errors.password
															? "border-red-400/70"
															: "border-border/70"
													}`}
												/>
												<button
													type="button"
													onClick={() => setShowPassword(!showPassword)}
													className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
												>
													{showPassword ? (
														<Eye className="size-4" />
													) : (
														<EyeOff className="size-4" />
													)}
												</button>
											</div>
											{errors.password && (
												<p className="mt-1 text-xs text-red-200">
													{errors.password.message}
												</p>
											)}
										</div>

										<div className="flex items-center gap-2">
											<input
												id="remember"
												type="checkbox"
												checked={rememberMe}
												onChange={(e) => setRememberMe(e.target.checked)}
												className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
											/>
											<label
												htmlFor="remember"
												className="text-sm text-muted-foreground"
											>
												Remember me
											</label>
										</div>

										<Button
											type="submit"
											disabled={loading}
											className="w-full"
											size="lg"
										>
											{loading ? "Signing in..." : "Sign in"}{" "}
											<ArrowRight className="size-4" />
										</Button>
									</form>

									<div className="mt-6 text-center text-sm text-muted-foreground">
										Don't have an account?{" "}
										<Link
											to="/register"
											className="text-foreground hover:underline"
										>
											Create account
										</Link>
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
