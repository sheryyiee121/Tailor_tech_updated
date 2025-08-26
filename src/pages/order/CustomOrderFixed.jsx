import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    User, Mail, Phone, MapPin, Package,
    Shirt, CheckCircle, ArrowLeft
} from 'lucide-react';
import promptStorageService from '../../services/promptStorageService';

const CustomOrderFixed = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { prompt, generatedImage, modelData } = location.state || {};

    // Get saved prompt if not provided
    const designPrompt = prompt || promptStorageService.getCurrentPrompt() || 'Custom Design';

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
        size: '',
        additionalNotes: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    // Simple input handler - no complex logic
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        } else {
            // Submit order
            console.log('Order submitted:', { ...formData, designPrompt, generatedImage });
            setOrderSubmitted(true);
        }
    };

    if (orderSubmitted) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-300 mb-6">
                        We'll start working on your "{designPrompt}" design immediately.
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white text-black px-6 py-3 rounded-lg font-semibold"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="border-b border-white/10 p-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-300 hover:text-white mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                </button>
                <h1 className="text-3xl font-bold">Custom Order</h1>
                <p className="text-gray-300 mt-2">Design: "{designPrompt}"</p>
            </div>

            {/* Simple Step Indicator */}
            <div className="flex justify-center py-6">
                <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-white text-black' : 'bg-gray-600'
                        }`}>1</div>
                    <div className={`w-20 h-1 ${currentStep >= 2 ? 'bg-white' : 'bg-gray-600'}`}></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-white text-black' : 'bg-gray-600'
                        }`}>2</div>
                    <div className={`w-20 h-1 ${currentStep >= 3 ? 'bg-white' : 'bg-gray-600'}`}></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-white text-black' : 'bg-gray-600'
                        }`}>3</div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6">
                {/* Step 1: Personal Info */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Personal Information</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="John"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="Doe"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                placeholder="john@example.com"
                                autoComplete="off"
                            />
                        </div>

                        <div>
                            <label className="block mb-2">Phone</label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                placeholder="+1 (555) 123-4567"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                )}

                {/* Step 2: Address */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Delivery Address</h2>

                        <div>
                            <label className="block mb-2">Street Address</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                placeholder="123 Main St"
                                autoComplete="off"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="New York"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="NY"
                                    autoComplete="off"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2">ZIP Code</label>
                                <input
                                    type="text"
                                    name="zipCode"
                                    value={formData.zipCode}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="10001"
                                    autoComplete="off"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                                    placeholder="United States"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Order Details */}
                {currentStep === 3 && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold mb-6">Order Details</h2>

                        <div>
                            <label className="block mb-2">Size</label>
                            <select
                                name="size"
                                value={formData.size}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                            >
                                <option value="">Select Size</option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="XXL">XXL</option>
                            </select>
                        </div>

                        <div>
                            <label className="block mb-2">Additional Notes</label>
                            <textarea
                                name="additionalNotes"
                                value={formData.additionalNotes}
                                onChange={handleChange}
                                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white h-32"
                                placeholder="Any special requests or notes..."
                                autoComplete="off"
                            />
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white/5 p-4 rounded-lg mt-6">
                            <h3 className="font-bold mb-2">Order Summary</h3>
                            <p className="text-gray-300">Design: {designPrompt}</p>
                            <p className="text-gray-300">Name: {formData.firstName} {formData.lastName}</p>
                            <p className="text-gray-300">Email: {formData.email}</p>
                            <p className="text-gray-300">Size: {formData.size || 'Not selected'}</p>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between mt-8">
                    {currentStep > 1 && (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            className="px-6 py-3 bg-gray-600 text-white rounded-lg"
                        >
                            Previous
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-6 py-3 bg-white text-black rounded-lg font-semibold ml-auto"
                    >
                        {currentStep < 3 ? 'Next' : 'Submit Order'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CustomOrderFixed;
