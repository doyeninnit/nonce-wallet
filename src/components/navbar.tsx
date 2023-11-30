"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { ethers } from 'ethers';

export default function Navbar() {

  //WILL GO TO UTILS FOLDER
  const generateWallet = () => {
    const wallet = ethers.Wallet.createRandom();
    const address = wallet.address;
    // You can use the wallet's address now, for example, displaying it in the UI or storing it
    console.log(address);
};
  return (
    <div className="w-full px-6 border-b border-b-gray-700 py-2 flex justify-between items-center">
      <div className="gap-4 flex">
        <Link href="/" className="hover:underline">
          Home
        </Link>

        <Link href="/create-wallet" className="hover:underline">
          Create New Wallet
        </Link>
      </div>
      <button onClick={generateWallet}>Generate Wallet</button>

    </div>
  );
}
