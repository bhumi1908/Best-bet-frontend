"use client";

import { motion } from "framer-motion";

export default function PrivacyPolicyPage() {
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
        <section className="relative px-4 py-24">
          <div className="max-w-7xl mx-auto w-full">
            <motion.div
              className="text-center mb-20"
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
                <span className="text-yellow-400 text-sm font-semibold">LEGAL DOCUMENTS</span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl 2xl:text-7xl font-black mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Privacy <span className="text-yellow-400">Policy</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Your privacy is important to us. Learn how we collect, use, and protect your personal information
              </motion.p>

              {/* Last Updated */}
              <motion.p
                className="text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                Last Updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </motion.p>
            </motion.div>
          </div>
        </section>

        {/* ==================== PRIVACY CONTENT SECTION ==================== */}
        <section className="relative px-4 py-24 bg-gradient-to-b from-gray-900/15 via-gray-900/10 to-gray-900/5">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="prose prose-invert prose-lg max-w-none"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              {/* Introduction */}
              <div className="mb-12">
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  At Best Bet, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                  Florida Pick 3 lottery prediction platform and services.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  By using our services, you agree to the collection and use of information in accordance with this Privacy Policy. 
                  We reserve the right to update this Privacy Policy from time to time, and we will notify you of any material 
                  changes by posting the new Privacy Policy on this page.
                </p>
              </div>

              {/* Section 1 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  1. <span className="text-yellow-400">Information We Collect</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We collect information that you provide directly to us and information that is automatically collected when 
                  you use our services. The types of information we collect include:
                </p>
                
                <h3 className="text-xl font-bold mb-4 text-white mt-6">Personal Information</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  When you register for an account or use our services, we may collect:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Name and contact information (email address, phone number)</li>
                  <li>Account credentials (username, password)</li>
                  <li>Payment information (credit card details, billing address)</li>
                  <li>Subscription preferences and plan details</li>
                  <li>Communication preferences and customer support interactions</li>
                </ul>

                <h3 className="text-xl font-bold mb-4 text-white mt-6">Usage Information</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We automatically collect certain information about your use of our platform, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage patterns and preferences</li>
                  <li>Pages visited and features accessed</li>
                  <li>Time and date of access</li>
                  <li>Referral sources and search terms</li>
                </ul>

                <h3 className="text-xl font-bold mb-4 text-white mt-6">Cookies and Tracking Technologies</h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  We use cookies, web beacons, and similar tracking technologies to enhance your experience, analyze usage 
                  patterns, and personalize content. You can control cookie preferences through your browser settings.
                </p>
              </motion.div>

              {/* Section 2 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  2. <span className="text-yellow-400">How We Use Your Information</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We use the information we collect for various purposes, including:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>To provide, maintain, and improve our services</li>
                  <li>To process your subscriptions and payments</li>
                  <li>To authenticate your identity and manage your account</li>
                  <li>To deliver personalized predictions and content</li>
                  <li>To communicate with you about your account, services, and updates</li>
                  <li>To respond to your inquiries and provide customer support</li>
                  <li>To detect, prevent, and address technical issues and security threats</li>
                  <li>To analyze usage patterns and improve user experience</li>
                  <li>To comply with legal obligations and enforce our Terms of Service</li>
                  <li>To send promotional communications (with your consent)</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  We do not sell your personal information to third parties. We may share your information only as described 
                  in this Privacy Policy.
                </p>
              </motion.div>

              {/* Section 3 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  3. <span className="text-yellow-400">Information Sharing and Disclosure</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We may share your information in the following circumstances:
                </p>
                
                <h3 className="text-xl font-bold mb-4 text-white mt-6">Service Providers</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We may share your information with trusted third-party service providers who assist us in operating our 
                  platform, processing payments, providing customer support, or conducting business operations. These service 
                  providers are contractually obligated to protect your information and use it only for specified purposes.
                </p>

                <h3 className="text-xl font-bold mb-4 text-white mt-6">Legal Requirements</h3>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We may disclose your information if required by law, court order, or governmental regulation, or if we 
                  believe disclosure is necessary to:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Comply with legal obligations</li>
                  <li>Protect and defend our rights or property</li>
                  <li>Prevent or investigate possible wrongdoing</li>
                  <li>Protect the personal safety of users or the public</li>
                  <li>Protect against legal liability</li>
                </ul>

                <h3 className="text-xl font-bold mb-4 text-white mt-6">Business Transfers</h3>
                <p className="text-gray-300 text-base leading-relaxed">
                  In the event of a merger, acquisition, reorganization, or sale of assets, your information may be transferred 
                  as part of that transaction. We will notify you of any such change in ownership or control of your personal 
                  information.
                </p>
              </motion.div>

              {/* Section 4 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  4. <span className="text-yellow-400">Data Security</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information from unauthorized access, 
                  alteration, disclosure, or destruction. These measures include:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Encryption of sensitive data in transit and at rest</li>
                  <li>Secure authentication and access controls</li>
                  <li>Regular security assessments and updates</li>
                  <li>Secure payment processing through PCI-compliant providers</li>
                  <li>Employee training on data protection and privacy</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
                  to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. Please notify us immediately 
                  if you suspect any unauthorized access to your account.
                </p>
              </motion.div>

              {/* Section 5 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  5. <span className="text-yellow-400">Your Privacy Rights</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Depending on your location, you may have certain rights regarding your personal information. These rights may include:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li><strong className="text-white">Access:</strong> Request access to the personal information we hold about you</li>
                  <li><strong className="text-white">Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li><strong className="text-white">Deletion:</strong> Request deletion of your personal information</li>
                  <li><strong className="text-white">Portability:</strong> Request transfer of your data to another service</li>
                  <li><strong className="text-white">Opt-Out:</strong> Opt-out of certain data processing activities</li>
                  <li><strong className="text-white">Account Management:</strong> Update or delete your account at any time</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  To exercise these rights, please contact us using the contact information provided at the end of this Privacy Policy. 
                  We will respond to your request within a reasonable timeframe and in accordance with applicable law.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  <strong className="text-white">Florida Residents:</strong> Florida law provides additional privacy protections. 
                  If you are a Florida resident, you have the right to request information about our disclosure of personal information 
                  to third parties for their direct marketing purposes.
                </p>
              </motion.div>

              {/* Section 6 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  6. <span className="text-yellow-400">Cookies and Tracking Technologies</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. Cookies are small 
                  text files stored on your device that help us:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how you use our services</li>
                  <li>Provide personalized content and advertisements</li>
                  <li>Improve our services and user experience</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">Types of Cookies We Use:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li><strong className="text-white">Essential Cookies:</strong> Required for the platform to function properly</li>
                  <li><strong className="text-white">Analytics Cookies:</strong> Help us understand how visitors interact with our platform</li>
                  <li><strong className="text-white">Functional Cookies:</strong> Remember your preferences and enhance functionality</li>
                  <li><strong className="text-white">Marketing Cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  You can control cookies through your browser settings. However, disabling certain cookies may limit your ability 
                  to use some features of our platform.
                </p>
              </motion.div>

              {/* Section 7 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  7. <span className="text-yellow-400">Children's Privacy</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Our services are not intended for individuals under the age of 18. We do not knowingly collect personal 
                  information from children under 18 years of age.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  If you are a parent or guardian and believe that your child has provided us with personal information, please 
                  contact us immediately. If we become aware that we have collected personal information from a child under 18 
                  without parental consent, we will take steps to delete that information from our systems.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  In accordance with Florida law and federal regulations, we require all users to be at least 18 years of age 
                  to use our lottery prediction services.
                </p>
              </motion.div>

              {/* Section 8 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  8. <span className="text-yellow-400">Data Retention</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy 
                  Policy, unless a longer retention period is required or permitted by law.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  When determining retention periods, we consider:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>The nature and sensitivity of the information</li>
                  <li>The purposes for which we process the information</li>
                  <li>Legal and regulatory requirements</li>
                  <li>The potential risk of harm from unauthorized use or disclosure</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  When your information is no longer needed, we will securely delete or anonymize it in accordance with our 
                  data retention policies.
                </p>
              </motion.div>

              {/* Section 9 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  9. <span className="text-yellow-400">Third-Party Links and Services</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Our platform may contain links to third-party websites, services, or applications that are not owned or 
                  controlled by Best Bet. This Privacy Policy does not apply to such third-party services.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We are not responsible for the privacy practices or content of third-party websites or services. We encourage 
                  you to review the privacy policies of any third-party services you access through our platform.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Your interactions with third-party services are subject to their respective terms and privacy policies. We 
                  recommend exercising caution and reviewing their privacy practices before providing any personal information.
                </p>
              </motion.div>

              {/* Section 10 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  10. <span className="text-yellow-400">International Data Transfers</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Your information may be transferred to and processed in countries other than your country of residence. These 
                  countries may have data protection laws that differ from those in your country.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  By using our services, you consent to the transfer of your information to facilities located in the United States 
                  and other countries where we operate. We take appropriate measures to ensure that your information receives an 
                  adequate level of protection in accordance with this Privacy Policy and applicable data protection laws.
                </p>
              </motion.div>

              {/* Section 11 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  11. <span className="text-yellow-400">Changes to This Privacy Policy</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal 
                  requirements, or other factors. We will notify you of any material changes by:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Posting the updated Privacy Policy on this page</li>
                  <li>Updating the "Last Updated" date at the top of this Privacy Policy</li>
                  <li>Sending you an email notification (if you have provided an email address)</li>
                  <li>Displaying a prominent notice on our platform</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  We encourage you to review this Privacy Policy periodically to stay informed about how we collect, use, and 
                  protect your information. Your continued use of our services after any changes to this Privacy Policy constitutes 
                  your acceptance of the updated policy.
                </p>
              </motion.div>

              {/* Section 12 */}
              <motion.div
                className="mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <h2 className="text-3xl md:text-4xl font-black mb-6 text-white">
                  12. <span className="text-yellow-400">Contact Information</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our privacy practices, please 
                  contact us:
                </p>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <p className="text-gray-300 text-base leading-relaxed mb-2">
                    <strong className="text-text-primary">Best Bet</strong>
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed mb-2">
                    Email: privacy@bestbet.com
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed mb-2">
                    Phone: +1 (512) 361-9158
                  </p>
                </div>
                <p className="text-gray-300 text-base leading-relaxed mt-4">
                  For general inquiries, you can also contact us at support@bestbet.com. We will respond to your privacy-related 
                  inquiries within a reasonable timeframe.
                </p>
              </motion.div>

              {/* Final Note */}
              <motion.div
                className="mt-16 pt-8 border-t border-white/10"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <p className="text-gray-400 text-sm leading-relaxed text-center italic">
                  Thank you for trusting Best Bet with your personal information. We are committed to protecting your privacy and 
                  providing you with a secure and transparent experience on our Florida Pick 3 prediction platform.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

