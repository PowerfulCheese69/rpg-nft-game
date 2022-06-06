// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";
import "./libraries/Base64.sol"; // Helper we wrote to encode in Base64

// Our contract inherits from ERC721, which is the standard NFT contract!
contract MyEpicGame is ERC721 {
  struct CharacterAttributes {
    uint256 characterIndex;
    string name;
    string imageURI;
    uint256 hp;
    uint256 maxHp;
    uint256 attackDamage;
    uint256 fishing;
    uint256 woodcutting;
    uint256 mining;
    uint256 smithing;
  }

  // The tokenId is the NFTs unique identifier, it's just a number that goes
  // 0, 1, 2, 3, etc.
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  CharacterAttributes[] defaultCharacters;
  // We create a mapping from the nft's tokenId => that NFTs attributes.
  mapping(uint256 => CharacterAttributes) public nftHolderAttributes;
  // A mapping from an address => the NFTs tokenId. Gives me an ez way
  // to store the owner of the NFT and reference it later.
  mapping(address => uint256) public nftHolders;

  event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
  event FishingLvlUp(uint256 oldFishingLvl, uint256 newFishingLvl);
  event WoodCuttingLvlUp(uint256 oldWoodcuttingLvl, uint256 newWoodcuttingLvl);
  event MiningLvlUp(uint256 oldMiningLvl, uint256 newMiningLvl);
  event SmithingLvlUp(uint256 oldSmithingLvl, uint256 newSmithingLvl);

  constructor(
    string[] memory characterNames,
    string[] memory characterImageURIs,
    uint256[] memory characterHp,
    uint256[] memory characterAttackDmg,
    uint256[] memory characterFishingLvl,
    uint256[] memory characterWoodcuttingLvl,
    uint256[] memory characterMiningLvl,
    uint256[] memory characterSmithingLvl
  )
    // Below, you can also see I added some special identifier symbols for our NFT.
    // This is the name and symbol for our token, ex Ethereum and ETH. I just call mine
    // Heroes and HERO. Remember, an NFT is just a token!
    ERC721("Heroes", "HERO")
{
    for (uint256 i = 0; i < characterNames.length; i += 1) {
      defaultCharacters.push(
        CharacterAttributes({
          characterIndex: i,
          name: characterNames[i],
          imageURI: characterImageURIs[i],
          hp: characterHp[i],
          maxHp: characterHp[i],
          attackDamage: characterAttackDmg[i],
          fishing: characterFishingLvl[i],
          woodcutting: characterWoodcuttingLvl[i],
          mining: characterMiningLvl[i],
          smithing: characterSmithingLvl[i]
        })
      );

      CharacterAttributes memory c = defaultCharacters[i];

      // Hardhat's use of console.log() allows up to 4 parameters in any order of following types: uint, string, bool, address
      console.log("Done initializing %s w/ HP %s, img %s", c.name, c.hp, c.imageURI);
    }

    // I increment tokenIds here so that my first NFT has an ID of 1.
    // More on this in the lesson!
    _tokenIds.increment();
  }

  // Users would be able to hit this function and get their NFT based on the
  // characterId they send in!
  function mintCharacterNFT(uint256 _characterIndex) external {
    // Get current tokenId (starts at 1 since we incremented in the constructor).
    uint256 newItemId = _tokenIds.current();
    // The magical function! Assigns the tokenId to the caller's wallet address.
    _safeMint(msg.sender, newItemId);
    // We map the tokenId => their character attributes. More on this in
    // the lesson below.
    nftHolderAttributes[newItemId] = CharacterAttributes({
      characterIndex: _characterIndex,
      name: defaultCharacters[_characterIndex].name,
      imageURI: defaultCharacters[_characterIndex].imageURI,
      hp: defaultCharacters[_characterIndex].hp,
      maxHp: defaultCharacters[_characterIndex].hp,
      attackDamage: defaultCharacters[_characterIndex].attackDamage,
      fishing: defaultCharacters[_characterIndex].fishing,
      woodcutting: defaultCharacters[_characterIndex].woodcutting,
      mining: defaultCharacters[_characterIndex].mining,
      smithing: defaultCharacters[_characterIndex].smithing
    });
    console.log("Minted NFT w/ tokenId %s and characterIndex %s", newItemId, _characterIndex);

    // Keep an easy way to see who owns what NFT.
    nftHolders[msg.sender] = newItemId;
    // Increment the tokenId for the next person that uses it.
    _tokenIds.increment();
    emit CharacterNFTMinted(msg.sender, newItemId, _characterIndex);
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    CharacterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

    string memory strHp = Strings.toString(charAttributes.hp);
    string memory strMaxHp = Strings.toString(charAttributes.maxHp);
    string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);
    string memory strFishing = Strings.toString(charAttributes.fishing);
    string memory strWoodcutting = Strings.toString(charAttributes.woodcutting);
    string memory strMining = Strings.toString(charAttributes.mining);
    string memory strSmithing = Strings.toString(charAttributes.smithing);

    string memory json = Base64.encode(
      bytes(
        string(
          abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            " -- NFT #: ",
            Strings.toString(_tokenId),
            '", "description": "This is an NFT that lets people play in epic RPG NFT game", "image": "',
            charAttributes.imageURI,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',
            strHp,
            ', "max_value":',
            strMaxHp,
            '}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,
            '}, { "trait_type": "Fishing Level", "value": ',
            strFishing,
            '}, { "trait_type": "Woodcutting Level", "value": ',
            strWoodcutting,
            '}, { "trait_type": "Mining Level", "value": ', 
            strMining,
            '}, { "trait_type": "Smithing Level", "value": ',
            strSmithing,
            "}]}"
          )
        )
      )
    );

    string memory output = string(abi.encodePacked("data:application/json;base64,", json));

    return output;
  }

  function checkIfUserHasNFT() public view returns (CharacterAttributes memory) {
    // Get the tokenId of the user's character NFT
    uint256 userNftTokenId = nftHolders[msg.sender];
    // If the user has a tokenId in the map, return their character.
    if (userNftTokenId > 0) {
      return nftHolderAttributes[userNftTokenId];
    }
    // Else, return an empty character.
    else {
      CharacterAttributes memory emptyStruct;
      return emptyStruct;
    }
  }

  function getAllDefaultCharacters() public view returns (CharacterAttributes[] memory) {
    return defaultCharacters;
  }

  function tryFishing() public {
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
    uint256 currentFishingLvl = player.fishing;
    uint256 newFishingLvl = currentFishingLvl+=1; 

    player.fishing = player.fishing + 1;

    emit FishingLvlUp(currentFishingLvl,newFishingLvl);

  }

    function tryWoodCutting() public {
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
    uint256 currentWoodCuttingLvl = player.woodcutting;
    uint256 newWoodCuttingLvl = currentWoodCuttingLvl+=1; 

    player.woodcutting = player.woodcutting + 1;

    emit WoodCuttingLvlUp(currentWoodCuttingLvl,newWoodCuttingLvl);

  }

    function tryMining() public {
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
    uint256 currentMiningLvl = player.mining;
    uint256 newMiningLvl = currentMiningLvl+=1; 

    player.mining = player.mining + 1;

    emit MiningLvlUp(currentMiningLvl,newMiningLvl);

  }

    function trySmithing() public {
    uint256 nftTokenIdOfPlayer = nftHolders[msg.sender];
    CharacterAttributes storage player = nftHolderAttributes[nftTokenIdOfPlayer];
    uint256 currentSmithingLvl = player.smithing;
    uint256 newSmithingLvl = currentSmithingLvl+=1; 

    player.smithing = player.smithing + 1;

    emit SmithingLvlUp(currentSmithingLvl,newSmithingLvl);

  }

}