import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Wallet,
  Brain,
  FileCheck,
  Shield,
  Search,
  Lock,
  Sparkles,
  Check,
  ArrowRight,
  Github,
  Twitter,
} from "lucide-react";
import styles from "./page.module.css";

function PredictionCard({
  question,
  yesPercent,
  noPercent,
  totalPool,
}: {
  question: string;
  yesPercent: number;
  noPercent: number;
  totalPool: string;
}) {
  return (
    <div className={styles.card + " p-6"}>
      <h3
        className={
          styles.heading + " text-white text-[20px] font-semibold mb-4"
        }
      >
        {question}
      </h3>
      <div className="space-y-3 mb-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#3CE6FF] font-medium">YES</span>
            <span className="text-white/80">{yesPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#3CE6FF] transition-all duration-500"
              style={{ width: `${yesPercent}%` }}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-[#9A6BFF] font-medium">NO</span>
            <span className="text-white/80">{noPercent}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#9A6BFF] transition-all duration-500"
              style={{ width: `${noPercent}%` }}
            />
          </div>
        </div>
      </div>
      <p className={styles.body + " text-sm text-white/80"}>
        Total pool: {totalPool}
      </p>
    </div>
  );
}

function StepCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.card + " p-6 text-center"}>
      <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-[#9A6BFF]/20 flex items-center justify-center border border-white/5">
        <Icon className="w-6 h-6 text-[#9A6BFF]" />
      </div>
      <h3
        className={
          styles.heading + " text-white text-[20px] font-semibold mb-2"
        }
      >
        {title}
      </h3>
      <p className={styles.body + " text-[16px] text-white/80"}>
        {description}
      </p>
    </div>
  );
}

function TrustCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-[#3CE6FF]/10 flex items-center justify-center shrink-0 border border-white/5">
        <Icon className="w-5 h-5 text-[#3CE6FF]" />
      </div>
      <div>
        <h3
          className={
            styles.heading + " text-white text-[20px] font-semibold mb-1"
          }
        >
          {title}
        </h3>
        <p className={styles.body + " text-[16px] text-white/80"}>
          {description}
        </p>
      </div>
    </div>
  );
}

