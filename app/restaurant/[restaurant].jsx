import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "../../config/firebaseConfig";

const Restaurant = () => {
  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const { restaurant } = useLocalSearchParams();
  const [restaurantData, setRestaurantsData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotData, setSlotData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNextImage = () => {
    const carouselLength = carouselData[0]?.images?.length;
    if (currentIndex < carouselLength - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
    if (currentIndex === carouselLength - 1) {
      const nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
    }
  };
  const handlePreviousImage = () => {
    const carouselLength = carouselData[0]?.images?.length;
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
    if (currentIndex == 0) {
      const prevIndex = carouselLength - 1;
      setCurrentIndex(prevIndex);
      flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
    }
  };
  const carouselItem = (item) => {
    return (
      <View
        style={{ width: windowWidth - 2 }}
        className="h-64 relative rounded-[25px]"
      >
        <View
          style={{
            position: "absolute",
            top: "40%",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 25,
            padding: 5,
            zIndex: 10,
            right: "6%",
          }}
        >
          <Ionicons
            onPress={handleNextImage}
            name="arrow-forward"
            size={24}
            color="white"
          />
        </View>
        <View
          style={{
            position: "absolute",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            left: "50%",
            transform: [{ translateX: -50 }],
            zIndex: 10,
            bottom: 15,
          }}
        >
          <View className="bg-white h-10 w-10 mx-1 rounded-full"></View>
        </View>
        <Image
          resizeMethod="cover"
          source={{ uri: item?.item }}
          style={{
            opacity: 0.5,
            backgroundColor: "black",
            marginRight: 20,
            borderRadius: 25,
            marginLeft: 5,
            height: "100%",
          }}
        />
        <View
          style={{
            position: "absolute",
            top: "40%",
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: 25,
            padding: 5,
            zIndex: 10,
            left: "6%",
          }}
        >
          <Ionicons
            onPress={handlePreviousImage}
            name="arrow-back"
            size={24}
            color="white"
          />
        </View>
      </View>
    );
  };
  const getRestaurantsData = async () => {
    try {
      const restantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurant)
      );
      const restaurantSnapshot = await getDocs(restantQuery);

      if (restaurantSnapshot.empty) {
        console.log("no matching restaurant found");
        return;
      }
      // ✅ Get restaurant document
      const restaurantDoc = restaurantSnapshot.docs[0];
      const restaurantData = restaurantDoc.data();
      setRestaurantsData(restaurantData);

      // ✅ Use restaurantDoc.ref now
      const carouselQuery = query(
        collection(db, "carousel"),
        where("res_id", "==", restaurantDoc.ref)
      );

      const carouselSnapshot = await getDocs(carouselQuery);
      const carouselImages = [];

      if (!carouselSnapshot.empty) {
        carouselSnapshot.forEach((carouselDoc) =>
          carouselImages.push(carouselDoc.data())
        );
      }
      setCarouselData(carouselImages);

      const slotsQuery = query(
        collection(db, "slots"),
        where("ref_id", "==", restaurantDoc.ref)
      );

      const slotsSnapshot = await getDocs(slotsQuery);
      const slots = [];

      if (!slotsSnapshot.empty) {
        slotsSnapshot.forEach((slot) => slots.push(slot.data()));
      }
      setSlotData(slots);
    } catch (e) {
      console.log("Error fetchingData", e);
    }
  };

  useEffect(() => {
    getRestaurantsData();
  }, []);
  //   console.log(restaurantData, carouselData, slotData);
  return (
    <SafeAreaView
      style={[
        { backgroundColor: "#2b2b2b" },
        Platform.OS === "android" && { paddingBottom: 55 },
        Platform.OS === "android" && { paddingBottom: 20 },
      ]}
    >
      <ScrollView className="h-full">
        <View className="flex-1 p-4 py-2">
          <Text className="text-[#f49b33] text-xl font-bold">{restaurant}</Text>
          <View className="border-b border-[#f49b33]" />
        </View>
        <View className="h-64 max-w-[98%] mx-2 rounded-[25px]">
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            horizontal
            scrollEnabled={false}
            style={{ borderRadius: 25 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Restaurant;
