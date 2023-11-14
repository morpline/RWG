const constantData = {
    armors:[
        {
            name: "chestplate",
            description: "Protects the chest. Damage taken reduced 25%",
        },
        {
            name: "helmet",
            description: "Protects the head. Damage dealt increased 20%, damage taken increased 20%",
        },
        {
            name: "gloves",
            description: "Protects the hands. Can use battleaxe without guarding beforehand."
        },
    ],
    weaponNames: [
        "revolver",
        "axe",
        "dagger",
        "laserrifle",
        "shotgun",
        "iron mace",
        "warhammer",
        "apple"
    ],
    weapons:{
        "revolver":{
            name:"revolver",//                            the name
            description: "Medium Damage, max 3 shots.",// the description
            damage:45,//                                  damage
            maxammo:3,//                                  max no. of shots
            usage:1,//                                    how much ammo it uses per shot
            guardbefore:false,//                          if you need to gaurd before you have to use it
            refills:1,//                                  how much ammo gets refilled during guarding\
            startammo:3,//                                how much ammo you start with
            showammo:true,//                              show the player how much ammo it has
            //                                   special  if it returns true, doubles the damage
            //                                   spdesc   Describes the special
            // Special gets this object:
            //{
                //hp
            //}
        },
        "axe":{
            name:"Battleaxe",
            description: "Heavy damage, must guard before using.",
            damage:85,
            maxammo:1,
            usage:0,
            guardbefore:true,
            refills:0,
            startammo:1,
            showammo:false,
        },
        "dagger":{
            name:"Dagger",
            description: "Light damage, hits harder when below 40% hp.",
            damage:40,
            maxammo:1,
            usage:0,
            guardbefore:false,
            refills:0,
            startammo:1,
            showammo:false,
            special: (e) => (e.hp<40),
            spdesc: "If below 40%, damage doubles"
        },
        "laserrifle":{
            name:"Laser Rifle",
            description: "Extrmely Heavy damage, must charge.",
            damage:150,
            maxammo:100,
            usage:100,
            guardbefore:false,
            refills:34,
            startammo:0,
            showammo:true,
        },
        "shotgun":{
            name:"Shotgun",
            description: "Heavy damage, needs two shells.",
            damage:95,
            maxammo:2,
            usage:2,
            guardbefore:false,
            refills:1,
            startammo:2,
            showammo:true,
        },
        "iron mace":{
            name:"Iron Mace",
            description:"Medium damage, can crit for double",
            damage:45,
            maxammo:1,
            usage:0,
            guardbefore:true,
            refills:0,
            startammo:1,
            showammo:false,
            special: (e) => (Math.random()<0.5),
            spdesc: "50% chance to hit double"
        },
        "warhammer":{
            name:"War Hammer",
            description:"Heavy damage, can only be used once",
            damage:125,
            maxammo:1,
            usage:1,
            guardbefore:false,
            refills:0,
            startammo:1,
            showammo:true,
        },
        "apple":{
            name:"Apple",
            description:"no damage, instead heals you an extra 75%",
            damage:0,
            maxammo:1,
            usage:0,
            guardbefore:false,
            refills:1,
            startammo:1,
            showammo:true,
            special: (e) => (e.hp+=75),
            spdesc: "Heals 75%"
        }
    }
}

export default constantData;