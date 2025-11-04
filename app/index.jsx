import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import emptyImage from "../assets/images/Frame.png";
import logo from "././../assets/images/dinetimelogo.png";
export default function Index() {
  const router = useRouter();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };
  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="flex m-2 justify-center items-center">
          <Image source={logo} style={{ width: 300, height: 300 }} />
          <View className="w-3/4">
            <TouchableOpacity
              className="p-2 my-2 rounded-lg bg-[#f49b33] "
              onPress={() => router.push("/signup")}
            >
              <Text className="text-xl font-bold text-center text-black">
                Sign UP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="p-2 my-2 rounded-lg bg-[#2b2b2b]  border border-[#f49b33]"
              onPress={() => router.push("/home")}
            >
              <Text className="text-xl font-bold text-center text-white">
                Guest User
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={{ color: "white" }}
              className="my-4 font-bold text-center text-lg"
            >
              <View className="border-b-2 w-24 border-[#f49b33]" /> Or{" "}
              <View className="border-b-2 w-24 border-[#f49b33]" />
            </Text>
            <TouchableOpacity
              className="flex flex-row items-center gap-1 justify-center"
              onPress={handleGuest}
            >
              <Text className="text-white font-bold">Already a User ?</Text>
              <Text className="text-base font-bold text-[#f49b33] underline">
                Sing In{" "}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-1">
          <Image
            source={emptyImage}
            resizeMode="contain"
            className="w-full h-full"
          />
        </View>
        <StatusBar barStyle={"light-content"} backgroundColor={"#2b2b2b"} />
      </ScrollView>
    </SafeAreaView>
  );
}
