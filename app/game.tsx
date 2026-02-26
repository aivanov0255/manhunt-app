import MapView, { Marker, Polygon} from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import { useState, useEffect, JSX, use } from 'react';
import { getLocation } from '@/services/location';
import { socketService } from "@/services/socket";

export default function Game() {
    // Zoom in on san francisco by default
    const [region, setRegion] = useState({
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    });

    function updateMarkers(tempPlayers: Array<{ name: string; role: string; location: { latitude: number; longitude: number } }>) {
        const newMarkers = [];

        console.log("TYPE:", typeof tempPlayers);
        console.log("IS ARRAY:", Array.isArray(tempPlayers));
        console.log("VALUE:", tempPlayers);

        for (let i = 0; i < tempPlayers.length; i++) {
            const player: { name: string; role: string; location: { latitude: number; longitude: number } } = tempPlayers[i];
            if (!player || !player.location) continue;
            if (
                typeof player.location.latitude !== "number" ||
                typeof player.location.longitude !== "number"
            ) continue;
            newMarkers.push(
                {
                    key: player.name,
                    coordinate: {
                        latitude: player.location.latitude,
                        longitude: player.location.longitude
                    },
                    title: player.name
                }
            );
        }
        setMarkers(newMarkers);
    }

    const [players, setPlayers] = useState<Array<{ name: string; role: string; location: { latitude: number; longitude: number } }>>([]);

    const [markers, setMarkers] = useState<Array<{key: string; coordinate: {latitude: number; longitude: number}; title: string}>>([]);

    useEffect(() => {
        const tempPlayers = socketService.getPlayers();
        setPlayers(tempPlayers);

        updateMarkers(tempPlayers);

        socketService.addPlayerUpdateListener((updatedPlayers) => {
            console.log("Received player update:", updatedPlayers);
            setPlayers(updatedPlayers);
            updateMarkers(updatedPlayers);
        });
    }, []);

    useEffect(() => {
        let interval: number;

        async function startSendingLocation() {
            interval = setInterval(async () => {
                const loc = await getLocation();

                if (!loc) return;

                socketService.send({
                    action: "update_location",
                    game_code: socketService.getGameCode(),
                    player_name: socketService.getPlayerName(),
                    location: {
                        latitude: loc.coords.latitude,
                        longitude: loc.coords.longitude,
                    },
                });
            }, 10);
        }

        startSendingLocation();

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);


    const [coordinates, setCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);

    useEffect(() => {
        console.log(socketService.getBoundary());
        setCoordinates(socketService.getBoundary());
    }, [socketService.getBoundary()]);

    useEffect(() => {
        console.log(socketService.getOriginalCoords());
        setRegion({
            latitude: socketService.getOriginalCoords()?.latitude || 37.78825,
            longitude: socketService.getOriginalCoords()?.longitude || -122.4324,
            latitudeDelta: 0.000922,
            longitudeDelta: 0.000421,
        });
    }, []);

    return (
        <View style={styles.container}>
            <MapView style={styles.map}
                region={region}>
                <Polygon coordinates={coordinates}
                fillColor="rgba(100,10,255,0.5)"></Polygon>
                {markers.map(marker => (
                    <Marker key={marker.key} coordinate={marker.coordinate} title={marker.title} />
                ))}
            </MapView>
            <View style={{ position: "absolute", alignSelf: "center", backgroundColor: "#0000002b", width: "100%", height: 100, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ alignSelf: "center", top: 30, fontSize: 30, color: "#FFFFFF", fontWeight: "bold" }}>
                    Game Code: {socketService.getGameCode()}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
});