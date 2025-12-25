"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  HelpCircle,
  FileText,
  BookOpen,
  MessageCircle,
  Send,
  ChevronDown,
  ChevronUp,
  Headphones,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Star,
  Users,
  TrendingUp,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { createSupportThunk } from "@/redux/thunk/supportThunk";
import { useSession } from "next-auth/react";
import { routes } from "@/utilities/routes";
import Link from "next/link";
import { zodFormikValidate } from "@/utilities/zodFormikValidate";

// Support ticket form validation schema
const supportTicketSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().min(1, "Please select a priority"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportTicketFormValues = z.infer<typeof supportTicketSchema>;

const initialValues: SupportTicketFormValues = {
  name: "",
  email: "",
  subject: "",
  category: "",
  priority: "",
  message: "",
};

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: session } = useSession();
  const isAuthenticated = !!session;

  const dispatch = useAppDispatch()

  const { isLoading } = useAppSelector((state) => state.support);

  // Formik form configuration
  const formik = useFormik<SupportTicketFormValues>({
    initialValues,
    validate: zodFormikValidate(supportTicketSchema),

    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        await dispatch(createSupportThunk(values)).unwrap();

        toast.success("Support ticket submitted successfully! We'll get back to you soon.", {
          theme: "dark",
        });

        resetForm();
      } catch (error: any) {
        toast.error(error.message || "Failed to submit ticket. Please try again.", {
          theme: "dark",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

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

  const supportCategories = [
    { value: "technical", label: "Technical Issue" },
    { value: "billing", label: "Billing & Payment" },
    { value: "account", label: "Account Management" },
    { value: "feature", label: "Feature Request" },
    { value: "bug", label: "Bug Report" },
    { value: "other", label: "Other" },
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "text-green-400" },
    { value: "medium", label: "Medium", color: "text-yellow-400" },
    { value: "high", label: "High", color: "text-orange-400" },
    { value: "urgent", label: "Urgent", color: "text-red-400" },
  ];

  const faqs = [
    {
      question: "How do I submit a support ticket?",
      answer:
        "You can submit a support ticket using the form on this page. Fill in your details, select a category and priority level, describe your issue, and click submit. Our team typically responds within 24 hours.",
    },
    {
      question: "What are your support hours?",
      answer:
        "Our support team is available Monday through Friday, 9 AM to 6 PM EST. Premium and VIP members receive priority support with extended hours and faster response times.",
    },
    {
      question: "How long does it take to get a response?",
      answer:
        "Response times vary by plan: Basic plan members receive responses within 24-48 hours, Premium members within 12-24 hours, and VIP members within 2-4 hours. Urgent issues are prioritized across all plans.",
    },
    {
      question: "Can I track my support ticket status?",
      answer:
        "Yes! Once you submit a ticket, you'll receive a confirmation email with a ticket number. You can track your ticket status through your account dashboard or by replying to the confirmation email.",
    },
    {
      question: "What information should I include in my support ticket?",
      answer:
        "Please include: your account email, a clear description of the issue, steps to reproduce (if applicable), screenshots or error messages, and your plan type. The more details you provide, the faster we can help!",
    },
    {
      question: "Do you offer phone support?",
      answer:
        "Phone support is available for VIP plan members. Premium and Basic plan members can reach us via email or through the support ticket system. All members have access to our comprehensive knowledge base.",
    },
    {
      question: "How do I cancel my subscription?",
      answer:
        "You can cancel your subscription anytime from your account dashboard under 'Billing & Subscription'. Your access will continue until the end of your current billing period. No questions asked!",
    },
    {
      question: "What if I'm not satisfied with the support I received?",
      answer:
        "We're committed to providing excellent support. If you're not satisfied, please escalate your concern by submitting a new ticket marked as 'High Priority' or contact our support manager directly. We'll work to resolve your issue promptly.",
    },
  ];

  const helpResources = [
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Knowledge Base",
      description: "Browse our comprehensive guides and tutorials",
      link: "#",
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentation",
      description: "Detailed documentation for all features",
      link: "#",
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "Community Forum",
      description: "Connect with other members and share tips",
      link: "#",
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "Video Tutorials",
      description: "Step-by-step video guides for common tasks",
      link: "#",
    },
  ];

  
  const handleScrollToSuportTicket = () => {
    const supportTicketForm = document.getElementById("support-ticket-form");
    if (supportTicketForm) {
      supportTicketForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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
        <section className="relative px-4 py-16 md:py-24">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Badge */}
              <motion.div
                className="inline-block px-4 py-2 mb-6 rounded-full bg-yellow-400/10 border border-yellow-400/30"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-yellow-400 text-sm font-semibold">SUPPORT</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                We're Here to{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  Help You
                </span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Get the support you need, when you need it. Our team is ready to assist you with any questions or issues.
              </motion.p>
            </motion.div>

            {/* Contact Methods Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              {/* Email Card */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Mail className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Email Support</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    Send us an email and we'll respond within 24 hours
                  </p>
                  <a
                    href="mailto:support@bestbet.com"
                    className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm flex items-center gap-2 transition-colors"
                  >
                    support@bestbet.com
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>

              {/* Phone Card */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Phone className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Phone Support</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    VIP members: Call us for immediate assistance
                  </p>
                  <a
                    href="tel:+15123619158"
                    className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm flex items-center gap-2 transition-colors"
                  >
                    +1 (512) 361-9158
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>

              {/* Live Chat Card */}
              <motion.div
                className="group relative bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 hover:border-yellow-400/50 transition-all duration-300"
                variants={staggerItem}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                <div className="relative z-10">
                  <motion.div
                    className="w-14 h-14 mb-6 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-400/20"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <MessageSquare className="w-7 h-7 text-black" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-3 text-white">Live Chat</h3>
                  <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                    Chat with our support team in real-time
                  </p>
                  <button
                    onClick={() => toast.info("Live chat coming soon!", { theme: "dark" })}
                    className="text-yellow-400 hover:text-yellow-300 font-semibold text-sm flex items-center gap-2 transition-colors"
                  >
                    Start Chat
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>

            {/* Response Time Indicators */}
            {/* <motion.div
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10 mb-16"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-yellow-400" />
                <h3 className="text-2xl font-bold text-white">Response Times</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Basic Plan</div>
                    <div className="text-yellow-400 font-bold text-lg">24-48 hours</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 flex items-center justify-center flex-shrink-0">
                    <Star className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">Premium Plan</div>
                    <div className="text-yellow-400 font-bold text-lg">12-24 hours</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-yellow-400/20 to-yellow-500/20 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm mb-1">VIP Plan</div>
                    <div className="text-yellow-400 font-bold text-lg">2-4 hours</div>
                  </div>
                </div>
              </div>
            </motion.div> */}

              <motion.div
              className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >

              <Button onClick={handleScrollToSuportTicket} type="text" className="flex items-center mb-6 !w-fit text-lg rounded-lg font-semibold !px-2 py-2 h-fit animate-bounce">
                <ChevronDown className="w-10 h-10 text-yellow-400" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ==================== SUPPORT TICKET FORM SECTION ==================== */}
        <section id="support-ticket-form"  className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
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
                <span className="text-yellow-500 text-sm font-semibold">SUPPORT REQUEST</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Create a <span className="bg-gradient-to-r from-yellow-500 to-yellow-400 bg-clip-text text-transparent">Support Request</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Fill out the form below and our team will get back to you as soon as possible.
              </p>
            </motion.div>

            {/* Support Ticket Form */}
            <motion.div
              className="bg-white/5 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-white/10"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      className="h-10.5"
                      placeholder="Enter your full name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        {formik.errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Input */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="email"
                      className="h-10.5"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Input */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                    Subject <span className="text-red-400">*</span>
                  </label>
                  <Input
                    className="h-10.5"
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Brief description of your issue"
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.subject && formik.errors.subject && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      {formik.errors.subject}
                    </p>
                  )}
                </div>

                {/* Category and Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category Select */}
                  <div className="space-y-2">
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300">
                      Category <span className="text-red-400">*</span>
                    </label>
                    <Select
                      value={formik.values.category}
                      onValueChange={(value) => {
                        formik.setFieldValue("category", value);
                        formik.setFieldTouched("category", true);
                      }}
                    >
                      <SelectTrigger
                        className="h-10.5"
                        onBlur={() => formik.setFieldTouched("category", true)}
                      >
                        <SelectValue placeholder="Select a category">
                          {formik.values.category
                            ? supportCategories.find((cat) => cat.value === formik.values.category)?.label
                            : "Select a category"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {supportCategories.map((cat) => (
                          <SelectItem
                            key={cat.value}
                            value={cat.value}
                            className="hover:bg-white/10 focus:bg-white/10 text-white"
                          >
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.category && formik.errors.category && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        {formik.errors.category}
                      </p>
                    )}
                  </div>

                  {/* Priority Select */}
                  <div className="space-y-2">
                    <label htmlFor="priority" className="block text-sm font-medium text-gray-300">
                      Priority <span className="text-red-400">*</span>
                    </label>
                    <Select
                      value={formik.values.priority}
                      onValueChange={(value) => {
                        formik.setFieldValue("priority", value);
                        formik.setFieldTouched("priority", true);
                      }}
                    >
                      <SelectTrigger
                        className="h-10.5"
                        onBlur={() => formik.setFieldTouched("priority", true)}
                      >
                        <SelectValue placeholder="Select priority level">
                          {formik.values.priority
                            ? priorityLevels.find((p) => p.value === formik.values.priority)?.label
                            : "Select priority level"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {priorityLevels.map((priority) => (
                          <SelectItem
                            key={priority.value}
                            value={priority.value}
                            className={`hover:bg-white/10 focus:bg-white/10 ${priority.color}`}
                          >
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formik.touched.priority && formik.errors.priority && (
                      <p className="text-xs text-red-400 flex items-center gap-1">
                        {formik.errors.priority}
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                    Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    placeholder="Please provide detailed information about your issue..."
                    value={formik.values.message}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="w-full px-4 py-3 bg-bg-primary border border-white/10 rounded-lg text-white placeholder:text-gray-500 hover:bg-bg-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-border-accent transition-colors resize-none"
                  />
                  {formik.touched.message && formik.errors.message && (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      {formik.errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex items-center justify-center">
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={formik.isSubmitting}
                    className="!w-2/3 py-4 text-lg rounded-lg font-semibold"
                    icon={<Send className="w-5 h-5" />}
                  >
                    {/* Submit Support Ticket */}
                    {isLoading ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        </section>

        {/* ==================== FAQ SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-4xl mx-auto">
            {/* Section Header */}
            <motion.div
              className="text-center mb-12"
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
                <span className="text-yellow-400 text-sm font-semibold">FAQ</span>
              </motion.div>
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                Frequently Asked <span className="bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">Questions</span>
              </h2>
              <p className="text-gray-400 text-lg">
                Find quick answers to common questions about our support services.
              </p>
            </motion.div>

            {/* FAQ Accordion */}
            <motion.div
              className="space-y-4"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true, margin: "-50px" }}
            >
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className={`bg-white/5 backdrop-blur-md rounded-xl border border-white/10 overflow-hidden hover:border-yellow-400/50 transition-all duration-300 ${openFaq === index ? "border-yellow-400" : ""
                    }`}
                  variants={staggerItem}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-white pr-4">{faq.question}</span>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-yellow-400 flex-shrink-0 transition-transform" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-yellow-400 flex-shrink-0 transition-transform" />
                    )}
                  </button>
                  {openFaq === index && (
                    <motion.div
                      className="px-6 pb-5 text-gray-400 leading-relaxed"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {faq.answer}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>


        {/* ==================== CTA SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-5xl mx-auto text-center">
            {/* Announcement */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-yellow-500/10 border border-yellow-500/30"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-yellow-400 font-semibold">
                Premium & VIP Members Get Priority Support
              </span>
            </motion.div>
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <motion.h2
                className="text-4xl md:text-6xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Ready to Get{" "}
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 bg-clip-text text-transparent">
                  Premium Support?
                </span>
              </motion.h2>

              <motion.p
                className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Upgrade to Premium or VIP and get faster response times, priority support, and exclusive features to maximize your winning potential.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Link
                  href={isAuthenticated
                    ? routes.home
                    : routes.auth.register}
                  className="px-10 py-5 bg-white/10 backdrop-blur-md border-2 border-white/20 text-white font-bold text-xl rounded-xl hover:bg-white/20 hover:border-yellow-400/50 transition-all duration-300"
                >
                  {isAuthenticated ? "Go to Dashboard" : "Get Started Today"}
                </Link>

                <Button
                  type="primary"
                  size="large"
                  onClick={() => window.location.href = routes.plans}
                  className="px-10 py-5 text-xl !w-fit h-fit rounded-lg"
                >
                  View Plans
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

      </div>
    </motion.div>
  );
}
