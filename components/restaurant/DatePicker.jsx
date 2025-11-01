import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DatePickerComponent = ({ date, setDate }) => {
  const [show, setShow] = useState(false);

  const handlePress = () => {
    setShow(true);
  };

  const handleChange = (event, selectedDate) => {
    if (selectedDate) setDate(selectedDate);
    if (Platform.OS === "android") setShow(false); // Android auto close
  };

  return (
    <View className="flex flex-row items-center">
      {/* Button */}
      <TouchableOpacity onPress={handlePress}>
        <Text className="text-lg text-white px-4 py-1 bg-gray-800 font-bold rounded-lg">
          {date.toDateString()}
        </Text>
      </TouchableOpacity>

      {/* ✅ Android Picker */}
      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={date}
          onChange={handleChange}
          mode="date"
          display="default"
          themeVariant="light"
          accentColor="#f49b33"
          textColor="#f49b33"
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
        />
      )}

      {/* ✅ iOS Modal Picker */}
      {Platform.OS === "ios" && show && (
        <Modal transparent animationType="slide">
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-white p-4 rounded-t-2xl">
              <DateTimePicker
                value={date}
                onChange={handleChange}
                mode="date"
                display="spinner"
                accentColor="#f49b33" // ✅ Only thing Apple listens to
                themeVariant="light"
                minimumDate={new Date()}
                maximumDate={
                  new Date(new Date().setDate(new Date().getDate() + 7))
                }
              />

              {/* Done Button */}
              <Pressable
                onPress={() => setShow(false)}
                className="mt-3 rounded-md bg-[#f49b33] p-2"
              >
                <Text className="text-center text-white font-semibold">
                  Done
                </Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default DatePickerComponent;
