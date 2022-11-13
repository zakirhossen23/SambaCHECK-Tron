import React, { useState, useEffect } from "react";
import NavLink from "next/link";
import { Button } from "@heathmont/moon-core-tw";
import { SoftwareLogOut } from "@heathmont/moon-icons-tw";
import isServer from "../../../components/isServer";
import useContract from '../../../services/useContract'
declare let window: any;
export function Nav(): JSX.Element {
  const [acc, setAcc] = useState('');
  const [LoginType, setLoginType] = useState('');
  const [Balance, setBalance] = useState("");
  const { contract, signerAddress } = useContract()

  const [isSigned, setSigned] = useState(false);
  async function fetchInfo() {
    try {
      if (window.localStorage.getItem("loggedin") !== "true") {
        window.document.getElementById("withoutSign").style.display = "block";
        window.document.getElementById("withSign").style.display = "none";
        return;
      }
      if (window.localStorage.getItem("login-type") === "TronLink") {
        if (window?.tronWeb?.defaultAddress?.base58 != null && window?.tronWeb?.defaultAddress?.base58 != undefined) {
          try {
            let Balance = await window.tronWeb.trx.getBalance(window?.tronWeb?.defaultAddress?.base58);

            let subbing = 10;

            setSigned(true);
            if (window.innerWidth > 500) {
              subbing = 20;
            }
            setLoginType("TronLink");
            setAcc(window?.tronWeb?.defaultAddress?.base58.toString().substring(0, subbing) + "...");
            setBalance(Balance / 1000000 + " TRX");

            window.document.getElementById("withoutSign").style.display = "none";
            window.document.getElementById("withSign").style.display = "";
          } catch (error) {

          }

        } else {
          return;
        }

      }
      else if (window.localStorage.getItem("login-type") === "email") {
        try {
          if (contract !== null) {
            // @ts-ignore
            let userinfo = await contract._person_uris(Number(window.localStorage.userid))?.call();
            setAcc(userinfo.username);
            setBalance(userinfo.email);
            setLoginType("email");
            setSigned(true);
            window.document.getElementById("withoutSign").style.display = "none";
            window.document.getElementById("withSign").style.display = "";
          }

        } catch (error) { }
      }
      else {
        setSigned(false);
        window.document.getElementById("withoutSign").style.display = "";
        window.document.getElementById("withSign").style.display = "none";
      }
    } catch (error) {

    }
  }
  useEffect(() => {
    setInterval(async () => {
      await fetchInfo();
    }, 1000)

  }, []);

  async function onClickDisConnect() {
    window.localStorage.setItem("loggedin", "");
    window.localStorage.setItem('login-type', "");
    window.localStorage.setItem('Type', "");
    window.location.href = "/";
  }
  if (isServer()) return <></>;
  return (
    <nav className="main-nav w-full flex justify-between items-center">
      <ul className="flex justify-between items-center w-full">
        {isSigned && !window.location.search.includes("embed") ? (<>
          {(window.localStorage.getItem("Type") === "company") ? (<>
            <li>
              <NavLink href="/CreateCertification">
                <a>
                  <Button style={{ background: "none" }}>Create Certificate</Button>
                </a>
              </NavLink>
            </li>
          </>) : (<></>)}

          <li>
            <NavLink href="/ValidateCertification">
              <a>
                <Button style={{ background: "none" }}>Validate Certificate</Button>
              </a>
            </NavLink>
          </li>
        </>) : (<></>)}

        <li className="Nav walletstatus flex flex-1 justify-end">
          <div className="py-2 px-4 flex row items-center" id="withoutSign">
            <NavLink href="/login?[/]">
              <a>
                <Button variant="tertiary">Log in</Button>
              </a>
            </NavLink>
          </div>

          <div id="withSign" className={`wallets ${(!window.location.search.includes("embed")) ? ("text-goten") : ("")}`} style={{ display: "none" }}>
            <div
              className="wallet"
              style={{ height: 48, display: "flex", alignItems: "center" }}
            >
              <div className="wallet__wrapper gap-4 flex items-center">
                <div className="wallet__info flex flex-col items-end">
                  <a className="text-primary">
                    <div className="font-light">{acc}</div>
                  </a>
                  {window.localStorage.getItem("login-type") === "TronLink" ? (<>
                    <div >{Balance}</div></>) : (<></>)}

                </div>

                <Button iconOnly onClick={onClickDisConnect}>
                  <SoftwareLogOut
                    className="text-moon-24"
                    transform="rotate(180)"
                  ></SoftwareLogOut>
                </Button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
