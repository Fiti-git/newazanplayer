import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './src/screens/HomeScreen';
import Pairing from './src/screens/Pairing'
import DeviceRegistration from './src/screens/DeviceRegistration';
import PermissionsScreen from './src/screens/PermissionsScreen';
import Configuration from './src/screens/Configuration.js'
import Mode from './src/screens/Mode.js'
import PushScreen from './src/screensPushScreen.js'

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="PermissionsScreen"
        screenOptions={{ headerShown: false }} // 👈 Hide headers globally
      >
        <Stack.Screen name="PermissionsScreen" component={PermissionsScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="Pairing" component={Pairing}/>
        <Stack.Screen name="DeviceRegistration" component={DeviceRegistration} />
        <Stack.Screen name='Configuration' component={Configuration}/>
        <Stack.Screen name="Mode" component={Mode}/>
        <Stack.Screen name= "PushScreen" component={PushScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
