# Simple Ledger (Web3 dApp)

A minimal on‑chain personal ledger that records **income** and **expenses** via **MetaMask**.  
It runs on the **Sepolia** test network (Chain ID `11155111`) as seen in the screenshots.

> This README uses the included screenshots for illustration. Keep the README and the images in the **same folder** to render them correctly.

---

## ✨ What it does

- Connect your wallet with **MetaMask**.
- Choose entry **Type**: _Expense (–)_ or _Income (+)_.
- Fill in **Amount (integer)**, **Category**, and **Memo**.
- Click **Add Entry** → confirm the MetaMask transaction.
- The **My Balance** panel shows the latest entries and the running total.

---

## 🖼️ UI at a Glance

### Landing / Connect
![Landing & MetaMask unlock](9313b541-e0a6-4a02-8227-bfb0cfd5b521.png)

### Choose Type
![Type: Expense or Income](0c955a94-863e-4a73-ba3a-9fb8231d22af.png)

### Enter Amount
![Amount input](7e260203-7ef2-4fb2-ac5e-c19f49660db7.png)

### Category & Memo
![Category and Memo](f64d0a35-6536-4811-b6ec-4095b6d14aa0.png)

### MetaMask Transaction Confirmation (Sepolia)
- Requests come from the local dev server (e.g., `localhost:5173`).
- Example network fee shown: `0.0002 SepoliaETH`.
- Expected finality ~ a few seconds on testnet.

![MetaMask confirm](3832bef2-c684-43eb-86df-595e63f4242e.png)

### Entries & Balance
The list shows each entry with its **sign** (red for expenses, green for income), plus category and timestamp. The total is displayed on the right.

![My Balance list](d7813d44-2c91-4ca2-9615-659cbeed43c4.png)

---

## 🧩 Fields

| Field | Description | Example |
|---|---|---|
| **Type** | Income (+) or Expense (–) | _Expense (–)_ |
| **Amount (integer)** | Positive integer; sign is applied by **Type** | `25000` |
| **Category** | Freeform category label | `Food`, `Salary`, `Transport` |
| **Memo** | Short note for the entry | `Lunch`, `good` |

> The **running balance** is computed as: sum of all incomes minus sum of all expenses.

---

## 🔐 Wallet & Network

- **Wallet**: MetaMask (browser extension)
- **Network**: Sepolia testnet (`chainId = 11155111`)
- **Fee**: Paid in SepoliaETH (test ETH). You can use a faucet to obtain test ETH for development.

> If MetaMask is **locked**, you’ll be prompted for a password before confirming transactions.

---

## 🔄 Typical Flow

1. Open the dApp in your browser.
2. Click **Connect MetaMask** (or the dApp will prompt on the first transaction).
3. Select **Type**, enter **Amount**, **Category**, and **Memo**.
4. Click **Add Entry** → **Confirm** in MetaMask.
5. Wait for confirmation, then click **Refresh** if needed to pull the latest on‑chain state.

---

## 🧪 Notes for Testing

- Ensure MetaMask is set to **Sepolia**. If your balance is 0, acquire test ETH.
- If you see _“Request from localhost:5173”_, that’s expected during local development.
- Network speed and gas fees vary; screenshots show an **example** transaction only.

---

## 🛠️ Project Structure (high‑level)

- **Frontend (web dApp)**: Presents the form, lists entries, and shows the running total.
- **Wallet integration**: Uses MetaMask for account access and transaction signing.
- **On‑chain storage/logic**: A smart contract (not shown here) records ledger entries and returns the current state for rendering.

> Implementation details (framework/lib versions, contract ABI, deployment address) may vary across your environment. Add them here for your team as needed.

---

## ✅ Checklist for Your Own README

- [ ] Add the **contract address** and **ABI** you’re using.
- [ ] Document the **transaction method** (e.g., `addEntry(type, amount, category, memo)`).
- [ ] Describe how **balance** is derived (on‑chain or client computed).
- [ ] Note any **environment variables** or **build steps** (e.g., `VITE_*`, RPC URL).
- [ ] Include **faucet**/test‑ETH instructions for Sepolia.

---

## 📄 License

Add your chosen license (MIT/Apache‑2.0/etc.).
