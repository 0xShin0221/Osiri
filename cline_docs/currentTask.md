# Current Task - Osiri News Reader

- handling i18n for "channel" file of the en and ja
- reduce the limit of the articles created process and content scraped

## Current Focus: Platform Integration and Content Delivery

### Phase 1: Platform Integration Management

#### Objectives

1. サブスクリプション状態の管理
バックエンド
   サブスクの状態での slack メッセージ
   トライアル終了前の通知（メール、アプリ内通知）
   アップグレードへの誘導
フロントエンド
   ダウングレードの処理
   支払い履歴の表示
   請求書のダウンロード
   解約処理と解約後のデータ保持ポリシー


アプリ連携Discord
実アカウントでの運用
ユーザーの招待機能

#### Implementation Tasks

1. Channel Management

   - Channel creation and editing
   - Platform-specific settings
   - Connection status monitoring
   - Error handling and recovery

2. Settings Interface

   - Channel configuration UI
   - Platform authentication flow
   - Settings validation
   - Error feedback system

3. Organization Management
   - Organization-level settings
   - Channel grouping
   - Permission management
   - Usage tracking foundation

### Phase 2: Content Delivery System

#### Objectives

1. Implement reliable content delivery to channels
2. Create delivery scheduling system
3. Develop delivery monitoring

#### Implementation Tasks

1. Delivery Pipeline

   - Message formatting
   - Platform-specific adapters
   - Retry mechanism
   - Rate limiting

2. Scheduling System

   - Delivery frequency control
   - Time zone management
   - Queue management
   - Priority handling

3. Monitoring System
   - Delivery status tracking
   - Performance monitoring
   - Error logging
   -
