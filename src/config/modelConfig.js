// AI Model Configuration
export const MODEL_CONFIG = {
    // Update this path to match your actual trained model file
    MODEL_PATH: '/models/shapE_finetuned_with_330kdata.pth',

    // Model settings
    MODEL_TYPE: 'pytorch', // 'pytorch', 'tensorflow', 'onnx'

    // Generation settings
    DEFAULT_IMAGE_SIZE: 512,
    MAX_PROMPT_LENGTH: 200,

    // API endpoints (if using backend)
    BACKEND_URL: 'http://localhost:8000', // Update if you have a backend

    // Model loading options
    LOAD_OPTIONS: {
        useGPU: true,
        precision: 'float32',
        cacheSize: 100
    }
};

// Update this function to match your model's input/output format
export const preprocessPrompt = (prompt) => {
    // Add your prompt preprocessing logic here
    // This might include:
    // - Text normalization
    // - Tokenization
    // - Feature extraction

    return prompt.trim().toLowerCase();
};

// Update this function to match your model's output format
export const postprocessOutput = (modelOutput) => {
    // Add your output postprocessing logic here
    // This might include:
    // - Converting tensors to images
    // - Image enhancement
    // - Format conversion

    return modelOutput;
};
