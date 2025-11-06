import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from "../../assets/images/dinetimelogo.png";
import homebanner from "../../assets/images/homeBanner.png";
// import uploadData from "../../config/bulkupload";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "../../config/firebaseConfig";
const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();
  const temp = async () => {
    const value = await AsyncStorage.getItem("isGuest");
    const email = await AsyncStorage.getItem("userEmail");
    console.log(value, "value",email,"email");
  };
  // console.log(restaurants);
  // for uploading data in the firebase
  // useEffect(() => {
  //   uploadData();
  // }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/restaurant/${item?.name}`)}
      className="bg-[#5f5f5f] max-h-64 max-w-xs flex justify-center rounded-lg p-4 mx-4 shadow-md"
    >
      <Image
        source={{ uri: item?.image }}
        resizeMode="cover"
        className="h-28 w-100 mt-2 mb-1 rounded-lg"
      />
      <Text className="text-white text-lg font-bold mb-2">{item?.name}</Text>
      <Text className="text-white text-base mb-2">{item?.address}</Text>
      <Text className="text-white text-base mb-2">
        Open: {item?.opening} - Close:{item?.closing}
      </Text>
    </TouchableOpacity>
  );
  const getRestaurants = async () => {
    const q = query(collection(db, "restaurants"));
    const res = await getDocs(q);
    res.forEach((item) => {
      setRestaurants((prev) => [...prev, item.data()]);
    });
  };
  useEffect(() => {
    getRestaurants();
    temp();
  }, []);
  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS === "android" && { paddingBottom: 55 },
        Platform.OS === "android" && { paddingBottom: 20 },
      ]}
    >
      <View className="flex items-center">
        <View
          className="rounded-lg shadow-lg justify-between items-center flex flex-row p-4"
          style={{ backgroundColor: "#5f5f5f", width: 350 }}
        >
          <View className="flex flex-row gap-1">
            <Text
              className={`text-md h-10 font-bold text-white ${Platform.OS == "ios" ? "pt-[8px]" : "pt-1"}`}
            >
              Welcome To
            </Text>
            <Image
              resizeMode="cover"
              style={{ width: 100, height: 19 }}
              source={logo}
            />
          </View>
        </View>
      </View>
      <ScrollView stickyHeaderIndices={[0]}>
        <ImageBackground
          source={homebanner}
          resizeMode="cover"
          className="mb-4 mt-1 w-full h-52 items-center justify-center bg-[#2b2b2b]"
        >
          <BlurView
            intensity={Platform.OS === "android" ? 50 : 25}
            tint="dark"
            className="w-full p-4 shadow-lg"
          >
            <Text className="text-center text-3xl font-bold text-white">
              Amazing offer
            </Text>
          </BlurView>
        </ImageBackground>
        <View className="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-white mr-2 font-semibold">
            Special Discount %
          </Text>
        </View>
        {restaurants?.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating color={"#f49b33"} />
        )}
        <View className="p-4 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-3xl text-[#f49b33] mr-2 font-semibold">
            Our Restaurants
          </Text>
        </View>
        {restaurants?.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
          />
        ) : (
          <ActivityIndicator animating color={"#f49b33"} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
