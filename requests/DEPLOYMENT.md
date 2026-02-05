# GYLR Deployment Strategy

Complete guide for deploying Get Your Life Right to the Apple App Store and Google Play Store.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Apple App Store Deployment](#apple-app-store-deployment)
4. [Google Play Store Deployment](#google-play-store-deployment)
5. [Post-Launch Tasks](#post-launch-tasks)

---

## Prerequisites

### Developer Accounts

| Platform | Cost | URL |
|----------|------|-----|
| Apple Developer Program | $99/year | https://developer.apple.com/programs/ |
| Google Play Developer | $25 one-time | https://play.google.com/console/ |

### Tools Required

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to your Expo account
eas login

# Initialize EAS in the project (if not done)
eas build:configure
```

### Assets Needed

- [ ] App Icon (1024x1024 PNG, no transparency for iOS)
- [ ] Splash Screen (see app.json for dimensions)
- [ ] Screenshots for each device size
- [ ] Feature Graphic (Google Play: 1024x500)
- [ ] Privacy Policy hosted at a public URL

---

## Pre-Deployment Checklist

### 1. Update App Configuration

**app.json**
```json
{
  "expo": {
    "version": "1.0.0",  // Increment for each release
    "ios": {
      "buildNumber": "1",  // Increment for each build
      "bundleIdentifier": "com.yourcompany.gylr"
    },
    "android": {
      "versionCode": 1,  // Increment for each build
      "package": "com.yourcompany.gylr"
    },
    "extra": {
      "eas": {
        "projectId": "your-actual-project-id"  // Get from Expo dashboard
      }
    }
  }
}
```

### 2. Environment Variables for Production

Create production environment variables in EAS:
```bash
eas secret:create --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID --value "your-prod-client-id"
eas secret:create --name EXPO_PUBLIC_ANTHROPIC_API_KEY --value "your-prod-api-key"
```

### 3. Test Production Build Locally

```bash
# Create a preview build to test
eas build --profile preview --platform all

# Install and test on real devices
```

### 4. Final Testing Checklist

- [ ] Google Sign-In works
- [ ] Calendar events load correctly
- [ ] Categories save and persist
- [ ] Pie chart displays correctly
- [ ] AI roasts generate successfully
- [ ] Settings work (sign out, clear data)
- [ ] Onboarding shows for new users
- [ ] No console errors in production
- [ ] App doesn't crash on various screen sizes

---

## Apple App Store Deployment

### Step 1: Apple Developer Setup

1. **Enroll in Apple Developer Program**
   - Go to https://developer.apple.com/programs/
   - Pay $99/year fee
   - Wait for approval (can take 24-48 hours)

2. **Create App ID**
   - Go to Certificates, Identifiers & Profiles
   - Create new Identifier > App IDs
   - Bundle ID: `com.yourcompany.gylr`
   - Enable capabilities: (none required for basic app)

3. **Create Provisioning Profile**
   - EAS handles this automatically with `eas credentials`

### Step 2: App Store Connect Setup

1. **Create New App**
   - Go to https://appstoreconnect.apple.com/
   - Click "+" > "New App"
   - Platform: iOS
   - Name: "Get Your Life Right"
   - Primary Language: English (US)
   - Bundle ID: Select your app ID
   - SKU: `gylr-ios-001`

2. **Fill App Information**

   **App Information Tab:**
   - Category: Productivity
   - Content Rights: Does not contain third-party content
   - Age Rating: Complete questionnaire (likely 4+)

   **Pricing and Availability:**
   - Price: Free
   - Availability: All countries (or select specific)

   **App Privacy:**
   - Privacy Policy URL: `https://yoursite.com/privacy`
   - Data Collection:
     - Contact Info (Email) - Used for app functionality
     - Identifiers (User ID) - Used for app functionality

### Step 3: Prepare App Store Listing

**Screenshots Required:**
| Device | Size | Quantity |
|--------|------|----------|
| iPhone 6.7" (14 Pro Max) | 1290 x 2796 | 3-10 |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688 | 3-10 |
| iPhone 5.5" (8 Plus) | 1242 x 2208 | 3-10 |

**App Store Metadata:**
```
Name: Get Your Life Right
Subtitle: AI-Powered Life Balance Roasts

Description:
Ever wonder where all your time goes? GYLR connects to your Google Calendar
and shows you exactly how you're spending your life — then judges you for it.

FEATURES:
• Sync with Google Calendar automatically
• Categorize events: Work, Play, Health, Romance, Study
• Beautiful pie chart showing your time allocation
• AI-generated comedic roasts about your life choices
• Choose your judge: Sarcastic Friend, Cruel Comedian, or Disappointed Parent
• Retro pixel art aesthetic

HOW IT WORKS:
1. Connect your Google Calendar
2. Categorize your events (we'll learn your preferences)
3. View your time breakdown by day, week, month, or year
4. Tap "Get Roasted" for AI-powered judgment

Built with love and sarcasm. Your data stays on your device.
Roasts powered by Claude AI.

Keywords: time tracking, calendar, productivity, humor, AI, life balance, schedule

What's New in This Version:
Initial release! Track your time and get roasted.

Support URL: https://yoursite.com/support
Marketing URL: https://yoursite.com
```

### Step 4: Build and Submit

```bash
# Build for production
eas build --profile production --platform ios

# Wait for build to complete (10-30 minutes)
# You'll receive a URL to download the IPA

# Submit to App Store
eas submit --platform ios

# Or submit manually:
# Download the IPA and upload via Transporter app
```

### Step 5: App Review

1. **Submit for Review**
   - In App Store Connect, add build to your app version
   - Fill in "App Review Information"
     - Sign-in required: Yes
     - Provide test Google account credentials
   - Submit for review

2. **Review Timeline**
   - First submission: 24-48 hours typically
   - Updates: Usually faster (sometimes same-day)

3. **Common Rejection Reasons & Fixes**
   - Missing privacy policy: Host at public URL
   - Incomplete metadata: Fill all required fields
   - Bugs/crashes: Test thoroughly before submitting
   - Login issues: Provide working test credentials

---

## Google Play Store Deployment

### Step 1: Google Play Console Setup

1. **Create Developer Account**
   - Go to https://play.google.com/console/
   - Pay $25 one-time fee
   - Complete identity verification

2. **Create New App**
   - Click "Create app"
   - App name: "Get Your Life Right"
   - Default language: English (US)
   - App or game: App
   - Free or paid: Free
   - Accept policies

### Step 2: Store Listing

**Main Store Listing:**
```
App name: Get Your Life Right
Short description (80 chars):
Track your time. Get roasted by AI. Fix your life (maybe).

Full description (4000 chars max):
[Same as App Store description]
```

**Graphics Required:**
| Asset | Size | Notes |
|-------|------|-------|
| App Icon | 512 x 512 | PNG, 32-bit |
| Feature Graphic | 1024 x 500 | Required |
| Phone Screenshots | 16:9 or 9:16 | 2-8 required |
| 7" Tablet Screenshots | Optional | |
| 10" Tablet Screenshots | Optional | |

### Step 3: App Content Setup

1. **Content Rating**
   - Complete IARC questionnaire
   - Expected rating: Everyone (E)

2. **Target Audience**
   - Select: 18 and over
   - (Avoids additional children's privacy requirements)

3. **News App?** No

4. **COVID-19 App?** No

5. **Data Safety**
   - Data collected:
     - Email address (Account management)
     - Calendar events (App functionality)
   - Data shared: None
   - Security practices: Data encrypted in transit

### Step 4: App Signing

**Option A: Let Google Manage Signing (Recommended)**
- First upload, Google creates and manages your signing key
- Simpler, more secure

**Option B: Upload Your Own Key**
```bash
# Generate upload key
keytool -genkey -v -keystore upload-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload

# Configure in eas.json credentials
```

### Step 5: Build and Submit

```bash
# Build AAB (Android App Bundle) for production
eas build --profile production --platform android

# Wait for build to complete

# Submit to Google Play
eas submit --platform android

# First time: You'll need to set up service account
# See: https://docs.expo.dev/submit/android/
```

**Manual Upload Alternative:**
1. Download the AAB file from EAS
2. Go to Play Console > Release > Production
3. Create new release
4. Upload AAB file
5. Add release notes
6. Review and roll out

### Step 6: Release Tracks

| Track | Purpose | Review Time |
|-------|---------|-------------|
| Internal testing | Team only (up to 100) | Instant |
| Closed testing | Invite-only testers | Instant |
| Open testing | Public beta | Few hours |
| Production | Public release | Few hours to days |

**Recommended Release Strategy:**
1. Internal testing first (verify build works)
2. Closed testing with beta users
3. Open testing (optional)
4. Production rollout (start with 20%, then 100%)

### Step 7: Review Process

- **First submission**: 3-7 days typically
- **Updates**: Usually 1-3 days
- **Staged rollout**: Can pause if issues found

---

## Post-Launch Tasks

### Monitoring

1. **Crash Reporting**
   - Set up Sentry or Bugsnag
   - Monitor for crashes in production

2. **Analytics**
   - Add analytics (Firebase, Mixpanel, etc.)
   - Track key events:
     - Sign-ins
     - Categories assigned
     - Roasts requested
     - Time period changes

3. **User Reviews**
   - Monitor App Store and Play Store reviews
   - Respond to feedback promptly
   - Fix reported issues quickly

### Update Strategy

1. **Version Numbering**
   ```
   Major.Minor.Patch
   1.0.0 - Initial release
   1.0.1 - Bug fixes
   1.1.0 - New features
   2.0.0 - Major changes
   ```

2. **Release Cadence**
   - Bug fixes: As needed
   - Features: Every 2-4 weeks
   - Major updates: Quarterly

3. **Update Process**
   ```bash
   # Update version in app.json
   # Build new version
   eas build --profile production --platform all

   # Submit updates
   eas submit --platform ios
   eas submit --platform android
   ```

### Marketing

1. **Launch Checklist**
   - [ ] Social media announcement
   - [ ] Product Hunt submission
   - [ ] Press release (optional)
   - [ ] Share with friends/family

2. **ASO (App Store Optimization)**
   - Monitor keyword rankings
   - A/B test screenshots
   - Update description based on user feedback

---

## Troubleshooting

### Common Issues

**Build Fails:**
```bash
# Clear cache and rebuild
eas build --clear-cache --profile production --platform ios
```

**Credentials Issues:**
```bash
# Reset credentials
eas credentials --platform ios
```

**Submission Rejected:**
- Read rejection reason carefully
- Fix the issue
- Resubmit with explanation in review notes

### Support Resources

- Expo Documentation: https://docs.expo.dev/
- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- Apple App Review Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Google Play Policies: https://play.google.com/about/developer-content-policy/

---

## Timeline Estimate

| Task | Duration |
|------|----------|
| Developer account setup | 1-3 days |
| Asset preparation | 1-2 days |
| Store listing creation | 1 day |
| Build and test | 1 day |
| Submit for review | 1 day |
| Apple review | 1-3 days |
| Google review | 1-7 days |
| **Total** | **1-2 weeks** |

---

## Quick Reference Commands

```bash
# Build for both platforms
eas build --profile production --platform all

# Submit to both stores
eas submit --platform ios
eas submit --platform android

# Check build status
eas build:list

# View credentials
eas credentials

# Update over-the-air (minor fixes only)
eas update --branch production
```

---

*Good luck with your launch!*
