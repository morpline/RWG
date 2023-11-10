import React from 'react';

function Attack({setMenuState, handleAction}) {
    return (
        <div>
            <button type="button" onClick={()=>setMenuState("fight")}>fight</button>
            <button type="button" onClick={()=>handleAction("guard")}>guard</button>
        </div>
    );
}

export default Attack;