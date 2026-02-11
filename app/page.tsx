"use client";

import { Button } from "@/components/button";
import { Card, CardContent } from "@/components/card";
import {
  Plus,
  TrendingUp,
  Brain,
  Wallet,
  Shield,
  Search,
  FileCheck,
  Lock,
  Link2,
  History,
  ScrollText,
  ArrowRight,
  ExternalLink,
  Rocket,
  Target,
} from "lucide-react";

// Prediction Market Card Component
function PredictionCard({
  question,
  yesPercent,
  noPercent,
  totalPool,
  participants,
  source,
  variant = "default",
}: {
  question: string;
  yesPercent: number;
  noPercent: number;
  totalPool: string;
  participants?: string;
  source?: string;
  variant?: "default" | "mars";
}) {
  return (
    <Card
      className={`relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm ${variant === "mars" ? "md:col-span-2" : ""}`}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 pixel-pattern opacity-50" />
      {variant === "mars" && (
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/10 via-transparent to-red-900/10" />
      )}

      <CardContent className="relative p-6">
        {/* Question */}
        <h3 className="text-lg font-semibold text-foreground mb-4 leading-snug">
          {question}
        </h3>

        {/* Voting Progress */}
        <div className="space-y-3 mb-4">
          {/* Yes option */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[#2ecc71] font-medium">YES</span>
              <span className="text-muted-foreground">{yesPercent}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#2ecc71] rounded-full transition-all duration-500"
                style={{ width: `${yesPercent}%` }}
              />
            </div>
          </div>

          {/* No option */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-[#9b59b6] font-medium">NO</span>
              <span className="text-muted-foreground">{noPercent}%</span>
            </div>
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-[#9b59b6] rounded-full transition-all duration-500"
                style={{ width: `${noPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Pool Info */}
        <div className="flex items-center justify-between text-sm">
          <div>
            <span className="text-muted-foreground">Total Pool: </span>
            <span className="text-foreground font-semibold">{totalPool}</span>
          </div>
          {participants && (
            <div className="text-muted-foreground">
              Participants: {participants}
            </div>
          )}
        </div>

        {/* Resolution Source */}
        {source && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Resolution: {source}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// How It Works Step Card
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
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm group hover:bg-card/80 transition-colors">
      <CardContent className="p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-purple/10 flex items-center justify-center group-hover:bg-purple/20 transition-colors">
          <Icon className="w-6 h-6 text-purple" />
        </div>
        <h3 className="text-foreground font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}

// Trust Feature Card
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
    <Card className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm hover:border-cyan/30 transition-colors group">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center shrink-0 group-hover:bg-cyan/20 transition-colors">
            <Icon className="w-5 h-5 text-cyan" />
          </div>
          <div>
            <h3 className="text-foreground font-semibold mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Technical Feature
function TechFeature({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-card/50 border border-border/50 hover:border-border transition-colors">
      <div className="w-8 h-8 rounded-lg bg-purple/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-purple" />
      </div>
      <span className="text-foreground text-sm font-medium">{title}</span>
    </div>
  );
}

// Timeline Step
function TimelineStep({
  step,
  label,
  isLast = false,
}: {
  step: string;
  label: string;
  isLast?: boolean;
}) {
  return (
    <div className="flex flex-col items-center relative">
      <div className="w-8 h-8 rounded-full bg-cyan/20 border-2 border-cyan flex items-center justify-center text-xs font-semibold text-cyan glow-cyan">
        {step}
      </div>
      <span className="mt-2 text-xs text-muted-foreground text-center max-w-[80px]">
        {label}
      </span>
      {!isLast && (
        <div
          className="hidden md:block absolute top-4 left-full w-full h-0.5 bg-gradient-to-r from-cyan/50 to-transparent"
          style={{ width: "calc(100% - 2rem)", left: "calc(100% + 0.5rem)" }}
        />
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 animated-gradient" />
        <div className="absolute inset-0 pixel-pattern" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple/5 rounded-full blur-[120px]" />

        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              {/* Main headline */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                  Bet on reality.
                  <br />
                  <span className="gradient-text">Not opinions.</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  Create prediction events. Stake real value. AI resolves the
                  truth — blockchain enforces it.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-purple hover:bg-purple-hover text-white font-semibold px-8 glow-purple"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-border text-foreground hover:bg-card"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Explore Markets
                </Button>
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan" />
                  AI-verified outcomes
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-purple" />
                  Cosmos-powered blockchain
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#2ecc71]" />
                  USDT settlements
                </span>
              </div>
            </div>

            {/* Right: Prediction Card Preview */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple/10 to-cyan/10 rounded-2xl blur-2xl" />
              <PredictionCard
                question="Will Bitcoin hit $100K by 2024?"
                yesPercent={46}
                noPercent={54}
                totalPool="$120,500 USDT"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative border-t border-border/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From creating a prediction to getting paid — everything is
              automated and trustless.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StepCard
              icon={Plus}
              title="Create an event"
              description="Ask a question about a real-world outcome."
            />
            <StepCard
              icon={Target}
              title="Stake on outcomes"
              description="Bet USDT on Yes or No options."
            />
            <StepCard
              icon={Brain}
              title="AI verifies reality"
              description="AI checks trusted sources automatically."
            />
            <StepCard
              icon={Wallet}
              title="Automatic payout"
              description="Smart contracts pay the winners instantly."
            />
          </div>
        </div>
      </section>

      {/* Trust Features Section */}
      <section className="relative border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Trustless by Design
              </h2>
              <p className="text-muted-foreground text-lg">
                No intermediaries. No human bias. Just verifiable truth enforced
                by code.
              </p>

              <div className="space-y-4">
                <TrustCard
                  icon={Shield}
                  title="No human judges"
                  description="No moderators. No voting. No bias."
                />
                <TrustCard
                  icon={Search}
                  title="AI with sources"
                  description="Verified by public, open data sources."
                />
                <TrustCard
                  icon={Lock}
                  title="Immutable payouts"
                  description="Once decided, it's final on-chain forever."
                />
              </div>
            </div>

            <div className="grid gap-6">
              <PredictionCard
                question="Will SpaceX land humans on Mars before 2030?"
                yesPercent={62}
                noPercent={38}
                totalPool="$184,230 USDT"
                participants="4,912"
                source="NASA, SpaceX official releases"
                variant="mars"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline Section */}
      <section className="relative border-t border-border/50">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Resolution Process
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every prediction goes through a transparent, automated resolution
              process.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-4 md:justify-between max-w-4xl mx-auto">
            <TimelineStep step="1" label="Event Ends" />
            <TimelineStep step="2" label="AI Fetches Sources" />
            <TimelineStep step="3" label="Evidence Evaluated" />
            <TimelineStep step="4" label="Outcome On-Chain" isLast />
          </div>
        </div>
      </section>

      {/* Technical Features Section */}
      <section className="relative border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 grid sm:grid-cols-2 gap-4">
              <TechFeature icon={Link2} title="Cosmos SDK Blockchain" />
              <TechFeature icon={Wallet} title="ERC-20 (USDT) Compatible" />
              <TechFeature icon={History} title="Transparent Event History" />
              <TechFeature
                icon={ScrollText}
                title="Deterministic Smart Contracts"
              />
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Built for Transparency
              </h2>
              <p className="text-muted-foreground text-lg">
                Every transaction, every resolution, every payout — permanently
                recorded and verifiable on-chain.
              </p>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-cyan hover:text-cyan/80 transition-colors font-medium"
              >
                Read technical documentation
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative border-t border-border/50">
        <div className="absolute inset-0 bg-gradient-to-b from-purple/5 to-transparent" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Predict the future.
              <br />
              <span className="gradient-text">
                Get rewarded for being right.
              </span>
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-purple hover:bg-purple-hover text-white font-semibold px-8 glow-purple"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Launch App
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border text-foreground hover:bg-card"
              >
                Read Docs
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple" />
              <span className="font-semibold text-foreground">PredictAI</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 PredictAI. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Docs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
