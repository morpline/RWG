import React from 'react';
import Attack from './attack';
import Fight from './Fight';

function Menu({menuState, setMenuState, playerData, handleAction}) {
    function setMenu (state) {
        setTimeout(()=>setMenuState(state),100);
    }
    function setAction (action) {
        setTimeout(()=>{
            handleAction(action);
            setMenuState("menu")
        },100);
        
    }
    switch(menuState){
        case "menu":
            return (<Attack setMenuState={setMenu} handleAction={setAction}></Attack>)
        case "fight":
            return (<Fight setMenuState={setMenu} playerData = {playerData} handleAction={setAction}></Fight>)
    }
}

export default Menu;