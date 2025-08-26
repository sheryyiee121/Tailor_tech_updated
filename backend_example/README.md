# AI Generation Backend

This is a Python Flask backend that loads your trained PyTorch model and provides API endpoints for AI generation.

## Setup

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Place your trained model file:**
   - Put `shapE_finetuned_with_330kdata.pth` in the same directory as `app.py`

3. **Update the model loading code:**
   - Open `app.py`
   - Replace the placeholder model loading code with your actual model architecture
   - Update the preprocessing and postprocessing functions to match your model's input/output format

## Running the Backend

```bash
python app.py
```

The backend will start on `http://localhost:8000`

## API Endpoints

- `GET /health` - Health check
- `POST /generate` - Generate design from prompt
- `GET /model-status` - Check if model is loaded

## Frontend Integration

Update your `aiGenerationService.js` to call the backend API instead of loading the model directly.
