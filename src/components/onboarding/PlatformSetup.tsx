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
import { Separator } from "@/components/ui/separator"
import { useOnboardingStore } from '../../stores/onboardingStore'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { DiscordIcon, EmailIcon, SlackIcon } from '../PlatformIcons'

export default function PlatformSetup() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [showEmailSetup, setShowEmailSetup] = useState(false)
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
  const currentLang = i18n.resolvedLanguage
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data.user?.id || null);
    };
    getCurrentUser();
  }, []);
  
  // OAuth callback handling remains the same
  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (!organizationId||!userId) return
      try {
        await supabase.from('organization_members').insert({
          organization_id: organizationId,
          user_id: userId,
          role: 'owner'
        })
        window.location.href = '/dashboard'
      } catch (error) {
        console.error('Error creating organization member:', error)
      }
    }
    handleOAuthCallback()
  }, [organizationId])

  // Platform connection handlers remain the same
  const handleSlackConnect = async () => {
    setPlatform('slack')
    setIsConnecting(true)
    const redirectUri = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/slack-callback?lang=${currentLang}?userId=${userId}`
    window.location.href = `https://slack.com/oauth/v2/authorize?client_id=${
      import.meta.env.VITE_SLACK_CLIENT_ID
    }&scope=channels:join,channels:read,chat:write,channels:manage&user_scope=chat:write,channels:read&redirect_uri=${
      encodeURIComponent(redirectUri)
    }`
  }

  const handleDiscordConnect = async () => {
    setPlatform('discord')
    setIsConnecting(true)
    window.location.href = `https://discord.com/api/oauth2/authorize?client_id=${
      import.meta.env.VITE_DISCORD_CLIENT_ID
    }&permissions=2048&scope=bot&redirect_uri=${
      encodeURIComponent(import.meta.env.VITE_DISCORD_REDIRECT_URI)
    }`
  }

  const handleEmailSetup = () => {
    setPlatform('email')
    setShowEmailSetup(true)
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

          {/* Main platform options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={platform === 'slack' ? 'default' : 'outline'}
              className="h-auto py-8 flex flex-col items-center gap-3"
              onClick={handleSlackConnect}
              disabled={isConnecting}
            >
              <SlackIcon />
              <div className="text-center">
                <div className="font-medium text-lg">{t('platform.slack.title')}</div>
                <p className="text-sm text-muted-foreground mt-1">{t('platform.slack.description')}</p>
              </div>
            </Button>

            <Button
              variant={platform === 'discord' ? 'default' : 'outline'}
              className="h-auto py-8 flex flex-col items-center gap-3"
              onClick={handleDiscordConnect}
              disabled={isConnecting}
            >
              <DiscordIcon />
              <div className="text-center">
                <div className="font-medium text-lg">{t('platform.discord.title')}</div>
                <p className="text-sm text-muted-foreground mt-1">{t('platform.discord.description')}</p>
              </div>
            </Button>
          </div>

          {/* Email option */}
          <div className="pt-4">
            <Separator className="my-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <EmailIcon />
                <span className="text-sm text-muted-foreground">{t('platform.email.alternativeTitle')}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleEmailSetup}
                className="text-sm"
              >
                {showEmailSetup ? t('platform.email.cancel') : t('platform.email.setup')}
              </Button>
            </div>

            {/* Email setup form */}
            {showEmailSetup && (
              <div className="mt-4 space-y-4">
                <Input
                  type="email"
                  placeholder={t('platform.email.placeholder')}
                  value={workspaceConnection?.email || ''}
                  onChange={handleEmailChange}
                  className="max-w-md"
                />
                
                <div className="space-y-2 max-w-md">
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
          </div>

          {/* Navigation buttons */}
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