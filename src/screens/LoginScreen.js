import { Text, View, StatusBar, SafeAreaView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Animated, { useSharedValue, withSpring, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { signInWithEmailAndPassword } from 'firebase/auth'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { onAuthStateChanged } from 'firebase/auth';
import { getAuth } from '../config/FirebaseConfig'
export default function LoginScreen() {
    const navigation = useNavigation();
    const auth = getAuth();
    const [currentUser, setUser] = useState(null);
    const [email, setemail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, isLoading] = useState(false)


    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // const data = JSON.stringify(user, null, 2)
                // console.log("current user: ", data);
                setUser(user)
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            }
        })
    }, []);

    const login = async () => {
        isLoading(true);
        if (email.length == 0) {
            isLoading(false);
            alert("Vui lòng điền email")
            return
        } else if (password.length == 0) {
            isLoading(false);
            alert("Vui lòng điền password")
            return
        }
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            let data = JSON.stringify(response, null, 2);
            const user = response.user;
            if (user) {

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
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

                default:
                    alert('login failed: ' + error.message)
                    break;
            }

        } finally {
            isLoading(false);
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
                        {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
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
                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sky-600">SignUp</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </View>
        </View>
    )
}