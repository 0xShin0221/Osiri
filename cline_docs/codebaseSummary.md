# Codebase Summary - Osiri News Reader

## Project Structure

### Frontend (src/)

```
src/
├── components/
│   ├── ui/          # Base UI components
│   ├── auth/        # Authentication components
│   ├── channel/     # Integration components
│   ├── onboarding/  # Onboarding flow
│   └── rssFeed/     # Feed management
├── pages/           # Route pages
├── hooks/           # Custom React hooks
├── services/        # API services
├── stores/          # Zustand stores
└── types/           # TypeScript definitions
```

### Backend Services

```
heroku/
├── src/
│   ├── repositories/   # Data access
│   ├── services/       # Business logic
│   ├── routes/         # API endpoints
│   └── middleware/     # Request handling

supabase/
├── functions/          # Edge functions
│   ├── feed-collector/
│   ├── feed-processor/
│   └── emails/
└── migrations/         # Database changes
```

## Key Components

### Frontend Components

- AuthLayout: Authentication wrapper
- OnboardingLayout: User onboarding
- FeedList: RSS feed display
- ChannelSettings: Integration management

### Backend Services

- FeedCollector: RSS aggregation
- ContentProcessor: Article processing
- NotificationService: Alert delivery
- TranslationService: Content translation

## Data Flow

### Content Processing Flow

1. Feed Collection

   - Scheduled collection
   - Feed validation
   - Content extraction

2. Content Processing

   - Article parsing
   - AI summarization
   - Translation processing
   - Category assignment

3. Content Delivery
   - Feed updates
   - Notification dispatch
   - Channel delivery

### User Interaction Flow

1. Authentication

   - User login/signup
   - Session management
   - Profile handling

2. Customization

   - Feed selection
   - Category preferences
   - Integration setup

3. Content Access
   - Feed viewing
   - Article reading
   - Notification receipt

## External Dependencies

### API Services

- Supabase: Backend infrastructure
- OpenAI: Content processing
- Slack: Integration service

### Frontend Libraries

- Radix UI: Component library
- Tailwind: Styling
- i18next: Internationalization

## Recent Changes

- Added profile management
- Implemented notification logging
- Enhanced feed processing
- Added multilingual support

## Next Steps

- Complete feed processor
- Implement AI summarization
- Enhance error handling
- Add analytics tracking
