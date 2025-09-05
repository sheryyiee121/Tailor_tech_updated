import React from 'react';
import { motion } from 'framer-motion';
import { Linkedin, Twitter, Github } from 'lucide-react';
import Navbar from '../../components/common/navbar';
import Footer from '../../components/common/footer';

const OurTeam = () => {
    const teamMembers = [
        {
            name: "Muhammad Sheraz",
            role: "CEO & Founder",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
            bio: "Visionary leader driving innovation in fashion technology",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            name: "Sheeza Ijaz",
            role: "CTO & Co-Founder",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
            bio: "Technology expert specializing in AI and 3D modeling",
            social: {
                linkedin: "#",
                github: "#"
            }
        },
        {
            name: "Muhammad Hamza",
            role: "Lead Developer",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
            bio: "Full-stack developer with expertise in React and AI integration",
            social: {
                linkedin: "#",
                github: "#"
            }
        },
        {
            name: "Emily Rodriguez",
            role: "Head of Design",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
            bio: "Award-winning fashion designer and creative director",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        },
        {
            name: "David Kim",
            role: "AI Engineer",
            image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400",
            bio: "Machine learning specialist with expertise in generative AI",
            social: {
                linkedin: "#",
                github: "#"
            }
        },
        {
            name: "Lisa Anderson",
            role: "Marketing Lead",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
            bio: "Marketing strategist with deep experience in fashion retail",
            social: {
                linkedin: "#",
                twitter: "#"
            }
        }
    ];

    const values = [
        {
            title: "Innovation",
            description: "Pushing boundaries in fashion technology"
        },
        {
            title: "Creativity",
            description: "Empowering designers to express their vision"
        },
        {
            title: "Sustainability",
            description: "Reducing waste through digital design"
        },
        {
            title: "Inclusivity",
            description: "Making fashion design accessible to everyone"
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
                                Meet Our Team
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                We're a passionate team of designers, engineers, and fashion enthusiasts
                                working to revolutionize the fashion industry with AI.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Team Grid */}
                <section className="py-16 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {teamMembers.map((member, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                                >
                                    <div className="aspect-square overflow-hidden">
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                                            {member.name}
                                        </h3>
                                        <p className="text-gray-600 font-medium mb-3">{member.role}</p>
                                        <p className="text-gray-500 text-sm mb-4">{member.bio}</p>
                                        <div className="flex gap-3">
                                            {member.social.linkedin && (
                                                <a href={member.social.linkedin} className="text-gray-400 hover:text-blue-600 transition-colors">
                                                    <Linkedin className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.social.twitter && (
                                                <a href={member.social.twitter} className="text-gray-400 hover:text-blue-400 transition-colors">
                                                    <Twitter className="w-5 h-5" />
                                                </a>
                                            )}
                                            {member.social.github && (
                                                <a href={member.social.github} className="text-gray-400 hover:text-gray-900 transition-colors">
                                                    <Github className="w-5 h-5" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Company Values */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                            Our Values
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-md">
                                        <span className="text-2xl font-bold text-gray-900">
                                            {value.title.charAt(0)}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                        {value.title}
                                    </h3>
                                    <p className="text-gray-600">{value.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Join Us CTA */}
                <section className="py-16 px-4 sm:px-6 lg:px-8 bg-black text-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Join Our Mission
                        </h2>
                        <p className="text-lg mb-8 text-gray-300">
                            We're always looking for talented individuals to join our team
                        </p>
                        <button className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors">
                            View Open Positions
                        </button>
                    </div>
                </section>
            </div>
            <Footer />
        </>
    );
};

export default OurTeam;
