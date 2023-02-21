const CONTRACT_ADDRESS = '0xE8216A6F9BA171d788b6F39B3437F7DB133FC497';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
    fishing: characterData.fishing.toNumber(),
    woodcutting: characterData.woodcutting.toNumber(),
    mining: characterData.mining.toNumber(),
    smithing: characterData.smithing.toNumber(),
  };
};
export { CONTRACT_ADDRESS, transformCharacterData };