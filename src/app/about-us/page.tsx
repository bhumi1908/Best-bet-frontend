"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { routes } from "@/utilities/routes";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import {
  Target,
  Zap,
  BarChart3,
  Users,
  TrendingUp,
  Shield,
  Award,
  Star,
  Globe,
  CheckCircle2,
  ArrowRight,
  Heart,
  Lightbulb,
  Rocket,
  Clock,
} from "lucide-react";

export default function AboutUsPage() {
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="min-h-screen bg-black text-white overflow-hidden"
      initial="initial"
      animate="animate"
    >
      {/* Animated Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-yellow-900/20 via-transparent to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 8, repeat: Infinity }}
        ></motion.div>
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-yellow-800/10 via-transparent to-transparent"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        ></motion.div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 pt-20">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative px-4 py-16 ">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">ABOUT US</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                About <span className="text-yellow-400">Best Bet</span> Prediction Platform
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                The Most Accurate Pick 3 Predictions On The Planet!
              </motion.p>

              {/* Trust Indicators / Stats */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-12 text-sm md:text-base text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">94.8%</span>
                  <span>Accuracy Rate</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">10,000+</span>
                  <span>Active Members</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">38</span>
                  <span>States Covered</span>
                </motion.div>
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <CheckCircle2 className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">$2.5M+</span>
                  <span>Total Winnings</span>
                </motion.div>
              </motion.div>

              {/* Key Metrics Grid */}
              <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {[
                  { label: "Years of Excellence", value: "5+" },
                  { label: "Daily Predictions", value: "2x" },
                  { label: "Data Points Analyzed", value: "10M+" },
                  { label: "Success Rate", value: "94.8%" },
                ].map((metric, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.3 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -3 }}
                  >
                    <div className="text-2xl md:text-3xl font-black text-yellow-400 mb-2">
                      {metric.value}
                    </div>
                    <div className="text-xs md:text-sm text-gray-400 leading-tight">
                      {metric.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.6 }}
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() =>
                  (window.location.href = isAuthenticated
                    ? routes.landing
                    : routes.auth.register)
                  }
                  className="px-8 py-4 text-lg !w-fit h-fit rounded-lg"
                >
                  {isAuthenticated ? "Go to Home" : "Get Started"}
                </Button>

                <Link href={routes.plans}>
                  <Button
                    type="default"
                    size="large"
                    className="px-8 py-4 text-lg !w-fit h-fit rounded-lg bg-white/10 backdrop-blur-md border-2 border-white/20 text-white hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
                  >
                    View Plans
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== OUR STORY SECTION ==================== */}
        {/* <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            Section Header 
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">OUR STORY</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                How We <span className="text-yellow-400">Started</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                From a simple idea to the most trusted Pick 3 prediction platform
              </p>
            </motion.div>

             Story Timeline/Cards 
                         <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
               Story Card 1 
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                      <Lightbulb className="w-7 h-7 text-black" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">The Beginning</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    Best Bet was founded with a simple yet powerful mission: to provide the most
                    accurate Pick 3 lottery predictions possible. We recognized that players needed
                    more than just random numbers—they needed data-driven insights backed by
                    advanced algorithms and comprehensive historical analysis.
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <Star className="w-4 h-4" />
                      <span>Founded with a vision to revolutionize lottery predictions</span>
                    </div>
                  </div>
                </div>
              </motion.div>

               Story Card 2 
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                      <Rocket className="w-7 h-7 text-black" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Rapid Growth</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    What started as a passion project has grown into a trusted platform serving
                    thousands of players across 38 states. Our commitment to accuracy, transparency,
                    and innovation made us the leading choice for Pick 3 predictions.
                  </p>
                  <div className="pt-4 border-t border-white/10 mt-auto">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <TrendingUp className="w-4 h-4" />
                      <span>Expanded to 38 states in just 2 years</span>
                    </div>
                  </div>
                </div>
              </motion.div>

                 Story Card 3 
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                variants={staggerItem}
                whileHover={{ scale: 1.03, y: -5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20">
                      <TrendingUp className="w-7 h-7 text-black" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">Today & Beyond</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">
                    We continue to push the boundaries of lottery prediction technology, helping
                    our members make informed decisions and achieve their winning goals with
                    industry-leading accuracy. Our advanced AI algorithms process millions of data
                    points daily to deliver the most reliable predictions.
                  </p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 text-sm">
                      <Rocket className="w-4 h-4" />
                      <span>Continuously innovating with cutting-edge technology</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section> */}

        {/* ==================== OUR MISSION SECTION ==================== */}
        {/* <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-500 text-sm font-semibold">MISSION</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Our <span className="text-yellow-400">Mission</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  icon: <Target className="w-8 h-8" />,
                  title: "Accuracy First",
                  description:
                    "We're committed to providing the most accurate predictions possible, using advanced algorithms and comprehensive data analysis to give our members the best chance of success.",
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Real-Time Updates",
                  description:
                    "Our platform delivers instant updates and predictions, ensuring our members always have access to the latest information when they need it most.",
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Transparency & Trust",
                  description:
                    "We believe in complete transparency. Our performance metrics are publicly available, and we're committed to building trust through honest, reliable service.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                  variants={staggerItem}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <motion.div
                    className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center mb-6 text-black shadow-lg shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-4">{item.description}</p>
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 text-yellow-400 text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Core principle we live by</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section> */}

        {/* ==================== WHAT WE DO SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">WHAT WE DO</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                How We <span className="text-yellow-400">Help You Win</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  icon: <BarChart3 className="w-7 h-7" />,
                  title: "Advanced Analytics",
                  description:
                    "Our sophisticated algorithms analyze years of historical data, identifying patterns and trends that help predict winning numbers with industry-leading accuracy.",
                },
                {
                  icon: <Clock className="w-7 h-7" />,
                  title: "Daily Predictions",
                  description:
                    "Get fresh predictions every day for both MID and EVE draws. Our predictions are updated in real-time, ensuring you always have the latest insights.",
                },
                {
                  icon: <Globe className="w-7 h-7" />,
                  title: "Nationwide Coverage",
                  description:
                    "Access predictions for 38 states across the United States. We're continuously expanding our coverage to serve more players nationwide.",
                },
                {
                  icon: <TrendingUp className="w-7 h-7" />,
                  title: "Performance Tracking",
                  description:
                    "Track your success with detailed hit statistics and performance metrics. Monitor your progress and see how our predictions are working for you.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="group bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, y: -3 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black shadow-lg shadow-yellow-400/20 flex-shrink-0"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                      <p className="text-gray-400 leading-relaxed mb-4">{item.description}</p>
                      <div className="flex items-center gap-2 text-yellow-400 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Available in all plans</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== WHY CHOOSE US SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-500 text-sm font-semibold">WHY CHOOSE US</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Why <span className="text-yellow-400">Best Bet?</span>
              </h2>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Left Side - Text Content */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  The Most Trusted Platform for{" "}
                  <span className="text-yellow-400">Pick 3 Predictions</span>
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  At Best Bet, we've revolutionized the way players approach Pick 3 lottery predictions.
                  Our platform combines cutting-edge technology with years of expertise to deliver
                  unparalleled accuracy and reliability.
                </p>
                <p className="text-lg text-gray-300 leading-relaxed">
                  We understand that winning matters to you. That's why we've built a comprehensive
                  system that analyzes millions of data points, tracks historical patterns, and
                  provides real-time insights to maximize your chances of success.
                </p>

                {/* Key Points */}
                <div className="space-y-4 mt-8">
                  {[
                    "Industry-leading 94.8% accuracy rate powered by advanced AI algorithms",
                    "Comprehensive coverage across 38 states with daily predictions",
                    "Transparent performance tracking with detailed analytics"
                  ].map((point, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <CheckCircle2 className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-300 leading-relaxed">{point}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Right Side - Cards */}
              <motion.div
                className="grid grid-cols-2 gap-8"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true, margin: "-50px" }}
              >
                {[
                  {
                    icon: <Award className="w-4 h-4" />,
                    stat: "94.8%",
                    label: "Accuracy Rate",
                    description: "Industry-leading prediction accuracy",
                  },
                  {
                    icon: <Users className="w-4 h-4" />,
                    stat: "10K+",
                    label: "Active Members",
                    description: "Trusted by thousands of players",
                  },
                  {
                    icon: <Globe className="w-4 h-4" />,
                    stat: "38",
                    label: "States Covered",
                    description: "Nationwide coverage and growing",
                  },
                  {
                    icon: <TrendingUp className="w-4 h-4" />,
                    stat: "$2.5M+",
                    label: "Total Winnings",
                    description: "Helped members win big",
                  },
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 text-center flex flex-col items-center justify-center"
                    variants={staggerItem}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center mb-4 text-yellow-400"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    <div className="text-4xl font-black text-white mb-2">{item.stat}</div>
                    <div className="text-sm font-semibold text-yellow-400 mb-2 uppercase tracking-wider">{item.label}</div>
                    <div className="text-xs text-gray-400 leading-relaxed">{item.description}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ==================== OUR VALUES SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-500 text-sm font-semibold">OUR VALUES</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                What We <span className="text-yellow-400">Stand For</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </motion.div>

            {/* Values Grid */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-10"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {[
                {
                  icon: <Shield className="w-7 h-7" />,
                  title: "Integrity",
                  description:
                    "We operate with complete honesty and transparency. Our performance metrics are real, and we're committed to providing accurate, reliable predictions.",
                  color: "from-yellow-400 to-yellow-600",
                },
                {
                  icon: <Rocket className="w-7 h-7" />,
                  title: "Innovation",
                  description:
                    "We continuously improve our algorithms and technology to stay at the forefront of lottery prediction science.",
                  color: "from-yellow-500 to-yellow-600",
                },
                {
                  icon: <Heart className="w-7 h-7" />,
                  title: "Customer Focus",
                  description:
                    "Our members' success is our success. We're dedicated to providing exceptional service and support to help you achieve your goals.",
                  color: "from-yellow-400 to-yellow-600",
                },
                {
                  icon: <Award className="w-7 h-7" />,
                  title: "Responsibility",
                  description:
                    "We promote responsible gaming and encourage our members to play within their means while enjoying the excitement of lottery predictions.",
                  color: "from-yellow-500 to-yellow-600",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                  variants={staggerItem}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-black shadow-lg shadow-yellow-400/20 flex-shrink-0`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {value.icon}
                      </motion.div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                        <p className="text-gray-400 leading-relaxed mb-4">{value.description}</p>
                        <div className="flex items-center gap-2 text-yellow-400 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Guiding principle in everything we do</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ==================== CTA SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-500/10 border border-yellow-500/30"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-yellow-500 text-sm font-semibold">JOIN US</span>
              </motion.div>

              <motion.h2
                className="text-4xl md:text-6xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Ready to Start{" "}
                <span className="text-yellow-400">Winning?</span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Join thousands of members who trust Best Bet for the most accurate Pick 3
                predictions. Start your winning journey today.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Button
                  type="primary"
                  size="large"
                  onClick={() =>
                  (window.location.href = isAuthenticated
                    ? routes.home
                    : routes.auth.register)
                  }
                  className="px-10 py-5 text-xl !w-fit h-fit rounded-lg"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
                </Button>

                <Link href={routes.plans}>
                  <Button type="default" size="large" className="px-10 py-5 text-xl !w-fit h-fit rounded-lg">
                    View Plans
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Custom Styles for Animations */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </motion.div>
  );
}
