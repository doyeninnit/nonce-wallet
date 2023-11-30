import { prisma } from "@/utils/db";
import { walletFactoryContract } from "@/utils/getContracts";
import { randomBytes } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { ethers } from 'ethers';
import bcrypt from 'bcrypt'; // For password hashing

export async function POST(req: NextRequest) {
  try {
    // const { signers }: { signers: string[] } = await req.json();
    const { username, email, password }: { username: string; email: string; password: string } = await req.json();
    // Check if username or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Username or email already exists." });
    }

    // Generate wallet
    const wallet = ethers.Wallet.createRandom();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust the salt rounds as needed

    // Create user in the database
    const userEoa = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: hashedPassword,
        privateKey: wallet.privateKey,
        wallet: wallet.address     
      }
    });
    console.log(userEoa)
    const signers = [userEoa.wallet]; // Wrap in an array
    const salt = "0x" + randomBytes(32).toString("hex");

    const walletAddress = await walletFactoryContract.getAddress(signers, salt);

    const response = await prisma.wallet.create({
      data: {
        salt: salt,
        signers: signers.map((s) => s.toLowerCase()),
        isDeployed: false,
        address: walletAddress,
      },
    });
 
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}

