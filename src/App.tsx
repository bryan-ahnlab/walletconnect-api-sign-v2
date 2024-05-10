import React from "react";
import "./App.css";

import { useState, useCallback } from "react";

import { Web3Modal } from "@web3modal/standalone";
import { SignClient } from "@walletconnect/sign-client";
import { SessionTypes } from "@walletconnect/types";
import { ErrorResponse } from "@walletconnect/jsonrpc-types";

const projectId = process.env.REACT_APP_PROJECT_ID || "";
const walletId = process.env.REACT_APP_WALLET_ID || "";
const testAccount = process.env.REACT_APP_TEST_ACCOUNT || "";

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

  const createClient = useCallback(async () => {
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
    } catch (error) {
      console.error(`createClient: ${JSON.stringify(error)}`);
    }
  }, []);

  const onSessionConnected = useCallback(
    (sessionNamespace: SessionTypes.Struct) => {
      try {
        setSession(sessionNamespace);
        setAccount(
          sessionNamespace.namespaces.eip155.accounts[0]
            .split(":")
            .slice(2)
            .join(":")
        );
      } catch (error) {
        console.error(`onSessionConnected: ${JSON.stringify(error)}`);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setSignClient(null);
    setSession(null);
    setAccount(null);
  }, []);

  const handleConnect = useCallback(async () => {
    const _signClient = await createClient();
    try {
      if (!_signClient) throw Error("Sign client does not exist.");
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
    } catch (error) {}
  }, [createClient, onSessionConnected]);

  const handleDisconnect = useCallback(async () => {
    if (!signClient) throw Error("Sign client does not exist.");
    try {
      if (session) {
        await signClient.disconnect({
          topic: session.topic,
          reason: { code: 600, message: "Disconnected" } as ErrorResponse,
        });
        reset();
      }
    } catch (error) {
      console.error(`handleDisconnect: ${JSON.stringify(error)}`);
    }
  }, [reset, session, signClient]);

  const handlePersonalSign = useCallback(async () => {
    if (!signClient) throw Error("Sign client does not exist.");
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
    } catch (error) {
      console.error(`handlePersonalSign: ${JSON.stringify(error)}`);
    }
  }, [account, session, signClient]);

  const handleEthSignTransaction = useCallback(async () => {
    if (!signClient) throw Error("Sign client does not exist.");
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
    } catch (error) {
      console.error(`handleEthSignTransaction: ${JSON.stringify(error)}`);
    }
  }, [account, session, signClient]);

  const handleEthSignTypedData = useCallback(async () => {
    if (!signClient) throw Error("Sign client does not exist.");
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
    } catch (error) {
      console.error(`handleEthSignTypedData: ${JSON.stringify(error)}`);
    }
  }, [account, session, signClient]);

  const handleEthSendTransaction = useCallback(async () => {
    if (!signClient) throw Error("Sign client does not exist.");
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
    } catch (error) {
      console.error(`handleEthSendTransaction: ${JSON.stringify(error)}`);
    }
  }, [account, session, signClient]);

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
          className="button"
          onClick={handleConnect}
          disabled={session ? true : false}
        >
          Connect
        </button>
        <button
          className="button"
          onClick={handleDisconnect}
          disabled={!session ? true : false}
        >
          Disconnect
        </button>
        <button
          className="button"
          onClick={handlePersonalSign}
          disabled={!session ? true : false}
        >
          Personal Sign
        </button>
        <button
          className="button"
          onClick={handleEthSignTransaction}
          disabled={!session ? true : false}
        >
          Sign Transaction
        </button>
        <button
          className="button"
          onClick={handleEthSignTypedData}
          disabled={!session ? true : false}
        >
          Sign Typed Data
        </button>
        <button
          className="button"
          onClick={handleEthSendTransaction}
          disabled={!session ? true : false}
        >
          Send Transaction
        </button>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <span style={{ wordBreak: "break-all" }}>
            account status: {session ? "connected" : "disconnected"}
          </span>
          {session ? (
            <span style={{ wordBreak: "break-all" }}>
              account address: {account}
            </span>
          ) : null}
          {session ? (
            <span style={{ wordBreak: "break-all" }}>
              account chainId: {session.namespaces.eip155.chains?.[0]}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default App;
