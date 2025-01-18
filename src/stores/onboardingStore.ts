import { create } from 'zustand'
import { supabase } from '@/lib/supabase'

interface OnboardingState {
  step: number
  organizationName: string
  selectedCategories: string[]
  selectedFeeds: string[]
  platform: 'slack' | 'discord' | 'email' | null
  workspaceConnection: {
    platform: 'slack' | 'discord' | 'email'
    workspaceId?: string
    channelId?: string
    email?: string
    scheduleType?: 'realtime' | 'daily_morning' | 'daily_evening' | 'weekday_morning' | 'weekday_evening' | 'weekly_monday' | 'weekly_sunday'
  } | null
}

interface OnboardingActions {
  setStep: (step: number) => void
  setOrganizationName: (name: string) => void
  setSelectedCategories: (categories: string[]) => void
  setSelectedFeeds: (feedsOrUpdater: string[] | ((prev: string[]) => string[])) => void;
  setPlatform: (platform: OnboardingState['platform']) => void
  setWorkspaceConnection: (connection: OnboardingState['workspaceConnection']) => void
  createOrganization: () => Promise<void>
  handleOAuthCallback: (params: URLSearchParams) => Promise<void>
}

export const useOnboardingStore = create<OnboardingState & OnboardingActions>((set, get) => ({
  // Initial state
  step: 1,
  organizationName: '',
  selectedCategories: [],
  selectedFeeds: [],
  platform: null,
  workspaceConnection: null,

  // Actions
  setStep: (step) => set({ step }),
  setOrganizationName: (name) => set({ organizationName: name }),
  setSelectedCategories: (categories) => set({ selectedCategories: categories }),
  setSelectedFeeds: (feedsOrUpdater) =>
    set((state) => ({
      selectedFeeds:
        typeof feedsOrUpdater === 'function'
          ? feedsOrUpdater(state.selectedFeeds)
          : feedsOrUpdater,
    })),
  setPlatform: (platform) => set({ platform }),
  setWorkspaceConnection: (connection) => set({ workspaceConnection: connection }),

  handleOAuthCallback: async (params: URLSearchParams) => {
    const { platform, setWorkspaceConnection } = get()
    
    if (platform === 'slack') {
      const code = params.get('code')
      if (!code) throw new Error('No code received from Slack')

      // Exchange code for token using Edge Function
      const response = await fetch('/api/slack/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()
      
      setWorkspaceConnection({
        platform: 'slack',
        workspaceId: data.team_id,
        channelId: data.incoming_webhook?.channel_id,
        scheduleType: 'realtime'
      })
    }

    if (platform === 'discord') {
      const code = params.get('code')
      if (!code) throw new Error('No code received from Discord')

      // Exchange code for token using Edge Function
      const response = await fetch('/api/discord/oauth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      })

      const data = await response.json()

      setWorkspaceConnection({
        platform: 'discord',
        workspaceId: data.guild_id,
        channelId: data.channel_id,
        scheduleType: 'realtime'
      })
    }
  },

  createOrganization: async () => {
    const {
      organizationName,
      selectedCategories,
      selectedFeeds,
      platform,
      workspaceConnection
    } = get()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No user found')

    // Start a transaction
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert([{ 
        name: organizationName || `${user.email}'s Organization`
      }])
      .select()
      .single()

    if (orgError || !org) throw orgError

    // Create organization member
    await supabase
      .from('organization_members')
      .insert([{
        organization_id: org.id,
        user_id: user.id,
        role: 'owner'
      }])

    // Create workspace connection if platform is selected
    if (platform && workspaceConnection) {
      const { data: connection, error: connError } = await supabase
        .from('workspace_connections')
        .insert([{
          organization_id: org.id,
          platform,
          workspace_id: workspaceConnection.workspaceId,
        }])
        .select()
        .single()

      if (connError || !connection) throw connError

      // Create notification schedule if not realtime
      let scheduleId: string | undefined
      if (workspaceConnection.scheduleType && workspaceConnection.scheduleType !== 'realtime') {
        const { data: schedule, error: scheduleError } = await supabase
          .from('notification_schedules')
          .insert([{
            name: `${workspaceConnection.scheduleType} Schedule`,
            schedule_type: workspaceConnection.scheduleType,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
          }])
          .select()
          .single()

        if (scheduleError || !schedule) throw scheduleError
        scheduleId = schedule.id
      }

      // Create notification channel
      await supabase
        .from('notification_channels')
        .insert([{
          organization_id: org.id,
          workspace_connection_id: connection.id,
          platform: workspaceConnection.platform,
          channel_identifier: workspaceConnection.channelId || workspaceConnection.email,
          schedule_id: scheduleId,
          feed_ids: selectedFeeds,
          category_ids: selectedCategories,
          is_active: true
        }])
    }
  }
}))