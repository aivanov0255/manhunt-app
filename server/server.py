import asyncio
import websockets
import json

class Player:
    def __init__(self, name):
        self.name = name
        self.role = None
        self.position = None

class Game:
    def __init__(self, game_code, host_name, location, game_type="normal"):
        self.code = game_code
        self.host = Player(host_name)
        self.location = location
        self.game_type = game_type
        self.players = [self.host]
        self.mode = "lobby"
        self.num_hunters = 0
        self.num_hiders = 0

    def add_player(self, player_name):
        self.players.append(Player(player_name))

games = {}

async def handle_message(websocket):
    async for message in websocket:
        data = json.loads(message)
        print(f"Data from JSON: {data}")

        if data["action"] == "create_game":
            host_name = data["host_name"]
            game_type = data.get("game_type", "normal")
            game_code = str(len(games) + 1).zfill(4)
            game = Game(game_code, host_name, game_type)
            games[game_code] = game

            await websocket.send(json.dumps({
                "status": "success",
                "message": f"Game created with code {game_code}",
                "game_code": game_code,
                "game_type": game_type
            }))

        elif data["action"] == "join_game":
            player_name = data["player_name"]
            game_code = data["game_code"]
            if game_code in games:
                games[game_code].add_player(player_name)

            await websocket.send(json.dumps({
                "status": "success",
                "message": f"Player {player_name} joined game {game_code}"
            }))

async def main():
    async with websockets.serve(handle_message, "192.168.1.80", 8765):
        print("WebSocket server running on ws://192.168.1.80:8765")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
