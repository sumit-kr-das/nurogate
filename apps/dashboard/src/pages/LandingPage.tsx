import Logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Activity,
	ArrowRight,
	BarChart3,
	Check,
	Cpu,
	Github,
	Lock,
	Network,
	Quote,
	Sparkles,
	Twitter,
	Zap,
} from "lucide-react";
import { useMemo } from "react";
import { Link } from "react-router";

type Dot = { cx: number; cy: number; r: number; o: number };

function createSeededRandom(seed: number) {
	let t = seed >>> 0;
	return () => {
		t += 0x6d2b79f5;
		let x = t;
		x = Math.imul(x ^ (x >>> 15), x | 1);
		x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
		return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
	};
}

function generateWaveDots(count: number, seed: number): Dot[] {
	const rand = createSeededRandom(seed);
	const dots: Dot[] = [];

	for (let i = 0; i < count; i++) {
		const x = rand();
		const yBias = 0.52 + (rand() - 0.5) * 0.06;
		const wave =
			0.18 * Math.sin(x * Math.PI * 2 * 1.1) +
			0.06 * Math.sin(x * Math.PI * 2 * 2.5);
		const y = yBias + wave + (rand() - 0.5) * 0.08;

		const cx = x * 1000;
		const cy = Math.max(20, Math.min(380, y * 400));
		const r = 1.1 + rand() * 1.2;
		const o = 0.2 + rand() * 0.55;

		if (x > 0.06 && x < 0.97) {
			dots.push({ cx, cy, r, o });
		}
	}

	return dots;
}

