"use client";
import Link from "next/link";
import {
  QrCode,
  Shield,
  Smartphone,
  Tag,
  Mail,
  Phone,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Zap,
  Globe,
  Star,
} from "lucide-react";
import { PageContainer } from "@/components/shared/PageContainer";


export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50"
      suppressHydrationWarning={true}
    >
      <PageContainer className="relative overflow-hidden py-0">
        {/* Hero Section */}
        <section className="relative py-10 md:py-12 lg:py-10">
          {/* Background decorations */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left animate-fade-in">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Sparkles className="w-4 h-4" />
                    Smart QR Technology
                  </div>

                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
                    Never Lose Your
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Belongings Again
                    </span>
                  </h1>

                  <p className="max-w-[600px] text-lg text-gray-600 md:text-xl mx-auto lg:mx-0 leading-relaxed">
                    Our QR code lost and found system helps students quickly
                    recover lost items with durable, weatherproof stickers that
                    link directly to your contact information.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group text-lg"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center px-8 py-4 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-300 text-lg"
                  >
                    Sign In
                  </Link>
                </div>

                {/* Trust indicators */}
                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Free to start
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Durable stickers
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Instant recovery
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in">
                <div className="relative mx-auto aspect-square max-w-lg">
                  {/* Floating elements */}
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-200/40 rounded-2xl rotate-12 animate-pulse"></div>
                  <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-purple-200/40 rounded-2xl -rotate-12 animate-pulse delay-1000"></div>

                  <img
                    src="https://images.pexels.com/photos/4498362/pexels-photo-4498362.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="QR code sticker on a water bottle"
                    className="mx-auto rounded-3xl shadow-2xl object-cover w-full h-full"
                  />

                  {/* Floating QR code */}
                  <div className="absolute top-8 right-8 p-3 bg-white rounded-2xl shadow-lg animate-bounce">
                    <QrCode className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-10 md:py-12 bg-gradient-to-r from-gray-50/80 to-blue-50/80 backdrop-blur-sm -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                Simple Process
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                How It Works
              </h2>
              <p className="max-w-[900px] text-lg text-gray-600 md:text-xl leading-relaxed">
                Our system makes it easy to label your belongings and recover
                them if lost.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto">
              {/* Step 1 */}
              <div className="group relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Tag className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    1. Purchase QR Stickers
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Order durable, weatherproof QR code stickers in various
                    sizes to fit all your belongings.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <QrCode className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    2. Link to Your Account
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    Scan and link each QR code to your account, adding your
                    contact information for finders.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative overflow-hidden border-0 bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 text-center">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform">
                    <Smartphone className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    3. Get Found Fast
                  </h3>
                  <p className="text-gray-600 text-base leading-relaxed">
                    If your item is lost, the finder scans the QR code to access
                    your contact information and return your belongings.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <Star className="w-4 h-4" />
                Key Features
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Everything You Need
              </h2>
              <p className="max-w-[900px] text-lg text-gray-600 md:text-xl leading-relaxed">
                Our lost and found system is designed to provide everything you
                need for quick item recovery.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {/* Feature 1 */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Durable Stickers</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Weatherproof, tear-resistant stickers that stay attached and
                  readable in all conditions.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <QrCode className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Multiple Sizes</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Available in small, medium, and large sizes to fit everything
                  from keys to laptops.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    WhatsApp Integration
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Optional WhatsApp link for finders to contact you instantly
                  via message.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Privacy Control</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  You decide what contact information to share with finders of
                  your lost items.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Tag className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Multiple Items</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Link as many QR codes as you need to a single account for all
                  your belongings.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold">Account Management</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Easily update your contact information across all linked QR
                  codes at once.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-purple-50 -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-blue-600">
                  5K+
                </div>
                <div className="text-sm text-gray-600">Students Protected</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-purple-600">
                  95%
                </div>
                <div className="text-sm text-gray-600">Recovery Rate</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-green-500">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Always Active</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-orange-500">
                  Fast
                </div>
                <div className="text-sm text-gray-600">Quick Recovery</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-1">
              <div className="bg-white rounded-[calc(1.5rem-1px)] p-8 md:p-12 text-center">
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Globe className="w-4 h-4" />
                    Join Thousands of Students
                  </div>

                  <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                    Ready to Secure Your Belongings?
                  </h2>

                  <p className="text-lg text-gray-600 md:text-xl leading-relaxed">
                    Join thousands of students who have already protected their
                    valuables with our QR code system.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                      href="/register"
                      className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group text-lg"
                    >
                      <Star className="w-5 h-5" />
                      Get Started Today
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <Link
                      href="/login"
                      className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-semibold transition-all duration-300 text-lg"
                    >
                      Already have an account? Login
                    </Link>
                  </div>

                  <p className="text-sm text-gray-500 pt-4">
                    Free to start • No credit card required • Secure & private
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </PageContainer>

      {/* Footer - Outside PageContainer for full width */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {/* Logo and description */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2">
                <QrCode className="h-8 w-8 text-blue-400 flex-shrink-0" />
                <span className="text-xl font-bold text-white">QR Lost & Found</span>
              </div>
              <p className="text-sm leading-relaxed max-w-sm">
                Helping students recover lost items with our innovative QR code sticker system.
              </p>
            </div>
            
            {/* Quick links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/" className="hover:text-blue-400 transition-colors duration-200 inline-block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-blue-400 transition-colors duration-200 inline-block">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-blue-400 transition-colors duration-200 inline-block">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/admin/login" className="hover:text-blue-400 transition-colors duration-200 inline-block">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Contact Us</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start space-x-3">
                  <Mail className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span className="break-words">support@qrlostfound.com</span>
                </li>
                <li className="flex items-start space-x-3">
                  <Phone className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <span>+1 (555) 123-4567</span>
                </li>
              </ul>
            </div>
            
            {/* Newsletter */}
            <div className="space-y-4 sm:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Subscribe to get the latest updates and features.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  required
                />
                <button 
                  type="submit" 
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
          
          {/* Bottom section */}
          <div className="mt-8 pt-6 border-t border-gray-800">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} QR Lost & Found. All rights reserved.
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}