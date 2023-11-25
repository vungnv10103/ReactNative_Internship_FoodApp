import { View, Text, StatusBar, Image, TouchableOpacity, Dimensions, Alert, FlatList, ScrollView, StyleSheet } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { database, auth } from '../../config/FirebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { ref as databaseRef, onValue, update, remove } from "firebase/database";
import { useNavigation } from '@react-navigation/native'
import { IUserInterface, IOrderInterface } from '../../interfaces'
import { themeColors } from '../../theme';
import Loading from '../../components/Loading';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ChevronLeftIcon, ChevronRightIcon, ShoppingCartIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Statistics {
    datetime: string,
    price: number
}

import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";


const ID_ADMIN = 'SFdidBR95rWJxsTMLoHLXx8EBbk2'


export default function Statistics(props: any) {

    const navigation = useNavigation();

    const getDateTime = () => {
        let dateTime = new Date()
        let ngay = dateTime.getDate();
        let thang = dateTime.getMonth() + 1;
        let nam = dateTime.getFullYear();

        let gio = dateTime.getHours();
        let phut = dateTime.getMinutes();
        let giay = dateTime.getSeconds();
        let miliGiay = dateTime.getMilliseconds();
        let day = dateTime.getDay();
        const daysOfWeek = ['CN', 'Th2', 'Th3', 'Th4', 'Th5', 'Th6', 'Th7'];
        let date = `${daysOfWeek[day]}`

        return {
            day: ngay,
            month: thang,
            year: nam
        }
    }

    const [currentMonth, setCurrentMonth] = useState<number | any>();
    const [currentYear, setCurrentYear] = useState(getDateTime().year);
    const [currentUser, setUser] = useState<IUserInterface | null>();
    const [dataOrder, setDataOrder] = useState<IOrderInterface[]>([]);
    const [dataStatistics, setDataStatistics] = useState<Statistics[]>([]);

    const getUserData = async () => {
        return new Promise<any>((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user)
                }
            })
        })
    }

    const getDataOrder = (monthSelected: number) => {
        const dbRef = databaseRef(database, `orders/${ID_ADMIN}/`);
        onValue(dbRef, (snapshot) => {
            const mOrderData: any[] | ((prevState: never[]) => never[]) = [];
            const mDataStatistics: any[] | ((prevState: never[]) => never[]) = [];
            mDataStatistics.push({
                datetime: "Ngày",
                price: 0
            })
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(JSON.stringify(childData, null, 2));
                childData['pos'] = childKey
                childData['beforeScreen'] = "Statistics"
                // console.log(childData.datetime);
                let startIndex = childData.datetime.indexOf('/')
                let endIndex = childData.datetime.lastIndexOf('/')
                let month = parseInt(childData.datetime.slice(startIndex + 1, endIndex))
                let day = parseInt(childData.datetime.slice(2, startIndex))


                if (childData.status === 'success') {
                    if (month === monthSelected) {
                        mOrderData.push(childData);
                        mDataStatistics.push({
                            datetime: day,
                            price: childData.price / 1000
                        })
                    }
                }

            });
            // console.log(dataStatistics1to6);
            // console.log(JSON.stringify(mOrderData, null, 2));


            setDataOrder(mOrderData);
            setDataStatistics(mDataStatistics)
        }, {
            onlyOnce: false
        });
    }


    const handleOrderSelected = (item: IOrderInterface) => {
        if (currentUser?.uid === ID_ADMIN) {
            props.navigation.navigate('DetailOrder', { ...item })
        }
    }
    const handleChangeMonth = (type: string) => {
        if (type === 'plus') {
            if (currentMonth === 12) {
                setCurrentMonth(1)
                getDataOrder(1)
                setCurrentYear(currentYear + 1)
            }
            else {
                getDataOrder(currentMonth + 1)
                setCurrentMonth(currentMonth + 1)
            }
        }
        else if (type === 'minus') {
            if (currentMonth == 1) {
                setCurrentMonth(12)
                getDataOrder(12)
                setCurrentYear(currentYear - 1)
            }
            else {
                getDataOrder(currentMonth - 1)
                setCurrentMonth(currentMonth - 1)
            }
        }

    }

    const fetchData = async () => {
        const dataUser = await getUserData()
        let month = getDateTime().month;
        getDataOrder(month)
        setUser(dataUser)
        setCurrentMonth(month)
    };

    useEffect(() => {
        fetchData()
    }, []);


    function formatMoney(price: number) {
        if (price >= 1000) {
            return price.toLocaleString('vi-VN') + " đ";
        } else {
            return price.toString() + " đ";
        }
    }


    const renderItem = ({ item }: { item: IOrderInterface }) => (
        <TouchableOpacity onPress={() => handleOrderSelected(item)}>
            <View className='bg-white rounded-xl m-3 p-2 space-y-1.5'>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'># {item.id}</Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>Thời gian: <Text style={{ fontFamily: 'Inter-Medium' }}>{item.datetime}</Text></Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>Giá: <Text style={{ fontFamily: 'Inter-Medium' }}>{formatMoney(item.price)}</Text></Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>Trạng thái: <Text className='text-green-500'>Giao hàng thành công</Text></Text>
            </View>
        </TouchableOpacity>

    );

    const chartConfig = {
        backgroundColor: "#e6e6e6",
        backgroundGradientFrom: "#f2f2f2",
        backgroundGradientTo: "#fff",
        decimalPlaces: 2, // optional, defaults to 2dp
        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: {
            borderRadius: 16

        },
        propsForDots: {
            r: "5",
            strokeWidth: "2",
            stroke: "#fff",
            backgroundColor: '#FF0000'
        }
    }


    return (
        <View className="flex-1 bg-gray-200"
        // showsVerticalScrollIndicator={false}
        // contentContainerStyle={{ paddingBottom: 20 }}
        >
            <StatusBar barStyle="light-content" />

            {
                dataStatistics.length > 0 ? (<View>
                    <Animated.View className='flex-row justify-evenly items-center' entering={FadeIn.delay(100).duration(800)}>
                        <TouchableOpacity
                            onPress={() => handleChangeMonth('minus')}
                            className="p-2 rounded-full bg-gray-100">
                            <ChevronLeftIcon size={hp(3.5)} strokeWidth={3.5} color="#2dd4bf" />
                        </TouchableOpacity>
                        <Text onPress={() => console.log(currentMonth)
                        } style={{ fontFamily: 'Inter-Bold' }} className='m-5 text-black text-center text-2xl'>Tháng {currentMonth}</Text>
                        <TouchableOpacity
                            onPress={() => handleChangeMonth('plus')}
                            className="p-2 rounded-full  bg-gray-100">
                            <ChevronRightIcon size={hp(3.5)} strokeWidth={3.5} color="#2dd4bf" />
                        </TouchableOpacity>
                    </Animated.View>
                    <LineChart
                        data={{
                            labels: dataStatistics.map((item) => item.datetime),
                            datasets: [
                                {
                                    data: dataStatistics.map((item) => item.price),
                                    // color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
                                    // strokeWidth: 2 
                                }
                            ]
                        }}
                        width={Dimensions.get("window").width} // from react-native
                        height={220}
                        yAxisLabel="đ"
                        yAxisSuffix="k"
                        yAxisInterval={1}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.lineChart}
                    />


                </View>) : (<Loading size='large' style={{ marginTop: 20 }} />)
            }

            {dataOrder.length > 0 ?
                (
                    <View className='flex-1'>
                        <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-2xl text-center p-3'>Hoá đơn tháng {currentMonth}</Text>
                        <FlatList
                            data={dataOrder}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                ) :
                (<View className='flex-1 justify-center items-center'><Text className='text-black text-xl'>Không có dữ liệu</Text></View>)
            }

        </View>
    )
}

const styles = StyleSheet.create({
    lineChart: {
        margin: 10,
        borderRadius: 16
    }
})