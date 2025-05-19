# Meta-Transactions & Paymasters Explained

Below is a complete overview of how handleOps-based meta-transactions work, why your gas gets paid by a relayer, and how they recoup their costs.

---

## 1. What is a Meta-Transaction?

A **meta-transaction** lets a user authorize a blockchain call (e.g., `donateToCampaign`) off-chain by signing a payload. A separate party (the **relayer** or **paymaster**) then submits that signed payload on-chain, paying the gas fee.

Key benefits:

* **Gasless UX**: Users never need ETH to send transactions.
* **Flexible fee models**: Apps can sponsor users, bill off-chain, or use token-based reimbursements.

---

## 2. handleOps & EntryPoint

* **EntryPoint Contract**: A central contract (EIP-4337) deployed at a known address (e.g., `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789` on Sepolia).
* **handleOps**: The EntryPoint function that accepts an array of ops (each containing `sender`, `callData`, gas limits, signature, etc.) and executes them.

Flow:

1. **User EOA** (e.g., `0x136cCe199B895a15Eb0f800aA0aA3E2ECd2781af`) signs a `UserOperation`.
2. The signed op includes **smart wallet** as sender (e.g., `0x5b79864Cf0Bc67f6f56e453249C262a857D11c3B`).
3. A **bundler/relayer** picks up the op and calls `EntryPoint.handleOps([yourOp], paymaster)` on-chain.
4. EntryPoint validates signature, funds, and paymaster data, then internally calls your target Crowdfunding contract.

---

## 3. Why Does Someone Pay Your Fee?

Relayers/paymasters front the ETH gas to execute your transaction. They do this because:

* **Off-chain Billing**: Your dApp has a prepaid account or ledger with the paymaster.
* **Token Reimbursement**: After execution, the paymaster contract collects tokens from your wallet (you pre-approved) equal to gas cost + fee.
* **Sponsorship**: Projects subsidize user gas to boost onboarding (marketing expense).

---

## 4. How Are They Reimbursed?

1. **Off-chain invoicing**: Paymaster bills the dApp team for all sponsored gas.
2. **On-chain refund**: The paymaster contract performs a follow-up token transfer from your smart wallet, covering gas+markup.
3. **Bundler Fees**: A small markup (e.g., 10%) over raw gas is automatically collected.

---

## 5. Why Transactions Appear in Internal Txs

* **Top-level tx**: Goes to EntryPoint (so shown under `Transactions` on the EntryPoint contract page).
* **Internal tx**: The EntryPoint’s call to your Crowdfunding contract is logged as an *internal transaction*—visible under the `Internal Txns` tab or in the logs.

---

> **TL;DR**: `handleOps` is part of EIP-4337's EntryPoint that lets relayers bundle & pay for user-signed ops. They recoup costs via off-chain billing, token refunds, or sponsorship, and your Crowdfunding contract call shows up as an internal transaction because EntryPoint is the on-chain entry point.
