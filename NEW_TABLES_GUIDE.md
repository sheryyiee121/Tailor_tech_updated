# 📊 New Analytics Tables - Complete Guide

## ✅ What Was Added:

### 4 New Database Tables:

1. **UserActivity** - Track all user actions
2. **PromptHistory** - Track AI prompts and usage
3. **MannequinSelection** - Track mannequin choices (gender, size)
4. **UserPreferences** - Store user preferences and stats

---

## 📋 Table Details:

### 1. UserActivity Table
**Purpose:** Track every action users take

**Fields:**
- UserId (Firebase UID)
- ActivityType (prompt_generated, mannequin_selected, texture_applied, etc.)
- Prompt
- MannequinGender
- MannequinSize
- TextureUrl
- GeneratedImageUrl
- Measurements (JSON)
- AdditionalData (JSON)
- CreatedAt

**Use Cases:**
- See what users are doing
- Track user journey
- Identify popular features
- Debug user issues

---

### 2. PromptHistory Table
**Purpose:** Track all AI prompts users generate

**Fields:**
- UserId
- Prompt (the text prompt)
- GeneratedImageUrl
- IsFavorite
- Tags
- UsageCount (how many times used)
- CreatedAt
- LastUsedAt

**Use Cases:**
- See most popular prompts
- Track prompt reuse
- Identify trending designs
- User's favorite prompts

---

### 3. MannequinSelection Table
**Purpose:** Track mannequin choices (gender, size)

**Fields:**
- UserId
- Gender (male/female)
- Size (small/medium/large)
- CustomMeasurements (JSON)
- AssociatedPrompt
- TextureApplied
- FinalImageUrl
- IsCustomMannequin
- CreatedAt

**Use Cases:**
- See which sizes are popular
- Track gender preferences
- Custom vs standard mannequins
- Size distribution analytics

---

### 4. UserPreferences Table
**Purpose:** Store user preferences and statistics

**Fields:**
- UserId
- FavoriteDesignTypes (JSON array)
- PreferredColors (JSON array)
- PreferredFabrics (JSON array)
- DefaultGender
- DefaultSize
- SavedMeasurements (JSON)
- TotalPromptsGenerated
- TotalOrdersPlaced
- LastActiveAt
- CreatedAt, UpdatedAt

**Use Cases:**
- User profile insights
- Personalized recommendations
- Usage statistics
- User engagement metrics

---

## 🚀 How to Use:

### Step 1: Restart Backend

Stop and restart in Visual Studio to create new tables:
1. Click Stop (⏹️)
2. Click Play (▶️)
3. Database will auto-create new tables

---

### Step 2: Track Activities in Frontend

**Example: Track Prompt Generation**

In `src/pages/dashboard/dashboard.jsx`:

```javascript
import { trackPrompt, trackActivity } from '../../services/activityTracker';

const handleGenerate = async () => {
  if (prompt) {
    // ... existing code ...
    
    // Track the prompt
    await trackPrompt(user.uid, prompt, generatedImage);
    
    // Track activity
    await trackActivity(user.uid, 'prompt_generated', {
      prompt: prompt,
      generatedImageUrl: generatedImage
    });
  }
};
```

**Example: Track Mannequin Selection**

In `src/pages/model/model.jsx`:

```javascript
import { trackMannequinSelection } from '../../services/activityTracker';

const handleNext = () => {
  // ... existing code ...
  
  // Track mannequin selection
  trackMannequinSelection(user.uid, {
    gender: gender,
    size: mannequinSize,
    customMeasurements: userMeasurements,
    prompt: selectedTexture?.prompt,
    texture: selectedTexture?.texture,
    isCustom: !!customMannequin
  });
};
```

---

## 📊 Admin Analytics Dashboard

### New Page: `/admin/analytics`

**Features:**
- Total users, prompts, mannequins, orders
- Average prompts per user
- Average orders per user
- Gender distribution chart
- Size distribution chart
- Top 10 most used prompts
- User engagement metrics

**Access:**
- Sign in as admin
- Go to `/admin`
- Click "Analytics" button
- Or navigate to `/admin/analytics`

---

## 🎯 API Endpoints:

### UserActivity:
- `GET /api/useractivity/user/{userId}` - Get user's activities
- `POST /api/useractivity` - Track new activity
- `GET /api/useractivity/recent/{userId}?limit=10` - Recent activities

### PromptHistory:
- `GET /api/prompthistory/user/{userId}` - Get user's prompts
- `POST /api/prompthistory` - Track prompt (auto-increments usage)
- `GET /api/prompthistory/recent/{userId}?limit=10` - Recent prompts
- `PUT /api/prompthistory/{id}/favorite` - Toggle favorite

### MannequinSelection:
- `GET /api/mannequin/user/{userId}` - Get user's selections
- `POST /api/mannequin` - Track selection
- `GET /api/mannequin/stats/{userId}` - User mannequin stats

### Analytics:
- `GET /api/analytics/user/{userId}` - Complete user analytics
- `GET /api/analytics/admin/overview` - Platform-wide analytics

---

## 🧪 Testing:

### Test 1: Generate Prompt
1. Go to dashboard
2. Enter prompt: "Blue dress"
3. Generate
4. Check `/admin/analytics`
5. Should see prompt in "Top Prompts"

### Test 2: Select Mannequin
1. Go to model page
2. Select gender and size
3. Click next
4. Check admin analytics
5. Should see in gender/size distribution

### Test 3: View User Analytics
1. Use the app normally
2. Generate prompts, select mannequins
3. Go to `/admin/analytics`
4. See all insights!

---

## 📈 What You Can Track:

### User Behavior:
- ✅ What prompts they use
- ✅ Which mannequin sizes they prefer
- ✅ Male vs female mannequin usage
- ✅ Custom vs standard mannequins
- ✅ Prompt reuse patterns
- ✅ User engagement levels

### Platform Insights:
- ✅ Most popular prompts
- ✅ Most popular sizes
- ✅ Gender preferences
- ✅ Average prompts per user
- ✅ Conversion rate (prompts → orders)

---

## 🔄 Next Steps:

1. **Restart backend** (creates new tables)
2. **Integrate tracking** in your pages
3. **Use the app** to generate data
4. **View analytics** in `/admin/analytics`

---

## 💡 Integration Examples:

I can help you integrate tracking into:
- Dashboard (prompt generation)
- Model page (mannequin selection)
- Texture page (texture application)
- Any other user actions

Just let me know which pages you want to track!

---

**New tables created and ready to use!** 🎉

