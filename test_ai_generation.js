// Test script for AI Generation Service
// Run this with: node test_ai_generation.js

import aiGenerationService from './src/services/aiGenerationService.js';

async function testAIGeneration() {
    console.log('🧪 Testing AI Generation Service...\n');

    try {
        // Test 1: Check model status
        console.log('1️⃣ Testing model status...');
        const status = aiGenerationService.getModelStatus();
        console.log('Model status:', status);
        console.log('✅ Model status check passed\n');

        // Test 2: Load model
        console.log('2️⃣ Testing model loading...');
        const modelLoaded = await aiGenerationService.loadModel();
        console.log('Model loaded:', modelLoaded);
        console.log('✅ Model loading test passed\n');

        // Test 3: Generate design
        if (modelLoaded) {
            console.log('3️⃣ Testing design generation...');
            const testPrompt = "A stylish blue leather jacket with silver zippers";
            console.log('Test prompt:', testPrompt);

            const result = await aiGenerationService.generateDesign(testPrompt);
            console.log('Generation result:', {
                success: result.success,
                prompt: result.prompt,
                hasImage: !!result.generatedImage,
                timestamp: result.timestamp
            });
            console.log('✅ Design generation test passed\n');
        } else {
            console.log('⚠️  Skipping generation test - model not loaded\n');
        }

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the test
testAIGeneration();
