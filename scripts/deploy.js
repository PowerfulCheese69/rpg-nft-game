const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
      ["ChiRho", "D.V.", "CCrypt"],       // Names
      ["https://i.imgur.com/dYHQzeo.png", // Images
      "https://i.imgur.com/kSLFDBd.gif", 
      "https://i.imgur.com/hfLC3A8.png"],
      [69, 69, 69],                    // HP values
      [1, 1, 1],                        // Att values
      [1,1,1],                          // Fishing values
      [1,1,1],                          // Woodcutting values
      [1,1,1],                          // Mining values
      [1,1,1]                        // Smithing values               
    );
    
    await gameContract.deployed();

    let txn;
  


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