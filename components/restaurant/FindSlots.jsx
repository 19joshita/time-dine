import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { Formik } from "formik";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
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
  const handlePress = () => {
    setSlotVisible(!slotsVisible);
  };
  const handleSlotPress = (slot) => {
    let prevSlot = selectedSlot;
    if (prevSlot == slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };
  const handleBooking = async () => {
    const userEmail = await AsyncStorage.getItem("userEmail");
    const guestStatus = await AsyncStorage.getItem("isGuest");

    // console.log(userEmail, "userEmail");
    if (userEmail) {
      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
        });
        alert("Booking Successfully Done.");
      } catch (e) {
        console.log("error", e);
      }
    } else if (guestStatus === true) {
      setFormVisible(true);
      setModalVisible(true);
    }
  };
  return (
    <View className="flex-1">
      <View className={`flex ${selectedSlot !== null && "flex-row"}`}>
        <View className={`${selectedSlot !== null && "flex-1"}`}>
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-center text-lg font-bold bg-[#f49b33] p-2 my-2 mx-2 rounded-lg">
              {" "}
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>
        {selectedSlot !== null && (
          <View className="flex-1">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-center text-white text-lg font-bold bg-[#f49b33] p-2 my-2 mx-2 rounded-lg">
                {" "}
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {slotsVisible && (
        <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
          {slots?.map((slot, index) => {
            return (
              <TouchableOpacity
                key={index}
                className={`m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${selectedSlot && selectedSlot !== slot ? "opacity-50" : ""}`}
                onPress={() => handleSlotPress(slot)}
                disabled={
                  selectedSlot == slot || selectedSlot == null ? false : true
                }
              >
                <Text className="text-white font-bold">{slot}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        style={{
          flex: 1,
          justifyContent: "flex-end",
          margin: 0,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View className="flex-1 bg-[#00000080]">
          <View>
            {formVisible ? (
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
                  <View className="w-full flex gap-4">
                    <View>
                      <Text className="font-bold text-lg text-[#f49b33]">
                        Full Name
                      </Text>
                      <TextInput
                        className="h-12 border border-white text-white rounded px-2 w-full"
                        onChangeText={handleChange("fullName")}
                        value={values.fullName}
                        onBlur={handleBlur("fullName")}
                      />
                      {touched.fullName && errors.fullName && (
                        <Text className="text-red-500 text-sm my-2">
                          {errors?.fullName}
                        </Text>
                      )}
                    </View>
                    <View>
                      <Text className="font-bold text-lg text-[#f49b33]">
                        Phone Number
                      </Text>
                      <TextInput
                        className="h-12 border border-white text-white rounded px-2 w-full"
                        secureTextEntry
                        onChangeText={handleChange("phoneNumber")}
                        value={values.phoneNumber}
                        onBlur={handleBlur("phoneNumber")}
                      />
                      {touched.phoneNumber && errors.phoneNumber && (
                        <Text className="text-red-500 text-sm my-2">
                          {errors?.phoneNumber}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity
                      className="bg-[#f49b33] p-2 rounded-lg mt-5"
                      onPress={handleSubmit}
                    >
                      <Text className="text-black font-bold text-center text-lg">
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </Formik>
            ) : (
              <View>
                <Text>Table Booked</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;
