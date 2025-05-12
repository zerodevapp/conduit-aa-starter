# Conduit AA Starter

This repo demonstrates how to send smart account transactions (aka "UserOps") on your Conduit rollup.  We assume that you have installed the [Conduit AA stack](https://docs.conduit.xyz/account-abstraction/overview) which consists of a Conduit bundler and the [ZeroDev](https://docs.zerodev.app/) smart account SDK.

## Getting started

### Set up .env

Clone this repo, then create a `.env` with the following values:

```env
AA_RPC=
NODE_RPC=
CHAIN_ID=
```

You can obtain the AA RPC from your [Conduit AA dashboard](https://app.conduit.xyz/aa), and the node RPC and chain ID from your Conduit rollup page.

### Install dependencies

```bash
npm i
```

### Run the example

Now you can run the example script to send a gasless transaction:

```bash
npx ts-node main.ts
```

## Next steps

Check out the [ZeroDev docs](https://docs.zerodev.app/) to learn all the amazing things you can do with smart accounts, including gas sponsorship, transaction batching, transaction automation, and chain abstraction!