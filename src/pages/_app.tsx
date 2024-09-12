import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import store, { persistor } from '../store';
import { PersistGate } from 'redux-persist/integration/react';
import '../../src/app/globals.css';

function CodeReviewRotationApp({ Component, pageProps }: { Component: React.ElementType, pageProps: any }) {
  const router = useRouter();


  return (
    <Provider store={store}>

      <>
        <PersistGate loading={null} persistor={persistor}>
          <div className="body-custom text-gray-900 bg-white min-h-screen">
            <Component {...pageProps} />
          </div>
        </PersistGate>
      </>

    </Provider>
  );
}

export default CodeReviewRotationApp;
