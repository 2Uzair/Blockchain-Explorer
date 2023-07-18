import React, { useEffect, useState } from 'react';
import logo from '../imges/logo.png'
import './Home.css';

export default function Home(props) {
  const [blockNumber, setBlockNumber] = useState();
  const [gasPrice, setGasPrice] = useState();

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await props.alchemy.core.getBlockNumber());
    }

    async function getGasPrice() {
      const gasPriceWei = await props.alchemy.core.getGasPrice();
      const gasPriceGwei = gasPriceWei.div(1e9); // Convert from Wei to Gwei
      setGasPrice(gasPriceGwei.toString());
    }

    getBlockNumber();
    getGasPrice();

    const interval = setInterval(() => {
      getBlockNumber();
      getGasPrice();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div className='header-div'>
      <h2>Ethereum Blockchain Explorer</h2>
      <img src={logo} className='img' />
      </div>
      <div className="price-div">
        <div className="left-div">
          <div className="header-text">
            <h3>Gas <span>Price</span></h3>
            <p>{gasPrice} Gwei</p>
          </div>
          <label>MED GAS PRICE</label>
        </div>
        <div className="right-div">
          <div className="header-text">
            <h3>Block</h3>
            <p>{blockNumber}</p>
          </div>
          <label>LAST FINALIZED BLOCK</label>
        </div>
      </div>

      <div className='coming-div'>
        <h2 className='c-text'>More Things Are Coming Soon</h2>
        <p className='c-para'>Check out <span className='text-bold'>Block Details</span> For Latest Block Details and <span className='text-bold'>Latest Transactions</span> For Latest Transactions from Side Bar</p>
      </div>
    </>
  );
}
