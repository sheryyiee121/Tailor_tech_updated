# ⚠️ IMPORTANT: Large Model Files Management

## Problem
The project contains HUGE AI model files that should NOT be in Git:
- `shapE_finetuned_with_330kdata.pth` - **3.6 GB**
- `ViT-L-14.pt` - **890 MB**

## Solution for Deployment

### Option 1: Use Cloud Storage (Recommended)
Instead of including these files in your repo, host them on:
- **Google Cloud Storage**
- **AWS S3**
- **Cloudflare R2**
- **Any CDN**

Then load them from URLs in your code:
```python
model_url = "https://storage.googleapis.com/your-bucket/shapE_finetuned_with_330kdata.pth"
```

### Option 2: Git LFS (Large File Storage)
If you must version control these files:
```bash
git lfs track "*.pth"
git lfs track "*.pt"
git add .gitattributes
git add backend_example/shapE_finetuned_with_330kdata.pth
git commit -m "Add model with LFS"
```

### Option 3: Download on First Run
Create a script that downloads models when needed:
```python
import os
import requests

def download_model():
    model_path = "shapE_finetuned_with_330kdata.pth"
    if not os.path.exists(model_path):
        print("Downloading model...")
        url = "YOUR_MODEL_URL_HERE"
        response = requests.get(url)
        with open(model_path, 'wb') as f:
            f.write(response.content)
```

## For Vercel/Netlify Deployment

These platforms have size limits:
- **Vercel**: 100MB per file
- **Netlify**: 100MB per file

You CANNOT deploy these large files directly. You must:
1. Host models elsewhere (CDN/Cloud Storage)
2. Load them via URL in your backend
3. Or use a different hosting solution (AWS EC2, Google Cloud Run)

## Current Setup

The model file is in:
```
backend_example/shapE_finetuned_with_330kdata.pth
backend_example/shap_e_model_cache/ViT-L-14.pt
```

These are used by your Python backend for 3D model generation.

## Recommended Actions

1. **DO NOT** commit these files to Git
2. **Upload** them to cloud storage
3. **Update** your backend code to download from URL
4. **Add** to `.gitignore` (already done)

## Quick Fix for Now

Since these are only used by the Python backend (not the web app), and the backend runs locally, you can:
1. Keep the files locally for development
2. Deploy only the frontend to Vercel
3. Run the Python backend separately (on a VPS or cloud service)

The frontend can still work without the backend - it will use mock data for demos.
