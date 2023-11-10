import React from 'react';
import constantData from '../../../constants';

function Fight({setMenuState, playerData, handleAction}) {
    
    return (
        <div>
            <button type="button" onClick={()=>handleAction("attack")}>{playerData.loadout.weapon} {constantData.weapons[playerData.loadout.weapon].showammo?""+playerData.mainammo+"/"+constantData.weapons[playerData.loadout.weapon].maxammo:""}</button>
            <button type="button" onClick={()=>handleAction("secondary")}>{playerData.loadout.secondary} {constantData.weapons[playerData.loadout.secondary].showammo?""+playerData.secammo+"/"+constantData.weapons[playerData.loadout.secondary].maxammo:""}</button>
            <button type="button" onClick={()=>setMenuState("menu")}>Back</button>
        </div>
    );
}

export default Fight;