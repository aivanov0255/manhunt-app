import GameButton from "@/components/GameButton";
import { socketService } from "@/services/socket";
import { useFonts } from "expo-font";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function JoinGame() {
    let playerName = "";

    const [loaded] = useFonts({
      Jersey: require("../assets/fonts/Jersey10-Regular.ttf"),
    });

    function createGame() {
      console.log("Attempting to create game with player name: " + playerName + "...");
      socketService.send({
        action: "create_game",
        host_name: playerName,
        game_type: "normal"
    });
    }

    return (
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: "#6043A9" }}>
        <Text style={{ fontSize: 80, fontFamily: "Jersey", color: "#FFFFFF", marginTop: 80 }}>New Game</Text>
        <TextInput placeholder="Enter Player Name" onChangeText={(text) => {
            playerName = text;
        }} style={{ fontSize: 20, fontFamily: "Jersey", width: 300, height: 50, backgroundColor: "#FFFFFF", paddingHorizontal: 15, marginBottom: 50, marginTop: 50 }} />
        <GameButton text="Create" onPress={() => createGame()} width={300} height={100} />
        </View>
    );
}