import { Text, TouchableOpacity, View } from "react-native";

const GuestPickerComponent = ({ selectedNumber, setSelectedNumber }) => {
  const decreament = () => {
    if (selectedNumber > 1) setSelectedNumber(selectedNumber - 1);
  };
  const increament = () => {
    if (selectedNumber < 12) setSelectedNumber(selectedNumber + 1);
  };
  return (
    <View className="flex flex-row items-center rounded-lg text-white text-base">
      <TouchableOpacity onPress={decreament} className="rounded">
        <Text className="text-white text-lg border border-[#f49b33] rounded-l-lg px-3">
          -
        </Text>
      </TouchableOpacity>
      <Text className="text-white px-3 bg-[#474747] text-lg border border-[#f49b33]">
        {selectedNumber}
      </Text>
      <TouchableOpacity onPress={increament} className="rounded">
        <Text className="text-white text-lg border border-[#f49b33] rounded-r-lg px-3">
          +
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default GuestPickerComponent;
