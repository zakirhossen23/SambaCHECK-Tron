import { Button } from "@heathmont/moon-core-tw";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { Header } from "../components/layout/Header";
import styles from "./Home.module.scss";
import section2Image from "/public/home/section-2-img.jpg";
import section1Image from "/public/home/section-1-img.jpg";
import logo from "/public/Logo.svg";
import logo_white from "/public/Logo-white.svg";

declare let window: any;
export default function Welcome() {
  const router = useRouter();
  function checkcClick() {
  if ( window.localStorage.getItem("loggedin") !== "true") {
      router.push("/login?[/ValidateCertification]");
    } else {
      router.push("/ValidateCertification");
    }
  }

  return (
    <>
      <Head>
        <title>SambaCHECK</title>
        <meta name="description" content="SambaCHECK" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={styles.section}>
        <div className={styles.text}>
          <div className={`${styles.logo} pb-4`}>
            <Image height={400} width={400} src={logo} alt="" />
          </div>
          <p className="py-4 text-justify">      
            SambaCHECK is a plugin that provides a web3 security infrastructure on TRON  
            for organizations, where they can make a non-fungible token (NFT) certification
            for each product automatically. SambaCHECK creates a new layer of security
            where brands can protect their products by providing a unique certification
            which will be generated when the product is selling. SambaCHECK helps 
            customers making better decisions, by providing information of the product,
            which helps not only countering counterfeiting/forgery but also creating 
            awareness of the impact of a product on the environment.


          </p>
          <div className="pt-4">
            <Button onClick={checkcClick}>Let&apos;s check</Button>
          </div>
        </div>
        <div className={styles.image}>
          <Image src={section1Image} objectFit="cover" layout="fill" alt="" />
        </div>
      </div>
      <div className={`${styles.section} ${styles["section-dark"]}`}>
        <div className={styles.image}>
          <Image src={section2Image} objectFit="cover" layout="fill" alt="" />
        </div>
        <div className={styles.text}>
          <div className={`${styles.logo} pb-4`}>
            <Image src={logo_white} width={450} height={400} alt="" />
          </div>
          <p className="py-4 text-justify">
            SambaCHECK is a plugin that provides a web3 security infrastructure on TRON  
            for organizations, where they can make a non-fungible token (NFT) certification
            for each product automatically. SambaCHECK creates a new layer of security
            where brands can protect their products by providing a unique certification
            which will be generated when the product is selling. SambaCHECK helps 
            customers making better decisions, by providing information of the product,
            which helps not only countering counterfeiting/forgery but also creating 
            awareness of the impact of a product on the environment.

          </p>
          <div className="pt-4">
            <Button onClick={checkcClick}>Let&apos;s check</Button>
          </div>
        </div>
      </div>
    </>
  );
}
