# Step 1: Proxy contract
# AdminUpgradeabilityProxy should be verified manually using a flatten verion of source code:
# (FlattenedAdminUpgradeabilityProxy.sol)
# REF: https://forum.openzeppelin.com/t/verify-upgrades-plugins-proxy-on-etherscan/3920
# REF: https://forum.openzeppelin.com/t/generate-flattened-version-of-adminupgradeabilityproxy-sol

# Step 2: Implementation contract
truffle run verify WRNRewardPool@0x41b0de019efd5ec9c5393954f66b034e19b63341 --network bsctest
truffle run verify ERC20Token@0xe888dF124ed4f0087aBE673Be48F538072c48565 --network bsctest

# -> Lock-up Contract: 0xB84Accc7376171AA6e9a03Bf1Cc9eb76A889Ce1B
# -> WRN: 0xDD42F573125b920b25769B903D4d2C831BD46340

# Step 3: Connect
# Connect the proxy contract to the implementation contract on Etherscan interface:
# (Contract -> More Options -> Is this a proxy?)