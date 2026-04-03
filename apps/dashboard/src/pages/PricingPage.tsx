import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Check, Sparkles, X } from "lucide-react";
import { Link } from "react-router";

const tiers = [
	{
		name: "Starter",
		price: "$0",
		period: "/mo",
		description: "For personal projects and prototypes.",
		cta: "Start free",
		link: "/register",
		highlight: false,
		features: [
			{ label: "1 workspace", included: true },
			{ label: "1 API key", included: true },
			{ label: "Basic usage metrics", included: true },
			{ label: "Email support", included: true },
			{ label: "Team roles", included: false },
			{ label: "Advanced routing rules", included: false },
		],
	},
	{
		name: "Pro",
		price: "$29",
		period: "/mo",
		description: "For builders shipping into production.",
		cta: "Go Pro",
		link: "/register",
		highlight: true,
		features: [
			{ label: "Unlimited workspaces", included: true },
			{ label: "Unlimited API keys", included: true },
			{ label: "Granular access policies", included: true },
			{ label: "Usage analytics + exports", included: true },
			{ label: "Team roles", included: true },
			{ label: "Advanced routing rules", included: true },
		],
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "",
		description: "For teams that need controls and governance.",
		cta: "Contact us",
		link: "/register",
		highlight: false,
		features: [
			{ label: "SLA + priority support", included: true },
			{ label: "SSO / SCIM", included: true },
			{ label: "Audit logs", included: true },
			{ label: "VPC / private networking", included: true },
			{ label: "Custom contracts", included: true },
			{ label: "Security reviews", included: true },
		],
	},
] as const;

export default function PricingPage() {
	return (
		<div className="dark">
			<div className="min-h-screen bg-background text-foreground">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.30),transparent_60%)] blur-2xl" />
					<div className="absolute -bottom-56 right-0 h-[560px] w-[560px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.20),transparent_60%)] blur-2xl" />
				</div>

				<header className="relative">
					<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
						<Link
							to="/"
							className="flex items-center gap-3 text-foreground/90 hover:text-foreground"
						>
							<img src={Logo} alt="NeuroGate" className="h-9 w-9" />
							<span className="text-sm font-semibold tracking-wide">
								NeuroGate
							</span>
						</Link>

						<div className="flex items-center gap-2">
							<Button variant="ghost" asChild>
								<Link to="/login">Sign in</Link>
							</Button>
							<Button asChild>
								<Link to="/register">Create account</Link>
							</Button>
						</div>
					</nav>
				</header>

				<main className="relative">
					<section className="mx-auto max-w-6xl px-6 pb-12 pt-10">
						<div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
							<Sparkles className="size-4 text-primary" />
							<span>Simple pricing that scales with you</span>
						</div>
						<h1 className="mt-7 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
							Choose a plan that fits your workflow
						</h1>
						<p className="mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
							Start free, upgrade when you need deeper controls and analytics.
						</p>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-14">
						<div className="grid gap-4 lg:grid-cols-3">
							{tiers.map((tier) => (
								<Card
									key={tier.name}
									className={`bg-card/40 backdrop-blur ${
										tier.highlight
											? "border-primary/40 shadow-[0_0_0_1px_rgba(99,102,241,0.35)]"
											: "border-border/70"
									}`}
								>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="text-lg">{tier.name}</CardTitle>
											{tier.highlight && (
												<div className="rounded-full border border-primary/30 bg-primary/15 px-3 py-1 text-xs font-medium text-primary-foreground">
													Popular
												</div>
											)}
										</div>
										<CardDescription>{tier.description}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="flex items-end gap-2">
											<div className="text-4xl font-semibold tracking-tight">
												{tier.price}
											</div>
											<div className="pb-1 text-sm text-muted-foreground">
												{tier.period}
											</div>
										</div>

										<div className="mt-6 space-y-3 text-sm">
											{tier.features.map((f) => (
												<div
													key={f.label}
													className="flex items-start justify-between gap-4"
												>
													<div className="flex items-start gap-2">
														{f.included ? (
															<Check className="mt-0.5 size-4 text-emerald-300" />
														) : (
															<X className="mt-0.5 size-4 text-muted-foreground" />
														)}
														<span
															className={
																f.included ? "text-foreground" : "text-muted-foreground"
															}
														>
															{f.label}
														</span>
													</div>
												</div>
											))}
										</div>
									</CardContent>
									<CardFooter>
										<Button
											className="w-full"
											variant={tier.highlight ? "default" : "outline"}
											size="lg"
											asChild
										>
											<Link to={tier.link}>{tier.cta}</Link>
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-20">
						<Card className="bg-card/40 backdrop-blur">
							<CardHeader>
								<CardTitle className="text-lg">Frequently asked</CardTitle>
								<CardDescription>
									Short answers to the common questions.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<div className="text-sm font-medium">Can I cancel anytime?</div>
									<div className="text-sm text-muted-foreground">
										Yes. You can downgrade or cancel whenever you want.
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-sm font-medium">
										Do you offer annual billing?
									</div>
									<div className="text-sm text-muted-foreground">
										You can switch to annual later and keep your existing setup.
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-sm font-medium">
										Is there a free tier for testing?
									</div>
									<div className="text-sm text-muted-foreground">
										Starter is free and designed for experimenting and prototyping.
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-sm font-medium">
										What’s included in Enterprise?
									</div>
									<div className="text-sm text-muted-foreground">
										Governance, auditability, and support tailored to your org.
									</div>
								</div>
							</CardContent>
						</Card>
					</section>
				</main>

				<footer className="relative border-t border-border/60">
					<div className="mx-auto max-w-6xl px-6 py-12">
						<div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
							<div className="flex items-center gap-3">
								<img src={Logo} alt="NeuroGate" className="h-9 w-9" />
								<div>
									<div className="text-sm font-semibold tracking-wide">
										NeuroGate
									</div>
									<div className="text-sm text-muted-foreground">
										Build, route, and monitor with confidence.
									</div>
								</div>
							</div>
							<div className="flex items-center gap-6 text-sm text-muted-foreground">
								<Link to="/" className="hover:text-foreground">
									Home
								</Link>
								<Link to="/pricing" className="hover:text-foreground">
									Pricing
								</Link>
								<Link to="/login" className="hover:text-foreground">
									Login
								</Link>
							</div>
						</div>
						<div className="mt-10 text-xs text-muted-foreground">
							© {new Date().getFullYear()} NeuroGate. All rights reserved.
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
