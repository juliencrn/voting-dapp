<div align="center">
<h1>Voting Dapp</h1>

A basic voting dapp (decentralized application) written in Solidity & React.

<!-- &mdash; [usehooks-typescript.com](https://usehooks-typescript.com/) &mdash; -->

<!-- Badges -->

<!-- [![Netlify Status](https://api.netlify.com/api/v1/badges/f1f0f5a4-8207-499b-b912-d99acb04176e/deploy-status)](https://app.netlify.com/sites/usehooks-ts/deploys)
[![License](https://badgen.net/badge/License/MIT/blue)](https://github.com/juliencrn/usehooks.ts/blob/master/LICENSE) -->

</div>

After have followed this [tutorial](https://www.youtube.com/watch?v=3681ZYbDSSk) on Youtube from [Dapp University](https://www.youtube.com/channel/UCY0xL8V6NzzFcwzHCgB8orQ), I built this voting app from scratch with React as the frontend.

## Get started

Requires
- NodeJS
- npm
- git
- truffle (dapp EVM framework)
- Ganache (local blockchain)

Download the repo:
```sh
git clone https://github.com/juliencrn/voting-dapp
cd voting-dapp
```

Then start the **Ganache** blockchain. I use the default macOS client on the default port (`7545`), but you can also use `ganache-cli` and change port in the `truffle-config.js` file.

Launch Truffle in console mode, and deploy contract:
```sh
truffle console

# type the following inside the truffle console
# truffle(development)>
> test
> migrate --reset
