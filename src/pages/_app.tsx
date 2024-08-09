import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import store from '../../store';
import '../../src/app/globals.css';

function CodeReviewRotationApp({ Component, pageProps }: { Component: React.ElementType, pageProps: any }) {
  const router = useRouter();

  return (
    <Provider store={store}>
        <div className="body-custom text-gray-900 bg-white min-h-screen">
        <Component {...pageProps} />
      </div>
    </Provider>
  );
}

export default CodeReviewRotationApp;
