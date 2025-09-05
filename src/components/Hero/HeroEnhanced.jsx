import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Palette, Globe, TrendingUp, Shield, ArrowRight, Play, Star, Users, Award } from 'lucide-react';

const HeroEnhanced = () => {
    const stats = [
        { value: "10M+", label: "Designs Created", icon: <Sparkles className="w-5 h-5" /> },
        { value: "500K+", label: "Active Users", icon: <Users className="w-5 h-5" /> },
        { value: "99%", label: "Satisfaction Rate", icon: <Star className="w-5 h-5" /> },
        { value: "50+", label: "Countries", icon: <Globe className="w-5 h-5" /> }
    ];

    const features = [
        {
            icon: <Zap className="w-6 h-6" />,
            title: "AI-Powered Design",
            description: "Generate stunning fashion designs in seconds with our advanced AI",
            gradient: "from-purple-500 to-pink-500"
        },
        {
            icon: <Palette className="w-6 h-6" />,
            title: "3D Visualization",
            description: "See your designs come to life with realistic 3D rendering",
            gradient: "from-blue-500 to-cyan-500"
        },
        {
            icon: <Globe className="w-6 h-6" />,
            title: "Global Marketplace",
            description: "Connect with manufacturers and buyers worldwide",
            gradient: "from-green-500 to-emerald-500"
        }
    ];

    const testimonials = [
        {
            name: "Sarah Chen",
            role: "Fashion Designer",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
            quote: "TailorTech revolutionized my design process. What used to take days now takes minutes!",
            rating: 5
        },
        {
            name: "Marcus Johnson",
            role: "Boutique Owner",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
            quote: "The 3D visualization helps my customers see exactly what they're getting. Sales up 40%!",
            rating: 5
        },
        {
            name: "Emily Zhang",
            role: "E-commerce Manager",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
            quote: "Virtual try-on reduced our return rate by 60%. Game changer for online fashion!",
            rating: 5
        }
    ];

    return (
        <>
            {/* Hero Section with Video Background Effect */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-gray-900">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }} />
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6">
                                <Sparkles className="w-4 h-4" />
                                <span>AI-Powered Fashion Design Platform</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                                Design Fashion
                                <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Beyond Imagination
                                </span>
                            </h1>

                            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                                Create stunning 3D fashion designs with AI, visualize on virtual models,
                                and bring your creative vision to life in minutes, not months.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                                <Link to="/signup">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        Start Creating Free
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                                >
                                    <Play className="w-5 h-5" />
                                    Watch Demo
                                </motion.button>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex items-center gap-8 text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" />
                                    <span className="text-sm">Secure & Private</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5" />
                                    <span className="text-sm">Industry Leading</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Content - 3D Visual */}
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative">
                                {/* Glowing Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-30 animate-pulse" />

                                {/* Main Image Container */}
                                <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700">
                                    <img
                                        src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600"
                                        alt="Fashion Design"
                                        className="rounded-2xl w-full h-[500px] object-cover"
                                    />

                                    {/* Floating Elements */}
                                    <motion.div
                                        animate={{ y: [-10, 10, -10] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                        className="absolute -top-4 -right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                                    >
                                        AI Generated
                                    </motion.div>

                                    <motion.div
                                        animate={{ y: [10, -10, 10] }}
                                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                                        className="absolute -bottom-4 -left-4 bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                                    >
                                        3D Preview
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                >
                    <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-white rounded-full mt-2" />
                    </div>
                </motion.div>
            </section>

            {/* Stats Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="text-center"
                            >
                                <div className="flex justify-center mb-3 text-purple-500">
                                    {stat.icon}
                                </div>
                                <div className="text-4xl font-bold text-gray-900 mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            Everything You Need to
                            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Create Amazing Fashion
                            </span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            From AI-powered design generation to 3D visualization and marketplace integration
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="group relative"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl blur-xl"
                                    style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                                />
                                <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100">
                                    <div className={`w-12 h-12 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center text-white mb-6`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        {feature.description}
                                    </p>
                                    <Link to="/signup" className="text-purple-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                        Learn More
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                            Loved by Fashion Professionals
                        </h2>
                        <p className="text-xl text-gray-400">
                            Join thousands of designers transforming the fashion industry
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-gray-800 p-8 rounded-2xl border border-gray-700"
                            >
                                <div className="flex items-center gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-gray-300 mb-6 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div>
                                        <div className="font-semibold text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Fashion Business?
                        </h2>
                        <p className="text-xl text-white/90 mb-8">
                            Start creating stunning designs today. No credit card required.
                        </p>
                        <Link to="/signup">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-10 py-5 bg-white text-purple-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                            >
                                Get Started Free
                            </motion.button>
                        </Link>
                        <p className="text-white/70 text-sm mt-6">
                            ✓ Free forever plan ✓ No credit card ✓ Cancel anytime
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
};

export default HeroEnhanced;
