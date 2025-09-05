import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Shield, Users, BarChart3, Globe, Zap } from 'lucide-react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const EnterpriseSuite = () => {
    const features = [
        {
            icon: <Shield className="w-8 h-8" />,
            title: "Enterprise Security",
            description: "Bank-level security with SOC 2 compliance and data encryption"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Team Collaboration",
            description: "Advanced collaboration tools for large design teams"
        },
        {
            icon: <BarChart3 className="w-8 h-8" />,
            title: "Analytics & Insights",
            description: "Comprehensive analytics dashboard with AI-powered insights"
        },
        {
            icon: <Globe className="w-8 h-8" />,
            title: "Global Scalability",
            description: "Scale your operations across multiple regions seamlessly"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "AI-Powered Design",
            description: "Advanced AI models for complex fashion design generation"
        },
        {
            icon: <Building2 className="w-8 h-8" />,
            title: "Custom Integration",
            description: "Seamless integration with your existing enterprise systems"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
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
                                Enterprise Suite
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Transform your fashion business with our comprehensive enterprise solution.
                                Designed for large-scale operations and teams.
                            </p>
                            <button className="bg-black text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-800 transition-colors">
                                Schedule Demo
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Enterprise Features
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                                >
                                    <div className="text-black mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Scale Your Fashion Business?
                        </h2>
                        <p className="text-lg mb-8 text-gray-300">
                            Join leading fashion brands using TailorTech Enterprise
                        </p>
                        <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                            Contact Sales
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default EnterpriseSuite;
