import TronWeb from 'tronweb';
import isServer from "../components/isServer";

let iscalled = false;
const fetchInfo = async () => {
  if (typeof window !== "undefined"){
    if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
      if (await window.localStorage.getItem('login-type') !== "TronLink") {
        const fullNode = 'https://api.nileex.io';
        const solidityNode = 'https://api.nileex.io';
        const eventServer = 'https://event.nileex.io';
        const privateKey = '1468f14005ff479c5f2ccde243ad3b85b26ff40d5a4f78f4c43c81a1b3f13a03';
        const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
        window.accountId = tronWeb.address.fromPrivateKey("1468f14005ff479c5f2ccde243ad3b85b26ff40d5a4f78f4c43c81a1b3f13a03");
        window.contract = await tronWeb.contract().at('TBT8DZwpUCdTknZvvyWbtjn5xG3LK9oqHz');
        iscalled = false;
      } else if (await window.localStorage.getItem('loggedin') === "true") {
        window.contract = await window.tronWeb.contract().at('TBT8DZwpUCdTknZvvyWbtjn5xG3LK9oqHz');
        window.accountId = window.tronWeb.defaultAddress.base58;
        window.account = await window.tronWeb.trx.getAccount(accountId);
        iscalled = false;
  
      }
    }

  }
  iscalled = false;
}

setInterval(function () {
  if (typeof window !== "undefined" ) {
    if (iscalled === false || typeof window.accountId === "undefined"){
      iscalled = true;
      fetchInfo();
    }
  }
}, 100);

