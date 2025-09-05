import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, BookOpen, Users, Lightbulb, Award, Video } from 'lucide-react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const Education = () => {
    const features = [
        {
            icon: <GraduationCap className="w-8 h-8" />,
            title: "Fashion Design Courses",
            description: "Interactive 3D design courses for fashion students"
        },
        {
            icon: <BookOpen className="w-8 h-8" />,
            title: "Digital Curriculum",
            description: "Comprehensive fashion design curriculum with AI tools"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Collaborative Learning",
            description: "Students and teachers collaborate in real-time"
        },
        {
            icon: <Lightbulb className="w-8 h-8" />,
            title: "Creative Exploration",
            description: "AI-powered tools to explore design possibilities"
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: "Certification Programs",
            description: "Industry-recognized certificates upon completion"
        },
        {
            icon: <Video className="w-8 h-8" />,
            title: "Virtual Workshops",
            description: "Live workshops with industry professionals"
        }
    ];

    const institutions = [
        "Fashion Institute of Technology",
        "Parsons School of Design",
        "Central Saint Martins",
        "Royal College of Art",
        "Pratt Institute",
        "FIDM"
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
                                Education Platform
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                Empower the next generation of fashion designers with cutting-edge
                                AI technology and immersive learning experiences.
                            </p>
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
                                Request Demo for Schools
                            </button>
                        </motion.div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Transform Fashion Education
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
                                    <div className="text-blue-600 mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Partner Institutions */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Trusted by Leading Institutions
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                            {institutions.map((institution, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center p-6 bg-gray-50 rounded-xl"
                                >
                                    <p className="text-gray-700 font-medium">{institution}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Statistics */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-blue-600 text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold mb-2">10,000+</div>
                                <div className="text-blue-100">Students Enrolled</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">500+</div>
                                <div className="text-blue-100">Partner Schools</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold mb-2">95%</div>
                                <div className="text-blue-100">Student Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4 text-gray-900">
                            Bring AI-Powered Fashion Design to Your Institution
                        </h2>
                        <p className="text-lg mb-8 text-gray-600">
                            Join the education revolution in fashion design
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-colors">
                                Schedule Demo
                            </button>
                            <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-50 transition-colors">
                                Download Brochure
                            </button>
                        </div>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default Education;
