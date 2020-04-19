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
    showHelp();
    showRoom();
    rl.prompt();
});

const help = `
    n,s,e,w : Move north, south, east or west
    look : Look at room
    lookat <object> : Look at object in room
    pickup <object> : Pick up object in room
    inventory : Show inventory
    drop <object> : Drop object in inventory
    help : Show this help
    quit : Quit game
`;

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
        case "drop":
            dropObject(parts[1]);
            break;
        case "help":
            showHelp();
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

function showHelp() {
    print(help);
}

function print(str) {
    console.log(str);
}

function dropObject(objectName)  {
    const objectInInventory = getObjectByName(objectName, inventory);
    if (objectInInventory) {
        deleteObjectByName(objectName, inventory);
        const room = getRoomById(currentRoomId);
        room.objects.push(objectInInventory);
        print(`You have dropped ${objectName}.`);
    } else {
        print(`This object is not in your inventory.`);
    }
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

function deleteObjectByName(objectName, objects) {
    if (!objects) {
        const room = getRoomById(currentRoomId);
        if (!room.objects) {
            return false;
        } else {
            objects = room.objects;
        }
    }
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name === objectName) {
            objects.splice(i, 1);
            return true;
        }
    }
    return false;
}

function getObjectByName(objectName, objects) {
    if(!objects) {
        const room = getRoomById(currentRoomId);
        if (!room.objects) {
            return false;
        } else {
            objects = room.objects;
        }
    }
    for (let i = 0; i < objects.length; i++) {
        if (objects[i].name === objectName) {
            return objects[i];
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
            // Make sure room has objects array
            if (!config.rooms[i].objects) {
               config.rooms[i].objects = [];
            }
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