import React, { useEffect } from 'react';
import MainNavigator from './src/navigation/MainNavigator';
import { Provider } from 'react-redux';
import store from './src/store/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SpInAppUpdates, { IAUUpdateKind } from 'sp-react-native-in-app-updates';

function App() {

  useEffect(() => {
    const inAppUpdates = new SpInAppUpdates(false); // Set to true for debug logs
    const checkForUpdates = async () => {
      try {
        const result = await inAppUpdates.checkNeedsUpdate();
        if (result.shouldUpdate) {
          const updateOptions = {
            updateType: IAUUpdateKind.IMMEDIATE,
          };
          inAppUpdates.startUpdate(updateOptions);
        }
      } catch (e) {
        console.log('Error checking for updates:', e);
      }
    };
    checkForUpdates();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <MainNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
