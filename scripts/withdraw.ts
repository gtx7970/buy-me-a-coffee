import { ethers } from 'hardhat';
import abi from '../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json';

async function getBalance(provider: any, address: string) {
  const balance = await provider.getBalance(address);
  return ethers.utils.formatEther(balance);
}

async function main() {
  const contractAddress = '0x8C5bb3b635244BA98Fc1c28084b80618f88D2bA0';
  const contractABI = abi.abi;
  const provider = new ethers.providers.AlchemyProvider(
    'goerli',
    process.env.GOERLI_API_KEY
  );

  // signer
  const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  const buyMeACoffee = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  console.log(
    'current balance of owner: ',
    await getBalance(provider, signer.address),
    'ETH'
  );

  const contractBalance = await getBalance(provider, buyMeACoffee.address);

  console.log(
    'current balance of contract: ',
    await getBalance(provider, buyMeACoffee.address),
    'ETH'
  );

  if (contractBalance !== '0.0') {
    console.log('withdrawing funds..');
    const withdrawTxn = await buyMeACoffee.withdrawTips();
    await withdrawTxn.wait();
  } else {
    console.log('no funds to withdraw!');
  }

  console.log(
    'current balance of owner: ',
    await getBalance(provider, signer.address),
    'ETH'
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
