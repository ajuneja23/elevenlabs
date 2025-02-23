"use server"

import crypto from "crypto"

async function signRequest(timestamp: string, method: string, path: string, body = "") {
  if (!process.env.KALSHI_API_KEY || !process.env.KALSHI_PRIVATE_KEY) {
    throw new Error("Missing API credentials")
  }

  const message = `${timestamp}${method}${path}${body}`
  
  try {
    // Try to create private key without specifying type
    const privateKey = crypto.createPrivateKey(process.env.KALSHI_PRIVATE_KEY)

    const signature = crypto.sign(
      'sha256',
      Buffer.from(message, 'utf-8'),
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST
      }
    );

    return signature.toString('base64');
  } catch (error) {
    console.error("Error during signing:", error)
    throw new Error(`Failed to sign request: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function getAuthHeaders(method: string, path: string, body = "") {
  try {
    const timestamp = Date.now().toString()
    const signature = await signRequest(timestamp, method, path, body)

    return {
      "KALSHI-ACCESS-KEY": process.env.KALSHI_API_KEY!,
      "KALSHI-ACCESS-SIGNATURE": signature,
      "KALSHI-ACCESS-TIMESTAMP": timestamp,
      "Content-Type": "application/json",
    }
  } catch (error) {
    console.error("Error generating auth headers:", error)
    throw error
  }
}

