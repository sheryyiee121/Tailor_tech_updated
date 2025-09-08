import React, { useRef, useState, useEffect } from 'react';
import * as cam from '@mediapipe/camera_utils';
import * as pose from '@mediapipe/pose';
import { Camera, Upload, RefreshCw, Check } from 'lucide-react';

const BodyMeasurementCamera = ({ onMeasurementsComplete }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [measurements, setMeasurements] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [poseDetector, setPoseDetector] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [processingImage, setProcessingImage] = useState(false);

    useEffect(() => {
        // Initialize MediaPipe Pose
        const initializePose = async () => {
            const pose = new window.Pose({
                locateFile: (file) => {
                    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
                }
            });

            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: false,
                smoothSegmentation: false,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            });

            pose.onResults(onPoseResults);
            setPoseDetector(pose);
            setIsLoading(false);
        };

        initializePose();
    }, []);

    const startCamera = async () => {
        if (!poseDetector) return;

        const camera = new cam.Camera(videoRef.current, {
            onFrame: async () => {
                await poseDetector.send({ image: videoRef.current });
            },
            width: 640,
            height: 480
        });

        camera.start();
        setCameraActive(true);
    };

    const onPoseResults = (results) => {
        if (!results.poseLandmarks) return;

        const canvasCtx = canvasRef.current.getContext('2d');
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw the image
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

        // Draw pose landmarks
        drawConnectors(canvasCtx, results.poseLandmarks, pose.POSE_CONNECTIONS, {
            color: '#00FF00',
            lineWidth: 4
        });

        drawLandmarks(canvasCtx, results.poseLandmarks, {
            color: '#FF0000',
            lineWidth: 2
        });

        canvasCtx.restore();

        // Calculate measurements from landmarks
        if (results.poseLandmarks) {
            calculateMeasurements(results.poseLandmarks);
        }
    };

    const calculateMeasurements = (landmarks) => {
        // Key landmark indices
        const LEFT_SHOULDER = 11;
        const RIGHT_SHOULDER = 12;
        const LEFT_HIP = 23;
        const RIGHT_HIP = 24;
        const LEFT_ANKLE = 27;
        const RIGHT_ANKLE = 28;
        const LEFT_WRIST = 15;
        const RIGHT_WRIST = 16;
        const LEFT_ELBOW = 13;
        const RIGHT_ELBOW = 14;

        // Calculate distances (normalized values - need calibration with known reference)
        const shoulderWidth = calculateDistance(landmarks[LEFT_SHOULDER], landmarks[RIGHT_SHOULDER]);
        const torsoLength = calculateDistance(
            getMidpoint(landmarks[LEFT_SHOULDER], landmarks[RIGHT_SHOULDER]),
            getMidpoint(landmarks[LEFT_HIP], landmarks[RIGHT_HIP])
        );
        const totalHeight = calculateDistance(
            getMidpoint(landmarks[LEFT_SHOULDER], landmarks[RIGHT_SHOULDER]),
            getMidpoint(landmarks[LEFT_ANKLE], landmarks[RIGHT_ANKLE])
        );
        const armLength = calculateDistance(landmarks[LEFT_SHOULDER], landmarks[LEFT_WRIST]);
        const hipWidth = calculateDistance(landmarks[LEFT_HIP], landmarks[RIGHT_HIP]);

        // Convert to estimated real measurements (requires calibration)
        // These are example conversions - you'd need to calibrate with known measurements
        const estimatedMeasurements = {
            height: Math.round(totalHeight * 170), // cm (average height calibration)
            chest: Math.round(shoulderWidth * 100), // cm
            waist: Math.round(hipWidth * 85), // cm
            armLength: Math.round(armLength * 60), // cm
            torsoLength: Math.round(torsoLength * 50), // cm
            bodyType: determineBodyType(shoulderWidth, hipWidth, torsoLength)
        };

        setMeasurements(estimatedMeasurements);
    };

    const calculateDistance = (point1, point2) => {
        return Math.sqrt(
            Math.pow(point2.x - point1.x, 2) +
            Math.pow(point2.y - point1.y, 2) +
            Math.pow(point2.z - point1.z, 2)
        );
    };

    const getMidpoint = (point1, point2) => {
        return {
            x: (point1.x + point2.x) / 2,
            y: (point1.y + point2.y) / 2,
            z: (point1.z + point2.z) / 2
        };
    };

    const determineBodyType = (shoulder, hip, torso) => {
        const ratio = shoulder / hip;
        if (ratio > 1.1) return 'athletic';
        if (ratio < 0.9) return 'pear';
        return 'regular';
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const image = canvas.toDataURL('image/png');
        setCapturedImage(image);
        setCameraActive(false);
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setProcessingImage(true);
        const reader = new FileReader();

        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                // Process image with MediaPipe
                if (poseDetector) {
                    await poseDetector.send({ image: img });
                    setCapturedImage(e.target.result);
                }
                setProcessingImage(false);
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    };

    const confirmMeasurements = () => {
        if (measurements && onMeasurementsComplete) {
            onMeasurementsComplete({
                ...measurements,
                image: capturedImage
            });
        }
    };

    const drawConnectors = (ctx, landmarks, connections, style) => {
        ctx.strokeStyle = style.color;
        ctx.lineWidth = style.lineWidth;

        connections.forEach(([start, end]) => {
            const startPoint = landmarks[start];
            const endPoint = landmarks[end];

            ctx.beginPath();
            ctx.moveTo(startPoint.x * ctx.canvas.width, startPoint.y * ctx.canvas.height);
            ctx.lineTo(endPoint.x * ctx.canvas.width, endPoint.y * ctx.canvas.height);
            ctx.stroke();
        });
    };

    const drawLandmarks = (ctx, landmarks, style) => {
        ctx.fillStyle = style.color;

        landmarks.forEach(landmark => {
            ctx.beginPath();
            ctx.arc(
                landmark.x * ctx.canvas.width,
                landmark.y * ctx.canvas.height,
                5,
                0,
                2 * Math.PI
            );
            ctx.fill();
        });
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-6">Body Measurement Scanner</h3>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Camera/Upload Options */}
                    {!cameraActive && !capturedImage && (
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={startCamera}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Camera className="w-5 h-5" />
                                Use Camera
                            </button>

                            <label className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer transition-colors">
                                <Upload className="w-5 h-5" />
                                Upload Photo
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    )}

                    {/* Camera View */}
                    {cameraActive && (
                        <div className="relative">
                            <video
                                ref={videoRef}
                                className="hidden"
                                width="640"
                                height="480"
                            />
                            <canvas
                                ref={canvasRef}
                                width="640"
                                height="480"
                                className="w-full rounded-lg"
                            />
                            <button
                                onClick={capturePhoto}
                                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                            >
                                Capture Photo
                            </button>
                        </div>
                    )}

                    {/* Captured Image & Measurements */}
                    {capturedImage && measurements && (
                        <div className="space-y-6">
                            <img
                                src={capturedImage}
                                alt="Captured"
                                className="w-full max-w-md mx-auto rounded-lg"
                            />

                            <div className="bg-gray-800 rounded-lg p-6">
                                <h4 className="text-xl font-semibold text-white mb-4">Detected Measurements</h4>
                                <div className="grid grid-cols-2 gap-4 text-gray-300">
                                    <div>
                                        <span className="text-gray-500">Height:</span>
                                        <span className="ml-2 text-white">{measurements.height} cm</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Chest:</span>
                                        <span className="ml-2 text-white">{measurements.chest} cm</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Waist:</span>
                                        <span className="ml-2 text-white">{measurements.waist} cm</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Arm Length:</span>
                                        <span className="ml-2 text-white">{measurements.armLength} cm</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">Body Type:</span>
                                        <span className="ml-2 text-white capitalize">{measurements.bodyType}</span>
                                    </div>
                                </div>

                                <div className="mt-6 flex gap-4">
                                    <button
                                        onClick={confirmMeasurements}
                                        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                    >
                                        <Check className="w-5 h-5" />
                                        Use These Measurements
                                    </button>

                                    <button
                                        onClick={() => {
                                            setCapturedImage(null);
                                            setMeasurements(null);
                                            setCameraActive(false);
                                        }}
                                        className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
                                    >
                                        <RefreshCw className="w-5 h-5" />
                                        Retake
                                    </button>
                                </div>
                            </div>

                            <p className="text-sm text-gray-400 text-center">
                                Note: These measurements are estimates. For best results, wear fitted clothing and stand against a plain background.
                            </p>
                        </div>
                    )}

                    {processingImage && (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-white">Processing image...</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BodyMeasurementCamera;
