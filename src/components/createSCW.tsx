"use client";
import { useState } from "react";
import Button from "./button";
import { useRouter } from "next/navigation"; // Corrected from "next/navigation"
import { ethers } from "../../node_modules/ethers/lib/index";
export default function CreateSCW() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // For user feedback

  const onCreateSCW = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch("/api/create-wallet", {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Signers:", data.user.privateKey);

      // console.log(data)
      if (data.error) {
        throw new Error(data.error);
      }

      if (data.user && data.user.privateKey) {
        // Construct a wallet from the private key
        const wallet = new ethers.Wallet(data.user.privateKey);

        // Store the wallet address in local storage
        localStorage.setItem('walletAddress', wallet.address);

        console.log("Wallet Address:", wallet.address);
      }
      //   console.log("Signers:", data.signers);
      if (data.message) {
        setMessage(data.message);
      }

      if (data.user) {
        // User logged in or registered successfully
        window.alert(data.message);
        router.push('/'); // Redirect user as needed
      }
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-6 max-w-sm w-full">
      <input
        type="text"
        className="rounded-lg p-2 w-full text-slate-700"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        className="rounded-lg p-2 w-full text-slate-700"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="rounded-lg p-2 w-full text-slate-700"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {loading ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 mx-auto" />
      ) : (
        <Button onClick={onCreateSCW}>Register / Login</Button>
      )}
      {message && <div className="mt-2 text-center text-red-500">{message}</div>}
    </main>
  );
}
