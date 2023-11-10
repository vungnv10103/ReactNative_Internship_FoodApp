import { Text, View, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image, ActivityIndicator, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Animated, { useSharedValue, withSpring, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/FirebaseConfig'
import Loading from '../components/Loading';


export default function LoginScreen() {
    const navigation = useNavigation();
    const [currentUser, setUser] = useState(null);
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, isLoading] = useState(false)


    const getUserData = async () => {
        try {
            onAuthStateChanged(auth, (user) => {
                if (user != null) {
                    setUser(user)
                    const jsonData = JSON.stringify(user, null, 2)
                    console.log(jsonData);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomNav' }],
                    });
                }
                else {
                    console.log("No login");
                }
            })
        } catch (error) {
            console.log("Error: " + error.message);
        }
    }

    // useEffect(() => {
    //     getUserData()
    // }, []);


    const showToast = () => {
        ToastAndroid.show('Login Success', ToastAndroid.SHORT);
    };

    const showToastWithGravity = () => {
        ToastAndroid.showWithGravity(
            'Login Success',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
        );
    };

    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
            'Login Success',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    };

    const login = async () => {
        isLoading(true);
        if (email.length == 0) {
            isLoading(false);
            alert("Vui lòng điền email")
        } else if (password.length == 0) {
            isLoading(false);
            alert("Vui lòng điền password")
        }
        else {
            try {
                const response = await signInWithEmailAndPassword(auth, email, password);
                let data = JSON.stringify(response, null, 2);
                const user = response.user;
                if (user != null) {
                    // showToast()
                    // showToastWithGravity()
                    showToastWithGravityAndOffset()
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'BottomNav' }],
                    });
                }
            } catch (error) {
                const errorCode = error.code;
                console.log(errorCode);
                switch (errorCode) {
                    case "auth/missing-password":
                        alert('Vui lòng điền mật khẩu')
                        break;
                    case "auth/invalid-email":
                        alert("Email không đúng định dạng")
                        break;
                    case "auth/network-request-failed":
                        alert("Vui lòng kết nối internet")
                        break;

                    default:
                        alert('login failed: ' + error.message)
                        break;
                }

            } finally {
                isLoading(false);
            }
        }
    }

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />
            <View className="flex justify-around pt-20">
                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        style={{ fontFamily: 'Inter-Bold' }}
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-black  tracking-wider text-5xl">
                        Login
                    </Animated.Text>

                </View>

                {/* form */}
                <View className="flex items-center mx-5 space-y-4 pt-20">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-black/5 p-2 rounded-2xl w-full">

                        <TextInput
                            style={{ fontFamily: 'Inter-Medium' }}
                            className="text-black"
                            value={email}
                            onChangeText={(text) => setemail(text)}
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-2 rounded-2xl w-full mb-3">

                        <TextInput
                            style={{ fontFamily: 'Inter-Medium' }}
                            className="text-black"
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                        />
                    </Animated.View>

                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        {loading ? <ActivityIndicator size="lagre" color='#38bdf8' /> : <>
                            <TouchableOpacity
                                className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                                onPress={login}>
                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Login</Text>
                            </TouchableOpacity>
                        </>}
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(600).duration(1000).springify()}
                        className="flex-row justify-center p-1">

                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black">Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.push('Signup')}
                        >
                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sky-600">Signup</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </View>
        </View>
    )
}