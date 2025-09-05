import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, DollarSign, Clock, Palette, ShoppingBag, Headphones } from 'lucide-react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const SmallBusiness = () => {
    const benefits = [
        {
            icon: <DollarSign className="w-8 h-8" />,
            title: "Affordable Pricing",
            description: "Start with our budget-friendly plans designed for small businesses"
        },
        {
            icon: <Clock className="w-8 h-8" />,
            title: "Quick Setup",
            description: "Get started in minutes with our intuitive onboarding process"
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: "Easy Design Tools",
            description: "User-friendly AI design tools that don't require technical expertise"
        },
        {
            icon: <ShoppingBag className="w-8 h-8" />,
            title: "E-commerce Ready",
            description: "Integrate seamlessly with popular e-commerce platforms"
        },
        {
            icon: <Sparkles className="w-8 h-8" />,
            title: "AI Assistant",
            description: "Personal AI assistant to help you create stunning designs"
        },
        {
            icon: <Headphones className="w-8 h-8" />,
            title: "24/7 Support",
            description: "Round-the-clock customer support to help you succeed"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
                {/* Hero Section */}
                <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <h1 className="text-5xl font-bold text-gray-900 mb-6">
                                Small Business Solution
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Perfect for boutiques, independent designers, and growing fashion brands.
                                Professional tools at small business prices.
                            </p>
                            <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
                                Start Free Trial
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Everything You Need to Grow
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                                >
                                    <div className="text-black mb-4">{benefit.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonial */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">
                            "TailorTech helped us increase our design output by 300% while reducing costs"
                        </h2>
                        <p className="text-lg text-gray-600 mb-4">
                            - Sarah Chen, Founder of Boutique Fashion Co.
                        </p>
                        <div className="flex justify-center gap-2">
                            {[...Array(5)].map((_, i) => (
                                <span key={i} className="text-yellow-400 text-2xl">★</span>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Start Your Fashion Journey Today
                        </h2>
                        <p className="text-lg mb-8 text-gray-600">
                            No credit card required. 14-day free trial.
                        </p>
                        <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
                            Get Started Free
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default SmallBusiness;
