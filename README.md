# WalletConnect - Web3Wallet v2.0 Sign SDK 프로젝트 예제

## 프로젝트 설명

본 프로젝트는 안랩 블록체인 컴퍼니의 모바일 지갑, Multi-Party Computation(MPC) Mobile Wallet 서비스를 Decentralized Application(DApp)과 연결하기 위한 것입니다. 주요 독자 대상은 WalletConnect v2.0 Sign SDK를 활용하여 DApp을 개발하는 TypeScript/JavaScript 개발자입니다.

## 월렛커넥트 라이브러리

본 프로젝트에서 사용하는 월렛커넥트 라이브러리는 `@walletconnect/sign-client@2.12.2`와 `@web3modal/standalone@2.4.3` 두 가지입니다.

- `@walletconnect/sign-client`는 DApp과 지갑 모두에게 월렛커넥트 2.0 프로토콜에 호환되는 서명 클라이언트를 제공합니다. 브라우저, NodeJS, React-Native 환경에서 호환되며, 개발자가 연결, 종료 및 다양한 메소드를 호출할 수 있는 인스턴스를 생성할 수 있습니다.

- `@web3modal/standalone`는 사용자가 Web3Modal을 통해 DApp에 연결하고 블록체인과 상호작용할 수 있도록 지원하는 UI 라이브러리입니다.

## 프로젝트 예제 실행 방법

프로젝트 내에서 다음 명령어들을 순차적으로 입력하여 실행합니다.

```bash
npm install
npm start
```
