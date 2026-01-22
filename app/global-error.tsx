"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect, useState } from "react";

const translations = {
  en: {
    connectionTitle: 'Connection Error',
    errorTitle: 'Something went wrong',
    connectionDesc: 'There was a problem connecting to the server. This might be a browser compatibility issue.',
    errorDesc: 'An unexpected error occurred. Please try again.',
    tryThese: 'Try one of these:',
    useBrowser: 'Use Chrome or Safari instead',
    clearCache: 'Clear your browser cache',
    checkInternet: 'Check your internet connection',
    updateBrowser: 'Update your browser to the latest version',
    tryAgain: 'Try Again',
  },
  es: {
    connectionTitle: 'Error de Conexión',
    errorTitle: 'Algo salió mal',
    connectionDesc: 'Hubo un problema al conectar con el servidor. Puede ser un problema de compatibilidad del navegador.',
    errorDesc: 'Ocurrió un error inesperado. Por favor intenta de nuevo.',
    tryThese: 'Intenta una de estas opciones:',
    useBrowser: 'Usa Chrome o Safari en su lugar',
    clearCache: 'Limpia la caché del navegador',
    checkInternet: 'Verifica tu conexión a internet',
    updateBrowser: 'Actualiza tu navegador a la última versión',
    tryAgain: 'Intentar de Nuevo',
  },
  pt: {
    connectionTitle: 'Erro de Conexão',
    errorTitle: 'Algo deu errado',
    connectionDesc: 'Houve um problema ao conectar com o servidor. Pode ser um problema de compatibilidade do navegador.',
    errorDesc: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
    tryThese: 'Tente uma destas opções:',
    useBrowser: 'Use Chrome ou Safari',
    clearCache: 'Limpe o cache do navegador',
    checkInternet: 'Verifique sua conexão com a internet',
    updateBrowser: 'Atualize seu navegador para a versão mais recente',
    tryAgain: 'Tentar Novamente',
  },
};

type Lang = keyof typeof translations;

function detectLanguage(): Lang {
  if (typeof navigator === 'undefined') return 'en';
  const lang = navigator.language?.split('-')[0] || 'en';
  return (lang in translations ? lang : 'en') as Lang;
}

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [lang, setLang] = useState<Lang>('en');

  useEffect(() => {
    Sentry.captureException(error);
    setLang(detectLanguage());
  }, [error]);

  const t = translations[lang];
  const isConnectionError = error.message?.toLowerCase().includes('tls') ||
    error.message?.toLowerCase().includes('network') ||
    error.message?.toLowerCase().includes('connection');

  return (
    <html lang={lang}>
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#0a0a0a', color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '400px' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{isConnectionError ? '🔌' : '😵'}</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            {isConnectionError ? t.connectionTitle : t.errorTitle}
          </h1>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {isConnectionError ? t.connectionDesc : t.errorDesc}
          </p>
          {isConnectionError && (
            <div style={{ backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              <p style={{ fontSize: '0.8rem', color: '#888', margin: '0 0 0.5rem 0' }}>{t.tryThese}</p>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#ccc' }}>
                <li style={{ marginBottom: '0.3rem' }}>{t.useBrowser}</li>
                <li style={{ marginBottom: '0.3rem' }}>{t.clearCache}</li>
                <li style={{ marginBottom: '0.3rem' }}>{t.checkInternet}</li>
                <li>{t.updateBrowser}</li>
              </ul>
            </div>
          )}
          <button onClick={reset} style={{ backgroundColor: '#7c3aed', color: '#fff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 500, cursor: 'pointer' }}>
            {t.tryAgain}
          </button>
        </div>
      </body>
    </html>
  );
}