export default function LandingPage() {
	const waveDots = useMemo(() => generateWaveDots(900, 42), []);

	return (
		<div className="dark">
			<div className="min-h-screen bg-background text-foreground">
				<div className="pointer-events-none absolute inset-0 overflow-hidden">
					<div className="absolute -top-56 left-1/3 h-[640px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.32),transparent_60%)] blur-3xl" />
					<div className="absolute -bottom-56 left-0 h-[680px] w-[680px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.22),transparent_60%)] blur-3xl" />
					<div className="absolute -bottom-72 right-0 h-[760px] w-[760px] rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.18),transparent_60%)] blur-3xl" />
					<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.12]" />
					<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85)_78%)]" />
				</div>

				<header className="sticky top-0 z-40 border-b border-border/60 bg-background/40 backdrop-blur supports-[backdrop-filter]:bg-background/30">
					<nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
						<Link
							to="/"
							className="flex items-center gap-3 text-foreground/90 hover:text-foreground"
						>
							<img src={Logo} alt="NeuroGate" className="h-9 w-9" />
							<span className="text-sm font-semibold tracking-wide">
								NeuroGate
							</span>
							<span className="hidden rounded-full border border-border/70 bg-card/30 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur sm:inline-flex">
								Beta
							</span>
						</Link>

						<div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
							<Link to="#product" className="hover:text-foreground">
								Product
							</Link>
							<Link to="/pricing" className="hover:text-foreground">
								Pricing
							</Link>
							<Link to="#docs" className="hover:text-foreground">
								Docs
							</Link>
						</div>

						<div className="flex items-center gap-2">
							<Button variant="ghost" asChild>
								<Link to="/login">Sign in</Link>
							</Button>
							<Button asChild>
								<Link to="/register">
									Create account <ArrowRight className="size-4" />
								</Link>
							</Button>
						</div>
					</nav>
				</header>

				<main className="relative">
					<section className="mx-auto max-w-6xl px-6 pb-12 pt-14 sm:pt-18">
						<div className="relative overflow-hidden rounded-3xl border border-border/70 bg-card/20 backdrop-blur">
							<div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_55%)]" />

							<div className="pointer-events-none absolute inset-0">
								<svg
									className="absolute left-0 top-10 h-[380px] w-[72%] opacity-90 mix-blend-screen [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
									viewBox="0 0 1000 400"
									preserveAspectRatio="none"
								>
									{waveDots.map((d, idx) => (
										<circle
											key={idx}
											cx={d.cx}
											cy={d.cy}
											r={d.r}
											fill="rgba(255,255,255,0.9)"
											opacity={d.o}
										/>
									))}
								</svg>

								<div className="absolute right-0 top-0 h-full w-[44%] opacity-60">
									<div className="absolute inset-0 bg-[radial-gradient(circle,rgba(255,255,255,0.38)_1px,transparent_1px)] bg-[size:10px_10px]" />
									<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),transparent_55%)]" />
									<div className="absolute inset-0 [mask-image:radial-gradient(circle_at_70%_45%,black,transparent_62%)] bg-black/55" />
								</div>
							</div>

							<div className="relative grid gap-10 px-6 py-14 lg:grid-cols-12 lg:items-end lg:px-12">
								<div className="lg:col-span-7">
									<div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur">
										<Sparkles className="size-4 text-primary" />
										<span>One interface for access, routing, and usage</span>
									</div>
									<h1 className="mt-8 text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-6xl">
										The modern control plane
										<br />
										<span className="bg-gradient-to-r from-indigo-300 via-sky-200 to-emerald-200 bg-clip-text text-transparent">
											for AI workloads
										</span>
									</h1>
								</div>

								<div className="lg:col-span-5">
									<div className="text-sm font-medium text-muted-foreground">
										Understand. Execute. Deliver.
									</div>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										NeuroGate centralizes authentication, API key management,
										and usage monitoring so teams can ship faster with fewer
										surprises.
									</p>

									<div className="mt-6 flex flex-col gap-3 sm:flex-row">
										<Button size="lg" asChild className="sm:flex-1">
											<Link to="/register">
												Get started <ArrowRight className="size-4" />
											</Link>
										</Button>
										<Button
											size="lg"
											variant="outline"
											asChild
											className="sm:flex-1"
										>
											<Link to="/pricing">View pricing</Link>
										</Button>
									</div>

									<div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
										<div className="flex items-center gap-2">
											<Lock className="size-4 text-primary" />
											Secure auth
										</div>
										<div className="flex items-center gap-2">
											<Zap className="size-4 text-primary" />
											Smart routing
										</div>
										<div className="flex items-center gap-2">
											<BarChart3 className="size-4 text-primary" />
											Usage visibility
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section id="product" className="mx-auto max-w-6xl px-6 pb-20 pt-6">
						<div className="grid gap-10 lg:grid-cols-12 lg:items-end">
							<div className="lg:col-span-5">
								<div className="text-sm text-muted-foreground">Product</div>
								<h2 className="mt-2 text-balance text-3xl font-semibold tracking-tight">
									Everything you need to run AI in production
								</h2>
								<p className="mt-4 text-sm text-muted-foreground">
									Ship with guardrails: secure sessions, scoped keys, resilient
									routing, and clear usage visibility across providers.
								</p>
							</div>
							<div className="lg:col-span-7">
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
									<div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 backdrop-blur">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Network className="size-4 text-primary" />
											Providers
										</div>
										<div className="mt-1 text-xl font-semibold">60+</div>
									</div>
									<div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 backdrop-blur">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Cpu className="size-4 text-primary" />
											Models
										</div>
										<div className="mt-1 text-xl font-semibold">300+</div>
									</div>
									<div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 backdrop-blur">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Activity className="size-4 text-primary" />
											Monitoring
										</div>
										<div className="mt-1 text-xl font-semibold">Live</div>
									</div>
									<div className="rounded-xl border border-border/70 bg-card/40 px-4 py-3 backdrop-blur">
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<Zap className="size-4 text-primary" />
											Routing
										</div>
										<div className="mt-1 text-xl font-semibold">Smart</div>
									</div>
								</div>
							</div>
						</div>

						<div className="mt-10 grid gap-4 md:grid-cols-3">
							<Card className="bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<Lock className="size-4 text-primary" />
										Access control
									</CardTitle>
									<CardDescription>
										Generate keys, rotate safely, and keep permissions tight.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<BarChart3 className="size-4 text-primary" />
										Usage analytics
									</CardTitle>
									<CardDescription>
										Track latency, errors, and spend with clean dashboards.
									</CardDescription>
								</CardHeader>
							</Card>
							<Card className="bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<Zap className="size-4 text-primary" />
										Resilient routing
									</CardTitle>
									<CardDescription>
										Fallback between providers automatically when it matters.
									</CardDescription>
								</CardHeader>
							</Card>
						</div>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-20">
						<div className="rounded-2xl border border-border/70 bg-card/30 px-6 py-10 backdrop-blur">
							<div className="grid gap-8 md:grid-cols-2 md:items-center">
								<div>
									<div className="text-sm text-muted-foreground">
										Trusted by builders
									</div>
									<div className="mt-2 text-2xl font-semibold tracking-tight">
										Designed for teams who care about reliability
									</div>
									<p className="mt-3 text-sm text-muted-foreground">
										From prototypes to production, keep your routing and access
										layer consistent.
									</p>
								</div>
								<div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
									<div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/40">
										OpenAI-compatible
									</div>
									<div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/40">
										Low latency
									</div>
									<div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/40">
										Automatic failover
									</div>
									<div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/40">
										Scoped keys
									</div>
									<div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/40">
										Exports
									</div>
									<div className="rounded-xl border border-border/70 bg-background/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-background/40">
										Audit-ready
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-20">
						<div className="grid gap-8 lg:grid-cols-12 lg:items-start">
							<div className="lg:col-span-5">
								<div className="text-sm text-muted-foreground">
									How it works
								</div>
								<h2 className="mt-2 text-3xl font-semibold tracking-tight">
									Go from signup to shipping in minutes
								</h2>
								<p className="mt-4 text-sm text-muted-foreground">
									Create an account, generate keys, and route requests with
									clear guardrails.
								</p>
								<div className="mt-6 flex gap-3">
									<Button asChild>
										<Link to="/pricing">View pricing</Link>
									</Button>
									<Button variant="outline" asChild>
										<Link to="/register">Create account</Link>
									</Button>
								</div>
							</div>

							<div className="lg:col-span-7">
								<div className="grid gap-4 md:grid-cols-3">
									<Card className="bg-card/40 backdrop-blur">
										<CardHeader>
											<div className="flex items-center gap-3">
												<div className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/30 text-sm font-semibold">
													1
												</div>
												<div>
													<CardTitle className="text-base">
														Create access
													</CardTitle>
													<CardDescription>
														Register and set up your first workspace.
													</CardDescription>
												</div>
											</div>
										</CardHeader>
										<CardContent className="text-sm text-muted-foreground">
											Invite teammates later as your project grows.
										</CardContent>
									</Card>
									<Card className="bg-card/40 backdrop-blur">
										<CardHeader>
											<div className="flex items-center gap-3">
												<div className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/30 text-sm font-semibold">
													2
												</div>
												<div>
													<CardTitle className="text-base">
														Issue keys
													</CardTitle>
													<CardDescription>
														Generate keys with clear scopes and policies.
													</CardDescription>
												</div>
											</div>
										</CardHeader>
										<CardContent className="text-sm text-muted-foreground">
											Rotate quickly without downtime.
										</CardContent>
									</Card>
									<Card className="bg-card/40 backdrop-blur">
										<CardHeader>
											<div className="flex items-center gap-3">
												<div className="inline-flex size-9 items-center justify-center rounded-full border border-border/70 bg-background/30 text-sm font-semibold">
													3
												</div>
												<div>
													<CardTitle className="text-base">
														Route + monitor
													</CardTitle>
													<CardDescription>
														Understand usage and performance in one place.
													</CardDescription>
												</div>
											</div>
										</CardHeader>
										<CardContent className="text-sm text-muted-foreground">
											See trends before they turn into surprises.
										</CardContent>
									</Card>
								</div>
							</div>
						</div>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-20">
						<div className="grid gap-4 md:grid-cols-3">
							<Card className="bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<Quote className="size-4 text-primary" />
										Lightning setup
									</CardTitle>
									<CardDescription>
										“No more wiring auth and keys across services.”
									</CardDescription>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">
									Everything lives in one clean control plane.
									<div className="mt-4 text-xs text-muted-foreground/80">
										— Early adopter, Indie builder
									</div>
								</CardContent>
							</Card>
							<Card className="bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<Quote className="size-4 text-primary" />
										Clean visibility
									</CardTitle>
									<CardDescription>
										“Usage tracking finally feels effortless.”
									</CardDescription>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">
									See trends, exports, and guardrails at a glance.
									<div className="mt-4 text-xs text-muted-foreground/80">
										— Platform engineer, Startup team
									</div>
								</CardContent>
							</Card>
							<Card className="bg-card/40 backdrop-blur">
								<CardHeader>
									<CardTitle className="flex items-center gap-2 text-base">
										<Quote className="size-4 text-primary" />
										Confident shipping
									</CardTitle>
									<CardDescription>
										“Routing rules saved us when a provider degraded.”
									</CardDescription>
								</CardHeader>
								<CardContent className="text-sm text-muted-foreground">
									Fallbacks and policies keep production stable.
									<div className="mt-4 text-xs text-muted-foreground/80">
										— Engineering lead, SaaS company
									</div>
								</CardContent>
							</Card>
						</div>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-20">
						<Card className="bg-card/40 backdrop-blur">
							<CardHeader>
								<CardTitle className="text-lg">FAQ</CardTitle>
								<CardDescription>
									Answers to questions you might have before starting.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-6 md:grid-cols-2">
								<div className="space-y-2">
									<div className="text-sm font-medium">
										Do you support multiple providers?
									</div>
									<div className="text-sm text-muted-foreground">
										Yes. NeuroGate is designed around routing and resiliency
										across providers.
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-sm font-medium">
										How is authentication handled?
									</div>
									<div className="text-sm text-muted-foreground">
										HTTP-only auth cookies from the server, with a client token
										available for UI state.
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-sm font-medium">Can I rotate keys?</div>
									<div className="text-sm text-muted-foreground">
										Yes. Keys are designed to be rotated without disrupting your
										workflows.
									</div>
								</div>
								<div className="space-y-2">
									<div className="text-sm font-medium">
										Is there a free plan?
									</div>
									<div className="text-sm text-muted-foreground">
										Starter is free, and you can upgrade later when you need
										more controls.
									</div>
								</div>
							</CardContent>
						</Card>
					</section>

					<section className="mx-auto max-w-6xl px-6 pb-24">
						<div className="rounded-2xl border border-border/70 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.22),transparent_60%)] px-6 py-10 backdrop-blur">
							<div className="grid gap-8 lg:grid-cols-12 lg:items-center">
								<div className="lg:col-span-7">
									<h3 className="text-2xl font-semibold tracking-tight">
										Start routing smarter today
									</h3>
									<p className="mt-2 text-sm text-muted-foreground">
										Create an account and get a working setup fast. Upgrade when
										you need advanced controls.
									</p>
									<div className="mt-6 flex flex-col gap-3 sm:flex-row">
										<Button size="lg" asChild>
											<Link to="/register">
												Get started <ArrowRight className="size-4" />
											</Link>
										</Button>
										<Button size="lg" variant="outline" asChild>
											<Link to="/pricing">View pricing</Link>
										</Button>
									</div>
								</div>

								<div className="lg:col-span-5">
									<div className="rounded-xl border border-border/70 bg-background/30 p-5">
										<div className="text-sm font-medium">What you get</div>
										<div className="mt-4 space-y-3 text-sm text-muted-foreground">
											<div className="flex items-start gap-2">
												<Check className="mt-0.5 size-4 text-emerald-300" />
												<span>Secure auth and session handling</span>
											</div>
											<div className="flex items-start gap-2">
												<Check className="mt-0.5 size-4 text-emerald-300" />
												<span>API keys with consistent policies</span>
											</div>
											<div className="flex items-start gap-2">
												<Check className="mt-0.5 size-4 text-emerald-300" />
												<span>Usage visibility for cost control</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
					<div id="docs" className="sr-only" />
				</main>

				<footer className="relative border-t border-border/60">
					<div className="mx-auto max-w-6xl px-6 py-14">
						<div className="grid gap-10 lg:grid-cols-12">
							<div className="lg:col-span-4">
								<div className="flex items-center gap-3">
									<img src={Logo} alt="NeuroGate" className="h-10 w-10" />
									<div>
										<div className="text-sm font-semibold tracking-wide">
											NeuroGate
										</div>
										<div className="text-sm text-muted-foreground">
											Route, secure, and monitor your AI workloads.
										</div>
									</div>
								</div>

								<div className="mt-6 flex items-center gap-3 text-muted-foreground">
									<a
										href="#"
										className="inline-flex items-center justify-center rounded-lg border border-border/70 bg-card/30 p-2 hover:text-foreground"
										aria-label="Twitter"
									>
										<Twitter className="size-4" />
									</a>
									<a
										href="#"
										className="inline-flex items-center justify-center rounded-lg border border-border/70 bg-card/30 p-2 hover:text-foreground"
										aria-label="GitHub"
									>
										<Github className="size-4" />
									</a>
								</div>
							</div>

							<div className="grid gap-8 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-3">
								<div className="space-y-3">
									<div className="text-sm font-medium">Product</div>
									<div className="flex flex-col gap-2 text-sm text-muted-foreground">
										<Link to="/pricing" className="hover:text-foreground">
											Pricing
										</Link>
										<Link to="/api-tester" className="hover:text-foreground">
											API Tester
										</Link>
										<Link to="/register" className="hover:text-foreground">
											Get started
										</Link>
									</div>
								</div>
								<div className="space-y-3">
									<div className="text-sm font-medium">Account</div>
									<div className="flex flex-col gap-2 text-sm text-muted-foreground">
										<Link to="/login" className="hover:text-foreground">
											Login
										</Link>
										<Link to="/register" className="hover:text-foreground">
											Register
										</Link>
										<Link to="/" className="hover:text-foreground">
											Status
										</Link>
									</div>
								</div>
								<div className="space-y-3">
									<div className="text-sm font-medium">Company</div>
									<div className="flex flex-col gap-2 text-sm text-muted-foreground">
										<Link to="/" className="hover:text-foreground">
											About
										</Link>
										<Link to="/" className="hover:text-foreground">
											Privacy
										</Link>
										<Link to="/" className="hover:text-foreground">
											Terms
										</Link>
									</div>
								</div>
							</div>

							<div className="lg:col-span-3">
								<div className="text-sm font-medium">Get updates</div>
								<p className="mt-2 text-sm text-muted-foreground">
									Occasional product notes. No spam.
								</p>
								<div className="mt-4 flex gap-2">
									<Input placeholder="you@company.com" />
									<Button type="button">Join</Button>
								</div>
								<p className="mt-3 text-xs text-muted-foreground">
									By subscribing, you agree to receive updates from NeuroGate.
								</p>
							</div>
						</div>

						<div className="mt-12 flex flex-col justify-between gap-3 border-t border-border/60 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
							<div>
								© {new Date().getFullYear()} NeuroGate. All rights reserved.
							</div>
							<div className="flex items-center gap-4">
								<Link to="/pricing" className="hover:text-foreground">
									Pricing
								</Link>
								<Link to="/login" className="hover:text-foreground">
									Login
								</Link>
								<Link to="/register" className="hover:text-foreground">
									Register
								</Link>
							</div>
						</div>
					</div>
				</footer>
			</div>
		</div>
	);
}
