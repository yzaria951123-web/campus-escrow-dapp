# PawCraft Studio 🐾

**Create Your Dream Virtual Pet.**

A bilingual (English / Chinese) virtual pet art commission **DApp demo** using a previously deployed Solidity escrow contract on **Ethereum Sepolia**. This is a course project using **test ETH**, not real payments or NFTs.

## How it works

1. Browse the **Gallery** (inspiration samples only).
2. Prepare a customization brief using the **Customize** form. Copy it and discuss artwork, pricing, and delivery details with the studio **off-chain**, e.g. via Discord.
3. The studio uses **Create a commission** to call `listItem(name, price)`.
4. The customer checks the **seller wallet address**, commission ID and amount before clicking **Pay & lock ETH** (`buyItem`), which locks test ETH in the contract.
5. The studio delivers artwork outside the blockchain.
6. The buyer clicks **Confirm artwork received** (`confirmReceipt`), releasing escrow to the seller.

**Important:** The deployed contract does not restrict who may create an order or who may purchase an available order. The interface labels a seller as “studio” in its business scenario, but any wallet can list. It cannot verify delivery or artwork quality. Do **not** treat a listing as reserved for one buyer.

## Files

- `index.html` — page content and interface
- `style.css` — responsive design
- `script.js` — gallery, bilingual UI, form, MetaMask and Sepolia interactions
- `CampusEscrow.sol` — original contract source, not redeployed

## Setup

1. Keep these four files in the same folder.
2. Open through a local HTTP server (recommended): `python3 -m http.server 8000` and navigate to `http://localhost:8000`.
3. Install MetaMask, select Ethereum **Sepolia** and obtain **Sepolia test ETH** for gas and payments.
4. Open the site and click **Connect Wallet**.
5. To use a studio Discord link, set `DISCORD_URL` near the top of `script.js`. If not configured, the UI shows a clear notice instead of a fake URL.
6. For hosting, upload the files to GitHub and enable GitHub Pages in **Settings → Pages**.

The page uses Ethers.js 6 from jsDelivr, so an internet connection is required. It relies on a browser-injected wallet for RPC access and does not ask for private keys.

## Contract

**Network:** Ethereum Sepolia (chain ID `11155111`, hex `0xaa36a7`)

**Address:** `0x8aB8aff56f55263F10c5d9e7c198B9712cC8a26A`

[View on Sepolia Etherscan](https://sepolia.etherscan.io/address/0x8aB8aff56f55263F10c5d9e7c198B9712cC8a26A)

| Contract function | Interface label | Access / requirement |
|---|---|---|
| `listItem(name, price)` | Create on Sepolia | Any wallet; name not empty and price > 0 |
| `buyItem(id)` | Pay & lock ETH | Any wallet except listing seller; listing available; exact ETH amount |
| `confirmReceipt(id)` | Confirm artwork received | Buyer only, order paid |
| `cancelItem(id)` | Cancel listing | Seller only, before purchase |
| `refund(id)` | Request refund | Buyer only, paid at least **7 days** ago |
| `getItemCount()` | Number of commissions | Public read |
| `getItem(id)` | Commission details | Public read |

Order statuses: `0=Listed`, `1=Paid`, `2=Completed`, `3=Cancelled`, `4=Refunded`.

On-chain fields: seller, buyer, name, price (wei), paidAt (timestamp), and status. Gallery artwork, design briefs, chat messages and final artwork are **not** on-chain.

## Live demonstration (3 transactions)

1. **Studio wallet:** Connect, create `Magic Cat` commission at `0.001` test ETH. Confirm in MetaMask.
2. **Customer wallet:** Switch wallets, find the order and pay `0.001` test ETH. Confirm in MetaMask.
3. **Customer wallet:** After simulating off-chain delivery, confirm artwork received. Show the completed status and Etherscan transaction details.

Transactions depend on Sepolia availability and confirmations. Prepare two test wallets with sufficient test ETH in advance. Do not demonstrate with real funds.

## Known limitations

- Commission briefs are generated locally in the browser and not saved or sent automatically.
- Discord is not configured until a real URL is supplied.
- The contract cannot reserve orders for a specific buyer or confirm artwork quality.
- No on-chain NFT ownership, file storage, dispute resolution, or artwork delivery verification.
- Refunds become eligible **7 days after payment**, not immediately.
- All listings are public and may come from any wallet: always verify the seller address before paying.
- Contract source and address are preserved from the original Campus Escrow project. The front-end rebranding does not change deployed contract behavior.

## Project status

**PawCraft v1.0 frontend source produced; live Sepolia transactions have not been verified as part of this delivery.** Test the wallet and transaction flow before presentation or deployment.
