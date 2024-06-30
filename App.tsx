import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MyStack from '@/Routes/Stack';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from '@/Redux/store';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'react-native';

function App(): JSX.Element {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    // <NavigationContainer>
    //   <MyStack />
    // </NavigationContainer>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor={'white'} />
            <MyStack />
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;