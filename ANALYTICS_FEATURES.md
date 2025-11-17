# 📊 Analytics & Tracking Features - Complete Guide

## ✅ What's New:

### 4 New Database Tables Added:

1. **UserActivity** - Every action users take
2. **PromptHistory** - All AI prompts with usage counts
3. **MannequinSelection** - Gender & size preferences
4. **UserPreferences** - User settings and stats

### New Admin Page:
- **Analytics Dashboard** (`/admin/analytics`) - Complete insights

### Automatic Tracking:
- ✅ Prompt generation (dashboard)
- ✅ Mannequin selection (model page)
- ✅ User activities
- ✅ Usage statistics

---

## 📊 What You Can See in Admin Panel:

### Analytics Dashboard (`/admin/analytics`):

**Overview Stats:**
- Total Users
- Total Prompts Generated
- Total Mannequin Selections
- Total Orders

**Engagement Metrics:**
- Average prompts per user
- Average orders per user
- Total activities

**User Preferences:**
- Gender distribution (Male vs Female)
- Size distribution (Small/Medium/Large)
- Visual charts

**Top 10 Most Used Prompts:**
- Prompt text
- Usage count
- Trending designs

---

## 🔄 Data Flow:

### When User Generates Prompt:
```
User enters prompt → Clicks generate
    ↓
Frontend tracks:
  - PromptHistory (prompt text, usage count)
  - UserActivity (activity type: "prompt_generated")
    ↓
Saved to database
    ↓
Admin sees in analytics
```

### When User Selects Mannequin:
```
User selects gender & size → Clicks next
    ↓
Frontend tracks:
  - MannequinSelection (gender, size, measurements)
  - UserActivity (activity type: "mannequin_selected")
    ↓
Saved to database
    ↓
Admin sees in analytics
```

---

## 🚀 How to Use:

### Step 1: Restart Backend

Stop and restart in Visual Studio:
1. Click Stop (⏹️)
2. Click Play (▶️)
3. New tables auto-created in database

### Step 2: Use the App

1. Sign in
2. Generate prompts
3. Select mannequins
4. Submit orders

### Step 3: View Analytics

1. Sign in as admin (`jeeu7786@gmail.com`)
2. Go to `/admin`
3. Click "Analytics" button
4. See all insights!

---

## 📋 What Gets Tracked:

### Prompt Generation:
- Prompt text
- Generated image URL
- Usage count (increments if same prompt used again)
- Timestamp
- Favorite status

### Mannequin Selection:
- Gender (male/female)
- Size (small/medium/large)
- Custom measurements (if body scan used)
- Associated prompt
- Texture applied
- Is custom mannequin
- Timestamp

### User Activities:
- Activity type
- Related prompt
- Mannequin details
- Texture info
- Generated images
- Measurements
- Timestamp

---

## 📊 Example Analytics Data:

### Admin Analytics Overview:
```json
{
  "totalUsers": 25,
  "totalPrompts": 150,
  "totalMannequinSelections": 120,
  "totalOrders": 45,
  "averagePromptsPerUser": 6.0,
  "averageOrdersPerUser": 1.8,
  "topPrompts": [
    { "prompt": "Elegant black dress", "usageCount": 15 },
    { "prompt": "Modern streetwear", "usageCount": 12 }
  ],
  "genderDistribution": [
    { "gender": "female", "count": 75 },
    { "gender": "male", "count": 45 }
  ],
  "sizeDistribution": [
    { "size": "medium", "count": 60 },
    { "size": "large", "count": 35 },
    { "size": "small", "count": 25 }
  ]
}
```

---

## 🎯 Business Insights You Get:

### User Behavior:
- ✅ Most popular design prompts
- ✅ Gender preferences (male vs female designs)
- ✅ Size preferences (what sizes sell most)
- ✅ Custom vs standard mannequin usage
- ✅ Prompt reuse patterns
- ✅ User engagement levels