function ResolutionStep({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className={styles.card + " p-6 text-center"}>
      <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-[#9A6BFF]/20 border-2 border-[#9A6BFF] flex items-center justify-center text-[#9A6BFF] font-semibold text-sm">
        {step}
      </div>
      <h3
        className={
          styles.heading + " text-white text-[20px] font-semibold mb-2"
        }
      >
        {title}
      </h3>
      <p className={styles.body + " text-[16px] text-white/80"}>
        {description}
      </p>
    </div>
  );
}

export default function Home() {
  return (
    <div className={styles.page + " min-h-screen bg-[#070B14] text-white"}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#070B14] pb-24 md:pb-32">
        <Image
          src="/hero.png"
          alt=""
          fill
          priority
          className="absolute inset-0 object-cover opacity-80 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-4 relative">
          <Link
            href="/"
            className="flex items-center gap-2 pt-4 md:pt-12 md:pb-16"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#9A6BFF] to-[#3CE6FF] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={styles.heading + " text-xl font-semibold"}>
              BetMe
            </span>
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1
                className={
                  styles.heading +
                  " text-[40px] md:text-[56px] lg:text-[64px] font-bold leading-tight"
                }
              >
                Bet on reality.
                <br />
                <span className={styles.gradientText}>Not opinions.</span>
              </h1>
              <p
                className={
                  styles.body +
                  " text-[16px] text-white/80 max-w-lg leading-relaxed"
                }
              >
                Create prediction events. Stake real value. AI resolves the
                truth — blockchain enforces it.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/app"
                  className={
                    styles.btnPrimary +
                    " inline-flex items-center gap-2 px-8 py-3 text-[16px]"
                  }
                >
                  Launch App
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-[16px] text-white/80">
                <span className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-[#9A6BFF]" />
                  AI verified outcomes
                </span>
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#9A6BFF]" />
                  Cosmos powered
                </span>
                <span className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-[#3CE6FF]" />
                  USDT settlements
                </span>
              </div>
            </div>
            <div className="relative">
              <PredictionCard
                question="Will Bitcoin hit $100K by 2025?"
                yesPercent={46}
                noPercent={54}
                totalPool="$120,500 USDT"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-[#0E1628]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2
              className={
                styles.heading + " text-[36px] font-semibold text-white mb-4"
              }
            >
              How It Works
            </h2>
            <p
              className={
                styles.body + " text-[16px] text-white/80 max-w-2xl mx-auto"
              }
            >
              From creating a prediction to getting paid — everything is
              automated and trustless.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard
              icon={Plus}
              title="Create event"
              description="Define real world outcome."
            />
            <StepCard
              icon={Wallet}
              title="Stake value"
              description="Bet USDT on Yes or No."
            />
            <StepCard
              icon={Brain}
              title="AI verifies"
              description="Checks trusted sources."
            />
            <StepCard
              icon={FileCheck}
              title="Auto payout"
              description="Smart contracts pay winners."
            />
          </div>
        </div>
      </section>

      {/* Trustless by Design - video or image background */}
      <section className="relative py-20 overflow-hidden min-h-[480px]">
        {/* Background: MP4 video (parallax-style fixed when in view would need client JS) */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            poster="/slide.png"
          >
            <source src="/slide.mp4" type="video/mp4" />
            {/* Optional: add WebM for smaller size where supported */}
            {/* <source src="/slide.webm" type="video/webm" /> */}
          </video>
        </div>
        {/* Content on top */}
        <div className="relative z-10 max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2
                className={
                  styles.heading + " text-[36px] font-semibold text-white"
                }
              >
                Trustless by Design
              </h2>
              <p
                className={
                  styles.body + " text-[16px] text-white/80 leading-relaxed"
                }
              >
                No intermediaries. No human bias. Just verifiable truth enforced
                by code.
              </p>
              <div className="space-y-6">
                <TrustCard
                  icon={Shield}
                  title="No human judges"
                  description="No moderators, no voting, no bias."
                />
                <TrustCard
                  icon={Search}
                  title="AI with verifiable sources"
                  description="Resolutions are based on public and verifiable data."
                />
                <TrustCard
                  icon={Lock}
                  title="Immutable payouts"
                  description="Once the outcome is verified, payouts are executed on-chain."
                />
              </div>
            </div>
            <div>
              <PredictionCard
                question="Will SpaceX land humans on Mars before 2030?"
                yesPercent={62}
                noPercent={38}
                totalPool="$184,000 USDT"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Resolution Process */}
      <section className="py-20 bg-[#0E1628]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2
              className={
                styles.heading + " text-[36px] font-semibold text-white mb-4"
              }
            >
              Resolution Process
            </h2>
            <p
              className={
                styles.body + " text-[16px] text-white/80 max-w-2xl mx-auto"
              }
            >
              Every prediction, every resolution, every payout — permanently
              recorded and verifiable on-chain.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ResolutionStep
              step="1"
              title="Event ends"
              description="The prediction period closes and the outcome is locked."
            />
            <ResolutionStep
              step="2"
              title="AI fetches sources"
              description="AI retrieves data from trusted sources and APIs."
            />
            <ResolutionStep
              step="3"
              title="Evidence evaluation"
              description="Multiple sources are used to determine the correct outcome."
            />
            <ResolutionStep
              step="4"
              title="Result on-chain"
              description="Final result is written to the blockchain and payouts are executed."
            />
          </div>
        </div>
      </section>

      {/* CTA - Predict the future */}
      <section className="relative py-24 bg-[#070B14] border-t border-white/8 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage: "url('/betme.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.85,
          }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center space-y-8">
          <h2
            className={styles.heading + " text-[36px] font-semibold text-white"}
          >
            Predict the future.
            <br />
            <span className={styles.gradientText}>
              Get rewarded for being right.
            </span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/app"
              className={
                styles.btnPrimary +
                " inline-flex items-center gap-2 px-8 py-3 text-[16px]"
              }
            >
              Launch App
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 bg-[#070B14] py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#9A6BFF] to-[#3CE6FF] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className={styles.heading + " font-semibold"}>BetMe</span>
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/80">
            {/* <Link href="#" className="hover:text-white transition-colors">
              Docs
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Community
            </Link> */}
            <Link
              href="#"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Github className="w-4 h-4" /> Github
            </Link>
            {/* <Link
              href="#"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Twitter className="w-4 h-4" /> Twitter
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms
            </Link> */}
          </div>
        </div>
      </footer>
    </div>
  );
}
