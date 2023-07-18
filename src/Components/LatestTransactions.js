import React, { useEffect, useState } from "react";
import './LatestTransaction.css';
const { Utils } = require("alchemy-sdk");

export default function LatestTransactions(props) {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useEffect(() => {
    const fetchLatestTransactions = async () => {
      try {
        const latestBlockNumber = await props.alchemy.core.getBlockNumber();
        const latestTransactions = [];

        for (let i = 0; i < 10; i++) {
          const blockNumber = latestBlockNumber - i;
          const block = await props.alchemy.core.getBlockWithTransactions(
            blockNumber
          );

          for (const transaction of block.transactions) {
            const detailTransaction = {
              hash: transaction.hash,
              from: transaction.from ? transaction.from : "Unknown",
              to: transaction.to ? transaction.to : "Unknown",
              amount: Utils.formatEther(transaction.value),
              blockNumber: block.number,
              timestamp: new Date(block.timestamp * 1000).toLocaleString(),
              transactionFee: Utils.formatEther(
                transaction.gasPrice.mul(transaction.gasLimit)
              ),
              gasPrice: Utils.formatEther(transaction.gasPrice),
            };
            latestTransactions.push(detailTransaction);
          }
        }

        setTransactions(latestTransactions.slice(0, 10));
      } catch (error) {
        console.error("Error retrieving latest transactions:", error);
      }
    };

    fetchLatestTransactions();

    const interval = setInterval(fetchLatestTransactions, 2000);
    return () => clearInterval(interval);
  }, [props.alchemy]);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const handlePopupClose = () => {
    setSelectedTransaction(null);
  };

  const myStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.385)",
    borderBottom: "2px solid white",
    color: "white",
  };

  return (
    <section className="intro">
      <div className="container">
        <div className="row">
          <div className="col-md-12 offset-md-2">
            <div className="table-responsive">
              <table className="table table-borderless table-dark mb-0">
                <thead>
                  <tr>
                    <th style={myStyle} scope="col">
                      Transaction Hash
                    </th>
                    <th style={myStyle} scope="col">
                      From
                    </th>
                    <th style={myStyle} scope="col">
                      To
                    </th>
                    <th style={myStyle} scope="col">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      onClick={() => handleTransactionClick(transaction)}
                    >
                      <td
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        {transaction.hash.slice(0, 10)}...
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        {transaction.from.slice(0, 10)}...
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        {transaction.to.slice(0, 10)}...
                      </td>
                      <td
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        {transaction.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
      </div>
      <p className="table-para"><strong>Note: </strong> Click On Any Transaction To See Transaction details</p>

      {selectedTransaction && (
        <div
          className="modal fade show"
          id="exampleModalCenter"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
          style={{ display: "block" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLongTitle">
                  Transaction Details
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handlePopupClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div>
                  <div><b>Transaction Hash:</b> {selectedTransaction.hash}</div>
                  <div><b>From:</b> {selectedTransaction.from}</div>
                  <div><b>To:</b> {selectedTransaction.to}</div>
                  <div><b>Amount:</b> {selectedTransaction.amount}</div>
                  <div><b>Block Number:</b> {selectedTransaction.blockNumber}</div>
                  <div><b>Timestamp:</b> {selectedTransaction.timestamp}</div>
                  <div>
                    <b>Transaction Fee:</b> {selectedTransaction.transactionFee}
                  </div>
                  <div><b>Gas Price:</b> {selectedTransaction.gasPrice}</div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={handlePopupClose}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
