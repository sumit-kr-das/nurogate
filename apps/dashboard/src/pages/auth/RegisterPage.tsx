import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

const registerSchema = z
	.object({
		email: z.string().email("Invalid email"),
		password: z
			.string()
			.min(8, "Must be at least 8 characters")
			.max(16, "Must be at most 16 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterForm>({
		resolver: zodResolver(registerSchema),
	});

	const signUpMutation = useMutation<void, Error, RegisterForm>({
		mutationFn: async ({ email, password }) => {
			const apiBaseUrl =
				(import.meta as unknown as { env?: Record<string, string | undefined> })
					.env?.BUN_PUBLIC_API_URL ?? "http://localhost:3000";

			const res = await fetch(`${apiBaseUrl}/auth/sign-up`, {
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

				throw new Error(message ?? "Sign up failed");
			}
		},
		onSuccess: () => {
			setSuccessMessage("Account created. You can sign in now.");
			setTimeout(() => navigate("/login", { replace: true }), 400);
		},
	});

	const onSubmit = (data: RegisterForm) => {
		setSuccessMessage(null);
		signUpMutation.reset();
		signUpMutation.mutate(data);
	};

	const submitError = signUpMutation.error?.message ?? null;
	const loading = signUpMutation.isPending;

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
										Create your dashboard account
									</div>
								</div>
							</div>

							<div className="mt-8 space-y-4 text-sm text-muted-foreground">
								<div className="flex items-start gap-3">
									<Lock className="mt-0.5 size-4 text-primary" />
									<div>
										<div className="text-foreground">Secure authentication</div>
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
										<div>Quick setup, no friction.</div>
									</div>
								</div>
							</div>
						</div>

						<div className="lg:col-span-7 lg:flex lg:justify-end">
							<Card className="w-full max-w-md bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="text-lg">Create account</CardTitle>
								</CardHeader>
								<CardContent>
									{submitError && (
										<div className="mb-4 rounded-lg border border-red-200/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
											{submitError}
										</div>
									)}
									{successMessage && (
										<div className="mb-4 rounded-lg border border-emerald-200/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
											{successMessage}
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
													errors.email ? "border-red-400/70" : "border-border/70"
												}`}
											/>
											{errors.email && (
												<p className="mt-1 text-xs text-red-200">
													{errors.email.message}
												</p>
											)}
										</div>

										<div>
											<label className="mb-1 block text-sm text-muted-foreground">
												Password
											</label>
											<div className="relative">
												<input
													type={showPassword ? "text" : "password"}
													placeholder="Create a password"
													{...register("password")}
													className={`w-full rounded-lg border bg-background/40 px-3 py-2 pr-10 text-sm outline-none ring-0 transition focus:border-ring focus:ring-2 focus:ring-ring/30 ${
														errors.password
															? "border-red-400/70"
															: "border-border/70"
													}`}
												/>
												<button
													type="button"
													onClick={() => setShowPassword((v) => !v)}
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

										<div>
											<label className="mb-1 block text-sm text-muted-foreground">
												Confirm password
											</label>
											<div className="relative">
												<input
													type={showConfirmPassword ? "text" : "password"}
													placeholder="Re-enter password"
													{...register("confirmPassword")}
													className={`w-full rounded-lg border bg-background/40 px-3 py-2 pr-10 text-sm outline-none ring-0 transition focus:border-ring focus:ring-2 focus:ring-ring/30 ${
														errors.confirmPassword
															? "border-red-400/70"
															: "border-border/70"
													}`}
												/>
												<button
													type="button"
													onClick={() => setShowConfirmPassword((v) => !v)}
													className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
												>
													{showConfirmPassword ? (
														<Eye className="size-4" />
													) : (
														<EyeOff className="size-4" />
													)}
												</button>
											</div>
											{errors.confirmPassword && (
												<p className="mt-1 text-xs text-red-200">
													{errors.confirmPassword.message}
												</p>
											)}
										</div>

										<Button
											type="submit"
											disabled={loading}
											className="w-full"
											size="lg"
										>
											{loading ? "Creating..." : "Create account"}{" "}
											<ArrowRight className="size-4" />
										</Button>
									</form>

									<div className="mt-6 text-center text-sm text-muted-foreground">
										Already have an account?{" "}
										<Link to="/login" className="text-foreground hover:underline">
											Sign in
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
}
