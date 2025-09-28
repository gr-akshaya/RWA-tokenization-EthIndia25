
# 🏦 RWA Tokenization Platform — ERC3643 + Self Verification + USDT Purchase

A complete **Real-World Asset (RWA) tokenization smart contract** built with Solidity, using the **ERC-3643 standard** for regulated token issuance and transfer control.
This repository enables projects to **tokenize real-world assets**, manage listings, and allow **verified investors** to purchase tokens securely using **USDT**.

---

## 📁 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/gr-akshaya/RWA-tokenization-EthIndia25
cd rwa-tokenization
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Deploy Locally (Optional)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## ✨ Features

### 🔐 ERC-3643 Standard (T-REX Protocol)

This project implements the **ERC-3643** standard — a regulated security token standard — designed specifically for **Real-World Asset (RWA) tokenization**.
It ensures:

* ✅ **Identity-gated transfers** — Only verified participants can receive tokens.
* ✅ **Transfer compliance** — All transfers follow jurisdictional and age restrictions.
* ✅ **Regulated minting and burning** — Minting occurs only upon verified purchase.
* ✅ **Whitelist / KYC enforcement** — Managed via **Self Protocol** verification.

---

### 🪙 Core Capabilities

| Feature                        | Description                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Multi-Asset Listing**        | Admins can list multiple RWAs with asset ID, price, and total supply.                             |
| **USDT-Based Purchase**        | Users buy tokens by paying in **USDT**.                                                           |
| **On-Demand Minting**          | Tokens are minted and transferred to users upon successful purchase.                              |
| **Self Protocol Verification** | Users must complete a **zero-knowledge age and residency check** before they can purchase tokens. |
| **Compliance by Design**       | Integrates with `SelfVerificationRoot` for identity, age, and country gating.                     |
| **Admin Tools**                | Admin can withdraw collected USDT, pause assets, and update pricing.                              |

---

## 🔄 Purchase Flow

1. **Asset Listing:**
   Admin lists a real-world asset with parameters:

   * `assetId`
   * `pricePerToken` (in USDT)
   * `totalSupply`

2. **Self Verification:**

   * Before purchase, the user goes through a **Self Protocol** identity check.
   * Verification ensures:

     * 🧑‍⚖️ Age ≥ 18
     * 🌍 Residency in approved jurisdiction
   * All done **off-chain with zero-knowledge proofs**, then validated on-chain.

3. **Purchase Tokens:**

   * User approves the contract to spend USDT.
   * Calls `buyTokens(assetId, amount)` → contract mints tokens and sends them.

4. **Receive RWA Tokens:**

   * User now holds **ERC-3643-compliant RWA tokens** representing fractionalized ownership.

---

## 📡 Deployed Contracts

| Network        | Contract Address                    |
| -------------- | ----------------------------------- |
| **0G Mainnet** | `0xYourDeployedContractAddressHere` |

*(Replace with your real deployed address once live.)*

---

## 🧰 Tech Stack

* **Solidity (v0.8.x)** — Smart contract language
* **Hardhat** — Development & deployment environment
* **OpenZeppelin** — Secure ERC-20, AccessControl, and utility libraries
* **Self Protocol** — Identity, age, and residency verification
* **USDT (ERC-20)** — Payment method for token purchase

---

## 🔭 Future Roadmap

🚀 **Planned enhancements:**

* **0G Storage Integration:**
  All off-chain data — images, property documents, compliance files, licensing metadata — will be uploaded and pinned to **0G storage** for permanent availability.

* **Yield Computation Engine:**
  Real-time yield calculation based on uploaded metadata (rental income, performance, etc.) and smart contract-level analytics.

* **Secondary Marketplace:**
  Enable peer-to-peer trading of RWA tokens under the same ERC-3643 compliance framework.

* **Cross-chain Deployment:**
  Expand to multiple L2s and enterprise permissioned chains.

---

## 🏁 Summary

This project is a **turnkey ERC-3643-based RWA tokenization solution** that allows you to:

* ✅ Tokenize real-world assets
* ✅ Sell them to **verified** investors
* ✅ Manage compliance with **zero-knowledge identity checks**
* ✅ Accept **USDT** for purchases
* ✅ Mint tokens dynamically on purchase

It’s the perfect foundation for **real estate**, **private equity**, **debt instruments**, or any real-world asset backed token ecosystem.

---

### 📜 License

MIT License — feel free to use and modify for commercial or open-source RWA projects.

---

Would you like me to also include an **example `scripts/deploy.js`** and a **sample Hardhat test** in the README? (That makes it easier for devs to run locally 🚀)
Here’s a professional **README.md** you can use for your RWA tokenization project 👇 — you can copy-paste this directly into your repo:

