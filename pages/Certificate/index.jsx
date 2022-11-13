import React, { useState, useEffect } from "react";
import Head from "next/head";
import isServer from "../../components/isServer";
import styles from "./Certification.module.css";
import useContract from '../../services/useContract'
let id = "";
let iscalled = false;
export default function Certification() {


  const { contract, signerAddress } = useContract()
  const [CertificateURI, setCertificateURI] = useState({
    number: "0",
    price: "0",
    location: "",
    description: "",
    collection: "",
    date: "",
    image: [],
    wallet: ""
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
      id = m[1];
    }
  }


  //Fetching info
  async function fetchinfo() {
    if (id !== "" && contract !== null) {
      let value = await contract._certificate_uris(Number(id)).call()
      setCertificateURI({
        number: value.number,
        price: value.price,
        location: value.location,
        description: value.description,
        collection: value.collection,
        date: value.date,
        wallet: value.wallet
      });
      iscalled = true;
    }

  }
  useEffect(() => {
    fetchinfo();
  }, [contract])

  if (isServer()) return null;



  return (
    <>
      <Head>
        <title>Certificate</title>
        <meta name="description" content="Certificate" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={styles.body}>
        <div className={styles.border_pattern}>
          <div className={styles.content}>
            <div className={styles.inner_content}>
              <h1 className={styles.h2}>Certificate of {CertificateURI.number}</h1>
              <div className={styles.description_title_container}><h3 className={styles.description_title}>Description</h3></div>
              <h3 className={styles.description}>{CertificateURI.description}</h3>
              <p className={styles.wallet_address}> {CertificateURI.wallet}</p>
              <p className={styles.created_by}>Created by</p>
              <p className={styles.issued_date}>{new Date(CertificateURI.date).toDateString()}</p>
              <div className={styles.badge}></div>
            </div>
          </div>
        </div>
      </body>



    </>
  );
}
