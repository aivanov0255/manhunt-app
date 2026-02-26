import asyncio
import websockets
import json
import random

IP = ""
PORT = None

with open("config.json") as f:
    config = json.load(f)
    IP = config["ipv4"]
    PORT = config["port"]
    f.close()
    
games: dict[str, Game] = {}

class Player:
    HUNTER = "hunter"
    HIDER = "hider"
    
    def __init__(self, name, location=None):
        self.name = name
        self.role = None
        self.location = location
    
    # Set the player's role (hunter or hider)
    def set_role(self, role):
        self.role = role

    # Set the player's location
    def set_location(self, location):
        self.location = location

class GameType:
    NORMAL = "normal"
    INFECTION = "infection"

class Game:
    def __init__(self, game_code, host_player, num_hunters, bounds, original_coords, game_type="normal"):
        self.code = game_code
        self.host = host_player
        self.num_hunters = num_hunters
        self.game_type = game_type
        self.players = [self.host]
        self.mode = "lobby"
        self.bounds = bounds
        self.original_coords = original_coords

    # Add a player to the game
    def add_player(self, player):
        self.players.append(player)

    # Get a player from a specified name
    def get_player(self, player_name):
        for player in self.players:
            if player.name == player_name:
                return player
        return None
    
    def assign_roles(self):
        player_indexes = list(range(len(self.players)))
        random.shuffle(player_indexes)
        for player_index in player_indexes:
            if player_index < self.num_hunters:
                self.players[player_index].set_role(Player.HUNTER)
            else:
                self.players[player_index].set_role(Player.HIDER)

    def start(self):
        self.mode = "active"
        self.assign_roles()
            

async def handle_message(websocket):
    async for message in websocket:
        data = json.loads(message)
        print(f"Data from JSON: {data}")

        action = data.get("action")

        if action == "create_game":
            print("Creating game...")

            game_code = str(random.randint(10000, 99999))
            while game_code in games:
                game_code = str(random.randint(10000, 99999))
            games[game_code] = Game(game_code, Player(data["host_name"], data["original_coords"]), int(data["num_hunters"]), data["boundary"], data["original_coords"], data["game_type"])

            players = []

            for player in games[game_code].players:
                players.append({
                    "name": player.name,
                    "role": player.role,
                    "location": player.location
                })

            print(players)

            info = json.dumps(
                {
                    "action": "join_game",
                    "game_code": game_code,
                    "players": json.dumps(players),
                    "bounds": games[game_code].bounds,
                    "original_coords": games[game_code].original_coords
                })
            
            print("Sending info:", info)

            await websocket.send(info)
        
        elif action == "join_game":
            game_code = data["game_code"]
            player_name = data["player_name"]
            if game_code in games:
                game = games[game_code]
                game.add_player(Player(player_name, data["location"]))
            else:
                await websocket.send(json.dumps({"action": "error", "message": "Game not found"}))
                continue

            players = []

            for player in games[game_code].players:
                players.append({
                    "name": player.name,
                    "role": player.role,
                    "location": player.location
                })
            
            info = json.dumps(
                {
                    "action": "join_game",
                    "game_code": game_code,
                    "players": json.dumps(players),
                    "bounds": games[game_code].bounds,
                    "original_coords": games[game_code].original_coords
                })
            
            await websocket.send(info)
        
        elif action == "update_location":
            game_code = data["game_code"]
            player_name = data["player_name"]
            location = data["location"]

            print("update_location:", game_code, player_name, location)

            if game_code in games:
                game = games[game_code]
                player = game.get_player(player_name)
                if player:
                    player.set_location(location)
                else:
                    await websocket.send(json.dumps({"action": "error", "message": "Player not found"}))
                    continue
            else:
                await websocket.send(json.dumps({"action": "error", "message": "Game not found"}))
                continue


        info = {}

        info["action"] = "update_players"

        for game_code, game in games.items():
            players = []

            for player in game.players:
                players.append({
                    "name": player.name,
                    "role": player.role,
                    "location": player.location
                })

            info[game_code] = {
                "host": game.host.name,
                "num_hunters": game.num_hunters,
                "game_type": game.game_type,
                "players": players,
            }

        print("Broadcasting player updates:", info)

        await websocket.send(json.dumps(info))
            

async def main():
    async with websockets.serve(handle_message, IP, PORT):
        print(f"WebSocket server running on ws://{IP}:{PORT}")
        await asyncio.Future()

if __name__ == "__main__":
    asyncio.run(main())
