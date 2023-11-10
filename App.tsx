import { StyleSheet } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomHeader } from './src/components/index'
import { LoginScreen, SignupScreen, HomeScreen, DetailProduct, BottomNav, AccountScreen, CartScreen, ChatScreen } from './src/screens/index'
const Stack = createNativeStackNavigator();
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';


export default function App() {
  return (
    <GestureHandlerRootView style={styles.safeArea}>
      <BottomSheetModalProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Login'>
            <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Signup' component={SignupScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name='DetailProduct' component={DetailProduct} options={{ headerShown: false }} />
            {/* <Stack.Screen name='BottomNav' component={BottomNav} options={{ headerShown: false }} /> */}
            <Stack.Screen name='BottomNav' component={BottomNav} options={{ header: () => <CustomHeader name={'hehe'} /> }} />
            <Stack.Screen name='Account' component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Cart' component={CartScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Chat' component={ChatScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer >
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E5E7EB',
  }
});