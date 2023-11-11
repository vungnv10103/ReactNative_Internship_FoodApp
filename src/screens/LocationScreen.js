import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { REACT_APP_GOOGLE_API_KEY } from '@env'
import MapView from 'react-native-maps';
import { useNavigation } from '@react-navigation/native'
import BottomSheetMap from '../components/BottomSheetMap';
import { MagnifyingGlassIcon, BellIcon } from "react-native-heroicons/outline"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon, { Icons } from '../components/Icons';
const GOOGLE_MAP_API = REACT_APP_GOOGLE_API_KEY

export default function LocationScreen() {
    const navigation = useNavigation();

    // console.log(GOOGLE_MAP_API);
    const [location, setLocation] = useState({
        latitude: 20.1695081,
        longitude: 106.2525582,
        // longitude: 105.77553463,
        // latitude: 21.06693654,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    })
    return (
        <View className='flex-1'>
            <GooglePlacesAutocomplete
                placeholder='Search'
                styles={{
                    container: {
                        flex: 0
                    },
                    textInput: {
                        backgroundColor: '#eeebf3',
                        paddingLeft: 35,
                        borderRadius: 10
                    },
                    textInputContainer: {
                        padding: 8,
                        backgroundColor: 'white'
                    }
                }}

                fetchDetails={true}
                onPress={(data, details) => {
                    const point = details?.geometry?.location;
                    if (!point) return;
                    setLocation({
                        ...location,
                        latitude: point.lat,
                        longitude: point.lng
                    })
                }}
                onFail={(error) => console.error(error)}
                query={{
                    key: GOOGLE_MAP_API, //  must enable Billing on the Google Cloud Project at https://console.cloud.google.com/project/_/billing/enable
                    language: 'en',
                }}
                renderLeftButton={() => {
                    <View style={{
                        position: 'absolute',
                        left: 15,
                        top: 18,
                        zIndex: 1,
                    }}>
                        <Icon type={Icons.Ionicons} name="search" color='black' size={10} />
                    </View>

                }}
            />
            <MapView className='flex-1' region={location} showsUserLocation={true} />

            <View className='absolute w-full bottom-10'>
                <TouchableOpacity
                    className=" bg-sky-400 p-2.5 rounded-xl mb-3 mx-8"
                    onPress={() => {
                        navigation.goBack()
                    }}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Confirm</Text>
                </TouchableOpacity>
            </View>
        </View>

    );
}