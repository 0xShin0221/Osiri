# Tech Stack - Osiri News Reader

## Frontend Technologies

### Core Framework

- React 18
- Vite
- TypeScript
- React Router DOM

### Styling & UI

- Tailwind CSS
- Radix UI Components
- Lucide React Icons
- CSS Animations

### State Management

- Zustand
- React Context

### Internationalization

- i18next
- react-i18next
- Language detection

## Backend Infrastructure

### Core Services

- Supabase
  - Authentication
  - PostgreSQL Database
  - Edge Functions (Deno)
  - Real-time subscriptions

### Background Processing

- Heroku
  - Worker processes
  - Scheduled tasks
  - Heavy computation

### External Services

- OpenAI API
  - Content summarization
  - Translation assistance
- Slack API
  - Workspace integration
  - Channel management

## Development Tools

### Build & Development

- TypeScript
- Vite
- ESLint
- Prettier

### Testing

- Playwright
- Jest (Heroku services)
- Deno testing (Supabase functions)

### DevOps

- GitHub Actions
- Docker
- Supabase CLI
- Database migrations

## Monitoring & Analytics

### Application Monitoring

- Amplitude Analytics
- Error tracking
- Performance monitoring

### Infrastructure Monitoring

- Supabase metrics
- Heroku logs
- Custom monitoring

## Database Schema

### Core Tables

- profiles
- rss_feeds
- articles
- translations
- notification_logs
- article_categories

### Functions & Extensions

- Translation functions
- Cron extension
- Custom utilities

## Security & Authentication

### Authentication

- Supabase Auth
- JWT tokens
- Role-based access

### Security Measures

- CORS configuration
- Rate limiting
- Input validation
- SQL injection prevention
