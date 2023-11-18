import { StyleSheet } from 'react-native';
import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CustomHeader } from './src/components/index'
import {
  LoginScreen,
  SignupScreen,
  HomeScreen,
  DetailProductByIDCate,
  DetailProductByID,
  BottomNav,
  AccountScreen,
  CartScreen,
  ChatScreen,
  Filter,
  LocationScreen,
  ManageProduct,
  ListProductByIDCate
} from './src/screens/index'

import { EditProduct } from './src/components/form';
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
            <Stack.Screen name='DetailProductByIDCate' component={DetailProductByIDCate} options={{ headerShown: true, headerBackVisible: false }} />
            <Stack.Screen name='DetailProductByID' component={DetailProductByID} options={{ headerShown: false }} />
            <Stack.Screen name='BottomNav' component={BottomNav} options={{ headerShown: false }} />
            {/* <Stack.Screen name='BottomNav' component={BottomNav} options={{ header: () => <CustomHeader show={true} /> }} /> */}
            <Stack.Screen name='Account' component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Cart' component={CartScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Chat' component={ChatScreen} options={{ headerShown: false }} />
            <Stack.Screen name='ManageProduct' component={ManageProduct} options={{ headerShown: false }} />
            <Stack.Screen name='EditProduct' component={EditProduct} options={{ headerShown: false }} />
            <Stack.Screen name='ListProductByIDCate' component={ListProductByIDCate} options={{ headerShown: false }} />
            <Stack.Screen name='Location' component={LocationScreen} options={{ headerShown: true, headerTitle: 'Select location', headerTitleAlign: 'center' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen name='Filter' component={Filter} options={{ headerShown: false, presentation: 'modal' }} />
            </Stack.Group>
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