"use client";

import { motion } from "framer-motion";

export default function TermsOfServicePage() {
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
                Terms of <span className="text-yellow-400">Service</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p
                className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Please read these terms carefully before using our Florida Pick 3 prediction platform
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

        {/* ==================== TERMS CONTENT SECTION ==================== */}
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
                  Welcome to Best Bet, a premium Pick 3 lottery prediction service operating in the state of Florida, United States. 
                  These Terms of Service ("Terms") govern your access to and use of our website, services, and platform. 
                  By accessing or using our services, you agree to be bound by these Terms.
                </p>
                <p className="text-gray-300 text-lg leading-relaxed">
                  If you do not agree to these Terms, please do not use our services. We reserve the right to modify these Terms 
                  at any time, and such modifications will be effective immediately upon posting on our website.
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
                  1. <span className="text-yellow-400">Acceptance of Terms</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  By creating an account, accessing, or using Best Bet's services, you acknowledge that you have read, understood, 
                  and agree to be bound by these Terms of Service and our Privacy Policy. These Terms constitute a legally binding 
                  agreement between you and Best Bet.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  You must be at least 18 years of age to use our services. By using our platform, you represent and warrant that 
                  you are of legal age to form a binding contract and meet all eligibility requirements.
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
                  2. <span className="text-yellow-400">Service Description</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Best Bet provides predictive analytics and number suggestions for the Florida Pick 3 lottery game. Our services 
                  include daily predictions, historical data analysis, statistical insights, and performance tracking tools.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">Important:</strong> Best Bet is a prediction service only. We do not guarantee 
                  winning outcomes, and our predictions are based on statistical analysis and historical patterns. Lottery games 
                  are games of chance, and no prediction service can guarantee results.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Our predictions are provided for informational and entertainment purposes only. You acknowledge that any use of 
                  our predictions is at your own risk and discretion.
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
                  3. <span className="text-yellow-400">User Accounts and Registration</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  To access certain features of our service, you must create an account. When registering, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security of your password and account</li>
                  <li>Accept responsibility for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  You are responsible for maintaining the confidentiality of your account credentials. Best Bet is not liable for 
                  any loss or damage arising from your failure to protect your account information.
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
                  4. <span className="text-yellow-400">Subscription and Payment Terms</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Our services are available through various subscription plans. By subscribing, you agree to pay the fees 
                  associated with your chosen plan. All fees are charged in U.S. Dollars (USD) and are non-refundable unless 
                  otherwise stated.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">Billing:</strong> Subscriptions are billed in advance on a recurring basis 
                  (monthly, quarterly, or annually) as selected during registration. You authorize us to charge your payment 
                  method automatically for each billing cycle.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">Cancellation:</strong> You may cancel your subscription at any time. 
                  Cancellation will take effect at the end of your current billing period. No refunds will be provided for 
                  partial billing periods.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  <strong className="text-white">Price Changes:</strong> We reserve the right to modify subscription prices at 
                  any time. Price changes will be communicated to you in advance and will apply to subsequent billing cycles.
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
                  5. <span className="text-yellow-400">Intellectual Property Rights</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  All content, features, and functionality of the Best Bet platform, including but not limited to text, graphics, 
                  logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive 
                  property of Best Bet or its content suppliers and are protected by United States and international copyright, 
                  trademark, and other intellectual property laws.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, 
                  republish, download, store, or transmit any of the material on our platform without prior written consent from 
                  Best Bet.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Our predictions, algorithms, and analytical methods are proprietary and confidential. Unauthorized use, copying, 
                  or distribution of our content may result in legal action.
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
                  6. <span className="text-yellow-400">Prohibited Uses</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  You agree not to use our services:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>To submit false or misleading information</li>
                  <li>To upload or transmit viruses or any other type of malicious code</li>
                  <li>To collect or track the personal information of others</li>
                  <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                  <li>For any obscene or immoral purpose</li>
                  <li>To interfere with or circumvent the security features of our service</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  Violation of these prohibitions may result in immediate termination of your account and legal action.
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
                  7. <span className="text-yellow-400">Disclaimers and Limitations of Liability</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">No Guarantees:</strong> Best Bet provides predictions based on statistical 
                  analysis and historical data. We make no warranties, express or implied, regarding the accuracy, reliability, 
                  or success of our predictions. Lottery games are games of chance, and no prediction service can guarantee 
                  winning outcomes.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">As-Is Service:</strong> Our services are provided "as is" and "as available" 
                  without warranties of any kind, either express or implied, including but not limited to implied warranties of 
                  merchantability, fitness for a particular purpose, or non-infringement.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  <strong className="text-white">Limitation of Liability:</strong> To the fullest extent permitted by law, 
                  Best Bet shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any 
                  loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or 
                  other intangible losses resulting from your use of our services.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  <strong className="text-white">Florida Law:</strong> These disclaimers and limitations are in accordance with 
                  Florida state law and applicable federal regulations governing lottery and gaming services.
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
                  8. <span className="text-yellow-400">Responsible Gaming</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Best Bet is committed to promoting responsible gaming practices. We encourage all users to:
                </p>
                <ul className="list-disc list-inside text-gray-300 text-base leading-relaxed mb-4 space-y-2 ml-4">
                  <li>Play within their means and set personal spending limits</li>
                  <li>Understand that lottery games are games of chance with no guaranteed outcomes</li>
                  <li>Never gamble more than they can afford to lose</li>
                  <li>Seek help if gambling becomes a problem</li>
                </ul>
                <p className="text-gray-300 text-base leading-relaxed">
                  If you or someone you know has a gambling problem, please contact the Florida Council on Compulsive Gambling 
                  at 1-888-ADMIT-IT or visit their website for assistance and resources.
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
                  9. <span className="text-yellow-400">Termination</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We reserve the right to terminate or suspend your account and access to our services immediately, without prior 
                  notice or liability, for any reason, including if you breach these Terms of Service.
                </p>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, 
                  you may simply discontinue using the service or contact us to request account deletion.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  All provisions of these Terms that by their nature should survive termination shall survive termination, 
                  including ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
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
                  10. <span className="text-yellow-400">Governing Law and Jurisdiction</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the State of Florida, 
                  United States, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  Any disputes arising out of or relating to these Terms or our services shall be subject to the exclusive 
                  jurisdiction of the state and federal courts located in Florida. You consent to the personal jurisdiction of 
                  such courts and waive any objection to venue in such courts.
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
                  11. <span className="text-yellow-400">Changes to Terms</span>
                </h2>
                <p className="text-gray-300 text-base leading-relaxed mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is 
                  material, we will provide at least 30 days notice prior to any new terms taking effect.
                </p>
                <p className="text-gray-300 text-base leading-relaxed">
                  What constitutes a material change will be determined at our sole discretion. By continuing to access or use 
                  our service after any revisions become effective, you agree to be bound by the revised terms.
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
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10">
                  <p className="text-gray-300 text-base leading-relaxed mb-2">
                    <strong className="text-white">Best Bet</strong>
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed mb-2">
                    Email: support@bestbet.com
                  </p>
                  <p className="text-gray-300 text-base leading-relaxed">
                    Number: +1 (512) 361-9158
                  </p>
                </div>
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
                  By using Best Bet's services, you acknowledge that you have read, understood, and agree to be bound by these 
                  Terms of Service. Thank you for choosing Best Bet for your Florida Pick 3 predictions.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}

