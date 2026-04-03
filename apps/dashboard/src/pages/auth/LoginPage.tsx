import Logo from "@/assets/logo.png";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z
		.string()
		.refine((val) => val.length >= 8, {
			error: "Must be at least 8 characters",
		})
		.refine((val) => val.length <= 16, {
			error: "Must be at most 16 characters",
		}),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
	});
	const onSubmit = (data: LoginForm) => {
		try {
			setLoading(true);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
			<div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-sm p-8">
				<div className="flex justify-center">
					<img src={Logo} alt="nurogate" className="w-20" />
				</div>
				<div className="text-center mb-6">
					<h1 className="text-xl font-semibold text-gray-900">
						Sign in to your account
					</h1>
					<p className="text-sm text-gray-500 mt-1">
						Enter your credentials to continue
					</p>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Email
						</label>
						<input
							type="email"
							placeholder="you@company.com"
							{...register("email", {
								required: "Email is required",
								pattern: {
									value: /^\S+@\S+$/i,
									message: "Enter a valid email",
								},
							})}
							className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
								errors.email
									? "border-red-400 focus:ring-red-200"
									: "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
							}`}
						/>

						{errors.email && (
							<p className="text-red-500 text-xs mt-1">
								{errors.email.message}
							</p>
						)}
					</div>
					<div>
						<div className="flex justify-between mb-1">
							<label className="text-sm font-medium text-gray-700">
								Password
							</label>

							<a className="text-sm text-blue-600 hover:underline">
								Forgot password?
							</a>
						</div>

						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								placeholder="Enter password"
								{...register("password", {
									required: "Password is required",
									minLength: { value: 8, message: "Minimum 8 characters" },
								})}
								className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 ${
									errors.password
										? "border-red-400 focus:ring-red-200"
										: "border-gray-300 focus:ring-blue-200 focus:border-blue-500"
								}`}
							/>

							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 cursor-pointer"
							>
								{showPassword ? <Eye /> : <EyeOff />}
							</button>
						</div>

						{errors.password && (
							<p className="text-red-500 text-xs mt-1">
								{errors.password.message}
							</p>
						)}
					</div>
					<div className="flex items-center gap-2">
						<input
							id="remember"
							type="checkbox"
							className="w-4 h-4 border-gray-300 rounded text-blue-600 focus:ring-blue-500"
						/>
						<label htmlFor="remember" className="text-sm text-gray-600">
							Remember me
						</label>
					</div>
					<button
						type="submit"
						disabled={loading}
						className="w-full py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-60 cursor-pointer"
					>
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</form>
				<p className="text-center text-sm text-gray-500 mt-6">
					Don't have an account?{" "}
					<a className="text-blue-600 hover:underline font-medium">
						Create account
					</a>
				</p>
			</div>
		</div>
	);
};

export default LoginPage;
