import { View, Text, Modal, TouchableOpacity, TextInput, StatusBar, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage, database, auth } from '../../config/FirebaseConfig';
import { SelectList } from 'react-native-dropdown-select-list'
import { getDatabase, runTransaction, push, ref as databaseRef, onValue } from "firebase/database";


export default function EditProduct({ visible, onClose, onSubmit }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [idProduct, setIdProduct] = useState(uuid.v4())
    const [selectedCate, setSelected] = useState("");
    const [idCate, setIdCate] = useState("");
    const [nameProduct, setNameProduct] = useState("")
    const [description, setDescription] = useState("")
    const [price, setPrice] = useState("")
    const [loading, isLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [dataCate, setDataCate] = useState([])
    const [showData, setShowData] = useState(true);

    const getDataCategory = () => {
        const dbRef = databaseRef(database, 'categories');
        const dataFromFirebase = [];
        onValue(dbRef, (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                dataFromFirebase.push(
                    {
                        key: childData.id,
                        value: childData.name
                    }
                );
            });
            setDataCate(dataFromFirebase)

        }, {
            onlyOnce: true
        });
    }
    useEffect(() => {
        getDataCategory()
    }, [])

    const clearForm = () => {
        // setDataCate(null)
        setShowData(false);
        setSelected("")
        setNameProduct("")
        setDescription("")
        setPrice("")
        setSelectedImage(null)
    }
    const handleClose = () => {
        clearForm()
        onClose();
    };


    const handleSubmit = async () => {

        if (selectedCate == null || selectedCate.length == 0) {
            alert("Chưa chọn thể loại")
            return
        }

        else if (nameProduct.length == 0 || nameProduct == null) {
            alert("Nhập tên sản phẩm")
            return;
        }
        else if (price.length == 0 || price == null) {
            alert("Nhập giá sản phẩm")
            return;
        }
        else if (selectedImage == null) {
            alert("Vui lòng chọn ảnh")
            return;
        }
        // dataCate.map((cate) => {
        //     if (cate.value === selectedCate) {
        //         setIdCate(cate.key)
        //     }
        // })
        onSubmit(selectedCate, idProduct, nameProduct, description, price, selectedImage);
        clearForm()
    };


    const customLogger = (message) => {
        console.log(message);
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


    return (
        <Modal visible={visible} animationType="fade" transparent={true}>
            <View style={styles.container}>
                <View style={styles.dialog}>
                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black text-center text-xl py-2">Sửa thông tin sản phẩm</Text>
                    {/* { */}
                    {/* showData && dataCate.length > 0 ? ( */}
                    <View>
                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1 mt-2">Thể loại</Text>
                        <SelectList
                            fontFamily='Inter-Medium'
                            setSelected={(val) => setSelected(val)}
                            data={dataCate}
                            save="key"
                            label="Categories"
                            placeholder='Chọn thể loại'
                            inputStyles={{ color: 'black' }}
                            dropdownTextStyles={{ color: 'black' }}
                        />
                    </View>
                    {/* ) : ( */}
                    {/* <View>
                                <Text style={{ fontFamily: 'Inter-Medium', color: 'red' }}>Error fetch data categories</Text>
                            </View> */}
                    {/* ) */}
                    {/* } */}

                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1 mt-2 hidden">Mã sản phẩm</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border hidden"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={idProduct}
                        editable={false}
                        focusable={false}
                    />

                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1 mt-2">Tên sản phẩm</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={nameProduct}
                        onChangeText={(text) => setNameProduct(text)}
                    />

                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1 mt-2">Mô tả</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
                        style={{ fontFamily: 'Inter-Medium' }}
                        // value={description}
                        value={`${nameProduct} descriptions`}
                        onChangeText={(text) => setDescription(text)}
                    />

                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1 mt-2">Giá bán</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={price}
                        inputMode='numeric'
                        onChangeText={(text) => setPrice(text)}
                    />

                    {/* Rest of the component */}
                    {selectedImage && <Image
                        className="w-36 h-36 my-3"
                        source={{ uri: `${selectedImage.uri}` }} />}
                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity
                            className=" bg-sky-400  py-2 px-2 rounded-lg mb-3 my-2 "
                            onPress={handleImagePicker}>
                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Select Image</Text>
                        </TouchableOpacity>

                    </Animated.View>
                    {/* Rest of the component */}
                    <View className="flex-row justify-around mt-3">
                        <Animated.View
                            entering={FadeInDown.delay(400).duration(1000).springify()}>
                            {loading ? <ActivityIndicator size='large' color='#38bdf8' /> : <>
                                <TouchableOpacity
                                    className=" bg-sky-400  py-2 px-3 rounded-lg mb-3 "
                                    onPress={handleSubmit}>
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-sm text-white text-center">Cập nhật</Text>
                                </TouchableOpacity>
                            </>}
                        </Animated.View>
                        <Animated.View
                            entering={FadeInDown.delay(400).duration(1000).springify()}>

                            <TouchableOpacity
                                className=" bg-gray-400 py-2 px-4 rounded-lg mb-3"
                                onPress={handleClose}>
                                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-white text-center">Cancel</Text>
                            </TouchableOpacity>

                        </Animated.View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dialog: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        elevation: 4,
        width: '80%',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: '#007BFF',
        marginBottom: 12,
        width: '48%',
    },
    buttonCancel: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        backgroundColor: '#dbc6c6',
        marginBottom: 12,
        width: '48%',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});