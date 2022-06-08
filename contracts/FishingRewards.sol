 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
interface IFishingRewards {
    function safeMintFishingReward(address to) external;
}


contract nftCaller {
   address mintContract;
    IFishingRewards frRewards = IFishingRewards (mintContract);


    constructor(address _mintContract) {
        mintContract = _mintContract;
    }


    function callSafeMint() public{
        frRewards.safeMintFishingReward(msg.sender);
    }

}