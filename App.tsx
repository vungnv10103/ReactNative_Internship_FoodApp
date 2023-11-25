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
  ListProductByIDCate,
  PaymentScreen,
  ManageAccount,
  ManageOrderAdmin,
  WaitingOrderScreen,
  SuccessOrderScreen,
  CancelOrderScreen,
  DetailOrder,
  Statistics
} from './src/screens/index'

import { CartProvider } from './src/screens/CartProvider';
import { EditProduct } from './src/components/form';
const Stack = createNativeStackNavigator();
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import BottomSheet, { BottomSheetView, BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';


export default function App() {
  return (
    <CartProvider>
      <GestureHandlerRootView className='flex-1 bg-gray-200'>
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
              <Stack.Screen name='ManageAccount' component={ManageAccount} options={{ headerShown: false }} />
              <Stack.Screen name='ManageOrderAdmin' component={ManageOrderAdmin} options={{ headerShown: true, title: 'Quản lí đơn hàng' }} />
              <Stack.Screen name='WaitingOrder' component={WaitingOrderScreen} options={{ headerShown: false }} />
              <Stack.Screen name='SuccessOrder' component={SuccessOrderScreen} options={{ headerShown: false }} />
              <Stack.Screen name='CancelOrder' component={CancelOrderScreen} options={{ headerShown: false }} />
              <Stack.Screen name='DetailOrder' component={DetailOrder} options={{ headerShown: false }} />
              <Stack.Screen name='Statistics' component={Statistics} options={{ headerShown: true, title: 'Thống kê doanh thu' }} />
              <Stack.Screen name='Cart' component={CartScreen} options={{ headerShown: false }} />
              <Stack.Screen name='Payment' component={PaymentScreen} options={{ headerShown: false }} />
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
    </CartProvider>
  );
}
