import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import Animated, { useSharedValue, withSpring, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AddCategory, AddProduct } from '../components/form/index';
import uuid from 'react-native-uuid';
import { signOut } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'



export default function AccountScreen() {
    const navigation = useNavigation();
    const [selectedImage, setSelectedImage] = useState(null);
    const [progress, setProgress] = useState(0)
    const [isAddCategoryVisible, setAddCategoryVisible] = useState(false);
    const [isAddProductVisible, setAddProductVisible] = useState(false);


    const handleAddCategorySubmit = async (idCate, nameCate, imageSelected) => {
        try {
            const response = await fetch(imageSelected.uri);
            const blob = await response.blob()
            const fileName = `${uuid.v4()}.png`;
            const mStorageRef = storageRef(storage, "images/" + fileName)
            const uploadTask = uploadBytesResumable(mStorageRef, blob)
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress.toFixed())
            },
                (error) => {
                    // Handle error
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downLoadURL) => {
                        // save record
                        console.log("File at: " + downLoadURL);
                        setSelectedImage(downLoadURL);

                        const dbRef = 'categories';
                        const dataRef = databaseRef(database, dbRef);

                        // get key
                        const newDataRef = push(dataRef);
                        const dataID = newDataRef.key;
                        const newData = {
                            id: dataID,
                            name: nameCate,
                            img: downLoadURL,
                        };
                        try {
                            await runTransaction(dataRef, (currentData) => {
                                if (!currentData) {
                                    return [newData];
                                } else {
                                    currentData.push(newData);
                                    return currentData;
                                }
                            });
                            console.log('Thêm mới thành công!');
                        } catch (error) {
                            console.error('Thêm thất bại:', error);
                        }
                        setAddCategoryVisible(false)

                    })
                }
            )
        } catch (error) {
            console.error('Error uploading image to Firebase Storage', error);
        }
    }

    const handleAddProductSubmit = async (idCate, idProduct, nameProduct, desciption, price, imageSelected) => {
        try {
            const response = await fetch(imageSelected.uri);
            const blob = await response.blob()
            const fileName = `${uuid.v4()}.png`;
            const mStorageRef = storageRef(storage, "images/" + fileName)
            const uploadTask = uploadBytesResumable(mStorageRef, blob)
            uploadTask.on("state_changed", (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress.toFixed())
            },
                (error) => {
                    // Handle error
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downLoadURL) => {
                        // save record
                        console.log("File at: " + downLoadURL);
                        setSelectedImage(downLoadURL);

                        const dbRef = 'products';
                        const dataRef = databaseRef(database, dbRef);

                        // get key
                        const newDataRef = push(dataRef);
                        const dataID = newDataRef.key;
                        const newData = {
                            id: dataID,
                            idCate: idCate,
                            name: nameProduct,
                            desciption: desciption,
                            price: price,
                            img: downLoadURL,
                            sold: 0,
                            status: 0,
                            sale: 0
                        };
                        try {
                            await runTransaction(dataRef, (currentData) => {
                                if (!currentData) {
                                    return [newData];
                                } else {
                                    currentData.push(newData);
                                    return currentData;
                                }
                            });
                            console.log('Thêm mới thành công!');
                        } catch (error) {
                            console.error('Thêm thất bại:', error);
                        }
                        setAddProductVisible(false)

                    })
                }
            )
        } catch (error) {
            console.error('Error uploading image to Firebase Storage', error);
        }
    }

    const logout = () => {
        signOut(auth).then(() => {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }).catch((error) => {
            // An error happened.
        });
    }


    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />
            <View className="flex justify-around pt-20">
                <View className="flex items-center mx-5 space-y-4 pt-20">
                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                            onPress={() => { setAddCategoryVisible(true) }}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Thêm thể loại</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                            onPress={() => { setAddProductVisible(true) }}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Thêm sản phẩm</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.View
                        className="w-full"
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-2xl mb-3"
                            onPress={logout}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đăng xuất</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

            </View>

            <AddCategory
                visible={isAddCategoryVisible}
                onClose={() => setAddCategoryVisible(false)}
                onSubmit={handleAddCategorySubmit}
            />
            <AddProduct
                visible={isAddProductVisible}
                onClose={() => setAddProductVisible(false)}
                onSubmit={handleAddProductSubmit}
            />

        </View>
    )
}