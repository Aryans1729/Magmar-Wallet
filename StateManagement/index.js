"use client"

import { configDotenv } from "dotenv";

import React , {createContext , useContext , useState , useEffect} from "react";
import { Toaster, useToaster , toast} from 'react-hot-toast';

// import  { createEcdsaKernelAccountClient  } from "@zerodev/presets/zerodev";

import nftABI from "../utils/nftABI.json";

import tokenABI from "../utils/tokenABI.json";

// import  { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

import  {
  createKernelAccount,
  createZeroDevPaymasterClient,
  createKernelAccountClient,
} from "@zerodev/sdk";

import  { signerToEcdsaValidator } from "@zerodev/ecdsa-validator";
import  { ENTRYPOINT_ADDRESS_V07, bundlerActions , providerToSmartAccountSigner } from "permissionless";
import  { mainnet, base  } from "viem/chains";


import {zeroAddress , createPublicClient , http} from "viem";

import {getContract} from "viem";

import {encodeFunctionData} from "viem";

import {ethers, parseEther} from "ethers";

// import Web3 from "web3";

import {CovalentClient} from "@covalenthq/client-sdk";

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { Web3Auth } from "@web3auth/modal";
import { Web3Validator } from "web3";
import axios from "axios";


// import { Store } from 'react-notifications-component';


// import RPC from "../utils/web3RPC"
// import { redirect } from "next/navigation";
// import { useRouter } from "next/navigation";



configDotenv();

const StateManagement = createContext();


// const clientId = "BL4Vh9M4P-uw9fNMWgqlcuQLizPRbKT0AmMlH-F8kdB_whfwJ0SLg2vIyCjhB_SNw6ZLLPUVhz6D5dzw4cyTHTw"; // get from https://dashboard.web3auth.io

  const clientId = "BBHUzQDwJ_TG_j0hXP38EOvL6W3mLe_fYBRXcEJl0KAT1cPKqn9_V7tovqTKm2X6SelLrrlRGDnz4S7TXhOhqbk"

  const chainConfig = {
  chainId: "0x2105", // Please use 0x1 for Mainnet
  rpcTarget: "https://base.meowrpc.com",
  chainNamespace: CHAIN_NAMESPACES.EIP155, 
  displayName: "BASE",
  blockExplorerUrl: "https://basescan.org/",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://images.toruswallet.io/eth.svg",
};

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

const web3auth = new Web3Auth({
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
}

);


const successNotification = (msg) => toast.success(msg);

const failNotification = (msg) => toast.error(msg);


const isValidNFTContract = (provider , nftAddress) => {

  try {
    
    const isNftAddress = ethers.isAddress(nftAddress);

    if(isNftAddress){

      const code = provider.getCode(nftAddress);

      if(code === '0x'){

        return false;

      }else{

        return true;

      }

    }

  } catch (error) {

    console.log(error);
    
  }

}

const isValidTokenId = (provider , nftAddress , tokenId) => {

  try {
    
    const contract = new ethers.Contract(nftAddress , nftABI , provider);

    const owner = contract.ownerOf(tokenId);

    if(owner !== ethers.ZeroAddress){

      return true;

    }else{

      return false;

    }

  } catch (error) {

    console.log(error)
    
  }

}

