import { View, Text, TouchableOpacity, StatusBar, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get, update, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import Animated, { useSharedValue, withSpring, FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { AddCategory, AddProduct } from '../components/form/index';
import uuid from 'react-native-uuid';
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from '@react-navigation/native'
import { IUserInterface } from '../interfaces/index'


export default function AccountScreen(props: any) {
    const navigation = useNavigation();

    const [currentUser, setUser] = useState<IUserInterface | null>();
    const [avatar, setAvatar] = useState('');
    const [email, setEmail] = useState<String | null>('');

    const [selectedImage, setSelectedImage] = useState(null);
    const [progress, setProgress] = useState<number | any>(0)
    const [isAddCategoryVisible, setAddCategoryVisible] = useState(false);
    const [isAddProductVisible, setAddProductVisible] = useState(false);


    const showToast = (message: any) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };

    const getUserData = async () => {
        return new Promise<any>((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user)
                }
            })
        })
    }

    const fetchData = async () => {
        const dataUser = await getUserData()
        setUser(dataUser)
    }

    useEffect(() => {
        fetchData()
    }, []);


    const handleAddCategorySubmit = async (idCate: string, nameCate: string, imageSelected: any) => {
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
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downLoadURL: any) => {
                        // save record
                        console.log("File at: " + downLoadURL);
                        setSelectedImage(downLoadURL);

                        const dbRef = 'categories';
                        const dataRef = databaseRef(database, dbRef);

                        // get key
                        const newDataRef = push(dataRef);
                        const dataID = newDataRef.key;
                        const newData = {
                            // pos: 2,
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
                            showToast('Thêm mới thành công!')
                            console.log('Thêm mới thành công!');
                        } catch (error) {
                            showToast(`Thêm mới thất bại: ${error}`)
                            console.error('Thêm thất bại:', error);
                        }
                        setAddCategoryVisible(false)
                    })
                }
            )
        } catch (error) {
            showToast(`Error uploading image to Firebase Storage: ${error}`)
            console.error('Error uploading image to Firebase Storage', error);
        }
    }

    function updateQuantityProOfCate(idCate: string) {
        const postData = {
            id: "-NiQa7ZBOp7Yl3Q4kHzN",
            img: "https://firebasestorage.googleapis.com/v0/b/internship-88b0a.appspot.com/o/images%2Fbd092625-8019-466f-9584-8f11f48b189a.png?alt=media&token=b785bd16-6191-4f63-8e80-e71e35efbc6b",
            name: "Cơm",
            count: 2
        };
        const updates: { [key: string]: number } = {};
        updates[`categories/${0}/count`] = 2;

        return update(databaseRef(database), updates);
    }

    const handleAddProductSubmit = async (idCate: string, idProduct: string, nameProduct: string, description: string, price: string, imageSelected: any) => {
        try {
            const response = await fetch(imageSelected.uri);
            const blob = await response.blob()
            const fileName = `${uuid.v4()}.png`;
            const mStorageRef = storageRef(storage, "images/" + fileName)
            const uploadTask = uploadBytesResumable(mStorageRef, blob)
            uploadTask.on("state_changed", (snapshot) => {
                const progress: any = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setProgress(progress.toFixed())
            },
                (error) => {
                    // Handle error
                    showToast(error.message)
                    console.log(error.code);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (downLoadURL: any) => {
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
                            idSeller: currentUser?.uid,
                            name: nameProduct,
                            description: description,
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
                            showToast('Thêm mới thành công!')
                            console.log('Thêm mới thành công!');
                            // update cate count
                            // updateQuantityProOfCate(idCate)

                        } catch (error) {
                            showToast(`Thêm mới thất bại: ${error}`)
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
            props.navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }).catch((error) => {
            showToast(error)
        });
    }

    // const isMerchant = currentUser?.email?.includes("merchant")
    const isAdmin = currentUser?.email.toLowerCase() === 'admin@foodapp.com'

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />
            <View className="mx-5 space-y-4 pt-20">
                <Text>{currentUser?.email}</Text>
                {isAdmin ? (
                    <View>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => { setAddCategoryVisible(true) }}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Thêm thể loại</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => { setAddProductVisible(true) }}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Thêm sản phẩm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => props.navigation.navigate("ManageProduct")}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Quản lí sản phẩm</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => props.navigation.navigate('ManageOrderAdmin')}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Quản lí đơn hàng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => props.navigation.navigate('Statistics')}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Thống kê doanh thu</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => props.navigation.navigate('ManageAccount')}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Quản lí tài khoản</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                            onPress={() => props.navigation.navigate('ManageOrderAdmin')}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Quản lí đơn hàng</Text>
                        </TouchableOpacity>
                    </View>
                )
                }

                <View></View>
                {/* Logout */}
                <TouchableOpacity
                    className="w-full bg-sky-400 p-3 rounded-xl mb-3 bottom-0"
                    onPress={logout}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đăng xuất</Text>
                </TouchableOpacity>

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
