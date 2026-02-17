
class SocketService {
  private socket: WebSocket | null = null;

  connect(url: string) {
    if (this.socket) return;

    this.socket = new WebSocket(url);

    this.socket.onopen = () => console.log("Connected to Python!");
    this.socket.onerror = (e) => console.error("Socket Error:", e);
    this.socket.onclose = () => {
        console.log("Socket Closed");
        this.socket = null;
    };
  }

  send(data: any) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  onMessage(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.onmessage = (event) => callback(JSON.parse(event.data));
  }

  disconnect() {
    this.socket?.close();
  }
}

export const socketService = new SocketService();