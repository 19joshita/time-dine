import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { getAuth, signOut } from "firebase/auth";
const profile = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    const fetchUserEmail = async () => {
      const email = await AsyncStorage.getItem("userEmail");
      setUserEmail(email);
    };
    fetchUserEmail();
  }, []);
  const handleLogout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem("useEmail");
      setUserEmail(null);
      Alert.alert("Logged Out","You have been logout successfully");
      router.push("/signin");
    } catch (error) {
      console.log(error, "error");
    }
  };
  const handleSubmit = () => {
    router.push("/signup");
  };
  return (
    <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
      <Text className="text-xl text-[#f49b33] font-bold mb-4">
        User Profile
      </Text>
      {userEmail ? (
        <>
          <Text className="text-white text-lg mb-6">Email:{userEmail}</Text>
          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"
          >
            <Text className="text-lg font-bold text-bold">Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={handleSubmit}
            className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"
          >
            <Text className="text-lg font-bold text-bold">Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default profile;
