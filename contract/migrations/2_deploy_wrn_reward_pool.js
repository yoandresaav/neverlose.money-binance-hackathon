module.exports = async function (deployer, network, [creator]) {
  if (network === 'test') return;

  const ERC20Token = artifacts.require('ERC20Token');
  const WRNRewardPool = artifacts.require('WRNRewardPool');
  const { toBN } = require('../test/helpers/NumberHelpers');

  // REF: https://docs.openzeppelin.com/upgrades-plugins/1.x/truffle-upgrades
  const { deployProxy } = require('@openzeppelin/truffle-upgrades');
  if (network === 'bsctest') {
    const WBNB_ADDRESS = '0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F';
    const ETH_ADDRESS = '0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378';
    const BTCB_ADDRESS = '0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8';

    // Estimated target: Thu Feb 17 2021 19:20:00 GMT+0900
    const REWARD_START_BLOCK = 6334271 + (86400/3);

    const wrnToken = await deployProxy(ERC20Token, ['Warren', 'WRN', 18, 0], { deployer, unsafeAllowCustomTypes: true });

    // NOTE: Ethereum block time is calculated as 13 seconds, whereas BNB blocktime is 3 seconds
    // Let's make the calculation as 4x blocks & 1/4 WRN per block (0.025)
    const wrnRewardPool = await deployProxy(WRNRewardPool, [wrnToken.address, REWARD_START_BLOCK, 8800000*4, 500000*4, '25000000000000000'], { deployer, unsafeAllowCustomTypes: true });
    await wrnToken.addMinter(wrnRewardPool.address, { from: creator });

    // Almost No-Limit on lock-up
    await wrnRewardPool.addLockUpRewardPool(WBNB_ADDRESS, 2, toBN(10000000), false); // ~5% of total BNB = $1.3B
    await wrnRewardPool.addLockUpRewardPool(ETH_ADDRESS, 1, toBN(1000000), false); // ~1% of total ETH = $460M
    await wrnRewardPool.addLockUpRewardPool(BTCB_ADDRESS, 1, toBN(100000, 8), false); // ~0.5% of total BTC = $1,622M

    await wrnRewardPool.setFundAddress(creator); // Set fund address as the msg.sender

    console.log(`-> Lock-up Contract: ${wrnRewardPool.address}`);
    console.log(`-> WRN: ${wrnToken.address}`);
    console.log(`- Owner: ${await wrnRewardPool.owner()} / Fund: ${await wrnRewardPool.fundAddress()}`);
    console.log(`- Sum of reward pool multiplers: ${await wrnRewardPool.totalMultiplier()}`);
  }
}
