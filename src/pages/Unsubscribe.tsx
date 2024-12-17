import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const Unsubscribe = () => {
  const { t } = useTranslation("unsubscribe");
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    const unsubscribe = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          setStatus('error');
          return;
        }

        const { error } = await supabase.functions.invoke('unsubscribe', {
          body: { token },
        });

        if (error) throw error;
        setStatus('success');
      } catch (error) {
        console.error('Unsubscribe error:', error);
        setStatus('error');
      }
    };

    unsubscribe();
  }, [searchParams]);

  return (
    <div className="container mx-auto py-12 px-4 text-center">
      {status === 'processing' && (
        <div className="animate-pulse">
          <p>{t("processing")}</p>
        </div>
      )}
      
      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold mb-4">
            {t("title")}
          </h1>
          <p className="mb-8">
            {t("message")}
          </p>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold mb-4 text-red-500">
            {t("errorTitle")}
          </h1>
          <p className="mb-8">
            {t("errorMessage")}
          </p>
        </>
      )}

      <a
        href="/"
        className="text-primary hover:text-primary/80"
      >
        {t("backToHome")}
      </a>
    </div>
  );
};