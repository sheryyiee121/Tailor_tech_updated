import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, CreditCard, Package,
    Shirt, Ruler, Calendar, CheckCircle, ArrowLeft,
    Star, Sparkles
} from 'lucide-react';

// Move step components outside to prevent re-creation on every render
const PersonalInfoStep = ({ formData, handleInputChange }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center mb-6">Personal Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-2">First Name *</label>
                <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                        placeholder="John"
                        autoComplete="off"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Last Name *</label>
                <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="Doe"
                    autoComplete="off"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium mb-2">Email Address *</label>
            <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="john@example.com"
                    autoComplete="off"
                />
            </div>
        </div>

        <div>
            <label className="block text-sm font-medium mb-2">Phone Number *</label>
            <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                    placeholder="+1 (555) 123-4567"
                    autoComplete="off"
                />
            </div>
        </div>
    </div>
);

const CustomOrder = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { prompt, generatedImage, modelData } = location.state || {};

    const [formData, setFormData] = useState({
        // Personal Information
        firstName: '',
        lastName: '',
        email: '',
        phone: '',

        // Address Information
        address: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',

        // Order Details
        size: '',
        preferredFabric: '',
        additionalNotes: '',
        urgency: 'standard',

        // Measurements (optional)
        chest: '',
        waist: '',
        hips: '',
        height: '',
        weight: ''
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderSubmitted, setOrderSubmitted] = useState(false);

    const handleInputChange = (e) => {
        e.persist?.(); // Persist the event for React
        const { name, value } = e.target;

        // Use functional update to prevent stale closures
        setFormData(prevData => {
            // Create new object to prevent mutations
            return {
                ...prevData,
                [name]: value
            };
        });
    };

    const handleNext = () => {
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevious = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate order processing
        setTimeout(() => {
            setIsSubmitting(false);
            setOrderSubmitted(true);
        }, 2000);
    };

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];
    const fabricOptions = ['Cotton', 'Silk', 'Wool', 'Linen', 'Polyester', 'Blend', 'Premium'];
    const urgencyOptions = [
        { value: 'standard', label: 'Standard (2-3 weeks)', price: 0 },
        { value: 'express', label: 'Express (1-2 weeks)', price: 50 },
        { value: 'rush', label: 'Rush (3-5 days)', price: 150 }
    ];

    if (orderSubmitted) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6">
                    <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
                    <p className="text-gray-300 mb-6">
                        Thank you for your custom order. We'll start working on your design immediately and keep you updated via email.
                    </p>
                    <div className="bg-white/10 rounded-xl p-4 mb-6">
                        <p className="text-sm text-gray-300">Order ID</p>
                        <p className="text-xl font-mono text-white">#CO-{Date.now().toString().slice(-6)}</p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    const StepIndicator = () => (
        <div className="flex items-center justify-center mb-8">
            {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step <= currentStep ? 'bg-white text-black' : 'bg-gray-600 text-gray-400'
                        }`}>
                        {step}
                    </div>
                    {step < 4 && (
                        <div className={`w-12 h-0.5 ${step < currentStep ? 'bg-white' : 'bg-gray-600'
                            }`} />
                    )}
                </div>
            ))}
        </div>
    );

    const PersonalInfoStep = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Personal Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">First Name *</label>
                    <div className="relative">
                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <input
                            key="firstName-input"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400"
                            placeholder="John"
                            autoComplete="off"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Last Name *</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="Doe"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Email Address *</label>
                <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="john@example.com"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="+1 (555) 123-4567"
                    />
                </div>
            </div>
        </div>
    );

    const AddressStep = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Shipping Address</h2>

            <div>
                <label className="block text-sm font-medium mb-2">Street Address *</label>
                <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="123 Main Street"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="New York"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">State/Province *</label>
                    <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="NY"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">ZIP/Postal Code *</label>
                    <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                        placeholder="10001"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Country *</label>
                    <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white "
                    >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        </div>
    );

    const OrderDetailsStep = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center mb-6">Order Details</h2>

            {generatedImage && (
                <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <h3 className="text-lg font-semibold mb-3">Your Design</h3>
                    <div className="flex items-center space-x-4">
                        <img
                            src={generatedImage}
                            alt="Generated Design"
                            className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                            <p className="text-white font-medium">Custom Design</p>
                            <p className="text-gray-300 text-sm">Based on: "{prompt}"</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Size *</label>
                    <select
                        name="size"
                        value={formData.size}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white "

                    >
                        <option value="">Select Size</option>
                        {sizeOptions.map(size => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Preferred Fabric *</label>
                    <select
                        name="preferredFabric"
                        value={formData.preferredFabric}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white "

                    >
                        <option value="">Select Fabric</option>
                        {fabricOptions.map(fabric => (
                            <option key={fabric} value={fabric}>{fabric}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Delivery Timeline</label>
                <div className="space-y-3">
                    {urgencyOptions.map(option => (
                        <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="radio"
                                name="urgency"
                                value={option.value}
                                checked={formData.urgency === option.value}
                                onChange={handleInputChange}
                                className="w-4 h-4 text-white"
                            />
                            <span className="flex-1">{option.label}</span>
                            {option.price > 0 && (
                                <span className="text-green-400 font-semibold">+${option.price}</span>
                            )}
                        </label>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Additional Notes</label>
                <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 "
                    placeholder="Any special requirements, modifications, or preferences..."
                />
            </div>
        </div>
    );

    const ReviewStep = () => {
        const urgencyOption = urgencyOptions.find(opt => opt.value === formData.urgency);
        const basePrice = 299;
        const totalPrice = basePrice + (urgencyOption?.price || 0);

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-center mb-6">Review Your Order</h2>

                <div className="bg-white/5 rounded-xl p-6 space-y-4">
                    <h3 className="text-lg font-semibold">Order Summary</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h4 className="font-medium mb-2">Personal Information</h4>
                            <p className="text-gray-300 text-sm">{formData.firstName} {formData.lastName}</p>
                            <p className="text-gray-300 text-sm">{formData.email}</p>
                            <p className="text-gray-300 text-sm">{formData.phone}</p>
                        </div>

                        <div>
                            <h4 className="font-medium mb-2">Shipping Address</h4>
                            <p className="text-gray-300 text-sm">{formData.address}</p>
                            <p className="text-gray-300 text-sm">{formData.city}, {formData.state} {formData.zipCode}</p>
                            <p className="text-gray-300 text-sm">{formData.country}</p>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <h4 className="font-medium mb-2">Product Details</h4>
                        <div className="flex items-center space-x-4 mb-4">
                            {generatedImage && (
                                <img
                                    src={generatedImage}
                                    alt="Generated Design"
                                    className="w-16 h-16 object-cover rounded-lg"
                                />
                            )}
                            <div>
                                <p className="text-white">Custom {prompt}</p>
                                <p className="text-gray-300 text-sm">Size: {formData.size} | Fabric: {formData.preferredFabric}</p>
                                <p className="text-gray-300 text-sm">Timeline: {urgencyOption?.label}</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-4">
                        <div className="flex justify-between items-center mb-2">
                            <span>Base Price</span>
                            <span>${basePrice}</span>
                        </div>
                        {urgencyOption?.price > 0 && (
                            <div className="flex justify-between items-center mb-2">
                                <span>Rush Fee</span>
                                <span>+${urgencyOption.price}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-xl font-bold border-t border-white/10 pt-2">
                            <span>Total</span>
                            <span>${totalPrice}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center text-gray-300 hover:text-white mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </button>
                    <h1 className="text-4xl font-bold mb-4">Custom Order</h1>
                    <p className="text-gray-300">Create your personalized fashion item</p>
                </div>

                <StepIndicator />

                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto custom-order-form">
                    {currentStep === 1 && <PersonalInfoStep formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 2 && <AddressStep formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 3 && <OrderDetailsStep formData={formData} handleInputChange={handleInputChange} />}
                    {currentStep === 4 && <ReviewStep formData={formData} prompt={prompt} generatedImage={generatedImage} />}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-300"
                            >
                                Previous
                            </button>
                        )}

                        <div className="ml-auto">
                            {currentStep < 4 ? (
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    className="px-6 py-3 rounded-lg transition-colors duration-300 bg-white text-black hover:bg-gray-100"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors duration-300 flex items-center"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 mr-2" />
                                            Place Order
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CustomOrder;
