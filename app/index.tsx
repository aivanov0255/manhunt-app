import GameButton from "@/components/GameButton";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { Text, View } from "react-native";


type RootStackParamList = {
  index: undefined;
  joingame: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function Index() {
  const [loaded] = useFonts({
      Jersey: require("../assets/fonts/Jersey10-Regular.ttf"),
    });

  const navigation = useNavigation<NavigationProp>();

  function handleNewGamePress() {
    console.log("New Game button pressed!");
  }

  function handleJoinGamePress() {
    navigation.navigate("joingame");
  }

  if (!loaded) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#6043A9",
      }}
    >
      <Text style={{ fontSize: 100, fontFamily: "Jersey", marginBottom: 0, color: "#FFFFFF", padding: 0 }}>
        Manhunt
      </Text>
      <Text style={{ fontSize: 20, fontFamily: "Jersey", marginBottom: 50, color: "#FFFFFF", alignSelf: "flex-start", marginLeft: 50, marginTop: 0 }}>Bbronse & Prygin</Text>
      <GameButton text="New Game" onPress={handleNewGamePress} width={300} height={100} />
      <View style={{ height: 20 }} />
      <GameButton text="Join Game" onPress={handleJoinGamePress} width={300} height={100} />
    </View>
  );
}
