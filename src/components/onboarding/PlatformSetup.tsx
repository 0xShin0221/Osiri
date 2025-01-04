import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MessageCircle, MessageSquare, Mail } from 'lucide-react'
import { useOnboardingStore } from '../../stores/onboardingStore'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export default function PlatformSetup() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [searchParams] = useSearchParams()
  const organizationId = searchParams.get('organization_id')
  const { 
    platform, 
    workspaceConnection,
    setPlatform,
    setWorkspaceConnection,
    createOrganization,
    setStep 
  } = useOnboardingStore()
  const { t } = useTranslation('onboarding')
  const { i18n } = useTranslation()
  const currentLang = i18n.resolvedLanguage;

  useEffect(() => {
    // Handle organization_id from OAuth callback
    const handleOAuthCallback = async () => {
      if (!organizationId) return
 
      try {
        // Create organization member
        await supabase.from('organization_members').insert({
          organization_id: organizationId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          role: 'owner'
        })
        // Redirect to dashboard after member creation
        window.location.href = '/dashboard'
      } catch (error) {
        console.error('Error creating organization member:', error)
      }
    }
 
    handleOAuthCallback()
  }, [organizationId])

  const handleSlackConnect = async () => {
    setPlatform('slack')
    setIsConnecting(true)

    const redirectUri = `${window.location.origin}/functions/v1/slack-callback?lang=${currentLang}`
    // Redirect to Slack OAuth
    window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${
      import.meta.env.VITE_SLACK_CLIENT_ID
    }&scope=chat:write,channels:read,channels:join&redirect_uri=${
      encodeURIComponent(redirectUri)
    }`
  }

  const handleDiscordConnect = async () => {
    setPlatform('discord')
    setIsConnecting(true)
    // Redirect to Discord OAuth
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${
      import.meta.env.VITE_DISCORD_CLIENT_ID
    }&permissions=2048&scope=bot&redirect_uri=${
      encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI)
    }`
  }

  const handleEmailSetup = () => {
    setPlatform('email')
  }

  const handleScheduleChange = (value: string) => {
    setWorkspaceConnection({
      ...workspaceConnection!,
      scheduleType: value as any
    })
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWorkspaceConnection({
      platform: 'email',
      email: e.target.value,
      scheduleType: workspaceConnection?.scheduleType || 'daily_morning'
    })
  }

  const handleComplete = async () => {
    try {
      await createOrganization()
      // Redirect to dashboard or success page
    } catch (error) {
      console.error('Error creating organization:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-8">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('platform.title')}</h2>
            <p className="text-muted-foreground">
              {t('platform.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={platform === 'slack' ? 'default' : 'outline'}
              className="h-auto py-6 flex flex-col items-center gap-2"
              onClick={handleSlackConnect}
              disabled={isConnecting}
            >
              <MessageSquare className="h-8 w-8" />
              <span className="font-medium">{t('platform.slack.title')}</span>
              <span className="text-sm text-muted-foreground">{t('platform.slack.description')}</span>
            </Button>

            <Button
              variant={platform === 'discord' ? 'default' : 'outline'}
              className="h-auto py-6 flex flex-col items-center gap-2"
              onClick={handleDiscordConnect}
              disabled={isConnecting}
            >
              <MessageCircle className="h-8 w-8" />
              <span className="font-medium">{t('platform.discord.title')}</span>
              <span className="text-sm text-muted-foreground">{t('platform.discord.description')}</span>
            </Button>

            <Button
              variant={platform === 'email' ? 'default' : 'outline'}
              className="h-auto py-6 flex flex-col items-center gap-2"
              onClick={handleEmailSetup}
              disabled={isConnecting}
            >
              <Mail className="h-8 w-8" />
              <span className="font-medium">{t('platform.email.title')}</span>
              <span className="text-sm text-muted-foreground">{t('platform.email.description')}</span>
            </Button>
          </div>

          {/* Email Setup */}
          {platform === 'email' && (
            <div className="space-y-4">
              <Input
                type="email"
                placeholder={t('platform.email.placeholder')}
                value={workspaceConnection?.email || ''}
                onChange={handleEmailChange}
              />
              
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('platform.email.frequency')}</label>
                <Select
                  value={workspaceConnection?.scheduleType || 'daily_morning'}
                  onValueChange={handleScheduleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('platform.email.frequency')} />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(t('platform.email.schedules', { returnObjects: true })).map(([key, label]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
            >
              {t('platform.back')}
            </Button>
            <Button
              onClick={handleComplete}
              disabled={!platform || (platform === 'email' && !workspaceConnection?.email)}
            >
              {t('platform.complete')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}