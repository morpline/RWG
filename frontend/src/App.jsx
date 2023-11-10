import { useState } from 'react';
import constantData from '../../constants';

import './App.css'
function App() {
  const [armor, setArmor] = useState(0);
  const [weapon, setWeapon] = useState(0);
  const [sec, setSec] = useState(2);
  const delfult = JSON.parse(localStorage.getItem("loadout")) || {weapon:"revolver",secondary:"dagger",armor:0};


  function Ar({varToWatch, setVarFunc, value}) {
    if(varToWatch === value) {
      return (
        <h2 onClick={() => setVarFunc(value)}>
          {constantData.armors[value].name}
        </h2>
      )
    } else {
      return (
        <h3 onClick={() => setVarFunc(value)}>
          {constantData.armors[value].name}
        </h3>
      )
    }
    // return (<h2>Error</h2>)
  }
  function Zz({varToWatch, setVarFunc, value}) {
    console.log(constantData.weaponNames[value]);
    if(value > constantData.weaponNames.length-1) {
      return (<h2>Error</h2>)
    }
    if(varToWatch === value) {
      return (
        <h2 onClick={() => setVarFunc(value)}>
          {constantData.weapons[constantData.weaponNames[value]].name}
        </h2>
      )
    } else {
      return (
        <h3 onClick={() => setVarFunc(value)}>
          {constantData.weapons[constantData.weaponNames[value]].name}
        </h3>
      )
    }
    // return (<h2>Error</h2>)
  }
  function Play () {
    function handlePlay () {
      localStorage.setItem("loadout", JSON.stringify({
        weapon: constantData.weaponNames[weapon],armor,secondary: constantData.weaponNames[sec]
      }));
      
    }
    return (
      <>
        <div className="section">
          <button onClick={handlePlay}>save</button>
          <a href="/play">play</a>
        </div>
      </>
    )
  }
  // let w = [];
  // for (const key in constantData.weapons) {
  //   if (Object.hasOwnProperty.call(constantData.weapons, key)) {
  //     const element = constantData.weapons[key];
  //     w.push({
  //       name:element.name,
  //       description:element.description
  //     })
  //   }
  // }
  return (
    <>
      <div className='lists'>
        <div className='armors list'>
          <h1>Armor</h1>
          {constantData.armors.map((a,i)=>{ 
            return (
            <Ar key={i}varToWatch={armor} setVarFunc={setArmor} value={i}/>
          );}
          )}
        </div>
        <div className='weapons list'>
          <h1>Weapon</h1>
          {constantData.weaponNames.map((a,i)=>{ 
            console.log(i);
            return (
            <Zz key={i} varToWatch={weapon} setVarFunc={setWeapon} value={i}/>
          );}
          )}
        </div>
        <div className='secs list'>
          <h1>Secondary</h1>
          <Zz varToWatch={sec} setVarFunc={setSec} value={0}/>
          <Zz varToWatch={sec} setVarFunc={setSec} value={1}/>
          <Zz varToWatch={sec} setVarFunc={setSec} value={2}/>
          <Zz varToWatch={sec} setVarFunc={setSec} value={3}/>
          <Zz varToWatch={sec} setVarFunc={setSec} value={4}/>
          <Zz varToWatch={sec} setVarFunc={setSec} value={5}/>
        </div>
      </div>
      <h1>Descriptions</h1>
      <div className="tsection">
        <h1>Armor</h1>
        <h2>{(constantData.armors[armor].name)}</h2>
        <br />
        <p className='desc'>{constantData.armors[armor].description}</p>
      </div>
      <div className="tsection">
        <h1>Weapon</h1>
        <h2>{(constantData.weapons[constantData.weaponNames[weapon]].name)}</h2>
        <br />
        <p className='desc'>{constantData.weapons[constantData.weaponNames[weapon]].description}</p>
        <p className="desc">Must prepare: {constantData.weapons[constantData.weaponNames[weapon]].guardbefore?"Yes":"No"}</p>
        <p className="desc">Uses Ammo: {constantData.weapons[constantData.weaponNames[weapon]].showAmmo?"Yes":"No"}</p>
      </div>
      <div className="tsection">
        <h1>Secondary</h1>
        <h2>{(constantData.weapons[constantData.weaponNames[sec]].name)}</h2>
        <br />
        <p className='desc'>{constantData.weapons[constantData.weaponNames[sec]].description}</p>
        <p className="desc">Must prepare: {constantData.weapons[constantData.weaponNames[sec]].guardbefore?"Yes":"No"}</p>
        <p className="desc">Uses Ammo: {constantData.weapons[constantData.weaponNames[sec]].showAmmo?"Yes":"No"}</p>
      </div>
      <Play/>
    </>
  )
}

export default App
