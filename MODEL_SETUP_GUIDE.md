# AI Model Integration Setup Guide

## 🎯 Overview
This guide will help you integrate your trained PyTorch model (`shapE_finetuned_with_330kdata.pth`) with the React application to generate clothing designs from text prompts.

## 📁 File Placement

### 1. Place Your Model File
Put your trained model file in the correct location:
```
tailortech/public/models/shapE_finetuned_with_330kdata.pth
```

**Important**: The model file should be in the `public/models/` directory so it can be accessed by the frontend.

## 🔧 Model Integration Options

### Option 1: Direct Frontend Integration (Recommended for small models)
If your model is under 100MB and you want real-time generation:

1. **Convert PyTorch to TensorFlow.js**:
   ```bash
   pip install tensorflowjs
   tensorflowjs_converter --input_format=pytorch shapE_finetuned_with_330kdata.pth ./converted_model
   ```

2. **Update the service** to use the converted model

### Option 2: Backend API Integration (Recommended for large models)
If your model is large or you want better performance:

1. **Create a Python backend** (Flask/FastAPI)
2. **Load your PyTorch model** in Python
3. **Expose API endpoints** for generation
4. **Update frontend** to call the API

## 🚀 Quick Start (Option 1 - Frontend)

### Step 1: Install Dependencies
```bash
npm install @tensorflow/tfjs @tensorflow/tfjs-backend-webgl
```

### Step 2: Update Model Path
In `src/services/aiGenerationService.js`, update:
```javascript
this.modelPath = '/models/shapE_finetuned_with_330kdata.pth';
```

### Step 3: Convert Your Model
```bash
# Install conversion tools
pip install tensorflowjs

# Convert your model
tensorflowjs_converter --input_format=pytorch shapE_finetuned_with_330kdata.pth ./converted_model

# Copy converted files to public/models/
cp -r ./converted_model/* tailortech/public/models/
```

### Step 4: Update Service Implementation
Replace the placeholder methods in `aiGenerationService.js` with actual model loading and inference.

## 🔌 Backend Integration (Option 2)

### Step 1: Create Python Backend
```python
# app.py
from flask import Flask, request, jsonify
import torch
from your_model import YourModel  # Import your model architecture

app = Flask(__name__)

# Load your trained model
model = YourModel()
model.load_state_dict(torch.load('shapE_finetuned_with_330kdata.pth'))
model.eval()

@app.route('/generate', methods=['POST'])
def generate_design():
    prompt = request.json['prompt']
    
    # Process prompt through your model
    with torch.no_grad():
        output = model(prompt)
    
    # Convert output to image format
    # This depends on your model's output format
    
    return jsonify({
        'success': True,
        'image': image_data_url,
        'prompt': prompt
    })

if __name__ == '__main__':
    app.run(debug=True, port=8000)
```

### Step 2: Update Frontend Service
Update `aiGenerationService.js` to call the backend API instead of loading the model directly.

## 🎨 Customization

### Model Input Format
Update `preprocessPrompt()` in `src/config/modelConfig.js` to match your model's expected input format.

### Model Output Format
Update `postprocessOutput()` to handle your model's output format and convert it to displayable images.

## 🐛 Troubleshooting

### Common Issues:
1. **Model not loading**: Check file path and format
2. **Memory errors**: Use backend integration for large models
3. **Format compatibility**: Convert PyTorch models to TensorFlow.js or ONNX

### Debug Steps:
1. Check browser console for errors
2. Verify model file exists in correct location
3. Test model loading separately
4. Check model input/output format compatibility

## 📱 Testing

1. **Start the app**: `npm run dev`
2. **Navigate to dashboard** and enter a prompt
3. **Click "Generate AI Design"**
4. **Check console** for model loading and generation logs

## 🔒 Security Notes

- Keep your trained model file secure
- Don't expose sensitive model weights in production
- Consider using environment variables for API keys
- Implement rate limiting for generation requests

## 📚 Next Steps

1. **Test basic integration** with placeholder generation
2. **Implement actual model inference** based on your model's format
3. **Add error handling** and user feedback
4. **Optimize performance** and add caching
5. **Deploy** with proper model hosting

## 🆘 Need Help?

- Check the browser console for error messages
- Verify your model file format and compatibility
- Test model loading in isolation
- Consider using a simpler model for initial testing
