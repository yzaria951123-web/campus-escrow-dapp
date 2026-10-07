# Campus Escrow DApp

A decentralized escrow for second-hand trades on **Ethereum Sepolia**. The buyer's payment is locked in a smart contract and only released to the seller after the buyer confirms receipt.

- **Contract address:** `0x8aB8aff56f55263F10c5d9e7c198B9712cC8a26A`
- **Etherscan:** https://sepolia.etherscan.io/address/0x8aB8aff56f55263F10c5d9e7c198B9712cC8a26A

## Why blockchain?

In second-hand trading, neither side wants to go first: buyers fear paying and receiving nothing, sellers fear shipping and not being paid. Normally a platform acts as the trusted middleman. Here the smart contract plays that role: the rules are public, enforced by code, and nobody (not even the developer) can move locked funds outside those rules.

## How it works

```
Listed --buyItem--> Paid --confirmReceipt--> Completed
  |                   |
  | cancelItem        | refund (after timeout)
  v                   v
Cancelled          Refunded
```

| Function | Who | What it does |
|---|---|---|
| `listItem(name, price)` | Seller | Creates a listing |
| `buyItem(id)` | Buyer | Pays the exact price; funds are locked in the contract |
| `confirmReceipt(id)` | Buyer | Releases funds to the seller |
| `cancelItem(id)` | Seller | Cancels an unsold listing |
| `refund(id)` | Buyer | Reclaims funds if the seller/buyer flow stalls past `REFUND_TIMEOUT` |
| `getItem(id)`, `getItemCount()` | Anyone | Read-only queries (no gas) |

## What is stored on-chain

Seller and buyer addresses, item name, price, payment timestamp, and status, plus event logs for every action. Images and long descriptions are intentionally **not** stored on-chain because on-chain storage is expensive.

## Design decisions

- **State machine:** `require` checks on status prevent double payment or double release.
- **Checks-effects-interactions:** state is updated before ETH is transferred, to prevent reentrancy.
- **Exact payment:** `msg.value == price` avoids over/under payment.
- **Role checks:** only the buyer can confirm/refund, only the seller can cancel.

## Run locally

1. Install [MetaMask](https://metamask.io) and switch to the **Sepolia** test network.
2. Get Sepolia ETH from a faucet. You need **two accounts** (one seller, one buyer).
3. Open `frontend/index.html` through a local server (VS Code Live Server, or `npx serve frontend`). Do not open it via `file://`.
4. Click **Connect Wallet** and use the app.

## Deploy your own copy

1. Open [Remix](https://remix.ethereum.org) and paste `contracts/CampusEscrow.sol`.
2. Compile with Solidity 0.8.20+.
3. Deploy with **Injected Provider - MetaMask** on Sepolia.
4. Put the deployed address in `CONTRACT_ADDRESS` in `frontend/index.html`.

## Limitations and future work

- The contract cannot verify the physical delivery of goods. A dishonest buyer can delay confirmation until the timeout, and a seller can send a wrong item. Future work: arbitrator role or multisig dispute resolution.
- No images/descriptions (could be stored on IPFS with the hash on-chain).
- Every action costs gas, and the deployed contract is not upgradeable without a proxy pattern.

## Screenshots

_Add 1–2 screenshots of the working DApp here._


