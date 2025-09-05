import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const Plans = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');

    const plans = [
        {
            name: "Starter",
            monthlyPrice: 29,
            yearlyPrice: 290,
            description: "Perfect for individuals and freelancers",
            features: [
                { name: "50 AI Generations/month", included: true },
                { name: "Basic 3D Models", included: true },
                { name: "Standard Support", included: true },
                { name: "Export to PNG/JPG", included: true },
                { name: "1 User Account", included: true },
                { name: "Custom Branding", included: false },
                { name: "API Access", included: false },
                { name: "Priority Support", included: false }
            ],
            color: "gray",
            popular: false
        },
        {
            name: "Professional",
            monthlyPrice: 99,
            yearlyPrice: 990,
            description: "Ideal for small businesses and teams",
            features: [
                { name: "500 AI Generations/month", included: true },
                { name: "Advanced 3D Models", included: true },
                { name: "Priority Support", included: true },
                { name: "Export All Formats", included: true },
                { name: "5 User Accounts", included: true },
                { name: "Custom Branding", included: true },
                { name: "API Access", included: false },
                { name: "Dedicated Account Manager", included: false }
            ],
            color: "blue",
            popular: true
        },
        {
            name: "Enterprise",
            monthlyPrice: 299,
            yearlyPrice: 2990,
            description: "For large teams and organizations",
            features: [
                { name: "Unlimited AI Generations", included: true },
                { name: "Premium 3D Models", included: true },
                { name: "24/7 Priority Support", included: true },
                { name: "Export All Formats", included: true },
                { name: "Unlimited Users", included: true },
                { name: "Custom Branding", included: true },
                { name: "Full API Access", included: true },
                { name: "Dedicated Account Manager", included: true }
            ],
            color: "purple",
            popular: false
        }
    ];

    const getPrice = (plan) => {
        return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    };

    const getPriceLabel = (plan) => {
        return billingCycle === 'monthly' ? '/month' : '/year';
    };

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
                                Simple, Transparent Pricing
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Choose the perfect plan for your fashion design needs.
                                No hidden fees, cancel anytime.
                            </p>

                            {/* Billing Toggle */}
                            <div className="flex items-center justify-center gap-4 mb-12">
                                <span className={`${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
                                    Monthly
                                </span>
                                <button
                                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                                    className="relative w-16 h-8 bg-gray-200 rounded-full transition-colors duration-300"
                                >
                                    <motion.div
                                        className="absolute top-1 w-6 h-6 bg-black rounded-full"
                                        animate={{ left: billingCycle === 'monthly' ? '4px' : '36px' }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    />
                                </button>
                                <span className={`${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
                                    Yearly
                                    <span className="ml-2 text-green-600 font-semibold">Save 20%</span>
                                </span>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {plans.map((plan, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow ${plan.popular ? 'ring-2 ring-blue-600' : ''
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                            <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="p-8">
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {plan.name}
                                        </h3>
                                        <p className="text-gray-600 mb-6">{plan.description}</p>

                                        <div className="mb-8">
                                            <span className="text-5xl font-bold text-gray-900">
                                                ${getPrice(plan)}
                                            </span>
                                            <span className="text-gray-600">{getPriceLabel(plan)}</span>
                                        </div>

                                        <button className={`w-full py-3 px-6 rounded-full font-semibold transition-colors mb-8 ${plan.popular
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-900 text-white hover:bg-gray-800'
                                            }`}>
                                            Get Started
                                        </button>

                                        <ul className="space-y-4">
                                            {plan.features.map((feature, featureIndex) => (
                                                <li key={featureIndex} className="flex items-start">
                                                    {feature.included ? (
                                                        <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                                                    ) : (
                                                        <X className="w-5 h-5 text-gray-300 mr-3 flex-shrink-0 mt-0.5" />
                                                    )}
                                                    <span className={feature.included ? 'text-gray-700' : 'text-gray-400'}>
                                                        {feature.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Can't find what you're looking for? Contact our support team.
                        </p>
                        <button className="text-blue-600 font-semibold hover:text-blue-700">
                            View All FAQs →
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Plans;
