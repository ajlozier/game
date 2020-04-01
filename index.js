const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require("./confg");
let currentRoomId;
let inventory = [];

print(`Welcome to ${config.gameName}!`);
print(config.directions);

rl.question("What is your name ? ", function (name) {
    currentRoomId = config.startingRoomId;
    showRoom();
    rl.prompt();
});

rl.on("line", function (command) {
    const parts = command.split(" ");
    switch (parts[0]) {
        case "n":
        case "s":
        case "e":
        case "w":
            moveDirection(command);
            break;
        case "look":
            showRoom();
            break;
        case "quit":
            rl.close();
            break;
        case "lookat":
            lookatObject(parts[1]);
            break;
        case "pickup":
            pickupObject(parts[1]);
            break;
        case "inventory":
            showInventory();
            break;
        default:
            print(`Unrecognized command: ${command}`);
            break;
    }
    rl.prompt();
});

rl.on("close", function () {
    print("\nGAME OVER");
    process.exit(0);
});

// Functions

function print(str) {
    console.log(str);
}

function showInventory() {
    if (inventory.length > 0) {
        print(`You are carrying: `);
        for(let i = 0; i < inventory.length; i++) {
            print(inventory[i].description);
        }
    } else {
        print(`You do not have anything in your inventory. Use pickup command to pick up objects.`);
    }
}

function lookatObject(objectName) {
    const obje = getObjectByName(objectName);
    if (obje) {
        print(obje.description);
    } else {
        print(`There is no ${objectName} in this room`);
    }
}

function pickupObject(objectName) {
    const obje = getObjectByName(objectName);
    if (obje) {
        if (obje.pickUp) {
            inventory.push(obje);
            deleteObjectByName(objectName);
            print(`You picked up the ${obje.name}.`);
        } else {
            print(`You cannot pick up the ${obje.name}.`);
        }
    } else {
        print(`There is no ${objectName} in this room`);
    }
}

function deleteObjectByName(objectName) {
    const room = getRoomById(currentRoomId);
    if(!room.objects) {
        return false;
    }
    for (let i = 0; i < room.objects.length; i++) {
        if (room.objects[i].name === objectName) {
            room.objects.splice(i, 1);
            return true;
        }
    }
    return false;
}

function getObjectByName(objectName) {
    const room = getRoomById(currentRoomId);
    if(!room.objects) {
        return false;
    }
    for (let i = 0; i < room.objects.length; i++) {
        if (room.objects[i].name === objectName) {
            return room.objects[i];
        }
    }
    return false;
}

function moveDirection(direction) {
    const room = getRoomById(currentRoomId);
    const directions = getRoomDirections(room);
    if (directions.indexOf(direction) === -1) {
        print(`You can't go that way.`);
    } else {
        currentRoomId = room.adjacent[direction];
        showRoom();
    }
}

function getRoomById(roomId) {
    for (let i = 0; i < config.rooms.length; i++) {
        if (config.rooms[i].id === roomId) {
            return config.rooms[i];
        }
    }
    return false;
}

function showRoom() {
    const room = getRoomById(currentRoomId);
    const directions = getRoomDirections(room);
    print(`You are in the ${room.name}`);
    print(room.description);
    if (room.objects) {
        for(let i = 0; i < room.objects.length; i++) {
            if (room.objects[i].roomDescription) {
                print(room.objects[i].roomDescription);
            }
        }
    }
    print(`Directions you can go: ${directions.join(", ")}`);
}

function getRoomDirections(room) {
    return Object.keys(room.adjacent);
}