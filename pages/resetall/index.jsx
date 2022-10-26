import React from "react";
import Head from "next/head";
import { Button } from "@heathmont/moon-core-tw";
import { Header } from "../../components/layout/Header";
import UseFormInput from "../../components/components/UseFormInput";
export default function ResetDataFORM() {

  async function resetData() {
    await window.contract.reset_all().send({
      from:window.accountId,
      gasPrice: 1000000000,
      gas: 5_000_000,
    });
  }

  function ResetDataBTN() {
    return (
      <>
        <Button
          style={{ margin: "17px 0 0px 0px", width: "100%" }}
          onClick={resetData}
        >
          Reset All Data
        </Button>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Reset All data</title>
        <meta name="description" content="Add 5 days from now to Event" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>

      <div className="row" style={{ height: "100vh", paddingTop: 140 }}>
        <div className="createevents col">
          <div
            style={{
              background: "transparent",
              padding: "19px",
              borderRadius: "4px",
              height: "100%",
              border: "white solid",
            }}
          >
            <ResetDataBTN />
          </div>
        </div>
      </div>
    </>
  );
}
