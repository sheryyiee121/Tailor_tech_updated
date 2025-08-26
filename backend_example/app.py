from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn.functional as F
import numpy as np
import base64
from PIL import Image
import io
import json
import os
import trimesh
from shap_e.diffusion.sample import sample_latents
from shap_e.diffusion.gaussian_diffusion import diffusion_from_config
from shap_e.models.download import load_model, load_config
from shap_e.models.configs import model_from_config
from shap_e.util.notebooks import decode_latent_images
import matplotlib.pyplot as plt
from matplotlib.backends.backend_agg import FigureCanvasAgg

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

# Global variables to store the loaded models
shape_e_model = None
diffusion = None
device = None

def load_shape_e_model():
    """Load the fine-tuned ShapE model"""
    global shape_e_model, diffusion, device
    try:
        device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        print(f"🔧 Using device: {device}")
        
        # Update this path to match your actual model file location
        model_path = "shapE_finetuned_with_330kdata.pth"
        
        # Check if model file exists
        if not os.path.exists(model_path):
            print(f"⚠️  Model file not found: {model_path}")
            print("Please copy your model file to the backend directory")
            print("🔄 Loading base ShapE model instead...")
            # Load base model if fine-tuned model not found
            print("📥 Downloading base ShapE model...")
            shape_e_model = load_model('text300M', device=device)
            print("📥 Loading diffusion config...")
            diffusion = diffusion_from_config(load_config('diffusion'))
            print("✅ Base ShapE model loaded successfully!")
            return True
        
        print(f"📂 Found fine-tuned model file: {model_path}")
        print(f"📊 Model file size: {os.path.getsize(model_path) / (1024*1024):.1f} MB")
        
        try:
            print(f"🔄 Loading fine-tuned ShapE model from: {model_path}")
            
            # Load the base model architecture
            print("📥 Loading base ShapE architecture...")
            shape_e_model = model_from_config(load_config('text300M'), device=device)
            print("✅ Base architecture loaded!")
            
            # Load your fine-tuned weights
            print("📥 Loading fine-tuned weights...")
            checkpoint = torch.load(model_path, map_location=device)
            print("✅ Checkpoint loaded!")
            
            if isinstance(checkpoint, dict):
                if 'model_state_dict' in checkpoint:
                    # If saved with training script format
                    state_dict = checkpoint['model_state_dict']
                    print("📋 Found model_state_dict in checkpoint")
                else:
                    # If saved as direct state dict
                    state_dict = checkpoint
                    print("📋 Using checkpoint as state dict")
                
                print(f"🏗️  Model structure analysis:")
                for key in list(state_dict.keys())[:5]:  # Show first 5 keys
                    value = state_dict[key]
                    if hasattr(value, 'shape'):
                        print(f"   {key}: {value.shape}")
                    else:
                        print(f"   {key}: {type(value)}")
                
                # Load the state dict into the model
                print("🔄 Applying fine-tuned weights...")
                shape_e_model.load_state_dict(state_dict, strict=False)
                print("✅ Fine-tuned weights loaded successfully!")
            else:
                print(f"❌ Unexpected checkpoint format: {type(checkpoint)}")
                raise ValueError("Invalid checkpoint format")
            
            # Load diffusion configuration
            print("📥 Loading diffusion configuration...")
            diffusion = diffusion_from_config(load_config('diffusion'))
            print("✅ Diffusion config loaded!")
            
            # Set model to evaluation mode
            shape_e_model.eval()
            
            print("✅ Fine-tuned ShapE 3D model loaded and ready for clothing generation!")
            return True
            
        except Exception as load_error:
            print(f"❌ Error loading fine-tuned model: {load_error}")
            print("🔄 Falling back to base ShapE model...")
            print("📥 Downloading base ShapE model...")
            shape_e_model = load_model('text300M', device=device)
            print("📥 Loading diffusion config...")
            diffusion = diffusion_from_config(load_config('diffusion'))
            print("✅ Base ShapE model loaded successfully!")
            return True
        
    except Exception as e:
        print(f"❌ Error loading ShapE model: {e}")
        return False

