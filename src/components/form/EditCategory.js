import { View, Text, Modal, TouchableOpacity, TextInput, StatusBar, Image, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import ImagePicker from 'react-native-image-crop-picker';
import uuid from 'react-native-uuid';
import { getDownloadURL, ref as storageRef, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { storage, database, auth } from '../config/FirebaseConfig';

export default function EditCategory({ visible, onClose, onSubmit, initialData }) {
    const [selectedImage, setSelectedImage] = useState(null);
    const [posCate, setPosCate] = useState(initialData?.pos || '')
    const [idCate, setIdCate] = useState(initialData?.id || '')
    const [nameCate, setNameCate] = useState(initialData?.name || '')
    const [img, setImage] = useState(initialData?.img || '')
    const [loading, isLoading] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (visible) {
            setIdCate(initialData.id || '');
            setNameCate(initialData.name || '');
            setImage(initialData.img || '');
            setPosCate(initialData.pos || '');
        }
    }, [visible, initialData]);


    const clearForm = () => {
        setNameCate("")
        setSelectedImage(null)
    }
    const handleClose = () => {
        clearForm()
        onClose();
    };


    const handleSubmit = async () => {
        if (nameCate.length == 0 || nameCate == null) {
            alert("Nhập tên thể loại")
            return;
        } else if (selectedImage == null && img.length <= 0) {
            alert("Vui lòng chọn ảnh")
            return;
        }
        onSubmit(posCate, idCate, nameCate, selectedImage);
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
                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black text-center text-2xl py-2">Sửa thông tin thể loại</Text>

                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1 hidden">Mã thể loại</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border hidden"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={idCate}
                        editable={false}
                        focusable={false}
                    />

                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-black py-1">Tên thể loại</Text>
                    <TextInput
                        className="text-black p-3 rounded border-gray-300 border"
                        style={{ fontFamily: 'Inter-Medium' }}
                        value={nameCate}
                        onChangeText={(text) => setNameCate(text)}
                    />

                    {/* Rest of the component */}
                    {/* {
                        img != null ? <Image
                            className="w-36 h-36 my-3"
                            source={{ uri: img }} /> :
                    } */}
                    {
                        img.length > 0 && selectedImage == null &&
                        <Image
                            className="w-36 h-36 my-3"
                            source={{ uri: img }} />

                    }
                    {
                        selectedImage != null &&
                        <Image
                            className="w-36 h-36 my-3"
                            source={{ uri: selectedImage.uri }} />
                    }

                    <Animated.View
                        entering={FadeInDown.delay(400).duration(1000).springify()}>
                        <TouchableOpacity
                            className=" bg-sky-400  py-2 px-2 rounded-lg mb-3 my-2"
                            onPress={handleImagePicker}>
                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm  text-white text-center">Select Image</Text>
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
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-sm  text-white text-center">Cập nhật</Text>
                                </TouchableOpacity>
                            </>}
                        </Animated.View>
                        <Animated.View
                            entering={FadeInDown.delay(400).duration(1000).springify()}>

                            <TouchableOpacity
                                className=" bg-gray-400 py-2 px-4 rounded-lg mb-3"
                                onPress={handleClose}>
                                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm  text-white text-center">Cancel</Text>
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
    input: {
        marginBottom: 12,
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