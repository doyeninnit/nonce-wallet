// "use client";
// import { isAddress } from "ethers/lib/utils";
// import { useRouter } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { useAccount } from "wagmi";
// import Icon from "./icon";
// import Button from "./button";

// export default function CreateSCW() {
//   const { address } = useAccount();
//   const router = useRouter();

//   const [signers, setSigners] = useState<string[]>([]);
//   const lastInput = useRef<HTMLInputElement | null>(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setSigners([address as string]);
//   }, [address]);

//   useEffect(() => {
//     if (lastInput.current) {
//       lastInput.current.focus();
//     }
//   }, [signers]);

//   function addNewSigner() {
//     setSigners((signers) => [...signers, ""]);
//   }

//   function removeSigner(index: number) {
//     if (signers[index] === undefined) return;
//     if (signers[index].length > 0) return;
//     if (signers.length <= 1) return;

//     const newSigners = [...signers];
//     newSigners.splice(index, 1);
//     setSigners(newSigners);
//   }

//   const onCreateSCW = async () => {
//     try {
//       setLoading(true);
//       signers.forEach((signer) => {
//         if (isAddress(signer) === false) {
//           throw new Error(`Invalid address: ${signer}`);
//         }
//       });

//       const response = await fetch("/api/create-wallet", {
//         method: "POST",
//         body: JSON.stringify({ signers }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }
//       window.alert(`Wallet created: ${data.address}`);
//       router.push(`/`);
//     } catch (error) {
//       console.error(error);
//       if (error instanceof Error) {
//         window.alert(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex flex-col gap-6 max-w-sm w-full">
//       {signers.map((signer, index) => (
//         <div key={signer} className="flex items-center gap-4">
//           <input
//             type="text"
//             className="rounded-lg p-2 w-full text-slate-700"
//             placeholder="0x000"
//             value={signer}
//             ref={index === signers.length - 1 ? lastInput : null}
//             onKeyDown={(event) => {
//               if (event.key === "Enter") {
//                 addNewSigner();
//               } else if (event.key === "Backspace") {
//                 removeSigner(index);
//               }
//             }}
//             onChange={(event) => {
//               const newSigners = [...signers];
//               newSigners[index] = event.target.value;
//               setSigners(newSigners);
//             }}
//           />

//           {index > 0 && (
//             <div
//               className="hover:scale-105 cursor-pointer"
//               onClick={() => removeSigner(index)}
//             >
//               <Icon type="xmark" />
//             </div>
//           )}
//         </div>
//       ))}
//       {loading ? (
//         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-l-white items-center justify-center mx-auto" />
//       ) : (
//         <div className="flex items-center justify-between">
//           <Button onClick={addNewSigner}>Add New Signer</Button>
//           <Button onClick={onCreateSCW}>Create New Wallet</Button>
//         </div>
//       )}
//     </main>
//   );
// }

// "use client";
// import { isAddress } from "ethers/lib/utils";
// import { useRouter } from "next/navigation"; // Corrected from next/navigation
// import { useEffect, useState } from "react";
// import Icon from "./icon";
// import Button from "./button";

// export default function CreateSCW() {
//   const router = useRouter();

//   const [signer, setSigner] = useState('');
//   const [loading, setLoading] = useState(false);

//   const onCreateSCW = async () => {
//     try {
//       setLoading(true);

//       // Validate the address
//       if (!isAddress(signer)) {
//         throw new Error(`Invalid address: ${signer}`);
//       }

//       // Make the API call with the signer wrapped in an array
//       const response = await fetch("/api/create-wallet", {
//         method: "POST",
//         body: JSON.stringify({ signers: [signer] }),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });

//       const data = await response.json();
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       window.alert(`Wallet created: ${data.address}`);
//       router.push(`/`);
//     } catch (error) {
//       console.error(error);
//       if (error instanceof Error) {
//         window.alert(error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex flex-col gap-6 max-w-sm w-full">
//       <div className="flex items-center gap-4">
//         <input
//           type="text"
//           className="rounded-lg p-2 w-full text-slate-700"
//           placeholder="Enter Wallet Address"
//           value={signer}
//           onChange={(e) => setSigner(e.target.value)}
//         />
//       </div>
//       {loading ? (
//         <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 mx-auto" />
//       ) : (
//         <div className="flex items-center justify-between">
//           <Button onClick={onCreateSCW}>Create New Wallet</Button>
//         </div>
//       )}
//     </main>
//   );
// }


"use client";
import { ethers } from 'ethers'; // Import ethers for wallet generation
import { useRouter } from "next/navigation"; // Corrected from next/navigation
import { useEffect, useState } from "react";
import Button from "./button";

export default function CreateSCW() {
  const router = useRouter();

  const [signer, setSigner] = useState('');
  const [loading, setLoading] = useState(false);

  // Function to generate a new wallet address
  useEffect(() => {
    const wallet = ethers.Wallet.createRandom();
    setSigner(wallet.address);
  }, []);

  const onCreateSCW = async () => {
    try {
      setLoading(true);

      // Make the API call with the signer wrapped in an array
      const response = await fetch("/api/create-wallet", {
        method: "POST",
        body: JSON.stringify({ signers: [signer] }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      window.alert(`Wallet created: ${data.address}`);
      router.push(`/`);
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        window.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col gap-6 max-w-sm w-full">
      <div className="flex items-center gap-4">
        <input
          type="text"
          className="rounded-lg p-2 w-full text-slate-700"
          placeholder="Generated Wallet Address"
          value={signer}
          readOnly // The address is generated and not manually input
        />
      </div>
      {loading ? (
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-800 mx-auto" />
      ) : (
        <Button onClick={onCreateSCW}>Create New Wallet</Button>
      )}
    </main>
  );
}
