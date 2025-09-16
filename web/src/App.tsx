import { useEffect, useMemo, useState, useCallback } from "react";
import { ethers } from "ethers";
import { SimpleLedgerABI } from "./abi/SimpleLedger";
import { CONTRACT_ADDRESS } from "./config";
import "./index.css";

type Entry = {
  amount: bigint; // int256 from solidity -> bigint
  memo: string;
  category: string;
  timestamp: bigint; // uint64 -> bigint
};

export default function App() {
  const [account, setAccount] = useState<string>("");
  const [chainId, setChainId] = useState<string>("");
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(false);

  // form state
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState<string>(""); // integer units (e.g., KRW)
  const [memo, setMemo] = useState("");
  const [category, setCategory] = useState("");

  const isReady = useMemo(() => !!(contract && signer && account), [contract, signer, account]);

  useEffect(() => {
    const init = async () => {
      if (!(window as any).ethereum) return;
      const p = new ethers.BrowserProvider((window as any).ethereum);
      setProvider(p);

      // request accounts and network
      await p.send("eth_requestAccounts", []);
      const s = await p.getSigner();
      const addr = await s.getAddress();
      const net = await p.getNetwork();

      setSigner(s);
      setAccount(addr);
      setChainId(net.chainId.toString());

      const c = new ethers.Contract(CONTRACT_ADDRESS, SimpleLedgerABI, s);
      setContract(c);
    };
    init();

    const { ethereum } = window as any;
    if (ethereum) {
      const handleAccountsChanged = (accs: string[]) => {
        setAccount(accs[0] || "");
      };
      const handleChainChanged = (_: string) => {
        // 디버깅을 위해 임시 주석 처리
        console.log("Chain changed event:", _);
        // window.location.reload();
      };
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("chainChanged", handleChainChanged);
      return () => {
        ethereum.removeListener("accountsChanged", handleAccountsChanged);
        ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  const refresh = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const bal: bigint = await contract.balanceOf(account);
      setBalance(bal);

      const count: bigint = await contract.entryCount(account);
      const total = Number(count);
      const page = await contract.entriesOf(account, 0, total);
      // page is Entry[] struct array; ethers v6 returns objects with properties
      const parsed: Entry[] = page.map((e: any) => ({
        amount: BigInt(e.amount),
        memo: e.memo,
        category: e.category,
        timestamp: BigInt(e.timestamp)
      }));
      // newest first
      parsed.sort((a, b) => Number(b.timestamp - a.timestamp));
      setEntries(parsed);
    } catch (error) {
      console.error("Error in refresh:", error);
    }
  }, [contract, account]);

  useEffect(() => {
    if (contract && account) {
      refresh();
    }
  }, [refresh]);

  const submit = async () => {
    if (!isReady) return;
    if (!amount || isNaN(Number(amount))) {
      alert("Enter a valid integer amount.");
      return;
    }
    setLoading(true);
    try {
      const amt = BigInt(amount);
      const tx = type === "income"
        ? await contract!.addIncome(amt, memo, category)
        : await contract!.addExpense(amt, memo, category);
      await tx.wait();
      setAmount("");
      setMemo("");
      setCategory("");
      await refresh();
    } catch (e: any) {
      console.error(e);
      alert(e?.reason || e?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const fmt = (v: bigint) => (v >= 0n ? `+${v.toString()}` : v.toString());
  const cls = (v: bigint) => (v >= 0n ? "green" : "red");
  const toDate = (ts: bigint) => new Date(Number(ts) * 1000).toLocaleString();

  return (
    <div className="container">
      <div className="header">
        <div>
          <h2>Simple Ledger</h2>
          <div className="small mono">{account ? `Account: ${account}` : "Connect MetaMask"}</div>
          <div className="small">ChainId: {chainId || "?"}</div>
        </div>
        <button className="btn" onClick={refresh}>↻ Refresh</button>
      </div>

      <div className="card" style={{marginBottom: 16}}>
        <div className="row">
          <div>
            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as any)}>
              <option value="expense">Expense (−)</option>
              <option value="income">Income (+)</option>
            </select>
          </div>
          <div>
            <label>Amount (integer)</label>
            <input className="input" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g. 12000" />
          </div>
        </div>
        <div className="row" style={{marginTop: 10}}>
          <div>
            <label>Category</label>
            <input className="input" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Food / Salary / Transport" />
          </div>
          <div>
            <label>Memo</label>
            <input className="input" value={memo} onChange={(e) => setMemo(e.target.value)} placeholder="e.g. Lunch" />
          </div>
        </div>
        <div style={{marginTop: 12}}>
          <button className="btn primary" onClick={submit} disabled={!isReady || loading}>
            {loading ? "Submitting..." : "Add Entry"}
          </button>
        </div>
      </div>

      <div className="card">
        <div className="header">
          <h3>My Balance</h3>
          <div className={`mono ${cls(balance)}`}>{fmt(balance)}</div>
        </div>
        <hr/>
        <div className="list">
          <div className="item small" style={{opacity:.7}}>
            <div><b>Amount</b></div>
            <div><b>Memo</b></div>
            <div><b>Category</b></div>
            <div><b>When</b></div>
          </div>
          {entries.map((e, i) => (
            <div key={i} className="item">
              <div className={`mono ${cls(e.amount)}`}>{fmt(e.amount)}</div>
              <div>{e.memo || <span className="small">(no memo)</span>}</div>
              <div><span className="badge">{e.category || "–"}</span></div>
              <div className="small mono">{toDate(e.timestamp)}</div>
            </div>
          ))}
          {entries.length === 0 && <div className="small">No entries yet. Add one above.</div>}
        </div>
      </div>
    </div>
  );
}