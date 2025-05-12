import "dotenv/config"
import {
  createKernelAccount,
  createZeroDevPaymasterClient,
  createKernelAccountClient,
} from "@zerodev/sdk"
import { signerToEcdsaValidator } from "@zerodev/ecdsa-validator"
import { http, createPublicClient, zeroAddress, defineChain } from "viem"
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts"
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants"

if (
  !process.env.AA_RPC ||
  !process.env.NODE_RPC ||
  !process.env.CHAIN_ID
) {
  throw new Error("AA_RPC or NODE_RPC is not set")
}

export const chain = defineChain({
  id: Number(process.env.CHAIN_ID),
  name: 'Your Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [process.env.NODE_RPC],
    },
  },
})

const publicClient = createPublicClient({
  transport: http(process.env.NODE_RPC),
  chain,
})

const signer = privateKeyToAccount(generatePrivateKey())
const entryPoint = getEntryPoint('0.7')
const kernelVersion = KERNEL_V3_1

const main = async () => {
  const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
    signer,
    entryPoint,
    kernelVersion,
  })

  const account = await createKernelAccount(publicClient, {
    plugins: {
      sudo: ecdsaValidator,
    },
    entryPoint,
    kernelVersion,
  })
  console.log("My account:", account.address)

  const paymasterClient = createZeroDevPaymasterClient({
    chain,
    transport: http(process.env.AA_RPC),
  })

  const kernelClient = createKernelAccountClient({
    account,
    chain,
    bundlerTransport: http(process.env.AA_RPC),
    client: publicClient,
    paymaster: {
      getPaymasterData: (userOperation) => {
        return paymasterClient.sponsorUserOperation({
          userOperation,
        })
      }
    }
  })

  const userOpHash = await kernelClient.sendUserOperation({
    callData: await account.encodeCalls([
      {
        to: zeroAddress,
        value: BigInt(0),
        data: "0x",
      },
    ]),
  })

  console.log("userOp hash:", userOpHash)

  const _receipt = await kernelClient.waitForUserOperationReceipt({
    hash: userOpHash,
  })
  console.log('bundle txn hash: ', _receipt.receipt.transactionHash)

  console.log("userOp completed")

  process.exit(0);
}

main()
