# Step 1: Proxy contract
# AdminUpgradeabilityProxy should be verified manually using a flatten verion of source code:
# (FlattenedAdminUpgradeabilityProxy.sol)
# REF: https://forum.openzeppelin.com/t/verify-upgrades-plugins-proxy-on-etherscan/3920
# REF: https://forum.openzeppelin.com/t/generate-flattened-version-of-adminupgradeabilityproxy-sol

# Step 2: Implementation contract
truffle run verify WRNRewardPool@0x41b0de019efd5ec9c5393954f66b034e19b63341 --network bsctest
truffle run verify ERC20Token@0xe888dF124ed4f0087aBE673Be48F538072c48565 --network bsctest

# -> Lock-up Contract: 0xBeBa0bD880889570844A6aE756408759BF19e31d
# -> WRN: 0x9784dEdfB7d0F7Fbb98FA748B650908220971c4e

# Step 3: Connect
# Connect the proxy contract to the implementation contract on Etherscan interface:
# (Contract -> More Options -> Is this a proxy?)