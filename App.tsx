import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, SignupScreen, HomeScreen, DetailProduct, BottomNav, AccountScreen, SearchScreen } from './src/screens/index'
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Signup' component={SignupScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name='DetailProduct' component={DetailProduct} options={{ headerShown: false }} />
        <Stack.Screen name='BottomNav' component={BottomNav} options={{ headerShown: false }} />
        <Stack.Screen name='Account' component={AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name='Search' component={SearchScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}