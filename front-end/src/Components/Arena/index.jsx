import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, transformCharacterData } from '../../constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';
import LoadingIndicator from "../../Components/LoadingIndicator";

/*
 * We pass in our characterNFT metadata so we can show a cool card in our UI
 */
const Arena = ({ characterNFT }) => {
  // State
  const [gameContract, setGameContract] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [fishingSkill, setFishingSkill] = useState(false);
  const [woodcuttingSkill, setWoodcuttingSkill] = useState(false);
  const [miningSkill, setMiningSkill] = useState(false);
  const [smithingSkill, setSmithingSkill] = useState(false);

  const tryFishing = async () => {
  try {
    if (gameContract) {
      setFishingSkill(true);
      console.log('Fishing in progress...');
      const fishingTxn = await gameContract.tryFishing();
      await fishingTxn.wait();
      console.log('fishingTxn:', fishingTxn);
      setFishingSkill(false);
    }
  } catch (error) {
    console.warn('FishingAction Error:', error);
    setFishingSkill(false);
  }
};

  const tryWoodcutting = async () => {
  try {
    if (gameContract) {
      setWoodcuttingSkill(true);
      console.log('Woodcutting in progress...');
      const woodcuttingTxn = await gameContract.tryWoodcutting();
      await woodcuttingTxn.wait();
      console.log('woodcuttingTxn:', woodcuttingTxn);
      setWoodcuttingSkill(false);
    }
  } catch (error) {
    console.warn('Woodcutting Error:', error);
    setWoodcuttingSkill(false);
  }
};

    const tryMining = async () => {
  try {
    if (gameContract) {
       setMiningSkill(true);
      console.log('Mining in progress...');
      const miningTxn = await gameContract.tryMining();
      await miningTxn.wait();
      console.log('miningTxn:', miningTxn);
      setMiningSkill(false);
    }
  } catch (error) {
    console.warn('Mining Error:', error);
    setMiningSkill(false);
  }
};

    const trySmithing = async () => {
  try {
    if (gameContract) {
      setSmithingSkill(true);
      console.log('Smithing in progress...');
      const smithingTxn = await gameContract.trySmithing();
      await smithingTxn.wait();
      console.log('smithingTxn:', smithingTxn);
      setSmithingSkill(false);
    }
  } catch (error) {
    console.warn('Smithing Error:', error);
    setSmithingSkill(false);
  }
};

  // UseEffects
  useEffect(() => {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );

      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

   // Render Methods
const renderSkills = () =>
    <div className="character-item">
      <div className="name-container">
      </div>
      <div>
      <button className="custom-btn btn-12"
        type="button"
        onClick={()=> tryFishing()}
      >{`Try Some 🎣`}</button>
        </div>
      {fishingSkill && (
       <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Fishing In Progress...</p>
        </div>
        <img
          src="https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/0ab4b036812305.572a1cada9fdc.gif"
          alt="Fishing indicator"
        />
      </div>
      )}
          <div><button className="custom-btn btn-12"
        type="button"
        onClick={()=> tryWoodcutting()}
      >{`Try Some 🌲🪓`}</button></div>
      {woodcuttingSkill && (
       <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Woodcutting In Progress...</p>
        </div>
        <img
          src="https://static.jam.vg/raw/2ee/41/z/17736.gif"
          alt="Woodcutting indicator"
        />
      </div>
      )}
      <div><button className="custom-btn btn-12"
        type="button"
        onClick={()=> tryMining()}
      >{`Try Some ⛏️`}</button></div>
      {miningSkill && (
       <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Mining In Progress...</p>
        </div>
        <img
          src="https://darkiemindyou.files.wordpress.com/2017/01/miner9big.gif"
          alt="Mining indicator"
        />
      </div>
      )}
      <div><button className="custom-btn btn-12"
        type="button"
        onClick={()=> trySmithing()}
      >{`Try Some Smithing`}</button></div>
      {smithingSkill && (
       <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p>Smithing In Progress...</p>
        </div>
        <img
          src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/29cb7228-cd40-43ca-b719-4aaf521a838f/ddzhzu3-99f11ea8-e7f0-48d0-8d66-0793d225f70c.gif?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI5Y2I3MjI4LWNkNDAtNDNjYS1iNzE5LTRhYWY1MjFhODM4ZlwvZGR6aHp1My05OWYxMWVhOC1lN2YwLTQ4ZDAtOGQ2Ni0wNzkzZDIyNWY3MGMuZ2lmIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.mWCwMcq3vMwpqaXxX-JfRwbuUeUJVx0LaFtOeMGi8qs"
          alt="Smithing indicator"
        />
      </div>
      )}
          {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <h2>Your Character</h2>
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="skill-bar">
                <progress value={characterNFT.fishing} max={characterNFT.fishing}/>
                <p>{`Fishing Level: ${characterNFT.fishing}`}</p>
                
              </div>
              <div className="skill-bar" id="skill-adjustment-woodcutting">
                <progress value={characterNFT.woodcutting} max={characterNFT.woodcutting}/>
                <p>{`Woodcutting Level: ${characterNFT.woodcutting}`}</p>
                
              </div>
              <div className="skill-bar"  id="skill-adjustment-mining">
                <progress value={characterNFT.mining} max={characterNFT.mining}/>
                <p>{`Mining Level: ${characterNFT.mining}`}</p>
                
              </div>
              <div className="skill-bar"  id="skill-adjustment-smithing">
                <progress value={characterNFT.smithing} max={characterNFT.smithing}/>
                <p>{`Smithing Level: ${characterNFT.smithing}`}</p>
                
              </div>
              
            </div>
            
            <div className="stats">
              <h4>{`⚔️ Attack Damage: ${characterNFT.attackDamage}`}</h4>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>

  
    

  return (
    <div className="arena-container">
      {/* Boss */}
      <div className="skill-grid">{renderSkills()}</div>

      {/* Character NFT */}

    </div>
  );
};

export default Arena;