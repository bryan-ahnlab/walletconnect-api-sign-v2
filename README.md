# WalletConnect - Web3Modal v2.0 & Sign Client 예제

## 프로젝트

본 프로젝트는 안랩 블록체인 컴퍼니의 모바일 지갑, Multi-Party Computation(MPC) Mobile Wallet 서비스를 Decentralized Application(DApp)과 연결하기 위한 것입니다. 사용 대상은 WalletConnect Web3Modal v2.0 및 Sign Client를 활용하여 DApp을 개발하는 TypeScript/JavaScript 개발자입니다.

## 월렛커넥트 라이브러리

본 프로젝트에서 사용하는 월렛커넥트 라이브러리는 `@web3modal/standalone@2.4.3`와 `@walletconnect/sign-client@2.12.2`, 총 두 가지입니다.

- `@web3modal/standalone`는 사용자가 Web3Modal을 통해 DApp에 연결하고 블록체인과 상호작용할 수 있도록 지원하는 UI 라이브러리입니다.

- `@walletconnect/sign-client`는 DApp과 지갑 모두에게 월렛커넥트 2.0 프로토콜에 호환되는 라이브러리를 제공합니다.

## 프로젝트 예제 실행

월렛커넥트 라이브러리를 사용하기 위하여 월렛커넥트 클라우드에 접속하여 발급받은 프로젝트 아이디가 필요합니다. 회원이 아닌 경우, 월렛커넥트 클라우드에 가입한 후 로그인하여 프로젝트를 생성하고 고유 프로젝트 아이디를 적용합니다. 프로젝트 내 .env 파일 내 다음의 부분에 프로젝트 아이디를 입력합니다.

```bash
REACT_APP_PROJECT_ID="프로젝트 아이디"
```

```bash
npm install
npm start
```