export const StateManagementProvider = ({children}) => {


    const [showSendModal , setShowSendModal] = useState(true);

    const [showReceieveModal , setShowReceieveModal] = useState(false);

    const [showTokenModal , setShowTokenModal] = useState(true);

    const [showNFTModal , setShowNFTModal] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    const [selectedNetwork, setSelectedNetwork] = useState('Ethereum');

    const [selectedNetworkIcon , setSelectedNetworkIcon] = useState();

    const [selectedNavbarHeading , setSelectedNavarHeading] = useState("Dashboard");

    const [selectedDashboardHeading , setSelectedDashboardHeading] = useState("Tokens");
    
    const [selectedSendAndRecieveHeading , setSelectedSendAndRecieveHeading] = useState("Send");

    const [socialAccount , setSocialAccount] = useState(null);

    const [userAccount , setUserAccount] = useState(null);

    const [kernelClient , setKernelClient] = useState(null);

    const [ethTokenBalance , setEthTokenBalance] = useState("0.0");

    const [ethTokenSymbol  , setEthTokenSymbol] = useState("ETH");

    const [tokenDetails , setTokenDetails] = useState();

    const [nftDetails , setNFTDetails] = useState();

    const [txDetails , setTxDetails]  = useState();

    const [loggedIn, setLoggedIn] = useState(false);

    const [provider, setProvider] = useState(null);
  
    const [loading , setLoading] = useState(false);

    const [popularTokens , setPopularTokens] = useState([]);

     //State for Ethers 
  const [transferType, setTransferType] = useState('Ether Transfer')
  const [sendTo, setSendTo] = useState('')
  const [sendFrom, setSendFrom] = useState('')
  const [amount, setAmount] = useState('')

  //State for Token Transfer
  const [tokenAddress, setTokenAddress] = useState('')

  //State for NFT transfer
  const [nftAddress, setNftAddress] = useState('')
  const [nftId, setNftId] = useState('')

    //Bash Transfer
    const [data, setdata] = useState('')
    const [to, setto] = useState('')
    // const [bashTransactionData, setBashTransactionData] = useState([{to: '' , data: ''}])

    const [inputFields, setInputFields] = useState([{ value1: '', value2: '' }]);

  
    //Notification message
    const { } = useToaster();
  
    // const addBaseFields = (e) => {
    //   e.preventDefault();
    //   setBashTransactionData([...bashTransactionData, {to: '' , data: ''}]) ;
    //   console.log('Form Data:', bashTransactionData);
    // } 
  
  //   const handleInputChange = (index, fieldName, value) => {
  //     const newbashData = [...bashTransactionData];
  //     newbashData[index][fieldName] = value;
  //     setBashTransactionData(newbashData);
  // };

  

  const handleInputChange = (index, event) => {
      const { name, value } = event.target;
      const values = [...inputFields];
      values[index][name] = value;
      setInputFields(values);
  };

  const handleAddInput = () => {
      setInputFields([...inputFields, { value1: '', value2: '' }]);
  };


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const hideDropdown = () => {
      setIsOpen(isOpen);
    }

    const changeNetwork = (network) => {
        setSelectedNetwork(network);
        setIsOpen(false);
    };


    web3auth.on("connected" , async() => {

      createSmartAccount();
    
    })

    const createSmartAccount = async () => {

      const bundlerRPC = "https://rpc.zerodev.app/api/v2/bundler/e62ac119-fa7f-48de-9f73-9fd31d813ff2"
            
      const paymasterRPC = "https://rpc.zerodev.app/api/v2/paymaster/e62ac119-fa7f-48de-9f73-9fd31d813ff2"

      // const bundlerRPCBase = "https://rpc.zerodev.app/api/v2/bundler/e62ac119-fa7f-48de-9f73-9fd31d813ff2"

      // const paymasterRPCBase = "https://rpc.zerodev.app/api/v2/paymaster/e62ac119-fa7f-48de-9f73-9fd31d813ff2"
      
      
      if (
          !bundlerRPC ||
          !paymasterRPC
        ) {
          throw new Error("BUNDLER_RPC or PAYMASTER_RPC is not set");
        }
      
      const publicClient = createPublicClient({
        transport: http(bundlerRPC),
      });

      if(!provider){
        console.log("provider is not set");
        return;
      }

      const signer = await providerToSmartAccountSigner(provider , socialAccount);
      
      const chain = base;
      const entryPoint = ENTRYPOINT_ADDRESS_V07;
    
    
      const ecdsaValidator = await signerToEcdsaValidator(publicClient, {
        signer,
        entryPoint,
      });
    
      const account = await createKernelAccount(publicClient, {
        plugins: {
          sudo: ecdsaValidator,
        },
        entryPoint,
      });


      setUserAccount(account.address);

      localStorage.setItem("smartAccount" , account.address);

    
      try {
        const kernelClient = createKernelAccountClient({
          account,
          entryPoint,
          chain,
          bundlerTransport: http(bundlerRPC),
          middleware: {
            sponsorUserOperation: async ({ userOperation }) => {
              const paymasterClient = createZeroDevPaymasterClient({
                chain: base,
                transport: http(paymasterRPC),
                entryPoint,
              });
              return paymasterClient.sponsorUserOperation({
                userOperation,
                entryPoint,
              });
            },
          },
        });
  
        setKernelClient(kernelClient);
      } catch (error) {
        console.log(error)
      }


      if(!kernelClient) return;
    
      const userOpHash = await kernelClient.sendUserOperation({
        userOperation: {
          sender: account.address,
          callData: await account.encodeCallData({
            to: zeroAddress,
            value: BigInt(0),
            data: "0x",
          }),
          
        },
        
      });


    
    
      const bundlerClient = kernelClient.extend(bundlerActions(entryPoint));
      bundlerClient.waitForUserOperationReceipt({ hash: userOpHash })
        .then(() => console.log("userOp completed"))
        .catch(error => console.error("Error waiting for receipt:", error));
    };

    const transferEther = async(receiverAddress , amountInEther) => {

      try {



     

      if(web3auth.connected){

        // const kernelClient = localStorage.getItem("kernelClient")
        

        const web3authProvider = web3auth.provider;
          
        const web3provider = new ethers.BrowserProvider(web3authProvider);

        const nativeBal = await web3provider.getBalance(userAccount)
        console.log(nativeBal , "abc")

        const validReceiverAddress = ethers.isAddress(receiverAddress);

        if(validReceiverAddress && amountInEther > 0 && parseEther(amountInEther) <= nativeBal){

          console.log(kernelClient, amountInEther , "kernelClient" );

        const tx = await kernelClient.sendTransaction({

          to: `${receiverAddress}`,
          value: parseEther(amountInEther),

        })

        // console.log("Transaction is " , tx);
        // alert("Tx Successful")
        successNotification("Transaction Successful")
        return tx;



        }else{

            console.log("Please Provide Valid Address or Amount")

            failNotification("Please Provide Valid Address or Amount")

        }

      }

      else{

          console.log("Please Create Your Account First");

      }
        
      } catch (error) {
        
        console.log(error)

      }

    }


    const transferTokens = async(tokenAddress , receiverAddress, tokenAmount) => {

      try {
       
      // console.log(tokenABI)

        const validRecieverAddress = ethers.isAddress(receiverAddress);

      const contract = getContract({

        abi: tokenABI,
        address: tokenAddress,
        client: kernelClient

      });

      // console.log(contract)

      const web3authProvider = web3auth.provider;
          
      const web3provider = new ethers.BrowserProvider(web3authProvider);

      const tokenContract = new ethers.Contract(tokenAddress , tokenABI , web3provider);

      const enoughBalance = tokenContract.balanceOf(userAccount);

      if(validRecieverAddress && contract && tokenAmount > 0 && tokenAmount <= enoughBalance){
 
        const transferTokens = await contract?.write?.transfer([`${receiverAddress}` , tokenAmount])
        
        console.log(transferTokens);

        successNotification(`${tokenAmount} Tokens Has Been Transferred Successfully`);
        
      }else{

        console.log("Please Provide Valid receiever address or tokenaddress or tokenamount");

        failNotification("Please Provide Valid receiever address or tokenaddress or tokenamount");

      }

    } catch (error) {
     
      console.log(error);
      
    }

    }


    const transferNFT = async(contractAddress , receiverAddress , tokenId) => {

      try {

        if(web3auth.connected){

          // const kernelClient = localStorage.getItem("kernelClient");

          const validReceiverAddress = ethers.isAddress(receiverAddress);

          const web3authProvider = web3auth.provider;
          
          const web3provider = new ethers.BrowserProvider(web3authProvider);

          const validNFTAddress = isValidNFTContract(web3provider , nftAddress);

          const validTokenId = isValidTokenId(web3provider , nftAddress , tokenId);

        
          if(validReceiverAddress && validNFTAddress && validTokenId){


          const nftData = await kernelClient.sendTransaction({

          to: contractAddress,
          data: encodeFunctionData({

            abi: nftABI,
            functionName: "transferFrom",
            args: [`${userAccount}` , `${receiverAddress}` , `${tokenId}`]

          })

        })

        console.log(`The Transaction hash is ${nftData}`);

        successNotification(`NFT With Id ${tokenId} Has Been Transferred Successfully`);

      }else{

        console.log("Please Provide Valid reciever address or nft address or token id");

        failNotification("Please Provide Valid reciever address or nft address or token id")

      }

    }

      else{

        console.log("Please Create Your Account First");

      }

        
      } catch (error) {
        
        console.log(error);

      } 

    }

    // const  getTransactionHistory = async() => {

    // const client = new CovalentClient("cqt_rQfmvyvGCjfTfhQ6VGcgtGGwjBhj");
    
    //   // const response = await client.TransactionService.getAllTransactionsForAddressByPage("eth-mainnet" , `${userAccount}`);
    //   const response = await client.TransactionService.getAllTransactionsForAddressByPage("eth-mainnet" , "0xe688b84b23f322a994a53dbf8e15fa82cdb71127");

    //    const txash = response.data.items;

    //    setTxDetails(txash)

    // }


  const getRawTransactions = async() => {

      try {
        
        const client = new CovalentClient("cqt_rQfmvyvGCjfTfhQ6VGcgtGGwjBhj");
      
        // const response = await client.TransactionService.getAllTransactionsForAddressByPage("eth-mainnet" , "0x878CC3d3b26809e562c7a998cF62bbCe467D2d59")
        // const response = await client.TransactionService.getAllTransactionsForAddressByPage("eth-mainnet" , "0x07a375d5a23d9A6DD28Fb06e022131E07CC7ff51")
        // const response = await client.TransactionService.getAllTransactionsForAddressByPage("eth-mainnet" , "0xa83114A443dA1CecEFC50368531cACE9F37fCCcb")
        const response = await client.TransactionService.getAllTransactionsForAddressByPage("base-mainnet" , "0x110032acbA8f8935A356d93F57AbF6bFA0051926")

    
        return response.data.items
  
  
      } catch (error) {
  
        console.log(error)
  
        return []
        
      }
    
  
  }

  const getProcessedTransactions = async(transactions , userAddress) => {
  
    try {
  
      return transactions.map((tx) => {
        let type = 'Other';
        const isSent = tx.from_address.toLowerCase() === userAddress.toLowerCase();
        const isReceived = tx.to_address && tx.to_address.toLowerCase() === userAddress.toLowerCase();
        const isContractCreation = tx.to_address === null && tx.input.startsWith("0x");
        const isFunctionCall =  tx.to_address && tx.input !== '0x';
    
        if (isContractCreation) {
          type = 'Contract Deployment';
        // } else if (isDelegateCall) {
        //   type = 'Delegate Call';
        } else if (isFunctionCall) {
          type = 'Function Call';
        } else if (isSent) {
          type = 'Sent';
        } else if (isReceived) {
          type = 'Received';
        }
    
        // Default to native token (e.g., ETH)
        let tokenSymbol = 'ETH';
        let value = parseFloat(tx.value) / 1e18; // Convert from Wei
    
        // Check for ERC-20 token transfers
        if (Array.isArray(tx.log_events)) {
          tx.log_events.forEach(log => {
            if (log.decoded && log.decoded.name === 'Transfer') {
              const transferEvent = log.decoded.params;
              if (
                transferEvent[0].value.toLowerCase() === userAddress.toLowerCase() ||
                transferEvent[1].value.toLowerCase() === userAddress.toLowerCase()
              ) {
                tokenSymbol = log.sender_contract_ticker_symbol;
                value = parseFloat(transferEvent[2].value) / 10 ** log.sender_contract_decimals;
                type = transferEvent[1].value.toLowerCase() === userAddress.toLowerCase() ? 'Received' : 'Sent';
              }
            }
          });
        }
    
        return {
          hash: tx.tx_hash,
          from: tx.from_address,
          to: tx.to_address,
          value: value,
          tokenSymbol: tokenSymbol,
          type: type,
          timestamp: new Date(tx.block_signed_at).toLocaleString()
        };
      });
    } catch (error) {
  
      console.log(error)
      
    }
  
  }

  const getTransactionHistory = async() => {
  
    try {
      
        const rawTransactions = await getRawTransactions();

        // const transactions = await getProcessedTransactions(rawTransactions , "0xe688b84b23f322a994a53dbf8e15fa82cdb71127");
        // const transactions = await getProcessedTransactions(rawTransactions , "0x878CC3d3b26809e562c7a998cF62bbCe467D2d59");
        // const transactions = await getProcessedTransactions(rawTransactions , "0x07a375d5a23d9A6DD28Fb06e022131E07CC7ff51");
        // const transactions = await getProcessedTransactions(rawTransactions , "0xa83114A443dA1CecEFC50368531cACE9F37fCCcb");
        const transactions = await getProcessedTransactions(rawTransactions , "0x110032acbA8f8935A356d93F57AbF6bFA0051926");


        console.log(transactions);

        setTxDetails(transactions);


        transactions.map((tx) => console.log(tx));



    } catch (error) {

      console.log(error);
      
    }


}


    const sendBatchTransaction = async() => {

      const txnHash = await kernelClient.sendTransactions({
        transactions: inputFields,
      });
    
      console.log("Txn hash:", txnHash);
    }
    
    // const sendBatchTransaction = async() => {

    //   const txnHash = await kernelClient.sendTransactions({
    //     transactions: [
    //       {
    //         to: zeroAddress,
    //         value: BigInt(0),
    //         data: "0x",
    //       },
    //       {
    //         to: zeroAddress,
    //         value: BigInt(0),
    //         data: "0x",
    //       },
    //     ],
    //   });
    
    //   console.log("Txn hash:", txnHash);
    // }


  const getTokenBalance = async() => {


  const client = new CovalentClient("cqt_rQfmvyvGCjfTfhQ6VGcgtGGwjBhj");

    // const resp = await  client.BalanceService.getTokenBalancesForWalletAddress(`eth-mainnet` , `${userAccount}`)
    const resp = await  client.BalanceService.getTokenBalancesForWalletAddress(`base-mainnet` , `0xe688b84b23f322a994a53dbf8e15fa82cdb71127`)

  const tokens = resp.data.items

  setTokenDetails(tokens);
  
  //0xe688b84b23f322a994a53dbf8e15fa82cdb71127
  
    }
    const getEthereumBalance = async() => {


  const client = new CovalentClient("cqt_rQfmvyvGCjfTfhQ6VGcgtGGwjBhj");

 
  // const resp = await  client.BalanceService.getNativeTokenBalance("eth-mainnet" , `${userAccount}`)
  const resp = await  client.BalanceService.getNativeTokenBalance("base-mainnet" , `0xe688b84b23f322a994a53dbf8e15fa82cdb71127`)

  const tokens = resp.data.items

  tokens.find((token) => {

    setEthTokenBalance(ethers.formatEther(token.balance).slice(0 , 5));

    setEthTokenSymbol(token.contract_ticker_symbol);

  })

  
  
  //0xe688b84b23f322a994a53dbf8e15fa82cdb71127
  
    }
    
    const getNFTs = async() => {

      const client = new CovalentClient("cqt_rQfmvyvGCjfTfhQ6VGcgtGGwjBhj");
  
      // const resp = await client.NftService.getNftsForAddress("eth-mainnet" , `${userAccount}`)
      const resp = await client.NftService.getNftsForAddress("base-mainnet" , "0xe688b84b23f322a994a53dbf8e15fa82cdb71127")
  
      const nfts = resp.data.items;

      setNFTDetails(nfts);
  
  }

  

  const isConnected = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return false;
    }
    return web3auth.status === "connected";
  };

  const handleLogin = async () => {
    const web3authProvider = await web3auth.connect();

    setProvider(web3authProvider);
    if (web3auth.connected) {
      setLoggedIn(true);

      await createSmartAccount()

    }
  };

   const getUserInfo = async () => {

    // if(web3auth.connected){
        
        const user = await web3auth.getUserInfo();
        console.log(user)

    // }

  };

  const getPopularTokens = async() => {



    try {
        
        let dextoolapi = "https://public-api.dextools.io/trial/v2/token/ether"

        // let dextoolapi = "https://public-api.dextools.io/trial/v2/token/ether?sort=socialsInfoUpdated&order=asc&from=2023-10-01T00:00:00.000Z&to=2024-11-01T00:00:00.000Z"

        const apiKey = "RhHELjiBDT0jc8p1XZ5E3ZkA0dosXqa8smIuL5s7";

        const resp = await axios.get(dextoolapi , {

            headers: {

                "X-API-KEY": apiKey,
                "Content-Type" : "application/json"

            },

            params: {

                "sort": "socialsInfoUpdated",
                "order": "desc",
                "from": "2023-10-01T00:00:00.000Z",
                "to": "2024-11-01T00:00:00.000Z"


            }

        })

        console.log(resp.data.data.tokens);

        setPopularTokens(resp.data.data.tokens)

        // console.log(resp.data);


    } catch (error) {

        console.log(error.data);

        console.log(error);
        
    }
        

  }



    // useEffect(() => {

    //   if(web3auth.status === "connected"){

    //     const smartAccount = localStorage.getItem("smartAccount");

    //     setUserAccount(smartAccount);

    //   }

    // }, [web3auth.status])

    useEffect(() => {
      // createSmartAccount();
      if (web3auth.status === "connected") {
        const smartAccount = localStorage.getItem("smartAccount");
  
        setUserAccount(smartAccount);
      }
    }, [web3auth.status]);


    return(

        <StateManagement.Provider value={{userAccount , popularTokens, loading , setLoading, inputFields , setInputFields , showSendModal , setShowSendModal , showReceieveModal , setShowReceieveModal , showTokenModal , setShowTokenModal , showNFTModal , setShowNFTModal , isOpen , setLoggedIn, hideDropdown , selectedNetwork , setSelectedNetwork , selectedNetworkIcon , setSelectedNetworkIcon , selectedNavbarHeading , setSelectedNavarHeading , selectedDashboardHeading , transferType , setTransferType , sendTo, setSendTo , amount , setAmount , tokenAddress , setTokenAddress , nftAddress , setNftAddress , nftId , setNftId , ethTokenBalance , ethTokenSymbol , tokenDetails , nftDetails , txDetails , web3auth  , setSelectedDashboardHeading , selectedSendAndRecieveHeading , setSelectedSendAndRecieveHeading , setProvider , setSocialAccount , toggleDropdown , changeNetwork , createSmartAccount , getTokenBalance , getEthereumBalance , getNFTs , getTransactionHistory , handleLogin , transferEther , transferTokens , transferNFT , handleInputChange , sendBatchTransaction , handleInputChange , handleAddInput , getPopularTokens}}>

                {children}

        </StateManagement.Provider>

    )

}


export const UseStateManagement = () => useContext(StateManagement);