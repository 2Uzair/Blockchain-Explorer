import React, { useState, useEffect } from "react";
import "./Table.css";

export default function Table(props) {
  const [blockNumber, setBlockNumber] = useState([]);
  const [blockDetails, setBlockDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    async function getLatestBlocks() {
      try {
        const latestBlockNumber = await props.alchemy.core.getBlockNumber();

        const formattedBlocks = [];
        for (let i = 0; i < 10; i++) {
          const block = await props.alchemy.core.getBlock(
            latestBlockNumber - i
          );

          formattedBlocks.push({
            number: block.number,
            hash: block.hash,
            timestamp: block.timestamp,
          });
        }

        setBlockNumber(formattedBlocks);
      } catch (error) {
        console.error("Error retrieving latest blocks:", error);
      }
    }

    getLatestBlocks();

    const interval = setInterval(getLatestBlocks, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBlockClick = async (hash) => {
    try {
      const blockDetails = await props.alchemy.core.getBlockWithTransactions(
        hash
      );
      setBlockDetails(blockDetails);
      setShowPopup(true);
    } catch (error) {
      console.error("Error retrieving block details:", error);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setBlockDetails(null);
  };

  const formatTimestamp = (timestamp) => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const seconds = currentTimestamp - timestamp;

    if (seconds < 60) {
      return `${seconds} sec`;
    } else {
      const minutes = Math.floor(seconds / 60);
      return `${minutes} min`;
    }
  };

  const myStyle = {
    backgroundColor: "rgba(0, 0, 0, 0.385)",
    borderBottom: "2px solid white",
    color: "white",
  };

  return (
    <section>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card mask-custom">
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-borderless text-white mb-0">
                    <thead>
                      <tr>
                        <th style={myStyle} className="table-head" scope="col">
                          Block
                        </th>
                        <th style={myStyle} scope="col">
                          Block Hash
                        </th>
                        <th style={myStyle} scope="col">
                          TimeStamp
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {blockNumber.map((block, index) => (
                        <tr key={index}>
                          <th
                            style={{
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                            scope="row"
                          >
                            {block.number}
                          </th>
                          <td
                            style={{
                              backgroundColor: "transparent",
                              color: "white",
                            }}
                            onClick={() => handleBlockClick(block.hash)}
                          >
                            {block.hash}
                          </td>
                          <td style={{ backgroundColor: 'transparent', color: 'white' }}>
                            {formatTimestamp(block.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className="table-para"><strong>Note:</strong> Click on any Block Hash to see that specific block details</p>
          </div>
        </div>
      </div>

      

      {showPopup && (
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
                  Block Details
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClosePopup}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {blockDetails && (
                  <div>
                    <div>
                      <b>Block Hash:</b> {blockDetails.hash}
                    </div>
                    <div>
                      <b>Block Number:</b> {blockDetails.number}
                    </div>
                    <div>
                      <b>Block TimeStamp:</b>{" "}
                      {formatTimestamp(blockDetails.timestamp)}
                    </div>
                    <div>
                      <b>Block Nonce:</b> {blockDetails.nonce}
                    </div>
                    <div>
                      <b>Block Difficulty:</b> {blockDetails.difficulty}
                    </div>
                    <div>
                      <b>Gas Used:</b> {blockDetails.gasUsed._hex.toString()}
                    </div>
                    <div>
                      <b>Gas Limit:</b> {blockDetails.gasLimit._hex.toString()}
                    </div>
                    <div>
                      <b>Miner:</b> {blockDetails.miner}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                  onClick={handleClosePopup}
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
