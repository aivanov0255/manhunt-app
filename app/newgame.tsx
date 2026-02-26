import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import GameButton from "@/components/GameButton";
import { getLocation } from "@/services/location";
import { socketService } from "@/services/socket";
import { useFonts } from "expo-font";
import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import MapView, { Polygon, Polyline} from 'react-native-maps';


type RootStackParamList = {
  index: undefined;
  joingame: undefined;
  newgame: undefined;
  game: undefined;
  creating: undefined;
};


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function NewGame() {
    const navigation = useNavigation<NavigationProp>();
    
    const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);

    // Zoom in on san francisco by default
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: any; longitude: any; }; }; }) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setCoordinates([...coordinates, { latitude, longitude }]);

    };

    const [initalCoords, setInitialCoords] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        getLocation().then(location => {
            if (location) {
                setInitialCoords({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.000922,
                    longitudeDelta: 0.000421,
                });
            }
        });
    }, []);

    const [playerName, setPlayerName] = useState("");

    const [loaded] = useFonts({
      Jersey: require("../assets/fonts/Jersey10-Regular.ttf"),
    });

    function createGame() {
        console.log(playerName);
        socketService.setPlayerName(playerName);
        socketService.send({
            action: "create_game",
            host_name: playerName,
            num_hunters: 2,
            game_type: "normal",
            boundary: coordinates,
            original_coords: initalCoords,
        });
        navigation.navigate("creating");
    }

    return (
        <View style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", backgroundColor: "#6043A9" }}>
            <Text style={{ fontSize: 80, fontFamily: "Jersey", color: "#FFFFFF", marginTop: 80 }}>New Game</Text>
            <TextInput placeholder="Enter Player Name" onChangeText={(text) => {
                setPlayerName(text);
            }} style={{ fontSize: 20, fontFamily: "Jersey", width: 300, height: 50, backgroundColor: "#FFFFFF", paddingHorizontal: 15, marginBottom: 50, marginTop: 50 }} />
            <GameButton text="Create" onPress={() => createGame()} width={300} height={100} />
            <MapView style={{ flex: 0, width: "80%", height: "40%", marginTop: 30 }} region={region} onPress={handleMapPress} >
                {coordinates.length > 2 && ( // A polygon needs at least 3 points
                <Polygon
                    coordinates={coordinates}
                    fillColor="rgba(100, 10, 255, 0.2)"
                    strokeColor="rgba(100, 10, 255, 0.8)"
                    strokeWidth={2}
                />
                )}
                {coordinates.length == 2 && (
                    <Polyline
                        coordinates={coordinates}
                        strokeColor="rgba(100, 10, 255, 0.8)"
                        strokeWidth={2}
                    />
                )}
            </MapView>
        </View>
    );
}