import { ethers } from 'ethers';

export const connectMetaMask = async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            return { address: accounts[0], provider, signer };
        } catch (error) {
            console.error("User denied connection", error);
            throw error;
        }
    } else {
        alert("MetaMask is not installed!");
        return null;
    }
};

export const getContract = (address: string, abi: any, signer: any) => {
    return new ethers.Contract(address, abi, signer);
};
