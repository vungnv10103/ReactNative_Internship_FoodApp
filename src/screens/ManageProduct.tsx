import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList, RefreshControl, ToastAndroid, Alert } from 'react-native'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { database, auth, storage } from '../config/FirebaseConfig';
import { ref as databaseRef, onValue, query, orderByChild, get, update, runTransaction, push, remove } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import uuid from 'react-native-uuid';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EditCategory, EditProduct } from '../components/form/index'
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import Loading from '../components/Loading';


interface Category {
    pos: string,
    id: string,
    name: string,
    img: string
}
interface MyImage {
    uri: string
}

export default function ManageProduct(props: any) {

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = React.useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [categorySelected, setCategorySelected] = useState<Category>({
        pos: '',
        id: '',
        name: '',
        img: ''
    });
    const [activeCategory, setActiveCategory] = useState<string>('');
    const [progress, setProgress] = useState<number | any>(0)

    const [isEditCategoryVisible, setEditCategoryVisible] = useState(false);
    const [isEditProductVisible, setEditProductVisible] = useState(false);


    const handleChangeCategory = (category: Category | React.SetStateAction<string>) => {
        // setActiveCategory(category.toString())
        props.navigation.navigate("ListProductByIDCate", category)
    }

    const getDataCategory = async () => {
        return new Promise<any[]>((resolve) => {
            const dbRef = databaseRef(database, 'categories');

            onValue(dbRef, (snapshot) => {
                const dataFromFirebase: any[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    // console.log(JSON.stringify(childData, null, 2));
                    const dataCate = {
                        pos: childKey,
                        id: childData.id,
                        name: childData.name,
                        img: childData.img
                    }
                    dataFromFirebase.push(dataCate);
                });
                resolve(dataFromFirebase)
                setCategories(dataFromFirebase)
            }, {
                onlyOnce: false
            });
        })
    }

    const fetchData = async () => {
        await getDataCategory();
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        fetchData()
    }, [])


    const showToast = (message: any) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };

    const onEditCate = async (category: Category) => {
        setCategorySelected(category)
        // showToast(category.name)
        setEditCategoryVisible(true)
    };

    const updateQuantityProOfCate = (idCate: string) => {
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

    const handleDeleteCategorySubmit = (pos: string) => {
        const dataRef = databaseRef(database, `categories/${pos}`);
        remove(dataRef)
            .then(() => {
                showToast('Xoá thành công')
                console.log('Data deleted successfully!');
            })
            .catch((error) => {
                showToast(`Xoá thất bại: ${error}`)
                console.error('Error deleting data:', error);
            });
    }

    const onDeleteCategory = (category: Category) => {
        return Alert.alert(
            "Bạn có chắc chắn muốn xoá?",
            "Thể loại sẽ mất nếu bạn xoá.",
            [
                {
                    text: "Xoá",
                    onPress: () => {
                        handleDeleteCategorySubmit(category.pos)
                    },
                },
                {
                    text: "Huỷ",
                },
            ]
        );
    }

    const updateCategory = async (updateData: Category) => {
        const dbRef = `categories/${updateData.pos}`;
        const dataRef = databaseRef(database, dbRef);
        try {
            update(dataRef, updateData).then(() => {
                showToast('Cập nhật thành công!')
                console.log('Cập nhật thành công!');
            })
                .catch((error) => {
                    console.error('Error updating data: ', error);
                });
        } catch (error) {
            showToast(`Cập nhật thất bại: ${error}`)
            console.error('Cập nhật thất bại:', error);
        }

        setEditCategoryVisible(false)
    }

    const handleEditCategorySubmit = async (posCate: string, idCate: string, nameCate: string, imageSelected: any) => {
        const updateData = {
            pos: posCate,
            id: idCate,
            name: nameCate,
            img: categorySelected?.img || ''
        };
        if (imageSelected != null) {
            updateData.img = imageSelected.uri
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
                            updateCategory(updateData)
                        })
                    }
                )
            } catch (error) {
                showToast(`Error uploading image to Firebase Storage: ${error}`)
                console.error('Error uploading image to Firebase Storage', error);
            }
        }
        else {
            updateCategory(updateData)
        }
    }

    const handleEditProductSubmit = async (idCate: string, idProduct: string, nameProduct: string, description: string, price: string, imageSelected: any) => {

    }

    if (categories.length <= 0) {

        return (
            <View className='flex-1 justify-center items-center'>
                <Loading size='large' />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <ScrollView
                className="space-y-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

                <View className='flex-row items-center'>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 rounded-full ml-5 bg-gray-100">
                        <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#2dd4c0" />
                    </TouchableOpacity>

                    <Text style={{ fontFamily: 'Inter-Bold' }}
                        className='text-black text-xl mx-4'>
                        Danh sách thể loại
                    </Text>
                </View>

                {
                    categories.length > 0 ? (
                        <Animated.View entering={FadeInDown.duration(500).springify()}>
                            <ScrollView
                                className=''
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: hp(1.5) }}
                            >
                                {
                                    categories.map((cate, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleChangeCategory(cate)}
                                            >
                                                <View className={"flex-row w-full rounded-lg p-[5px] bg-white items-center my-2"}>
                                                    <Image
                                                        source={{ uri: cate.img }}
                                                        style={{ width: hp(6.5), height: hp(6.5) }}
                                                    />
                                                    <Text className="text-black" style={{ fontSize: hp(2), fontFamily: 'Inter-Medium' }}>
                                                        {
                                                            cate.name.length > 12 ? cate.name.slice(0, 12) + "..." : cate.name
                                                        }
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => onEditCate(cate)}>
                                                        <Image className="h-8 w-8" source={require('./../assets/images/edit.png')} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => onDeleteCategory(cate)}>
                                                        <Image className="h-8 w-8" source={require('./../assets/images/delete.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </Animated.View>
                    ) :
                        (
                            <View>
                                <Text style={{ fontFamily: 'Inter-Medium', color: 'black' }}>No data category available</Text>
                            </View>
                        )
                }

                {/* <View>
                    <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View> */}


                <EditCategory
                    visible={isEditCategoryVisible}
                    onClose={() => setEditCategoryVisible(false)}
                    onSubmit={handleEditCategorySubmit}
                    initialData={categorySelected}

                />
                <EditProduct
                    visible={isEditProductVisible}
                    onClose={() => setEditProductVisible(false)}
                    onSubmit={handleEditProductSubmit}
                />
            </ScrollView>

        </View>
    )
}