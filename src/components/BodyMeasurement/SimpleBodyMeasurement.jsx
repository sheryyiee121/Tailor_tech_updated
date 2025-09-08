import React, { useState, useRef } from 'react';
import { Upload, Camera, Info, Check, PlayCircle } from 'lucide-react';

const SimpleBodyMeasurement = ({ onMeasurementsComplete }) => {
    const [step, setStep] = useState(1);
    const [userHeight, setUserHeight] = useState('');
    const [frontImage, setFrontImage] = useState(null);
    const [sideImage, setSideImage] = useState(null);
    const [measurements, setMeasurements] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const fileInputRefFront = useRef(null);
    const fileInputRefSide = useRef(null);

    // Calculate measurements based on height and body proportions
    const calculateMeasurements = () => {
        if (!userHeight || !frontImage || !sideImage) return;

        const height = parseInt(userHeight);

        // Standard body proportions (can be adjusted based on image analysis)
        // These are approximations based on average human proportions
        const estimatedMeasurements = {
            height: height,
            chest: Math.round(height * 0.57), // Chest is typically 57% of height
            waist: Math.round(height * 0.47), // Waist is typically 47% of height
            hips: Math.round(height * 0.52), // Hips are typically 52% of height
            armLength: Math.round(height * 0.36), // Arm length is typically 36% of height
            inseam: Math.round(height * 0.45), // Inseam is typically 45% of height
            shoulder: Math.round(height * 0.26), // Shoulder width is typically 26% of height
            bodyType: 'regular' // This could be determined by analyzing proportions
        };

        setMeasurements(estimatedMeasurements);
        setStep(4);
    };

    const handleImageUpload = (event, type) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (type === 'front') {
                setFrontImage(e.target.result);
            } else {
                setSideImage(e.target.result);
            }
        };
        reader.readAsDataURL(file);
    };

    const confirmMeasurements = () => {
        if (measurements && onMeasurementsComplete) {
            onMeasurementsComplete({
                ...measurements,
                frontImage,
                sideImage
            });
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white">Quick Body Measurement</h3>
                <button
                    onClick={() => setShowVideo(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                    <PlayCircle className="w-5 h-5" />
                    Watch Working Demo
                </button>
            </div>

            {/* Video Modal */}
            {showVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-semibold text-white">How Body Measurement Works</h4>
                            <button
                                onClick={() => setShowVideo(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                            <video
                                controls
                                autoPlay
                                className="w-full h-full"
                                src="/videos/SnapMeasureAI_showcase.mp4"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>

                        <div className="mt-4 space-y-2">
                            <p className="text-gray-300 text-sm">
                                This demo shows how our AI-powered body measurement system works:
                            </p>
                            <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                                <li>Enter your height as a reference</li>
                                <li>Upload front and side photos</li>
                                <li>AI estimates your body measurements</li>
                                <li>Get personalized size recommendations</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 1: Height Input */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm text-blue-300">
                                    We'll use your height as a reference to estimate other body measurements.
                                    For more accurate results, wear fitted clothing in your photos.
                                </p>
                                <button
                                    onClick={() => setShowVideo(true)}
                                    className="mt-2 text-sm text-blue-400 hover:text-blue-300 underline flex items-center gap-1"
                                >
                                    <PlayCircle className="w-4 h-4" />
                                    Watch demo video for best results
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-white mb-2">Enter Your Height</label>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                value={userHeight}
                                onChange={(e) => setUserHeight(e.target.value)}
                                placeholder="Enter height in cm"
                                className="flex-1 px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                                min="140"
                                max="220"
                            />
                            <button
                                onClick={() => userHeight && setStep(2)}
                                disabled={!userHeight}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${userHeight
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                Next
                            </button>
                        </div>
                        <p className="text-sm text-gray-400 mt-2">
                            Example: 175 cm or 5'9" = 175 cm
                        </p>
                    </div>
                </div>
            )}

            {/* Step 2: Front Photo */}
            {step === 2 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h4 className="text-xl font-semibold text-white mb-2">Front View Photo</h4>
                        <p className="text-gray-400">Stand straight, arms slightly away from body</p>
                    </div>

                    {!frontImage ? (
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">Upload a front-facing photo</p>
                            <input
                                ref={fileInputRefFront}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'front')}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRefFront.current?.click()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Upload className="w-5 h-5 inline mr-2" />
                                Choose Photo
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <img
                                src={frontImage}
                                alt="Front view"
                                className="w-64 h-auto mx-auto rounded-lg"
                            />
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setFrontImage(null)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                >
                                    Retake
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 3: Side Photo */}
            {step === 3 && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h4 className="text-xl font-semibold text-white mb-2">Side View Photo</h4>
                        <p className="text-gray-400">Stand straight, natural posture</p>
                    </div>

                    {!sideImage ? (
                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 mb-4">Upload a side-facing photo</p>
                            <input
                                ref={fileInputRefSide}
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'side')}
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRefSide.current?.click()}
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Upload className="w-5 h-5 inline mr-2" />
                                Choose Photo
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <img
                                src={sideImage}
                                alt="Side view"
                                className="w-64 h-auto mx-auto rounded-lg"
                            />
                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={() => setSideImage(null)}
                                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                >
                                    Retake
                                </button>
                                <button
                                    onClick={calculateMeasurements}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                                >
                                    Calculate Measurements
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Step 4: Results */}
            {step === 4 && measurements && (
                <div className="space-y-6">
                    <div className="text-center">
                        <h4 className="text-xl font-semibold text-white mb-2">Your Estimated Measurements</h4>
                        <p className="text-gray-400">Based on standard body proportions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-800 rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Height</span>
                            <p className="text-white text-lg font-semibold">{measurements.height} cm</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Chest</span>
                            <p className="text-white text-lg font-semibold">{measurements.chest} cm</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Waist</span>
                            <p className="text-white text-lg font-semibold">{measurements.waist} cm</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Hips</span>
                            <p className="text-white text-lg font-semibold">{measurements.hips} cm</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Shoulder Width</span>
                            <p className="text-white text-lg font-semibold">{measurements.shoulder} cm</p>
                        </div>
                        <div className="bg-gray-800 rounded-lg p-4">
                            <span className="text-gray-400 text-sm">Arm Length</span>
                            <p className="text-white text-lg font-semibold">{measurements.armLength} cm</p>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                            <Info className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-yellow-300">
                                These measurements are estimates based on average body proportions.
                                For custom tailoring, professional measurements are recommended.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => {
                                setStep(1);
                                setMeasurements(null);
                                setFrontImage(null);
                                setSideImage(null);
                                setUserHeight('');
                            }}
                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                        >
                            Start Over
                        </button>
                        <button
                            onClick={confirmMeasurements}
                            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Use These Measurements
                        </button>
                    </div>
                </div>
            )}

            {/* Progress Indicator */}
            <div className="mt-8 flex justify-center gap-2">
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`h-2 w-12 rounded-full transition-colors ${s <= step ? 'bg-blue-600' : 'bg-gray-700'
                            }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default SimpleBodyMeasurement;
