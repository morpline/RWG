import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import Menu from './menus/Menu';
import constantData from '../../constants';
let log = "";
let data = {
    loadout: JSON.parse(localStorage.getItem("loadout")) || {weapon:"revolver",secondary:"dagger",armor:0},
    id : -1,
    ingame : false,
    mainammo: 100,
    secammo: 100,

};
data.mainammo = constantData.weapons[data.loadout.weapon].startammo;
data.secammo = constantData.weapons[data.loadout.secondary].startammo;

let urturn = false;
let hp = 100;
let keys = [];
let announcement = "";
let recievedData = {};
const Connect = () => {
    //Public API that will echo messages sent to it back to the client
    // console.log(useState("e"));
    const [socketUrl, setSocketUrl] = useState('ws://rwg.onrender.com/');
    const [menuState, setMenuState] = useState('menu');
    const [messageHistory, setMessageHistory] = useState([]);
    const [message, setMessage] = useState("");
    // const [hp, setHp] = useState(100);
    // const [recievedData, setRecievedData] = useState({});
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    // const handleClickSendMessage = (e) => {useCallback(() => {sendMessage(e)}, [])};
    const SendMessage = useCallback((e) => {
        console.log("Sending Message...");
        sendMessage(JSON.stringify(e));
    }, []);
    function handleAction (action) {
        console.log("start HandleAction");
        if(data.status=="ended" || recievedData.status=="ended")
            return;
        console.log("Switch statement");
        switch (action) {
            case "attack":
                if(data.mainammo!=0) {
                    data.mainammo-=constantData.weapons[data.loadout.weapon].usage;
                } else {
                    setMessage("Out of Ammo!");
                    return;
                }
                if(constantData.weapons[data.loadout.weapon].guardbefore && !data.guarding && data.loadout.armor!=2) {
                    setMessage("You need to prepare first!");
                    return;
                }
                if(constantData.weapons[data.loadout.weapon].spdesc) {
                    if(constantData.weapons[data.loadout.weapon].special({hp:hp})) {
                        estTakenDamage((data.mainammo!=0)?constantData.weapons[data.loadout.weapon].damage*2:0);
                    } else {
                        estTakenDamage((data.mainammo!=0)?constantData.weapons[data.loadout.weapon].damage:0);
                    }
                } else {
                    estTakenDamage((data.mainammo!=0)?constantData.weapons[data.loadout.weapon].damage:0);

                }
                data.guarding=false;
                break;
            case "secondary":
                if(data.secammo!=0) {
                    data.secammo-=constantData.weapons[data.loadout.secondary].usage;
                } else {
                    setMessage("Out of Ammo!");
                    return;
                }
                if(constantData.weapons[data.loadout.secondary].guardbefore && !data.guarding && data.loadout.armor!=2) {
                    setMessage("You need to prepare first!");
                    return;
                }
                if(constantData.weapons[data.loadout.secondary].spdesc) {
                    if(constantData.weapons[data.loadout.secondary].special({hp:hp})) {
                        estTakenDamage(constantData.weapons[data.loadout.secondary].damage * 1.6);
                    } else {
                        estTakenDamage(constantData.weapons[data.loadout.secondary].damage * 0.8);
                    }
                } else {
                    estTakenDamage(constantData.weapons[data.loadout.secondary].damage * 0.8);
                }
                data.guarding=false;
                break;
            case "guard":
                setMessage("You guard yourself.")
                data.mainammo+=constantData.weapons[data.loadout.weapon].refills;
                data.mainammo=Math.min(constantData.weapons[data.loadout.weapon].maxammo,data.mainammo);
                data.secammo+=constantData.weapons[data.loadout.secondary].refills;
                data.secammo=Math.min(constantData.weapons[data.loadout.secondary].maxammo,data.secammo);
                data.guarding=true;
                break;
        }
        if(recievedData.turn == data.id && data.ingame){
            if(recievedData.players[0]==data.id)
            {
                //sends it as this being p1
                SendMessage({
                    id:data.id,
                    players: recievedData.players,
                    player1loadout:data.loadout,
                    player2loadout:recievedData.player2loadout,
                    player1hp:hp,
                    player2hp:recievedData.player2hp,
                    turn:recievedData.id,
                    gameStatus:"starting",
                    opponentAction:action,
                    ingame:data.ingame,
                    origin:"connect.jsx",
                });
            } else {
                //sends it as p2
                SendMessage({
                    id:data.id,
                    players: recievedData.players,
                    player1loadout:recievedData.player1loadout,
                    player2loadout:data.loadout,
                    player1hp:recievedData.player1hp,
                    player2hp:hp,
                    turn:recievedData.id,
                    gameStatus:"starting",
                    opponentAction:action,
                    ingame:data.ingame,
                    origin:"connect.jsx",
                });
            }
        }
    }
    function takeDamage (dmg) {
        let damage = 0;
        damage+=dmg;
        if(data.guarding){
            damage*=0.8;
            console.log("Adding damage multiplier 0.8 for guarding", damage);
        }
        if(data.loadout.armor==0) {
            damage*=0.75
            console.log("Adding damage multiplier 0.75 for armor 0", damage);
        }
        if(data.loadout.armor==1) {
            damage*=1.1;
            console.log("Adding damage multiplier 1.1 for armor 1", damage);
        }
        if(recievedData.players[0]==data.id) {
            if(recievedData.player2loadout.armor==1) {
                damage*=1.2
                console.log("Adding damage multiplier 1.2 for armor 1", damage);
            }
        } else {
            if(recievedData.player1loadout.armor==1) {
                damage*=1.2
                console.log("Adding damage multiplier 1.2 for armor 1", damage);
            }
        }
        // setHp(hp-damage);
        hp-=damage;
        setMessage(`You took ${damage} damage!`)
        
        
        if(hp<=0){
            data.gameStatus="ended";

        }
    }
    function estTakenDamage (dmg) {
        let damage = 0;
        damage+=dmg;
        if(recievedData.opponentAction == "guard"){
            damage*=0.8;
        }
        if(data.loadout.armor == 1) {
            damage*=1.2;
        }
        // console.log(recievedData.players[0]==data.id);
        if(recievedData.players[0]==data.id) {
            // console.log(recievedData.player2loadout.armor);
            if(recievedData.player2loadout.armor==0) {
                damage*=0.75;
            }
            if(recievedData.player2loadout.armor==1) {
                damage*=1.1;
            }
            // setHp(hp-damage);
            recievedData.player2hp-=damage;
        } else {
            if(recievedData.player1loadout.armor==0) {
                damage*=0.75
            }
            if(recievedData.player1loadout.armor==1) {
                damage*=1.1;
            }
            recievedData.player1hp-=damage;
        }
        setMessage(`They took ${damage} damage!`);
        
        if(recievedData.player1hp<=0 || recievedData.player2hp<=0){
            data.gameStatus="ended";
        }
    }
    function updateFromMessage () {
        console.log("update from message ", recievedData.pns, data.ingame);
        if(recievedData.gameStatus == "starting") {
            data.ingame = true;
        }
        if(recievedData.pns && data.ingame == false){
            data.id = recievedData.pns;
            console.log(data.loadout);
            // console.log(recievedData);
            SendMessage(JSON.stringify(data));
            return;
        }
        if(data.id != recievedData.id) {
            //If data sent is from them, not you
            switch(recievedData.opponentAction) {
                //if they do one of the following:
                case "attack":
                    if(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.weapon:recievedData.player2loadout.weapon].spdesc) {
                        if(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.weapon:recievedData.player2loadout.weapon].special({hp:hp})) {
                            takeDamage(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.weapon:recievedData.player2loadout.weapon].damage);
                        } else {
                            takeDamage(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.weapon:recievedData.player2loadout.weapon].damage);
                        }
                    } else {
                        takeDamage(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.weapon:recievedData.player2loadout.weapon].damage);
                    }
                    break;
                case "secondary":
                    if(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.secondary:recievedData.player2loadout.secondary].spdesc) {
                        if(constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.secondary:recievedData.player2loadout.secondary].special({hp:hp})) {
                            takeDamage(0.8*constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.secondary:recievedData.player2loadout.secondary].damage);
                        } else {
                            takeDamage(0.8*constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.secondary:recievedData.player2loadout.secondary].damage);
                        }
                    } else {
                        takeDamage(0.8*constantData.weapons[(recievedData.players[0]!=data.id)?recievedData.player1loadout.secondary:recievedData.player2loadout.secondary].damage);
                    }
                    break;
                case "update":
                    setMessage("They took "+recievedData.message + " damage!");
                    break;
                case "guard":
                    setMessage("They are guarding themselves.");
                    break;
                default:
                    if(recievedData.players[0]==data.id) {
                        setMessage("You have first move.");
                    } else {
                        setMessage("They have first move.")
                    }
            }
        }
    }
    useEffect(() => {
        if (lastMessage !== null) {
            const re = JSON.parse(lastMessage.data);
            console.log("re",re);
            // setRecievedData(re);
            recievedData=re;
            urturn = recievedData.turn==data.id;
            updateFromMessage();
            setMessageHistory((prev) => prev.concat(re.message));
        }
    }, [lastMessage, setMessageHistory]);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Connected',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];
    return (
        <div>
            {/* <button onClick={()=>{setMessage(""+Math.random())}}>Set number</button> */}
            {/* <button onClick={handleSubmit}>SEND</button> */}
            
            {/* {lastMessage ? <span>Last message: {JSON.stringify(lastMessage.data)}</span> : null} */}
            {/* <ul>
            { {messageHistory.map((message, idx) => (
                <span key={idx}>M; {(message)}<br/></span>
                
            ))} }
            </ul> */}

            <div className="section">
                <div className="left">
                    <div className="img">(picture of {hp<=0?"dead ":" "}warrior)</div>
                    <h3>you: {hp}/100</h3>
                </div>
                <div className="right">
                    <div className="img">(picture of {
                        recievedData.players?
                        ((recievedData.players[0]==data.id)?
                            recievedData.player2hp<=0:
                            recievedData.player1hp<=0
                        )?"dead ":" ":" "
                    }warrior)</div>
                    {recievedData.players?(<h3>them: {
                        (recievedData.players[0]==data.id)?
                            recievedData.player2hp:
                            recievedData.player1hp
                    }/100</h3>):(<h3>...</h3>)}
                </div>

            </div>
            
            <h1>{message}</h1>
            
            {/* <h3>{urturn?"your turn":"their turn"}</h3> */}

            {/* <h2>Actions</h2>
            <p>{data.loadout.weapon} {constantData.weapons[data.loadout.weapon].showammo?""+data.mainammo+"/"+constantData.weapons[data.loadout.weapon].maxammo:""}</p>
            <button type="button" onClick={()=>handleAction("attack")}>Send attack</button>
            <p>{data.loadout.secondary} {constantData.weapons[data.loadout.secondary].showammo?""+data.secammo+"/"+constantData.weapons[data.loadout.secondary].maxammo:""}</p>
            <button type="button" onClick={()=>handleAction("secondary")}>Send secondary</button>
            <p>{constantData.armors[data.loadout.armor].name}</p>
            <button type="button" onClick={()=>handleAction("guard")}>Send guard</button> */}

            {(urturn)?(
            <Menu menuState={menuState} setMenuState={setMenuState} playerData={data} handleAction={handleAction}></Menu>
            ):(<div></div>)}
            <div className="section top">
                <p>{connectionStatus}</p>
                <p>{data.ingame?"Matched!":"Waiting for match..."}</p>
            </div>
        </div>
    );
};
export default Connect;