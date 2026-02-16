import GameButton from "@/components/GameButton";
import { useFonts } from "expo-font";
import React from "react";
import { Text, TextInput, View } from "react-native";

export default function JoinGame() {
    let gameCode = "";
    let playerName = "";

    const [loaded] = useFonts({
      Jersey: require("../assets/fonts/Jersey10-Regular.ttf"),
    });

    function joinGame() {
      console.log("Attempting to join game with code: " + gameCode + " and player name: " + playerName + "...");
    }

    return (
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: "#6043A9" }}>
        <Text style={{ fontSize: 80, fontFamily: "Jersey", color: "#FFFFFF", marginTop: 80 }}>Join Game</Text>
        <TextInput placeholder="Enter Game Code" maxLength={5} onChangeText={(text) => {
            gameCode = text;
        }} keyboardType="numeric" style={{ fontSize: 20, fontFamily: "Jersey", width: 300, height: 50, backgroundColor: "#FFFFFF", paddingHorizontal: 15, marginTop: 50, marginBottom: 50 }} />
        <TextInput placeholder="Enter Player Name" onChangeText={(text) => {
            playerName = text;
        }} style={{ fontSize: 20, fontFamily: "Jersey", width: 300, height: 50, backgroundColor: "#FFFFFF", paddingHorizontal: 15, marginBottom: 50 }} />
        <GameButton text="Join Game" onPress={() => joinGame()} width={300} height={100} />
        </View>
    );
}