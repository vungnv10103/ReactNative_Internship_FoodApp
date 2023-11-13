import { View, Text, Image, SafeAreaView, TextInput, TouchableOpacity, Pressable, StatusBar, ActivityIndicator, ScrollView, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FIREBASE_AUTH} from '../../FirebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { getDatabase, ref, set } from "firebase/database";

export default function SignupMerchantScreen() {
    const navigation = useNavigation();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [restaurantName, setRestaurantName] = useState('')
    const [address, setAddress] = useState('')
    const [loading, isLoading] = useState(false)


    function writeUserData(userId, name, email, password, phone, restaurantName, address) {
        isLoading(true);
        const db = getDatabase();
        set(ref(db, 'merchants/' + userId), {
            username: name,
            email: email,
            phone,
            restaurantName,
            address
        });
        showToastWithGravityAndOffset()
        navigation.reset({
            index: 0,
            routes: [{ name: 'BottomNav' }],
        });
    }

    const showToastWithGravityAndOffset = () => {
        ToastAndroid.showWithGravityAndOffset(
            'Register Success',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        );
    };

    const sigup = async () => {
        isLoading(true);
        if (username.length == 0) {
            isLoading(false);
            alert("Vui lòng điền username")
        }
        else if (password.length == 0) {
            isLoading(false);
            alert("Vui lòng điền password")
        } else if (email.length == 0) {
            isLoading(false);
            alert("Vui lòng điền email")
        }
        else if (phone.length == 0) {
            isLoading(false);
            alert("Vui lòng điền Số điện thoại")
        }
        else if (restaurantName.length == 0) {
            isLoading(false);
            alert("Vui lòng điền tên nhà hàng")
        }
        else if (address.length == 0) {
            isLoading(false);
            alert("Vui lòng điền địa chỉ nhà hàng")
        }
        else {
            if (email.indexOf("gmail")) {
                const newEmail = email.replace("gmail", "merchant");
                try {
                    const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, newEmail, password);
                    if (response) {
                        console.log(response);
                        const user = response.user;
                        writeUserData(user.uid, username, user.email, password, phone, restaurantName, address)
                    }

                } catch (error) {
                    const errorCode = error.code;
                    switch (errorCode) {
                        case 'auth/email-already-in-use':
                            alert("Email đã được sử dụng \nVui lòng dùng email khác")
                            break;
                        case 'auth/weak-password':
                            alert("Mật khẩu tối thiểu 6 kí tự")
                            break;

                        default:
                            alert('login failed: ' + error.message)
                            break;
                    }
                    console.log(errorCode);
                } finally {
                    isLoading(false);
                }
            }
        }
    }


    return (
        <ScrollView className="bg-white flex-1">
            <StatusBar barStyle="light-content" />
            <View className="flex justify-around mt-6">

                {/* title */}
                <View className="flex items-center">
                    <Animated.Text
                        style={{ fontFamily: 'Inter-Bold' }}
                        entering={FadeInUp.duration(1000).springify()}
                        className="text-black tracking-wider text-3xl px-20">
                        Sign Up Merchant
                    </Animated.Text>
                </View>

                {/* form */}
                <View className="flex items-center mx-5 space-y-4 pt-8">
                    <Animated.View
                        entering={FadeInDown.duration(1000).springify()}
                        className="bg-black/5 p-1.5 rounded-xl w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'black' }}
                            value={username}
                            onChangeText={(text) => setUsername(text)}
                            placeholder="Username"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}
                        className="bg-black/5 p-1.5 rounded-xl w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'black' }}
                            value={password}
                            onChangeText={(text) => setPassword(text)}
                            placeholder="Password"
                            placeholderTextColor={'gray'}
                            secureTextEntry
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-1.5 rounded-xl w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'black' }}
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholder="Email"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-1.5 rounded-xl w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'black' }}
                            value={phone}
                            onChangeText={(text) => setPhone(text)}
                            placeholder="Phone number"
                            inputMode='numeric'
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-1.5 rounded-xl w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'black' }}
                            value={restaurantName}
                            onChangeText={(text) => setRestaurantName(text)}
                            placeholder="Restaurant name"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>
                    <Animated.View
                        entering={FadeInDown.delay(200).duration(1000).springify()}
                        className="bg-black/5 p-1.5 rounded-xl w-full">
                        <TextInput
                            style={{ fontFamily: 'Inter-Medium', color: 'black' }}
                            value={address}
                            onChangeText={(text) => setAddress(text)}
                            placeholder="Address"
                            placeholderTextColor={'gray'}
                        />
                    </Animated.View>

                    <Animated.View className="w-full" entering={FadeInDown.delay(600).duration(1000).springify()}>
                        {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
                            <TouchableOpacity
                                className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                                onPress={sigup}
                            >
                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl  text-white text-center">SignUp</Text>
                            </TouchableOpacity>
                        </>}
                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="flex-row justify-center p-1">

                        <Text style={{ color: 'black', fontFamily: 'Inter-Medium' }}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.push('Login')}>
                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sky-600">Login</Text>
                        </TouchableOpacity>

                    </Animated.View>

                    <Animated.View
                        entering={FadeInDown.delay(800).duration(1000).springify()}
                        className="flex-row justify-center p-1">
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={{ color: 'black', fontFamily: 'Inter-Medium' }}>Register a user account</Text>
                        </TouchableOpacity>

                    </Animated.View>
                </View>
            </View>
        </ScrollView>
    )
}