### Platform Performance:
- ✅ Conversion rate (prompts → orders)
- ✅ User retention (activity over time)
- ✅ Feature usage (which features are popular)
- ✅ User journey tracking

### Marketing Insights:
- ✅ Trending designs
- ✅ Popular sizes (for inventory)
- ✅ Gender targeting
- ✅ User preferences

---

## 🔧 API Endpoints:

### Analytics:
- `GET /api/analytics/admin/overview` - Platform analytics
- `GET /api/analytics/user/{userId}` - Individual user analytics

### User Activity:
- `POST /api/useractivity` - Track activity
- `GET /api/useractivity/user/{userId}` - Get user activities
- `GET /api/useractivity/recent/{userId}?limit=10` - Recent activities

### Prompt History:
- `POST /api/prompthistory` - Track prompt
- `GET /api/prompthistory/user/{userId}` - Get user prompts
- `GET /api/prompthistory/recent/{userId}?limit=10` - Recent prompts
- `PUT /api/prompthistory/{id}/favorite` - Mark as favorite

### Mannequin:
- `POST /api/mannequin` - Track selection
- `GET /api/mannequin/user/{userId}` - Get user selections
- `GET /api/mannequin/stats/{userId}` - User mannequin stats

---

## 🧪 Testing:

### Test Prompt Tracking:
1. Go to dashboard
2. Enter prompt: "Red jacket"
3. Click generate
4. Check console: "Prompt tracked"
5. Go to `/admin/analytics`
6. See prompt in "Top Prompts"

### Test Mannequin Tracking:
1. Go to model page
2. Select: Female, Medium
3. Click next
4. Check console: "Mannequin selection tracked"
5. Go to `/admin/analytics`
6. See in gender/size distribution

### Test Analytics:
1. Use app multiple times
2. Generate different prompts
3. Select different mannequins
4. Go to `/admin/analytics`
5. See complete insights!

---

## 📈 Database Tables:

### UserActivity:
```
Id | UserId | ActivityType | Prompt | MannequinGender | MannequinSize | CreatedAt
1  | abc123 | prompt_generated | "Blue dress" | null | null | 2025-01-07
2  | abc123 | mannequin_selected | null | "female" | "medium" | 2025-01-07
```

### PromptHistory:
```
Id | UserId | Prompt | UsageCount | IsFavorite | CreatedAt | LastUsedAt
1  | abc123 | "Blue dress" | 3 | true | 2025-01-07 | 2025-01-07
2  | def456 | "Red jacket" | 1 | false | 2025-01-07 | 2025-01-07
```

### MannequinSelection:
```
Id | UserId | Gender | Size | IsCustomMannequin | AssociatedPrompt | CreatedAt
1  | abc123 | "female" | "medium" | false | "Blue dress" | 2025-01-07
2  | def456 | "male" | "large" | true | "Red jacket" | 2025-01-07
```

### UserPreferences:
```
Id | UserId | DefaultGender | DefaultSize | TotalPromptsGenerated | TotalOrdersPlaced
1  | abc123 | "female" | "medium" | 15 | 3
2  | def456 | "male" | "large" | 8 | 1
```

---

## ✅ Summary:

**New Features:**
- ✅ 4 new database tables
- ✅ Analytics dashboard page
- ✅ Automatic activity tracking
- ✅ Prompt history with usage counts
- ✅ Mannequin selection tracking
- ✅ User preference insights
- ✅ Platform-wide analytics

**Admin Can See:**
- ✅ All user prompts
- ✅ Most popular prompts
- ✅ Mannequin preferences (gender, size)
- ✅ User engagement metrics
- ✅ Conversion rates
- ✅ Trending designs

**Automatic Tracking:**
- ✅ Every prompt generated
- ✅ Every mannequin selected
- ✅ All user activities
- ✅ No manual work needed!

---

## 🎉 Ready to Use!

1. Restart backend (creates new tables)
2. Use the app normally
3. Go to `/admin/analytics`
4. See all insights!

**Complete analytics system implemented!** 🚀

