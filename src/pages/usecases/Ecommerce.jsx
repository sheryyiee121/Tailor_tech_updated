import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, TrendingUp, CreditCard, Truck, Star } from 'lucide-react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const Ecommerce = () => {
    const benefits = [
        {
            icon: <ShoppingCart className="w-8 h-8" />,
            title: "Virtual Try-On",
            description: "Let customers visualize products with AR technology"
        },
        {
            icon: <Package className="w-8 h-8" />,
            title: "3D Product Display",
            description: "Showcase products in stunning 3D views"
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            title: "Increase Conversions",
            description: "Boost sales by up to 40% with immersive experiences"
        },
        {
            icon: <CreditCard className="w-8 h-8" />,
            title: "Seamless Checkout",
            description: "Integrated payment processing for smooth transactions"
        },
        {
            icon: <Truck className="w-8 h-8" />,
            title: "Order Management",
            description: "Track and manage custom orders efficiently"
        },
        {
            icon: <Star className="w-8 h-8" />,
            title: "Customer Reviews",
            description: "Build trust with integrated review system"
        }
    ];

    const stats = [
        { value: "40%", label: "Higher Conversion Rate" },
        { value: "60%", label: "Reduced Returns" },
        { value: "3x", label: "Customer Engagement" },
        { value: "24/7", label: "AI Support" }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
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
                                E-commerce Solutions
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Revolutionize your online fashion store with AI-powered design tools
                                and immersive shopping experiences.
                            </p>
                            <button className="bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-700 transition-colors">
                                Start Free Trial
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-4xl font-bold text-purple-600 mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Transform Your Online Store
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {benefits.map((benefit, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="text-purple-600 mb-4">{benefit.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {benefit.title}
                                    </h3>
                                    <p className="text-gray-600">{benefit.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-purple-600 text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Boost Your Sales?
                        </h2>
                        <p className="text-lg mb-8 text-purple-100">
                            Join thousands of successful e-commerce stores
                        </p>
                        <button className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                            Get Started Today
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Ecommerce;
