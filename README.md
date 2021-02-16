# Neverlose.money - Gamified HODL Protocol
Neverlose.money is a gamified DeFi protocol on Binance Smart Chain (BSC) that pays a bonus to long-term investors, known as HODLers, using the penalty charge paid by users who fail to HODL.

- 🌐 Site - http://bsc-testnet.neverlose.money/
- 📜 Contract - [0xB84Accc7376171AA6e9a03Bf1Cc9eb76A889Ce1B](https://testnet.bscscan.com/address/0xB84Accc7376171AA6e9a03Bf1Cc9eb76A889Ce1B)

## Why HODL Protocol?
> "If you aren’t willing to own a stock for ten years, don’t even think about owning it for ten minutes."\
>\- Warren Buffet -

![](https://rukminim1.flixcart.com/image/832/832/j6v2ky80/poster/s/r/h/small-warren-buffett-motivational-quotes-value-investing-rule-no-original-imaex8tz68kyz2hf.jpeg)

Source: https://youtu.be/vCpT-UmVf3g

Neverlose.money is designed for crypto investors who want to invest like Warren Buffett. Long-term investment in the crypto market is far more difficult than the stock market as you will have to withstand more ups and downs. We have designed the perfect social HODL protocol on Binance Smart Chain that lets anyone invest in crypto assets like Warren Buffett, the master of value investing.

## How it works
1) You can lock-up your crypto for a set duration (from 3 months to 10 years).
2) While you continue your lock-up, you will get bonuses whenever other users fail to HODL according to their own lock-up terms.
3) You can withdraw your fund anytime you want, but you will get charged a 10% penalty + a 3% treasury charge if you break the lock-up and withdraw the fund within your lock-up period (the penalty is distributed to others as bonuses).

## Contracts
### LockUpPool.sol
A lock-up smart contract that pays bonus to the winners with the losers' penalty when they break lock-up prematurely.

### WRNRewardPool.sol
A governance token distribution contract on top of LockUpPool. A maximum of 1.2M WRN tokens will be distributed for 4 years depending on users' contribution to the lockup pool

#### Boost Factor
1. Token Amount: Linear
2. Lock-up period: 1x (3 months) - 40x (10 years)
3. Pool multiplier: 2x (BNB), 1x (ETH), 1x (BTCB)

## Contract addresses (BSC Testnet)
- Lock-up contract: [0xB84Accc7376171AA6e9a03Bf1Cc9eb76A889Ce1B](https://testnet.bscscan.com/address/0xB84Accc7376171AA6e9a03Bf1Cc9eb76A889Ce1B)
  - Reward starting block: [6,363,071](https://testnet.bscscan.com/block/countdown/6363071)
- Warren (WRN) token: [0x9784dEdfB7d0F7Fbb98FA748B650908220971c4e](https://testnet.bscscan.com/address/0x9784dEdfB7d0F7Fbb98FA748B650908220971c4e)

### Test tokens
- Wrapped BNB: [0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F](https://testnet.bscscan.com/address/0x094616F0BdFB0b526bD735Bf66Eca0Ad254ca81F)
- ETH: [0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378](https://testnet.bscscan.com/address/0xd66c6B4F0be8CE5b39D52E0Fd1344c389929B378)
- BTCB: [0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8](https://testnet.bscscan.com/address/0x6ce8dA28E2f864420840cF74474eFf5fD80E65B8)

## Gas consumption
```
·------------------------------------------------|---------------------------|--------------|----------------------------·
|      Solc version: 0.7.1+commit.f4a555be       ·  Optimizer enabled: true  ·  Runs: 1500  ·  Block limit: 6718946 gas  │
·················································|···························|··············|·····························
|  Methods                                       ·               20 gwei/gas                ·       129.42 usd/bnb       │
························|························|·············|·············|··············|··············|··············
|  Contract             ·  Method                ·  Min        ·  Max        ·  Avg         ·  # calls     ·  usd (avg)  │
························|························|·············|·············|··············|··············|··············
|  ERC20Token           ·  addMinter             ·      72827  ·      75612  ·       73164  ·          34  ·       0.19  │
························|························|·············|·············|··············|··············|··············
|  ERC20Token           ·  approve               ·      29070  ·      46897  ·       43989  ·         134  ·       0.11  │
························|························|·············|·············|··············|··············|··············
|  ERC20Token           ·  initialize            ·     324430  ·     369343  ·      356465  ·         105  ·       0.92  │
························|························|·············|·············|··············|··············|··············
|  ERC20Token           ·  mint                  ·          -  ·          -  ·       52871  ·          51  ·       0.14  │
························|························|·············|·············|··············|··············|··············
|  ERC20Token           ·  transfer              ·      37081  ·      52141  ·       50769  ·          22  ·       0.13  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  addLockUpPool         ·      71238  ·      86334  ·       84750  ·          38  ·       0.22  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  claimBonus            ·      26611  ·     105174  ·       63990  ·           3  ·       0.16  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  doLockUp              ·     184167  ·     349118  ·      299673  ·          53  ·       0.77  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  exit                  ·      58231  ·     206998  ·      134236  ·          31  ·       0.35  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  initialize            ·          -  ·          -  ·      155530  ·          32  ·       0.40  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  setEmergencyMode      ·          -  ·          -  ·       43203  ·           4  ·       0.11  │
························|························|·············|·············|··············|··············|··············
|  LockUpPool           ·  updateMaxLimit        ·      28764  ·      28836  ·       28800  ·           2  ·       0.07  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  addLockUpRewardPool   ·     100295  ·     223556  ·      133169  ·          41  ·       0.34  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  claimWRN              ·     146800  ·     202600  ·      184000  ·           6  ·       0.47  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  claimWRNandBonus      ·          -  ·          -  ·      200350  ·           1  ·       0.52  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  doLockUp              ·     303650  ·     421525  ·      390216  ·          32  ·       1.00  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  exit                  ·     159128  ·     290372  ·      250187  ·           8  ·       0.65  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  initialize            ·     280156  ·     280276  ·      280201  ·          30  ·       0.72  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  setEmergencyMode      ·          -  ·          -  ·       43181  ·           1  ·       0.11  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPool        ·  updatePoolMultiplier  ·          -  ·          -  ·      222725  ·           1  ·       0.57  │
························|························|·············|·············|··············|··············|··············
|  WRNRewardPoolV2Test  ·  setVarAdded           ·          -  ·          -  ·       44247  ·           2  ·       0.11  │
························|························|·············|·············|··············|··············|··············
|  Deployments                                   ·                                          ·  % of limit  ·             │
·················································|·············|·············|··············|··············|··············
|  ERC20Token                                    ·          -  ·          -  ·     1926451  ·      28.7 %  ·       4.98  │
·················································|·············|·············|··············|··············|··············
|  LockUpPool                                    ·          -  ·          -  ·     1924387  ·      28.6 %  ·       4.98  │
·················································|·············|·············|··············|··············|··············
|  WRNRewardPool                                 ·          -  ·          -  ·     2636267  ·      39.2 %  ·       6.82  │
·················································|·············|·············|··············|··············|··············
```
