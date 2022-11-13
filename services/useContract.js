import { useState, useEffect } from 'react';

export default function useContract() {
	const [contractInstance, setContractInstance] = useState({
		contract: null,
		signerAddress: null,
	});

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (await window.localStorage.getItem('login-type') !== "TronLink") {
					const fullNode = 'https://api.nileex.io';
					const solidityNode = 'https://api.nileex.io';
					const eventServer = 'https://event.nileex.io';
					const privateKey = '1468f14005ff479c5f2ccde243ad3b85b26ff40d5a4f78f4c43c81a1b3f13a03';
					const tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
					const contract = { contract: null, signerAddress: null };

					contract.signerAddress =  tronWeb.address.fromPrivateKey("1468f14005ff479c5f2ccde243ad3b85b26ff40d5a4f78f4c43c81a1b3f13a03");
					contract.contract = await tronWeb.contract().at('TXo5P2dPZ7mBzW3J8RTQdqHAGmMfHpjBoV');
					setContractInstance(contract);
				} else if (await window.localStorage.getItem('loggedin') === "true") {
					const contract = { contract: null, signerAddress: null };
					contract.contract = await window?.tronWeb?.contract()?.at('TXo5P2dPZ7mBzW3J8RTQdqHAGmMfHpjBoV');
					contract.signerAddress = window?.tronWeb?.defaultAddress?.base58;

					setContractInstance(contract);
				}
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	return contractInstance;
}