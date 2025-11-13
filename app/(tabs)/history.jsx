import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "./../../config/firebaseConfig"; // adjust the path

const History = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchBookings = async () => {
    if (userEmail) {
      try {
        const bookingCollection = collection(db, "bookings");
        const bookingQuery = query(
          bookingCollection,
          where("email", "==", userEmail)
        );
        const bookingSnapshot = await getDocs(bookingQuery);
        const bookingList = bookingSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBookings(bookingList);
        // console.log(bookingList);
      } catch (error) {
        Alert.alert("Could not fetch bookings");
        console.log(error);
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [userEmail]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-[#2b2b2b]">
        <Text>Loading ......</Text>
      </SafeAreaView>
    );
  }
  // console.log(bookings);

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      {userEmail ? (
        // <Text>Data is here</Text>
        <FlatList
          onRefresh={fetchBookings}
          data={bookings}
          refreshing={loading}
          keyExtractor={(item) => item?.id}
          renderItem={({ item }) => (
            <View className="p-4 border-b border-[#fb9b33]" key={item?.id}>
              <Text className="text-white">Date:{item?.date}</Text>
              <Text className="text-white">Slots:{item?.slot}</Text>
              <Text className="text-white">Guest:{item?.guests}</Text>
              <Text className="text-white">Restauranr:{item?.restaurant}</Text>
              <Text className="text-white">Email:{item?.email}</Text>
            </View>
          )}
          contentContainerStyle={{}}
        />
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text className="text-center mb-4">
            Please sign in to view your booking history
          </Text>
          <TouchableOpacity
            className="bg-[#f49b33] p-2 rounded-lg mt-5"
            onPress={() => router.puch("/signin")}
          >
            <Text className="text-black font-bold text-center text-lg">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default History;
