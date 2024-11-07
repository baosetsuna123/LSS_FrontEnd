import { getSystemWalletBalance } from "@/data/api"
import { useEffect, useState } from "react";

export default function SystemWalletBalance() {
    const [wallet, setWallet] = useState(0)
    const result = localStorage.getItem("result");

    let token;
    if (result) {
        try {
            const parsedResult = JSON.parse(result);
            token = parsedResult.token;
        } catch (error) {
            console.error("Error parsing result from localStorage:", error);
        }
    }

    const getSystemWalletBalances = async () => {
        try {
            const res = await getSystemWalletBalance(token);
            setWallet(res)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getSystemWalletBalances();
    }, [token]);

    return (
        <div className="flex flex-col justify-center items-center w-full bg-white shadow-lg pb-6 rounded-lg px-6">
            <h1 className="font-semibold text-xl py-5 tracking-wider uppercase text-center">System Wallet Balance</h1>
            <div className="*:text-blue-800 gap-6 text-2xl font-semibold" >
                <span>{wallet.toLocaleString()} VND</span>
            </div>
        </div>
    )
}
