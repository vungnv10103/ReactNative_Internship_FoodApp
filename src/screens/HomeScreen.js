import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import ImagePicker from 'react-native-image-crop-picker';
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import uuid from 'react-native-uuid';
import { onAuthStateChanged } from 'firebase/auth';
import { BellIcon, MagnifyingGlassIcon, XCircleIcon } from "react-native-heroicons/outline"
import { Categories, Restaurants, Products, ProductsSale } from '../components/index';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { AddCategory, AddProduct } from '../components/form/index';



export default function HomeScreen() {

    //  ADD
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [progress, setProgress] = useState(0)
    const [isAddCategoryVisible, setAddCategoryVisible] = useState(false);
    const [isAddProductVisible, setAddProductVisible] = useState(false);
    // 

    const navigation = useNavigation();

    const [user, setUser] = useState('');
    const [avatar, setAvatar] = useState('');
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsSale, setProductsSale] = useState([]);
    const [productsPopular, setProductsPopular] = useState([]);

    const getUserData = async () => {
        try {
            onAuthStateChanged(auth, (user) => {
                setUser(user.displayName ? user.displayName : user.email)
                setAvatar(user.photoURL ? user.photoURL : 'https://picsum.photos/200/300')
            })
        } catch (error) {
            console.log("Error: " + error.message);
        }
    }

    const getDataCategory = () => {
        const dbRef = databaseRef(database, 'categories');

        onValue(dbRef, (snapshot) => {
            const dataFromFirebase = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                dataFromFirebase.push(childData);
            });
            setCategories(dataFromFirebase);
        }, {
            onlyOnce: false
        });
    }
    const getDataProduct = () => {
        const dbRef = databaseRef(database, 'products');

        onValue(dbRef, (snapshot) => {
            const dataProductFromFirebase = [];
            const dataProductSale = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if(childData.sale > 0){
                    dataProductSale.push(childData)
                }
                dataProductFromFirebase.push(childData);
            });
            setProducts(dataProductFromFirebase);
            setProductsSale(dataProductSale)
        }, {
            onlyOnce: false
        });
    }

    const getDataProductPopular = async () => {
        try {
            const dbRef = databaseRef(database, 'products/');
            const productsPopularQuery = query(dbRef, orderByChild('sold'))
            const snapshot = await get(productsPopularQuery);
            if (snapshot.exists()) {
                const products = [];
                snapshot.forEach((childSnapshot) => {
                    const productData = childSnapshot.val();
                    products.push(productData);
                });
                const reversed = products.reverse();
                setProductsPopular(reversed)
            } else {
                console.log('Không có dữ liệu sản phẩm phổ biến.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
        }
    }

    const handleChangeCategory = category => {
        setActiveCategory(category)
    }

    useEffect(() => {
        getUserData();
        getDataCategory()
        getDataProduct()
        getDataProductPopular()
    }, [])



    const customLogger = (message) => {
        console.log(message);
    }


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


    const handleVideoPicker = () => {
        ImagePicker.openPicker({
            mediaType: 'video', // Specify mediaType as 'video' to select videos
            width: 300,
            height: 400,
        })
            .then(async (media) => {
                const selectedMedia = {
                    uri: media.path,
                    type: media.mime, // You can store the MIME type if needed
                };
                await uploadImageToFirebase(selectedMedia, "mp4");
                // setSelectedMedia(selectedMedia);
            })
            .catch((error) => {
                // Handle the error
                console.log(error);
            });
    };

    const handleImagePicker = () => {
        ImagePicker.openPicker({

            width: 300,
            height: 400,
            cropping: true,
        }).then(async (image) => {
            const selectedImage = { uri: image.path, fileName: image.filename };
            await uploadImageToFirebase(selectedImage, "png");
        }).catch(error => {
            if (error.message !== "User cancelled image selection") {
                customLogger(error.message);
            }
        });
    };

    const uploadImageToFirebase = async (selectedImage, typeFile) => {
        try {
            const response = await fetch(selectedImage.uri);
            const blob = await response.blob()
            const fileName = `${uuid.v4()}.${typeFile}`;
            const dir = typeFile == "png" ? "images" : "videos"
            const mStorageRef = storageRef(storage, `${dir}/` + fileName)
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
                        if (typeFile == "png") {
                            setSelectedImage(downLoadURL);
                        }
                        else {
                            setSelectedMedia(downLoadURL)
                        }
                    })
                }
            )
        } catch (error) {
            console.error('Error uploading image to Firebase Storage', error);
        }
    }

    let searchClass = search.length > 0 ? " pr-[30px]" : ""
    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <ScrollView
                contentContainerStyle={{ paddingBottom: 50 }}
                className="space-y-6 pt-5"
            >
                {/* Avatar $ Bell icon */}
                <View className="mx-3 flex-row justify-between items-center mb-1">
                    <TouchableOpacity
                        onPress={() => {
                            setAddProductVisible(true)
                        }}>
                        <Image
                            style={{ height: hp(5), width: hp(5), borderWidth: 0.5, borderColor: 'gray', borderRadius: 50, resizeMode: 'contain' }}
                            source={
                                avatar ? { uri: avatar } : require('../assets/images/avatar.png')
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setAddCategoryVisible(true)
                        }}>
                        <BellIcon size={hp(4)} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* greetings and punchline */}
                <View className="mx-4 space-y-2 mb-2">
                    <Text style={{ fontSize: hp(1.7), fontFamily: 'Inter-Medium' }} className="text-neutral-600">
                        Hello, {user} !
                    </Text>
                    <View>
                        <Text style={{ fontSize: hp(3.3), fontFamily: 'Inter-Medium' }} className="font-semibold text-neutral-600">Bringing the culinary world to your <Text style={{ fontFamily: 'Inter-Medium' }} className="text-amber-400">doorstep</Text></Text>
                    </View>

                </View>


                {/* search bar */}
                <View style={{ flexDirection: 'row' }} className={"mx-2 flex-row items-center " + searchClass}>
                    <View className="mx-1 flex-row items-center rounded-full bg-black/5 p-[3px]">
                        <TextInput
                            placeholder='Search any food...'
                            value={search}
                            onChangeText={(text) => setSearch(text)}
                            placeholderTextColor={'gray'}
                            style={{ fontSize: hp(2), color: 'black', fontFamily: 'Inter-Medium' }}
                            className="flex-1 text-base mb-0.5 pl-4 tracking-wider"
                        />

                        <View className="bg-white rounded-full p-3">
                            <TouchableOpacity
                                onPress={() => {
                                    if (search.length > 0) {

                                    }
                                }}
                            >
                                <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
                            </TouchableOpacity>
                        </View>

                    </View>
                    {
                        search.length > 0 && <View className="bg-white rounded-full">
                            <TouchableOpacity
                                onPress={() => {
                                    setSearch('')
                                    // Handle
                                }}
                            >
                                <XCircleIcon size={hp(4)} strokeWidth={1.5} color="gray" />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {/* Categories */}
                <View>
                    {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
                </View>
                {/* Restaurants */}
                {/* <View>
                    <Restaurants />
                </View> */}
                {/* Products Sale */}
                <View>
                    <ProductsSale productsSale={productsSale} />
                </View>
                {/* Products */}
                <View>
                    <Products products={products} activeCategory={activeCategory} productsPopular={productsPopular} />
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
            </ScrollView>
        </View>
    )
}