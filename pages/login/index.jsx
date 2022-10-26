import React, { useState, useEffect } from "react";
import { Header } from "../../components/layout/Header";
import Head from "next/head";
import styles from "./Login.module.scss";
import UseFormInput from "../../components/components/UseFormInput";
import isServer from "../../components/isServer";
import { Button } from "@heathmont/moon-core-tw";

let redirecting = "";
export default function Login() {
  const [ConnectStatus, setConnectStatus] = useState(true);
  const [SecletedTab, setSecletedTab] = useState(0);
  const [Alert, setAlert] = useState('');

  //Login Input fields
  const [LoginEmailBox, LoginEmailBoxInput] = UseFormInput({
    defaultValue: "",
    type: "email",
    placeholder: "Email",
    id: "",
  });
  const [LoginPasswordBox, LoginPasswordBoxInput] = UseFormInput({
    defaultValue: "",
    type: "password",
    placeholder: "Password",
    id: "",
  });

  //Regidster Input fields  
  const [RegisterUsernameBox, RegisterUsernameBoxInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Username",
    id: "",
  });
  const [RegisterEmailBox, RegisterEmailBoxInput] = UseFormInput({
    defaultValue: "",
    type: "email",
    placeholder: "Email",
    id: "",
  });
  const [RegisterPasswordBox, RegisterPasswordBoxInput] = UseFormInput({
    defaultValue: "",
    type: "password",
    placeholder: "Password",
    id: "",
  });



  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      redirecting = m[1];
    }
  }

  function activateWarningModal(TextAlert) {
    var alertELM = document.getElementById("alert");
    alertELM.style.display = 'block';
    setAlert(TextAlert)
  }

  const fetchDataStatus = async () => {
    if (
      window.ethereum.selectedAddress != null && window.localStorage.getItem("loggedin") == "true"
    ) {
      setConnectStatus(true);
    } else {
      setConnectStatus(false);
    }
  };
  useEffect(() => {
    if (!isServer()) {
      if (window.ethereum !== undefined) {
        setInterval(() => {
          if (window.ethereum.selectedAddress != null && window.localStorage.getItem("loggedin") == "true") {
            window.location.href = redirecting;
          }
          fetchDataStatus();
        }, 1000);
      }

    }
  }, []);
  if (isServer()) return null;

  //Register
  async function RegisterAccount(BTN) {
    try {
      BTN.disabled = true;
      BTN.classList.remove("active:scale-90")
      BTN.classList.remove("btn-primary")
      BTN.classList.add("cursor-not-allowed")

      await window.contract.register_person(RegisterUsernameBox, RegisterEmailBox, RegisterPasswordBox).send({
        from: window.accountId,
        gasPrice: 1000000000,
        gas: 5_000_000,
      });
      SetTab(2);
    } catch (e) {
      console.error(e)
    }
    BTN.disabled = false;
    BTN.classList.add("active:scale-90")
    BTN.classList.add("btn-primary")
    BTN.classList.remove("cursor-not-allowed")
  }

  //Login
  async function LoginAccount(BTN) {
    try {
      BTN.disabled = true;
      BTN.classList.remove("active:scale-90")
      BTN.classList.remove("btn-primary")
      BTN.classList.add("cursor-not-allowed")

      let isValid = await window.contract.login_person(LoginEmailBox, LoginPasswordBox).call()
      if (isValid === "false")
        activateWarningModal("Login credentials are invalid!");
      else{
        window.localStorage.setItem('loggedin', "true");
        window.localStorage.setItem('Type', "user");
        window.localStorage.setItem('login-type', "email");
        window.localStorage.setItem('userid', isValid);
        window.location.href = redirecting;
      }
      SetTab(2);
    } catch (e) {
      console.error(e)
    }
    BTN.disabled = false;
    BTN.classList.add("active:scale-90")
    BTN.classList.add("btn-primary")
    BTN.classList.remove("cursor-not-allowed")
  }



  async function onClickConnect() {
    let result = await window.ethereum.request({ method: 'eth_requestAccounts' });
    result;
    try {
      const getacc = await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaef3', }], //44787
      });
      getacc;
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaef3', //44787
                chainName: 'Alfajores Celo Testnet',
                nativeCurrency: {
                  name: 'CELO',
                  symbol: 'CELO',
                  decimals: 18,
                },
                rpcUrls: ['https://alfajores-forno.celo-testnet.org'],
              },
            ],
          });
        } catch (addError) {
          // handle "add" error
          console.log(addError);
        }
      }
      // handle other "switch" errors
    }
    window.localStorage.setItem('loggedin', 'true')
    window.localStorage.setItem('login-type', "metamask");
  }
  async function MetamaskLogin() {
    if (typeof window.ethereum === "undefined") {
      window.open(
        "https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn",
        "_blank"
      );
    } else {
      await onClickConnect();
      window.location.href = redirecting;
    }
  }
  function SetTab(id) {
    setSecletedTab(id);
  }

  async function TypeSet(e) {                           //Setting Type (Company/User)
    let type = e.target.getAttribute('type');
    window.localStorage.setItem('Type', type);
    if (type === "user") {
      setSecletedTab(1);
    } else {
      MetamaskLogin();
    }
  }

  function CompanyType() {                             //Company Button    
    return (
      <>
        <div type="company" onClick={TypeSet} className={styles.companyButton}>
          <span type="company" >
            Company
          </span>
        </div>
      </>
    )
  }
  function UserType() {                            //User Button  
    return (
      <>
        <div type="user" onClick={TypeSet} className={styles.userButton}>
          <span type="user">
            User
          </span>
        </div>
      </>
    )
  }

  function EmailBTN() {                             //Email Button    
    return (
      <>
        <div style={{ 'background': "#9E9C9F", width: '100%', fontSize: '1.6rem' }} onClick={() => SetTab(2)} className={styles.companyButton}>
          <span  >
            Login with Email
          </span>
        </div>
      </>
    )
  }
  function MetmaskBTN() {                            //Metamask Button  
    return (
      <>
        <div style={{ 'background': "#FF7000", width: '100%', fontSize: '1.6rem' }} onClick={MetamaskLogin} className={styles.userButton}>
          <span>
            Login with Metamask
          </span>
        </div>
      </>
    )
  }

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="SambaCHECK - Login" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      {(SecletedTab === 0) ? (<>
        <div className={`${styles.container} flex items-center flex-col gap-8`}>
          <div className={`${styles.title} gap-8 flex flex-col`}>
            <h1 className="text-moon-32 font-bold">Login to your account</h1>
          </div>
          <div className={styles.divider}></div>
          <div className={styles.Login_container}>
            <CompanyType />
            <UserType />
          </div>

        </div>
      </>) : ((SecletedTab === 1) ? (<>
        <div className={`${styles.container} flex items-center flex-col gap-8`}>
          <div className={`${styles.title} gap-8 flex flex-col`}>
            <h1 className="text-moon-32 font-bold">Login with email, or metamask</h1>
          </div>
          <div className={styles.divider}></div>
          <div style={{ flexDirection: 'column-reverse' }} className={styles.Login_container}>
            <EmailBTN />
            <MetmaskBTN />
          </div>

        </div>
      </>) : ((SecletedTab === 2) ? (<>
        <div className={`${styles.container} flex items-center flex-col gap-8`}>
          <div className={`${styles.title} gap-8 flex flex-col`}>
            <h1 className="text-moon-32 font-bold">Login with email</h1>
          </div>
          <div className={styles.divider}></div>
          <div style={{ width: '23rem' }} className="flex flex-col gap-2">
            <div id='alert' style={{ display: 'none'}} className="bg-red-100 border border-red-400 px-4 py-3 relative rounded text-center text-red-700" role="alert">
              {Alert}
            </div>
            <div className="gap-1">
              <h6>Email</h6>
              {LoginEmailBoxInput}
            </div>
            <div className="gap-1">
              <h6>Password</h6>
              {LoginPasswordBoxInput}
            </div>
            <div className="flex flex-col">
              <Button onClick={(e)=>{LoginAccount(e.currentTarget)}} >Login</Button>
              <div style={{ marginTop: " 0.5rem" }}>
                <h3 onClick={() => SetTab(3)} className={styles.registerButton}>Create an account</h3>
              </div>
            </div>
          </div>


        </div>
      </>) : (<>
        <div className={`${styles.container} flex items-center flex-col gap-8`}>
          <div className={`${styles.title} gap-8 flex flex-col`}>
            <h1 className="text-moon-32 font-bold">Register</h1>
          </div>
          <div className={styles.divider}></div>
          <div style={{ width: '23rem' }} className="flex flex-col gap-2">
            <div className="gap-1">
              <h6>Username</h6>
              {RegisterUsernameBoxInput}
            </div>
            <div className="gap-1">
              <h6>Email</h6>
              {RegisterEmailBoxInput}
            </div>
            <div className="gap-1">
              <h6>Password</h6>
              {RegisterPasswordBoxInput}
            </div>
            <div className="flex flex-col">
              <Button onClick={(e) => RegisterAccount(e.currentTarget)}>Register</Button>
              <div style={{ marginTop: " 0.5rem", display: 'flex' }}>
                Already have an account? <h3 onClick={() => SetTab(2)} className={styles.registerButton}>Login</h3>
              </div>
            </div>
          </div>


        </div>
      </>)))}

    </>
  );
}
