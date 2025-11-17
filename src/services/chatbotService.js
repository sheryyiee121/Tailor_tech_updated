class ChatbotService {
    constructor() {


        // For development, using the API key directly
        // In production, you should use environment variables properly
        // Note: This API key appears to be invalid - please replace with a valid OpenAI API key
        this.apiKey = import.meta.env.VITE_OPENAI_API_KEY ||
            'sk-3aTEoan7OkAqyopWuhT8J6o8s77IEeUxI3bf8VWFEXT3BlbkFJHxeeEpxFdMsTagEfaEGDrEJf6E52h8F9QR8kacFFYA';
        this.baseURL = 'https://api.openai.com/v1/chat/completions';
        this.testMode = false; // Set to true for testing without API calls - disabled now that API key is provided

        // TailorTech knowledge base for context
        this.tailorTechContext = `
        You are TailorBot, an AI assistant for TailorTech - an AI-powered fashion design platform. Here's what you should know about TailorTech:

        ABOUT TAILORTECH:
        - TailorTech is an innovative AI-powered fashion design platform
        - We help users create stunning 3D fashion designs using artificial intelligence
        - Our platform offers virtual try-on technology and 3D visualization
        - Users can generate custom outfits from text prompts
        - We provide a complete design-to-production pipeline

        KEY FEATURES:
        - AI-Powered Design Generation: Create fashion designs from text descriptions
        - 3D Visualization: See designs on virtual mannequins
        - Virtual Try-On: Preview outfits on different body types
        - Outfit Preview: Interactive 3D preview before finalizing
        - Custom Orders: Order physical garments based on designs
        - Multiple Fabric Options: Cotton, Silk, Wool, Linen, Polyester, etc.
        - Runway Animation: Watch your designs on a virtual fashion show

        TEAM:
        - Muhammad Sheraz (CEO & Founder): Leading AI-powered fashion design innovation
        - Sheeza Ijaz (CTO & Co-Founder): Developing 3D visualization and AI algorithms
        - Muhammad Hamza (Lead Developer): Building React and AI integration

        WORKFLOW:
        1. User enters a design prompt (e.g., "elegant black evening dress")
        2. AI generates the outfit design
        3. User selects mannequin (gender, size)
        4. 3D outfit preview with fabric selection
        5. Virtual runway show
        6. Option to place custom order

        PRICING & PLANS:
        - Free plan available for basic features
        - Premium plans for advanced AI tools and commercial use
        - Enterprise solutions for fashion businesses

        HELP TOPICS YOU CAN ASSIST WITH:
        - How to use TailorTech platform
        - Fashion design tips and trends
        - 3D visualization features
        - Custom order process
        - Fabric selection guidance
        - Design prompt suggestions
        - Platform navigation
        - Account and billing questions
        - Technical support

        Always be helpful, friendly, and knowledgeable about fashion and TailorTech's capabilities. Provide specific guidance and encourage users to try the platform.
        `;
    }

    async sendMessage(message, conversationHistory = []) {
        try {
            // First, let's try a simple local response for common questions
            const localResponse = this.getLocalResponse(message);
            if (localResponse) {
                return {
                    success: true,
                    message: localResponse
                };
            }

            // If in test mode, return a mock response
            if (this.testMode) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
                return {
                    success: true,
                    message: `I understand you're asking about "${message}". As TailorBot, I can help you with TailorTech features, fashion design tips, and platform guidance. Our AI-powered platform makes creating stunning fashion designs incredibly easy! What specific aspect would you like to explore?`
                };
            }

            const messages = [
                {
                    role: "system",
                    content: this.tailorTechContext
                },
                ...conversationHistory.slice(-10), // Keep only last 10 messages for context
                {
                    role: "user",
                    content: message
                }
            ];

            console.log('Sending request to OpenAI API...');

            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: messages,
                    max_tokens: 400,
                    temperature: 0.7,
                    presence_penalty: 0.1,
                    frequency_penalty: 0.1,
                    top_p: 1,
                    stream: false
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.text();
                console.error('API Error Response:', errorData);
                throw new Error(`API request failed with status ${response.status}: ${errorData}`);
            }

            const data = await response.json();
            console.log('API Response received successfully');

            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from API');
            }

            return {
                success: true,
                message: data.choices[0].message.content,
                usage: data.usage
            };
        } catch (error) {
            console.error('ChatGPT API Error Details:', error);

            // Return a helpful local response based on the error
            let fallbackMessage = this.getFallbackResponse(message, error);

            return {
                success: false,
                error: error.message,
                message: fallbackMessage
            };
        }
    }

    // Get local responses for common questions without API call
    getLocalResponse(message) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
            return "Hello! I'm TailorBot, your AI fashion assistant. I can help you with TailorTech features, fashion design tips, and answer questions about our platform. What would you like to know?";
        }

        if (lowerMessage.includes('how does') && lowerMessage.includes('work')) {
            return "TailorTech works in simple steps: 1) Enter a description of your dream outfit, 2) Our AI generates a design, 3) Preview it on a 3D mannequin, 4) Watch it on our virtual runway, and 5) Order it as a physical garment! Would you like me to explain any specific feature?";
        }

        if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
            return "TailorTech offers flexible pricing: We have a free plan to get you started with basic features, plus premium plans with advanced AI tools and 3D features. Enterprise solutions are available for fashion businesses. Would you like to know more about any specific plan?";
        }

        if (lowerMessage.includes('fabric') || lowerMessage.includes('material')) {
            return "TailorTech supports various fabric types including Cotton (breathable, comfortable), Silk (luxurious, smooth), Wool (warm, durable), Linen (lightweight, natural), Polyester (wrinkle-resistant), and more. Each fabric affects the look and feel of your design. What type of garment are you designing?";
        }

        if (lowerMessage.includes('team') || lowerMessage.includes('about')) {
            return "TailorTech is led by an amazing team: Muhammad Sheraz (CEO & Founder) leads our AI-powered fashion innovation, Sheeza Ijaz (CTO & Co-Founder) develops our 3D visualization technology, and Muhammad Hamza (Lead Developer) builds our seamless user experience. We're passionate about revolutionizing fashion design!";
        }

        return null; // No local response found
    }

    // Get contextual fallback responses based on the user's question
    getFallbackResponse(message, error) {
        const lowerMessage = message.toLowerCase();

        if (lowerMessage.includes('design') || lowerMessage.includes('create')) {
            return "I'd love to help you with design ideas! While I'm having connectivity issues with my advanced AI, I can tell you that TailorTech makes design creation super easy. Just describe your vision (like 'elegant black evening dress' or 'casual summer outfit') and our AI will generate stunning designs. Try the platform directly for the best experience!";
        }

        if (lowerMessage.includes('help') || lowerMessage.includes('support')) {
            return "I'm here to help! Even though I'm having some technical difficulties, I can share that TailorTech offers: AI-powered design generation, 3D visualization, virtual try-on, fabric selection, and custom ordering. What specific area would you like to know more about?";
        }

        if (lowerMessage.includes('feature') || lowerMessage.includes('how')) {
            return "TailorTech has amazing features! Our main workflow is: Enter design prompt → AI generates outfit → Select mannequin → 3D preview → Virtual runway → Custom order. While I'm having connection issues, you can explore these features directly on the platform. Is there a specific feature you're curious about?";
        }

        return "I'm experiencing some technical difficulties connecting to my advanced AI system, but I'm still here to help! TailorTech is an AI-powered fashion design platform where you can create stunning outfits from text descriptions. Try asking me about our features, team, or how to get started - I'll do my best to assist you!";
    }

    // Get suggested prompts for fashion design
    getSuggestedPrompts() {
        return [
            "How do I create a vintage-style dress?",
            "What fabrics work best for formal wear?",
            "Can you help me design a casual summer outfit?",
            "How does the 3D preview feature work?",
            "What's the difference between cotton and silk?",
            "How do I place a custom order?",
            "Can you suggest trendy color combinations?",
            "How do I use the virtual try-on feature?"
        ];
    }

    // Get quick responses for common questions
    getQuickResponses() {
        return {
            "getting_started": "To get started with TailorTech, simply sign up for a free account and enter a description of your dream outfit. Our AI will generate a design that you can preview in 3D!",
            "how_it_works": "TailorTech uses advanced AI to turn your text descriptions into stunning fashion designs. You can then visualize them on 3D mannequins and even order physical garments!",
            "pricing": "We offer a free plan to get you started, plus premium plans with advanced features. Check out our pricing page for detailed information!",
            "support": "I'm here to help! You can ask me about fashion design, using TailorTech features, or any questions about our platform."
        };
    }
}

export default new ChatbotService();
