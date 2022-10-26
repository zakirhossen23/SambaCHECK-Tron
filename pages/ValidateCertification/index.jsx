import React, { useEffect, useState } from "react";
import Head from "next/head";
import UseFormInput from "../../components/components/UseFormInput";
import UseFormTextArea from "../../components/components/UseFormTextArea";
import { Header } from "../../components/layout/Header";
import { Nav } from "../../components/layout/Nav";
import NavLink from "next/link";
import isServer from "../../components/isServer";
import { NFTStorage, File } from "nft.storage";
import emailjs from '@emailjs/browser';
import styles from "./ValidateCertification.module.css";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsPlus, TypeZoomOut } from "@heathmont/moon-icons-tw";
import { Checkbox } from "@heathmont/moon-core-tw";

export default function ValidateCertification() {
  const [Alert, setAlert] = useState('');

  if (isServer()) return null;
  const [Wallet, WalletInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Wallet",
    id: "",
  });
  const [NumberBox, NumberBoxInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Number",
    id: "",
  });

  async function SendMessage(id) {
    const certificate_url = `${`http://${window.location.host}/Certificate?[${id}]`}`;
    let userinfo = await window.contract._person_uris(Number(window.localStorage.userid)).call();

    var templateParams = {
      to: userinfo.email,
      name: userinfo.username,
      email: "sambachecknoreply@gmail.com",
      certificate_number: NumberBox,
      certificate_url: certificate_url
    };

    await emailjs.send('service_zyyof4z', 'template_simq55m', templateParams, "YGwUx1mfxEBEUYepi")
      .then(function (response) {
        console.log('SUCCESS!', response.status, response.text);


      }, function (error) {
        warnMessage.style = "";
        console.log('FAILED...', error);
      });

  }

  function activateWarningModal(TextAlert) {
    var alertELM = document.getElementById("alert");
    document.getElementById("workingalert").style.display = "none";
    alertELM.style.display = 'block';
    setAlert(TextAlert)
  }

  function activateWorkingModal(TextAlert) {
    var alertELM = document.getElementById("workingalert");
    document.getElementById("alert").style.display = "none";
    alertELM.style.display = 'block';
    setAlert(TextAlert)
  }
  //Downloading plugin function
  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  //Creating plugin function
  async function CreatePlugin(id) {
    const output = `<html><head></head><body><iframe src="${`http://${window.location.host}/Certificate?[${id}]`}"  style="width: 100%;height: 100%;" /></body></html>`;
    // Download it
    const blob = new Blob([output]);
    const fileDownloadUrl = URL.createObjectURL(blob);
    downloadURI(fileDownloadUrl, "Generated Create Certificate Plugin.html");
    console.log(output);
  }


  //Function after clicking Validate Certificate Button
  async function ValidateCertificate() {
    var ValidateBTN = document.getElementById("ValidateBTN");
    ValidateBTN.disabled = true;

    console.log("======================>Validate Certificate");
    try {

      // Validate in Smart contract
      let validating = await window.contract.validate_certificate(Wallet.toLowerCase(), NumberBox).call();

      console.log(validating);
      if (validating !== "false") {
        //Valid certificate
        activateWorkingModal("Valid Certificate!");
        if (document.getElementById("plugin_certificate")?.checked === true) await CreatePlugin(validating);
        if (document.getElementById("emailchecked")?.checked === true) await SendMessage(validating);
      } else {
        activateWarningModal("Invalid Certificate!");
      }

    } catch (error) {
      console.error(error);
    }
  }

  function ValidateBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          {(!window.location.search.includes("embed") && window.localStorage.getItem("Type") === "company") ? (<>
            <NavLink href="/CreateCertification">
              <Button variant="secondary">
                <ControlsPlus className="text-moon-24" />
                Create Certificate
              </Button>
            </NavLink></>) : (<></>)}

          <Button id="ValidateBTN" onClick={ValidateCertificate}>
            <TypeZoomOut className="text-moon-24" />
            Validate Certificate
          </Button>
        </div>
      </>
    );
  }
  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }
  }

  return (
    <>
      <Head>
        <title>Validate Certificates</title>
        <meta name="description" content="Validate Certificates" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {window.location.search.includes("embed") ? (<></>) : (<Header></Header>)}

      <div className={`${styles.container} flex items-center justify-center flex-col gap-8`}>
        <div className={`${styles.title} gap-8 flex justify-between`}>
          <h1 className="text-moon-32 font-bold">Validate Certificates</h1>
        </div>
        <div className={styles.divider}></div>
        <div id='alert' style={{ display: 'none', width: '640px' }} className="bg-red-100 border border-red-400 px-4 py-3 relative rounded text-center text-red-700" role="alert">
          {Alert}
        </div>
        <div id='workingalert' style={{ display: 'none', width: '640px' }} className="bg-teal-100 border-teal-500 px-4 py-3 rounded-b shadow-md text-center text-teal-900" role="alert">
          {Alert}
        </div>
        <div className={`${styles.form} flex flex-col gap-8`}>
          <div>
            <h6>Wallet</h6>
            {WalletInput}
          </div>

          <div>
            <h6>Number</h6>
            {NumberBoxInput}
          </div>
          <div className="flex flex-col">
            <Checkbox label="Generate Certificate" id="plugin_certificate" />
            {window.localStorage.getItem("login-type") === "email" ? (<>
              <Checkbox label=" Send to email?"  id="emailchecked" />
            </>) : (<></>)}
          </div>



          <ValidateBTN />
        </div>
        <div className={styles.divider}></div>
      </div>
    </>
  );
}