---

# 🏦 RWA Tokenization Platform — ERC3643 + Self Verification + USDT Purchase

A complete **Real-World Asset (RWA) tokenization smart contract** built with Solidity, using the **ERC-3643 standard** for regulated token issuance and transfer control.
This repository enables projects to **tokenize real-world assets**, manage listings, and allow **verified investors** to purchase tokens securely using **USDT**.

---

## 📁 Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/rwa-tokenization.git
cd rwa-tokenization
```

### 2. Install Dependencies

```bash
npm install
```

or

```bash
yarn install
```

### 3. Compile Contracts

```bash
npx hardhat compile
```

### 4. Deploy Locally (Optional)

```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## ✨ Features

### 🔐 ERC-3643 Standard (T-REX Protocol)

This project implements the **ERC-3643** standard — a regulated security token standard — designed specifically for **Real-World Asset (RWA) tokenization**.
It ensures:

* ✅ **Identity-gated transfers** — Only verified participants can receive tokens.
* ✅ **Transfer compliance** — All transfers follow jurisdictional and age restrictions.
* ✅ **Regulated minting and burning** — Minting occurs only upon verified purchase.
* ✅ **Whitelist / KYC enforcement** — Managed via **Self Protocol** verification.

---

### 🪙 Core Capabilities

| Feature                        | Description                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Multi-Asset Listing**        | Admins can list multiple RWAs with asset ID, price, and total supply.                             |
| **USDT-Based Purchase**        | Users buy tokens by paying in **USDT**.                                                           |
| **On-Demand Minting**          | Tokens are minted and transferred to users upon successful purchase.                              |
| **Self Protocol Verification** | Users must complete a **zero-knowledge age and residency check** before they can purchase tokens. |
| **Compliance by Design**       | Integrates with `SelfVerificationRoot` for identity, age, and country gating.                     |
| **Admin Tools**                | Admin can withdraw collected USDT, pause assets, and update pricing.                              |

---

## 🔄 Purchase Flow

1. **Asset Listing:**
   Admin lists a real-world asset with parameters:

   * `assetId`
   * `pricePerToken` (in USDT)
   * `totalSupply`

2. **Self Verification:**

   * Before purchase, the user goes through a **Self Protocol** identity check.
   * Verification ensures:

     * 🧑‍⚖️ Age ≥ 18
     * 🌍 Residency in approved jurisdiction
   * All done **off-chain with zero-knowledge proofs**, then validated on-chain.

3. **Purchase Tokens:**

   * User approves the contract to spend USDT.
   * Calls `buyTokens(assetId, amount)` → contract mints tokens and sends them.

4. **Receive RWA Tokens:**

   * User now holds **ERC-3643-compliant RWA tokens** representing fractionalized ownership.

---

## 📡 Deployed Contracts

| Network        | Contract Address                    |
| -------------- | ----------------------------------- |
| **0G Testnet** | `0x5637430507792c16d1ED3942d42366FbA374fA9d` |


---

## 🧰 Tech Stack

* **Solidity (v0.8.x)** — Smart contract language
* **Hardhat** — Development & deployment environment
* **OpenZeppelin** — Secure ERC-20, AccessControl, and utility libraries
* **Self Protocol** — Identity, age, and residency verification
* **USDT (ERC-20)** — Payment method for token purchase

---

## 🔭 Future Roadmap

🚀 **Planned enhancements:**

* **0G Storage Integration:**
  All off-chain data — images, property documents, compliance files, licensing metadata — will be uploaded and pinned to **0G storage** for permanent availability.

* **Yield Computation Engine:**
  Real-time yield calculation based on uploaded metadata (rental income, performance, etc.) and smart contract-level analytics.

* **Secondary Marketplace:**
  Enable peer-to-peer trading of RWA tokens under the same ERC-3643 compliance framework.

* **Cross-chain Deployment:**
  Expand to multiple L2s and enterprise permissioned chains.

---

## 🏁 Summary

This project is a **turnkey ERC-3643-based RWA tokenization solution** that allows you to:

* ✅ Tokenize real-world assets
* ✅ Sell them to **verified** investors
* ✅ Manage compliance with **zero-knowledge identity checks**
* ✅ Accept **USDT** for purchases
* ✅ Mint tokens dynamically on purchase

It’s the perfect foundation for **real estate**, **private equity**, **debt instruments**, or any real-world asset backed token ecosystem.

---

### 📜 License

MIT License — feel free to use and modify for commercial or open-source RWA projects.

---

Would you like me to also include an **example `scripts/deploy.js`** and a **sample Hardhat test** in the README? (That makes it easier for devs to run locally 🚀)