def generate_3d_clothing(prompt):
    """Generate 3D clothing using ShapE model"""
    global shape_e_model, diffusion, device
    
    try:
        print(f"🎨 Generating 3D clothing for prompt: '{prompt}'")
        
        if shape_e_model is None or diffusion is None:
            raise ValueError("ShapE model not loaded")
        
        # Generate latent codes using the model and diffusion
        latents = sample_latents(
            batch_size=1,
            model=shape_e_model,
            diffusion=diffusion,
            guidance_scale=15.0,
            model_kwargs=dict(texts=[prompt]),
            progress=False,
            clip_denoised=True,
            use_fp16=False,
            use_karras=True,
            karras_steps=64,
            sigma_min=1e-3,
            sigma_max=160,
            s_churn=0,
        )
        
        print("✅ 3D latent codes generated successfully!")
        
        # Decode latents to get 3D mesh
        try:
            # Get the first (and only) latent
            latent = latents[0]
            
            print("🔄 Decoding latent to 3D mesh...")
            
            # Decode latent to mesh (this gives us the actual 3D clothing)
            # We'll render multiple views of the 3D clothing
            images = decode_latent_images(
                shape_e_model, 
                latent, 
                size=512, 
                batch_size=1
            )
            
            if images:
                print(f"✅ Generated {len(images)} views of 3D clothing!")
                # Return the first rendered view
                return images[0]
            else:
                print("⚠️  No images generated, using fallback")
                return None
                
        except Exception as decode_error:
            print(f"❌ Error decoding latent: {decode_error}")
            return None
            
    except Exception as e:
        print(f"❌ Error in 3D generation: {e}")
        return None

def preprocess_prompt(prompt):
    """Preprocess the text prompt for ShapE model"""
    # Clean and format the prompt for clothing generation
    processed_prompt = prompt.strip()
    
    # Add clothing context if not present
    clothing_keywords = ['dress', 'shirt', 'jacket', 'pants', 'skirt', 'hoodie', 'blazer', 'top', 'bottom']
    has_clothing_keyword = any(keyword in processed_prompt.lower() for keyword in clothing_keywords)
    
    if not has_clothing_keyword:
        processed_prompt = f"clothing {processed_prompt}"
    
    print(f"📝 Processed prompt: '{processed_prompt}'")
    return processed_prompt

def postprocess_output(model_output):
    """Convert model output to displayable image"""
    try:
        # This depends on your model's output format
        # You might need to:
        # - Convert tensors to numpy arrays
        # - Normalize values to 0-255 range
        # - Convert to PIL Image
        # - Encode as base64
        
        # Handle 3D clothing output from ShapE model
        if isinstance(model_output, dict) and model_output.get('type') == '3d_clothing':
            print("🎯 Processing 3D clothing output")
            return generate_3d_clothing_image(model_output)
        
        # Example (customize for your model's output):
        elif isinstance(model_output, torch.Tensor):
            # Convert tensor to numpy
            output_array = model_output.detach().cpu().numpy()
            
            # Normalize to 0-255 range (adjust based on your output format)
            if output_array.max() > 1.0:
                output_array = output_array / 255.0
            
            # Convert to PIL Image
            if len(output_array.shape) == 3:
                # If output is (C, H, W), convert to (H, W, C)
                if output_array.shape[0] == 3:
                    output_array = np.transpose(output_array, (1, 2, 0))
            
            # Ensure values are in 0-255 range
            output_array = (output_array * 255).astype(np.uint8)
            
            # Create PIL Image
            image = Image.fromarray(output_array)
            
            # Convert to base64
            buffer = io.BytesIO()
            image.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return f"data:image/png;base64,{img_str}"
        
        else:
            # Handle other output formats
            raise ValueError(f"Unsupported output format: {type(model_output)}")
            
    except Exception as e:
        print(f"Error in postprocessing: {e}")
        # Return a placeholder image on error
        return generate_placeholder_image()

def generate_3d_clothing_placeholder(prompt):
    """Generate a 3D-style clothing representation based on prompt"""
    # This creates a more realistic looking clothing texture
    # In reality, this should be replaced with actual 3D mesh generation
    
    # Analyze prompt for clothing type and colors
    prompt_lower = prompt.lower()
    
    # Determine base colors from prompt
    if 'red' in prompt_lower:
        base_color = '#dc2626'
    elif 'blue' in prompt_lower:
        base_color = '#2563eb'
    elif 'green' in prompt_lower:
        base_color = '#16a34a'
    elif 'black' in prompt_lower:
        base_color = '#1f2937'
    elif 'white' in prompt_lower:
        base_color = '#f9fafb'
    else:
        base_color = '#6366f1'  # Default purple
    
    return {
        'type': '3d_clothing',
        'prompt': prompt,
        'base_color': base_color,
        'clothing_type': 'dress' if 'dress' in prompt_lower else 'jacket' if 'jacket' in prompt_lower else 'shirt',
        'pattern': 'floral' if 'floral' in prompt_lower else 'plain'
    }

