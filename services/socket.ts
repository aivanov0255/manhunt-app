import { router } from "expo-router";

class SocketService {
  socketService() {
      throw new Error('Method not implemented.');
  }
  private socket: WebSocket | null = null;
  private players: Array<{ name: string; role: string; location: { latitude: number; longitude: number } }> = [];
  private game_code: string = "";
  private boundary: Array<{
      latitude: any;
      longitude: any; lat: number; lng: number 
}> = [];
  private original_coords: { latitude: number; longitude: number } | null = null;

  private playerUpdateListeners: Array<(players: any) => void> = [];

  private playerName: string = "";

  connect(url: string) {
    if (this.socket) return;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log("Connected to Python!");
    this.socket.onerror = (e) => console.error("Socket Error:", e);
    this.socket.onclose = () => {
        console.log("Socket Closed");
        this.socket = null;
    };

    this.onMessage((data) => {action: "none"});

    this.players = [];
    this.game_code = "";
    this.boundary = [];
    this.original_coords = null;
    this.playerName = "";
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  addPlayerUpdateListener(listener: (players: any) => void) {
    this.playerUpdateListeners.push(listener);
  }

  getPlayers() {
    return this.players;
  }

  getGameCode() {
    return this.game_code;
  }

  getBoundary() {
    return this.boundary;
  }

  getOriginalCoords() {
    return this.original_coords;
  }

  setPlayerName(name: string) {
    this.playerName = name;
  }

  getPlayerName() {
    return this.playerName;
  }

  onMessage(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        const action = data.action;

        console.log("Received message with action:", action);
        console.log("Message data:", data);

        if (action === "join_game") {
          if (typeof data.players === "string") {
            this.players = JSON.parse(data.players);
          } else {
            this.players = data.players;
          }

          this.game_code = data.game_code;
          this.boundary = data.bounds;
          this.original_coords = data.original_coords;

          console.log("Updated game code:", this.game_code);
          console.log("Updated players:", this.players);
          console.log("Updated boundary:", this.boundary);
          console.log("Navigating to game screen...");

          router.push("/game");
        }

        if (action === "update_players") {
          if (typeof data.players === "string") {
            this.players = JSON.parse(data[this.game_code].players);
          } else {
            this.players = data[this.game_code].players;
          }
          console.log("Updated players:", this.players);

          this.playerUpdateListeners.forEach(listener => listener(this.players));
        }

        callback(data);
      } catch (e) {
        console.error("Failed to parse message:", e);
      }
    };
  }

  disconnect() {
    this.socket?.close();
  }
}

export const socketService = new SocketService();