const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const config = require("./confg");
let currentRoomId;
let inventory = [];

console.log(`Welcome to ${config.gameName}!`);
console.log(config.directions);

rl.question("What is your name ? ", function (name) {
    currentRoomId = config.startingRoomId;
    showRoom()
    //rl.close();
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
        default:
            console.log(`Unrecognized command: ${command}`);
            break;
    }
});

rl.on("close", function () {
    console.log("\nGAME OVER");
    process.exit(0);
});

// Functions

function lookatObject(objectName) {
    const obje = getObjectByName(objectName);
    if (obje) {
        console.log(obje.description);
    } else {
        console.log(`There is no ${objectName} in this room`);
    }
}

function pickupObject(objectName) {
    const obje = getObjectByName(objectName);
    if (obje) {
        if (obje.pickUp) {
            inventory.push(obje);
            deleteObjectByName(objectName);
            console.log(`You picked up the ${obje.name}.`);
        } else {
            console.log(`You cannot pick up the ${obje.name}.`);
        }
    } else {
        console.log(`There is no ${objectName} in this room`);
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
        console.log(`You can't go that way.`);
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
    console.log(`You are in the ${room.name}`);
    console.log(room.description);
    if (room.objects) {
        for(let i = 0; i < room.objects.length; i++) {
            if (room.objects[i].roomDescription) {
                console.log(room.objects[i].roomDescription);
            }
        }
    }
    console.log(`Directions you can go: ${directions.join(", ")}`);
}

function getRoomDirections(room) {
    return Object.keys(room.adjacent);
}