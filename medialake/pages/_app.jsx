import { RevalidateProvider } from 'next-swr';
import { useEffect } from 'react';
import { SWRConfig } from 'swr';
import '@tabnews/ui/css';
import '../interface/styles/medialake.css';

import { ThemeProvider } from '@/TabNewsUI';
import { DefaultHead, UserProvider } from 'interface';

async function SWRFetcher(resource, init) {
  const response = await fetch(resource, init);

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const responseBody = await response.json();

  return { body: responseBody, headers: response.headers };
}

const fallbackData = { body: null, headers: {} };

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // React never focuses what it hydrates, and leaves the  attribute in the markup for the browser
    // to honor — which it skips on a reload that restored a focus of its own. Only nodes that came
    // from the server carry it, so this is the first load.
    if (document.activeElement === document.body) {
      document.querySelector('[autofocus]')?.focus({ preventScroll: true });
    }
  }, []);

  return (
    <ThemeProvider>
      <UserProvider>
        <DefaultHead />
        <SWRConfig value={{ fetcher: SWRFetcher, fallbackData }}>
          <RevalidateProvider swr={{ swrPath: '/api/v1/swr', ...pageProps.swr }}>
            <Component {...pageProps} />
          </RevalidateProvider>
        </SWRConfig>
      </UserProvider>
    </ThemeProvider>
  );
}

export default MyApp;
