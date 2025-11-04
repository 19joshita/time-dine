import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { db } from "../../config/firebaseConfig";

const FindSlots = ({
  slots,
  selectedSlot,
  setSelectedSlot,
  date,
  selectedNumber,
  restaurant,
}) => {
  const [slotsVisible, setSlotVisible] = useState(false);
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
    </View>
  );
};

export default FindSlots;
