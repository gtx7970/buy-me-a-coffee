import * as hre from 'hardhat';

async function getBalance(address: string) {
  const balanceBigInt = await hre.waffle.provider.getBalance(address);

  return hre.ethers.utils.formatEther(balanceBigInt);
}

// Logs the Ether balances for a list of addresses.
async function printBalances(addresses: any[]) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases.
async function printMemos(memos: Record<string, any>[]) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(
      `At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`
    );
  }
}

async function main() {
  const [owner, tipper, tipper2, tipper3, tipper4] = await hre.ethers.getSigners();
  console.log('--- tipper ----')
  console.log(owner, tipper, tipper2, tipper3, tipper4);

  // get contract
  const BuyMeACoffee = await hre.ethers.getContractFactory('BuyMeACoffee');
  const buyMeACoffee = await BuyMeACoffee.deploy();

  // depoly
  await buyMeACoffee.deployed();
  console.log('--- address ---')
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];

  await printBalances(addresses);

  // buy coffee !!
  const tip = { value: hre.ethers.utils.parseEther('0.001') };
  await buyMeACoffee
    .connect(tipper)
    .buyCoffee('Carolina', "You're the best!", tip);
  await buyMeACoffee
    .connect(tipper2)
    .buyCoffee('Vitto', 'Amazing teacher', tip);
  await buyMeACoffee
    .connect(tipper3)
    .buyCoffee('Kay', 'I love my Proof of Knowledge', tip);

  console.log('== bought coffee ==');

  await printBalances(addresses);

  // Withdraw.
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balances after withdrawal.
  console.log('== withdrawTips ==');
  await printBalances(addresses);

  console.log('== memos ==');
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
