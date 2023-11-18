import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList, RefreshControl, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SelectList } from 'react-native-dropdown-select-list'
import uuid from 'react-native-uuid';
import { storage, database, auth } from '../../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, update } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import Loading from '../Loading';
import ImagePicker from 'react-native-image-crop-picker';
import { ICategoryInterface, IProductInterface } from '../../interfaces/index'


export default function EditProduct(props: any) {
    const navigation = useNavigation()

    const [selectedCate, setSelected] = useState("");
    const [categorySelected, setCategorySelected] = useState<ICategoryInterface>({
        pos: '',
        id: '',
        name: '',
        img: ''
    });

    const [dataCate, setDataCate] = useState<ICategoryInterface[]>([])
    const [productSelected, setProductSelected] = useState<IProductInterface>(props.route.params)
    const [refreshing, setRefreshing] = React.useState(false);
    const [progress, setProgress] = useState<number | any>(0)
    const [loading, isLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState({
        uri: ''
    });
    const [nameProduct, setNameProduct] = useState(productSelected.name || '')
    const [description, setDescription] = useState(productSelected.description || '')
    const [price, setPrice] = useState(productSelected.price.toString() || '')



    const getDataCategory = () => {
        const dbRef = databaseRef(database, 'categories');
        const dataFromFirebase: any[] | ((prevState: never[]) => never[]) = [];
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.id === productSelected.idCate) {
                    setCategorySelected(childData)
                }
                dataFromFirebase.push(
                    {
                        key: childData.id,
                        value: childData.name
                    }
                );
            });
            setDataCate(dataFromFirebase)
        }, {
            onlyOnce: false
        });
    }

    const fetchData = () => {
        getDataCategory()

    };
    useEffect(() => {
        fetchData()
    }, [])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    const showToast = (message: any) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };

    const customLogger = (message: string) => {
        console.log(message);
    }

    const handleClose = () => { navigation.goBack() }


    const updateProduct = async (updateData: IProductInterface) => {
        const dbRef = `products/${updateData.pos}`;
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
    }


    // handleEditProductySubmit(categorySelected, productSelected.pos, nameProduct, description, price, selectedImage)
    const handleEditProductySubmit = async (categorySelected: ICategoryInterface, posProduct: string, name: string, description: string, price: string, imageSelected: string) => {
        const updateData = {
            pos: posProduct,
            id: productSelected.id,
            idCate: categorySelected.id,
            idSeller: productSelected.idSeller,
            name: name,
            img: productSelected?.img || '',
            description: description,
            price: parseFloat(price),
            sale: productSelected.sale,
            sold: productSelected.sold,
            status: productSelected.status
        };
        if (imageSelected.length > 0) {
            updateData.img = imageSelected
            try {
                const response = await fetch(imageSelected);
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
                            updateProduct(updateData)
                        })
                    }
                )
            } catch (error) {
                showToast(`Error uploading image to Firebase Storage: ${error}`)
                console.error('Error uploading image to Firebase Storage', error);
            }
        }
        else {
            updateProduct(updateData)
        }
    }

    const handleSubmit = async () => {
        if (selectedCate.length <= 0) {
            showToast('Chưa chọn thể loại')
            return
        } else if (nameProduct.length <= 0) {
            showToast('Chưa nhập tên sản phẩm')
            return
        }
        else if (price.length <= 0) {
            showToast('Chưa nhập giá sản phẩm')
            return
        }
        else if (selectedImage.uri.length <= 0 && productSelected.img.length <= 0) {
            showToast('Chưa thêm ảnh sản phẩm')
            return
        }
        handleEditProductySubmit(categorySelected, productSelected.pos, nameProduct, description, price, selectedImage.uri)



        // console.log(categorySelecter.name);
        // console.log(nameProduct);
        // console.log(description);
        // console.log(price);
        // if (selectedImage.uri.length <= 0) {
        //     console.log(productSelected.img);
        // }
        // else {
        //     console.log(selectedImage.uri);
        // }
    }

    const handleImagePicker = () => {
        ImagePicker.openPicker({
            maxHeight: 512,
            maxWidth: 512,
            cropping: true,
        }).then(async (image) => {
            const selectedImage = { uri: image.path };
            setSelectedImage(selectedImage)
            // await uploadImageToFirebase(selectedImage, "png");
        }).catch(error => {
            if (error.message !== "User cancelled image selection") {
                customLogger(error.message);
            }
        });
    };

    if (dataCate.length <= 0) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Loading size='large' />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-100">
            <StatusBar barStyle="light-content" />

            <View className='flex-row items-center my-3'>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#2dd4c0" />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Inter-Bold' }}
                    className='text-black text-xl mx-4'>
                    Thông tin sản phẩm
                </Text>
            </View>

            <ScrollView
                className="space-y-1 pt-2 mx-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1">Thể loại</Text>
                <SelectList
                    fontFamily='Inter-Medium'
                    setSelected={(val: string) => setSelected(val)}
                    data={dataCate}
                    save="key"
                    placeholder='Chọn thể loại'
                    inputStyles={{ color: 'black' }}
                    dropdownTextStyles={{ color: 'black' }}
                    defaultOption={{ key: `${categorySelected.id}`, value: `${categorySelected.name}` }}
                />

                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2 ">Mã sản phẩm</Text>
                <TextInput
                    className="text-black p-3 rounded border-gray-300 border "
                    style={{ fontFamily: 'Inter-Medium' }}
                    value={productSelected.id}
                    editable={false}
                    focusable={false}
                />

                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2">Tên sản phẩm</Text>
                <TextInput
                    className="text-black p-3 rounded border-gray-300 border"
                    style={{ fontFamily: 'Inter-Medium' }}
                    value={nameProduct}
                    onChangeText={(text) => setNameProduct(text)}
                />

                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2">Mô tả</Text>
                <TextInput
                    className="text-black p-3 rounded border-gray-300 border"
                    style={{ fontFamily: 'Inter-Medium' }}
                    value={description}
                    // value={`${nameProduct} descriptions`}
                    onChangeText={(text) => setDescription(text)}
                />

                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-black py-1 mt-2">Giá bán</Text>
                <TextInput
                    className="text-black p-3 rounded border-gray-300 border mb-2"
                    style={{ fontFamily: 'Inter-Medium' }}
                    value={price}
                    inputMode='numeric'
                    onChangeText={(text) => setPrice(text)}
                />


                {selectedImage.uri.length > 0 ? (
                    <Image
                        className="w-36 h-36 my-3"
                        source={{ uri: `${selectedImage.uri}` }} />
                ) :
                    (
                        <Image
                            className="w-36 h-36 my-3"
                            source={{ uri: productSelected.img }} />
                    )
                }

                <TouchableOpacity
                    className=" bg-sky-400  py-2 px-2 rounded-lg mb-3 my-2 "
                    onPress={handleImagePicker}>
                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Select Image</Text>
                </TouchableOpacity>


                <View className="flex-row justify-around mt-3">
                    {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
                        <TouchableOpacity
                            className=" bg-sky-400 py-2 px-3 rounded-lg mb-3 "
                            onPress={handleSubmit}>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className="text-sm text-white text-center">Cập nhật</Text>
                        </TouchableOpacity>
                    </>}
                    <TouchableOpacity
                        className=" bg-gray-400 py-2 px-4 rounded-lg mb-3"
                        onPress={handleClose}>
                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Huỷ</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}