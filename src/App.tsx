import React from "react";
import "./App.css";

import { useState } from "react";
import { SignClient } from "@walletconnect/sign-client";

import { Web3Modal } from "@web3modal/standalone";
import { SessionTypes } from "@walletconnect/types";
import { ErrorResponse } from "@walletconnect/jsonrpc-types";

const projectId = process.env.REACT_APP_PROJECT_ID as string | "";
const walletId = process.env.REACT_APP_WALLET_ID as string | "";
const testAccount = process.env.REACT_APP_TEST_ACCOUNT as string | "";

const web3Modal = new Web3Modal({
  projectId: projectId,
  standaloneChains: ["eip155:1001"],
  walletConnectVersion: 2,
  explorerRecommendedWalletIds: [walletId],
  explorerExcludedWalletIds: "ALL",
});

function App() {
  const [signClient, setSignClient] = useState<InstanceType<
    typeof SignClient
  > | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  async function createClient() {
    try {
      const metadata = {
        name: "ABC DApp",
        description: "Wallet Connect Web3Modal v2.0 Sample",
        url: "https://abc-dapp.com",
        icons: [
          "https://explorer-api.walletconnect.com/v3/logo/lg/f9854c79-14ba-4987-42e1-4a82abbf5700?projectId=2f05ae7f1116030fde2d36508f472bfb",
        ],
      };

      const signClient = await SignClient.init({
        projectId: projectId,
        metadata: metadata,
      });
      return signClient;
    } catch (e) {
      console.error(e);
    }
  }

  const reset = () => {
    setSignClient(null);
    setSession(null);
    setAccount(null);
  };

  async function onSessionConnected(sessionNamespace: SessionTypes.Struct) {
    try {
      setSession(sessionNamespace);
      setAccount(
        sessionNamespace.namespaces.eip155.accounts[0]
          .split(":")
          .slice(2)
          .join(":")
      );
    } catch (e) {
      console.error(e);
    }
  }

  async function handleConnect() {
    const _signClient = await createClient();
    try {
      if (!_signClient) throw Error("SignClient does not exist");
      const proposalNamespace = {
        eip155: {
          methods: [
            "personal_sign",
            "eth_signTransaction",
            "eth_signTypedData",
            "eth_sendTransaction",
          ],
          chains: ["eip155:1001"],
          events: ["chainChanged", "accountsChanged"],
        },
      };
      const { uri, approval } = await _signClient.connect({
        requiredNamespaces: proposalNamespace,
      });
      if (uri) {
        web3Modal.openModal({ uri });
        const sessionNamespace = await approval();
        setSignClient(_signClient);
        onSessionConnected(sessionNamespace);
        web3Modal.closeModal();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleDisconnect() {
    if (!signClient) throw Error("SignClient does not exist");
    try {
      if (session) {
        await signClient.disconnect({
          topic: session.topic,
          reason: { code: 600, message: "Disconnected" } as ErrorResponse,
        });
        reset();
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handlePersonalSign() {
    if (!signClient) throw Error("SignClient does not exist");
    try {
      if (session && account) {
        const tx = {
          message: "hello world!",
          address: account,
        };
        const response = await signClient.request({
          topic: session.topic,
          chainId: "eip155:1001",
          request: {
            method: "personal_sign",
            params: [tx.message, tx.address],
          },
        });
        console.info(`response: ${response}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEthSignTransaction() {
    if (!signClient) throw Error("SignClient does not exist");
    try {
      if (session && account) {
        const tx = {
          from: account,
          to: testAccount,
          data: "0x",
          value: "0x00",
        };
        const response = await signClient.request({
          topic: session.topic,
          chainId: "eip155:1001",
          request: {
            method: "eth_signTransaction",
            params: [tx],
          },
        });
        console.info(`response: ${response}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEthSignTypedData() {
    if (!signClient) throw Error("SignClient does not exist");
    try {
      if (session && account) {
        const tx = {
          address: account,
          message: {
            types: {
              EIP712Domain: [
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "version",
                  type: "string",
                },
                {
                  name: "chainId",
                  type: "uint256",
                },
                {
                  name: "verifyingContract",
                  type: "address",
                },
              ],
              Person: [
                {
                  name: "name",
                  type: "string",
                },
                {
                  name: "wallet",
                  type: "address",
                },
              ],
              Mail: [
                {
                  name: "from",
                  type: "Person",
                },
                {
                  name: "to",
                  type: "Person",
                },
                {
                  name: "contents",
                  type: "string",
                },
              ],
            },
            primaryType: "Mail",
            domain: {
              name: "Ether Mail",
              version: "1",
              chainId: "1001",
              verifyingContract: "0xa",
            },
            message: {
              from: {
                name: "Cow",
                wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
              },
              to: {
                name: "Bob",
                wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
              },
              contents: "Hello, Bob!",
            },
          },
        };
        const response = await signClient.request({
          topic: session.topic,
          chainId: "eip155:1001",
          request: {
            method: "eth_signTypedData",
            params: [tx.address, tx.message],
          },
        });
        console.info(`response: ${response}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function handleEthSendTransaction() {
    if (!signClient) throw Error("SignClient does not exist");
    try {
      if (session && account) {
        const tx = {
          from: account,
          to: testAccount,
          data: "0x",
          gasLimit: "0x5208",
          value: "0x00",
        };
        const response = await signClient.request({
          topic: session.topic,
          chainId: "eip155:1001",
          request: {
            method: "eth_sendTransaction",
            params: [tx],
          },
        });
        console.info(`response: ${response}`);
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="App" style={{ textAlign: "center", padding: "0 2rem" }}>
      <h1>Wallet Connect Web3Modal v2.0 Sample</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <button
          style={{
            width: "100%",
            minHeight: "3rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            wordBreak: "break-all",
          }}
          onClick={handleConnect}
          disabled={account ? true : false}
        >
          Connect
        </button>
        <button
          style={{
            width: "100%",
            minHeight: "3rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            wordBreak: "break-all",
          }}
          onClick={handleDisconnect}
          disabled={!account ? true : false}
        >
          Disconnect
        </button>
        <button
          style={{
            width: "100%",
            minHeight: "3rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            wordBreak: "break-all",
          }}
          onClick={handlePersonalSign}
          disabled={!account ? true : false}
        >
          Personal Sign
        </button>
        <button
          style={{
            width: "100%",
            minHeight: "3rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            wordBreak: "break-all",
          }}
          onClick={handleEthSignTransaction}
          disabled={!account ? true : false}
        >
          Sign Transaction
        </button>
        <button
          style={{
            width: "100%",
            minHeight: "3rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            wordBreak: "break-all",
          }}
          onClick={handleEthSignTypedData}
          disabled={!account ? true : false}
        >
          Sign Typed Data
        </button>
        <button
          style={{
            width: "100%",
            minHeight: "3rem",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "0.5rem",
            padding: "0.5rem",
            wordBreak: "break-all",
          }}
          onClick={handleEthSendTransaction}
          disabled={!account ? true : false}
        >
          Send Transaction
        </button>
        {account ? (
          <span style={{ wordBreak: "break-all" }}>account: {account}</span>
        ) : null}
      </div>
    </div>
  );
}

export default App;
