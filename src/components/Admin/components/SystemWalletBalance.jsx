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
        <div className=" h-full w-full bg-red-500 *:text-white shadow-lg py-2 rounded-lg px-4">
            <h1 className="font-semibold text-xl pb-4 tracking-wider h-[75%]">System Wallet Balance</h1>
            <div className="*:text-white text-xl font-semibold" >
                <span>{wallet.toLocaleString()} VND</span>
            </div>
        </div>
    )
}