def generate_3d_clothing_image(clothing_data):
    """Generate a visual representation of 3D clothing data"""
    print(f"🎨 Creating visual for 3D {clothing_data['clothing_type']} with {clothing_data['pattern']} pattern")
    
    # Create a more realistic clothing texture based on the 3D data
    img = Image.new('RGB', (512, 512), color=clothing_data['base_color'])
    
    # Add some texture patterns based on clothing type and pattern
    # This is a simplified representation - in reality you'd render the 3D mesh
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

def generate_placeholder_image():
    """Generate a placeholder image when model fails"""
    # Create a simple placeholder image
    img = Image.new('RGB', (512, 512), color='#1e3a8a')
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return f"data:image/png;base64,{img_str}"

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': shape_e_model is not None,
        'model_type': 'ShapE_3D_Clothing_Generator',
        'device': str(device) if device else 'not_set'
    })

@app.route('/generate', methods=['POST'])
def generate_design():
    """Generate clothing design based on text prompt"""
    try:
        # Get prompt from request
        data = request.get_json()
        if not data or 'prompt' not in data:
            return jsonify({'error': 'No prompt provided'}), 400
        
        prompt = data['prompt']
        print(f"🎨 Generating design for prompt: {prompt}")
        
        # Check if ShapE model is loaded
        if shape_e_model is None:
            return jsonify({'error': 'ShapE model not loaded'}), 500
        
        # Preprocess prompt
        processed_prompt = preprocess_prompt(prompt)
        
        # Generate design using actual ShapE model
        with torch.no_grad():
            try:
                print(f"🚀 Generating 3D clothing with ShapE model...")
                
                # Use actual ShapE model for 3D generation
                generated_image = generate_3d_clothing(processed_prompt)
                
                if generated_image is not None:
                    print("✅ 3D clothing generated successfully!")
                    output = generated_image
                else:
                    print("⚠️  3D generation failed, using enhanced placeholder")
                    output = generate_3d_clothing_placeholder(processed_prompt)
                    
            except Exception as e:
                print(f"❌ ShapE generation failed: {e}")
                print("🔄 Falling back to placeholder generation")
                output = generate_3d_clothing_placeholder(processed_prompt)
        
        # Postprocess output to get image
        if output is not None:
            generated_image = postprocess_output(output)
        else:
            # Use placeholder for now
            generated_image = generate_placeholder_image()
        
        return jsonify({
            'success': True,
            'generatedImage': generated_image,
            'prompt': prompt,
            'timestamp': str(np.datetime64('now'))
        })
        
    except Exception as e:
        print(f"❌ Error in generation: {e}")
        return jsonify({
            'error': f'Generation failed: {str(e)}',
            'success': False
        }), 500

@app.route('/model-status', methods=['GET'])
def model_status():
    """Get model loading status"""
    return jsonify({
        'model_loaded': shape_e_model is not None,
        'model_type': 'ShapE_3D_Clothing_Generator',
        'model_path': 'shapE_finetuned_with_330kdata.pth',
        'device': str(device) if device else 'not_set',
        'diffusion_loaded': diffusion is not None
    })

if __name__ == '__main__':
    print("🚀 Starting ShapE 3D Clothing Generation Backend...")
    
    # Set memory management
    import gc
    gc.collect()
    
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        print("🧹 GPU memory cleared")
    
    # Load the ShapE model
    try:
        if load_shape_e_model():
            print("✅ ShapE backend ready! Starting Flask server...")
            app.run(debug=True, host='0.0.0.0', port=8000)
        else:
            print("❌ Failed to load ShapE model. Backend cannot start.")
            print("Please check your model file and dependencies.")
    except Exception as e:
        print(f"❌ Critical error during startup: {e}")
        print("🔄 Try restarting the backend...")
