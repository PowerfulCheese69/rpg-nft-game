const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
      ["Apple", "Orange", "Peach"],       // Names
      ["https://i.imgur.com/XgHOt4Z.jpeg", // Images
      "https://i.imgur.com/DNBm8an.jpeg", 
      "https://i.imgur.com/elGdZLf.jpeg"],
      [69, 69, 69],                    // HP values
      [1, 1, 1],
      "Elon Musk",
      "https://i.imgur.com/AksR0tt.png",
      10000,
      1                       
    );
    
    await gameContract.deployed();

    let txn;
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();
  
    txn = await gameContract.attackBoss();
    await txn.wait();

    txn = await gameContract.attackBoss();
    await txn.wait();


    console.log("Contract deployed to:", gameContract.address);
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();

    // Get the value of the NFT's URI.
    let returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);
    };

  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };

  runMain();