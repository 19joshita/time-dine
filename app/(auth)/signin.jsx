import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Formik } from "formik";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native-web";
import emptyImage from "../../assets/images/Frame.png";
import logo from "../../assets/images/dinetimelogo.png";
import { validationSchema } from "../../utils/authSchema";
const SignIn = () => {
  const router = useRouter();
  const auth = getAuth();
  const db = getFirestore();
  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };
  const handleSignIn = async (values) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        console.log("useData", userDoc.data());
        // console.log("values?.email", values?.email);
        await AsyncStorage.setItem("userEmail", values?.email);
        await AsyncStorage.setItem("isGuest", "false");
        router.push("/home");
      } else {
        console.log("No such documents");
      }
    } catch (error) {
      // console.log("Error white signUp", e);
      if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Sign In Failed",
          "Password should be correct.Please try again",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Sign in Error",
          "This email address is already exists.Please use different email.",
          [{ text: "OK" }]
        );
      }
    }
  };
  return (
    <SafeAreaView className={`bg-[#2b2b2b]`}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="m-2 flex items-center justify-center">
          <Image source={logo} style={{ height: 100, width: 220 }} />
          <Text className="font-bold text-white text-center text-lg mb-10 text-center ">
            New User{" "}
          </Text>

          <View className="w-5/6">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSignIn}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
                <View className="w-full flex gap-4">
                  <View>
                    <Text className="font-bold text-lg text-[#f49b33]">
                      Email
                    </Text>
                    <TextInput
                      className="h-12 border border-white text-white rounded px-2 w-full"
                      keyboardType="email-address"
                      onChangeText={handleChange("email")}
                      value={values.email}
                      onBlur={handleBlur("email")}
                    />
                    {touched.email && errors.email && (
                      <Text className="text-red-500 text-sm my-2">
                        {errors?.email}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Text className="font-bold text-lg text-[#f49b33]">
                      Password
                    </Text>
                    <TextInput
                      className="h-12 border border-white text-white rounded px-2 w-full"
                      secureTextEntry
                      onChangeText={handleChange("password")}
                      value={values.password}
                      onBlur={handleBlur("password")}
                    />
                    {touched.password && errors.password && (
                      <Text className="text-red-500 text-sm my-2">
                        {errors?.password}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    className="bg-[#f49b33] p-2 rounded-lg mt-5"
                    onPress={handleSubmit}
                  >
                    <Text className="text-black font-bold text-center text-lg">
                      Sign In
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </Formik>
            <View className="flex flex-col gap-4 my-5">
              <TouchableOpacity
                className="flex flex-row items-center gap-1 justify-center"
                onPress={() => router.push("/signup")}
              >
                <Text className="text-white font-bold">Already a User ?</Text>
                <Text className="text-base font-bold text-[#f49b33] underline">
                  Sing Up{" "}
                </Text>
              </TouchableOpacity>
              <Text
                style={{ color: "white" }}
                className="font-bold text-center text-lg"
              >
                <View className="border-b-2 w-24 border-[#f49b33]" /> Or{" "}
                <View className="border-b-2 w-24 border-[#f49b33]" />
              </Text>
              <TouchableOpacity
                className="flex flex-row items-center gap-1 justify-center"
                onPress={handleGuest}
              >
                <Text className="text-white font-bold">Be a </Text>
                <Text className="text-base font-bold text-[#f49b33] underline">
                  Guest User{" "}
                </Text>
              </TouchableOpacity>
            </View>
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
};

export default SignIn;
