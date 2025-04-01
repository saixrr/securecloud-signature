

const PRIVATE_KEY = '5f4dcc3b5aa765d61d8327deb882cf99';

export const generateSignature = async (username: string, password: string): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // In a real implementation, this would use actual HMAC-DRBG for randomness
  // and then NTRUSign to generate the signature
  
  // Simulate a digital signature by combining username, password and timestamp
  const timestamp = Date.now().toString();
  const data = username + password + timestamp;
  
  // Simple hash function for demonstration
  let signature = '';
  for (let i = 0; i < data.length; i++) {
    signature += data.charCodeAt(i).toString(16);
  }
  
  // Add some randomness to make each signature unique
  const randomPart = Math.random().toString(36).substring(2, 15);
  
  return `NTRU_SIG${signature}${randomPart}`;
};


 
export const verifySignature = (signature: string): boolean => {
 
  return signature.startsWith('NTRU_SIG');
};


export const encryptData = async (data: string): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would use actual NTRU encryption algorithms
  
  // Simple encryption simulation for demonstration
  let encrypted = 'NTRU_ENC:';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i);
    // Simple substitution - in real NTRU this would be far more complex
    encrypted += (charCode * 17 % 256).toString(16).padStart(2, '0');
  }
  
  return encrypted;
};

/**
 * Simulates decrypting data using NTRU decryption
 * @param encryptedData The encrypted data
 * @returns Decrypted data
 */
export const decryptData = async (encryptedData: string): Promise<string> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Check if input has the expected format
  if (!encryptedData.startsWith('NTRU_ENC:')) {
    throw new Error('Invalid encrypted data format');
  }
  
  // In a real implementation, this would use actual NTRU decryption algorithms
  
  // Strip the prefix
  const encryptedPart = encryptedData.substring(9);
  
  // Simple decryption simulation for demonstration
  let decrypted = '';
  for (let i = 0; i < encryptedPart.length; i += 2) {
    if (i + 1 < encryptedPart.length) {
      const hex = encryptedPart.substring(i, i + 2);
      const charCode = parseInt(hex, 16);
      // Reverse of the simple substitution we did
      for (let j = 0; j < 256; j++) {
        if ((j * 17) % 256 === charCode) {
          decrypted += String.fromCharCode(j);
          break;
        }
      }
    }
  }
  
  return decrypted;
};

// src/utils/cryptoUtils.ts

// const LAMBDA_ENDPOINT = 'https://rmc5ph1v6h.execute-api.eu-north-1.amazonaws.com/dev'; // Update with actual URL

// export const generateSignature = async (username: string, password: string): Promise<{ signature: string; token: string }> => {
//   const data = `${username}:${password}`;

//   const response = await fetch(LAMBDA_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       action: 'generateSignature',
//       data,
//     }),
//   });

//   const result = await response.json();
//   if (!response.ok) {
//     throw new Error(result.message || 'Failed to generate signature');
//   }

//   return {
//     signature: result.signature,
//     token: result.token,
//   };
// };

// export const verifySignature = async (
//   username: string,
//   password: string,
//   signature: string,
//   token: string
// ): Promise<boolean> => {
//   const data = `${username}:${password}`;

//   const response = await fetch(LAMBDA_ENDPOINT, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       action: 'verifySignature',
//       data,
//       providedSignature: signature,
//       token,
//     }),
//   });

//   const result = await response.json();
//   return result.verified;
// };
