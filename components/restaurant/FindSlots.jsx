import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from "formik";
import { useState } from "react";
import {
  Alert,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../config/firebaseConfig";
import { validationSchema } from "../../utils/guestFormSchema";

const FindSlots = ({
  slots,
  selectedSlot,
  setSelectedSlot,
  date,
  selectedNumber,
  restaurant,
}) => {
  const [slotsVisible, setSlotVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  // Toggle slot visibility
  const handlePress = () => {
    setSlotVisible(!slotsVisible);
  };

  // Select slot
  const handleSlotPress = (slot) => {
    if (selectedSlot === slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  // Handle booking click
  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");
    console.log("userEmail:", userEmail);
    console.log("guestStatus:", guestStatus);

    if (userEmail) {
      // Logged-in user → directly book
      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
        });
        Alert.alert("Success", "Booking Successfully Done.");
      } catch (e) {
        console.log("error", e);
        Alert.alert("Error", "Failed to book slot.");
      }
    } else if (guestStatus === "true") {
      // Guest → open modal form
      setFormVisible(true);
      setModalVisible(true);
    } else {
      // Neither guest nor logged in → ask user
      Alert.alert(
        "Login Required",
        "Please login or continue as guest to book a slot."
      );
    }
  };

  // Handle guest form submit
  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await addDoc(collection(db, "bookings"), {
        ...values,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant: restaurant,
        // isGuest: true,
      });
      Alert.alert("Success", "Table booked successfully as guest!");
      resetForm();
      setModalVisible(false);
      // setFormVisible(false);
    } catch (error) {
      console.log("error:", error);
      Alert.alert("Error", "Failed to submit guest booking.");
    }
  };
  const handleCloseModal = () => {
    setModalVisible(false);
  };
  return (
    <View className="flex-1">
      {/* FIND SLOTS / BOOK SLOT BUTTONS */}
      <View className={`flex ${selectedSlot !== null && "flex-row"}`}>
        <View className={`${selectedSlot !== null && "flex-1"}`}>
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-center text-lg font-bold bg-[#f49b33] p-2 my-2 mx-2 rounded-lg">
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>
        {selectedSlot !== null && (
          <View className="flex-1">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-center text-white text-lg font-bold bg-[#f49b33] p-2 my-2 mx-2 rounded-lg">
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* SLOT LIST */}
      {slotsVisible && (
        <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
          {slots?.map((slot, index) => (
            <TouchableOpacity
              key={index}
              className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${
                selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
              }`}
              onPress={() => handleSlotPress(slot)}
              disabled={
                selectedSlot == slot || selectedSlot == null ? false : true
              }
            >
              <Text className="text-white font-bold">{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View className="flex-1 bg-[#00000080] justify-end">
          <View className="bg-[#474747] mx-1 rounded-t-lg p-4 pb-6">
            {formVisible && (
              <Formik
                initialValues={{ fullName: "", phoneNumber: "" }}
                validationSchema={validationSchema}
                onSubmit={handleFormSubmit}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                }) => (
                  <View className="w-full gap-4">
                    <View>
                      <Ionicons
                        name="close-sharp"
                        size={30}
                        color={"#f49b33"}
                        onPress={handleCloseModal}
                      />
                    </View>
                    <Text className="text-center text-[#f49b33] font-bold text-lg mb-4">
                      Guest Booking Form
                    </Text>

                    <View>
                      <Text className="font-bold text-lg text-[#f49b33]">
                        Full Name
                      </Text>
                      <TextInput
                        className="h-12 border border-white text-white rounded px-2 w-full"
                        placeholder="Enter your name"
                        placeholderTextColor="#ccc"
                        onChangeText={handleChange("fullName")}
                        value={values.fullName}
                        onBlur={handleBlur("fullName")}
                      />
                      {touched.fullName && errors.fullName && (
                        <Text className="text-red-500 text-sm my-2">
                          {errors.fullName}
                        </Text>
                      )}
                    </View>

                    <View>
                      <Text className="font-bold text-lg text-[#f49b33]">
                        Phone Number
                      </Text>
                      <TextInput
                        className="h-12 border border-white text-white rounded px-2 w-full"
                        placeholder="Enter phone number"
                        placeholderTextColor="#ccc"
                        keyboardType="numeric"
                        onChangeText={handleChange("phoneNumber")}
                        value={values.phoneNumber}
                        onBlur={handleBlur("phoneNumber")}
                      />
                      {touched.phoneNumber && errors.phoneNumber && (
                        <Text className="text-red-500 text-sm my-2">
                          {errors.phoneNumber}
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      className="bg-[#f49b33] p-3 rounded-lg mt-5"
                      onPress={handleSubmit}
                    >
                      <Text className="text-black font-bold text-center text-lg">
                        Submit
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="p-2 mt-3"
                      onPress={() => setModalVisible(false)}
                    >
                      <Text className="text-center text-[#f49b33] text-lg font-semibold">
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;
