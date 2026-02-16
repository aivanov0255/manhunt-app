import { useFonts } from "expo-font";
import { Text, TouchableOpacity, View } from "react-native";

type GameButtonProps = {
  text: string;
  onPress: () => void;
  width: number;
  height: number;
}

export default function GameButton({ text, onPress, width, height }: GameButtonProps) {
  const [loaded] = useFonts({
    Jersey: require("../assets/fonts/Jersey10-Regular.ttf"),
  });

  return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{
            backgroundColor: "#BA88FF",
            width: width,
            height: height,
            borderRadius: 0,
            justifyContent: "center",
          }}
        >
          <Text 
            style={{
              color: "white", 
              fontSize: 50,
              alignSelf: "center",
              fontFamily: "Jersey"
              }}
          >{text}</Text>
          <View
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              height: 17,
              width: 17,
              backgroundColor: "#6A45FF",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              height: 17,
              width: 17,
              backgroundColor: "#6A45FF",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              height: 17,
              width: 17,
              backgroundColor: "#6A45FF",
            }}
          />
          <View
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              height: 17,
              width: 17,
              backgroundColor: "#6A45FF",
            }}
          />
        </View>
      </TouchableOpacity>
  );
}

