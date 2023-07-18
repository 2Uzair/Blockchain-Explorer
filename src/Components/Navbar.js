import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
const { Utils } = require("alchemy-sdk");

const Navbar = (props) => {
  const [searchValue, setSearchValue] = useState('');
  const [balance, setBalance] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    const value = searchValue;
    fetchBalance(value);
  };
  
  const fetchBalance = async (address) => {
    if (address) {
      try {
        const balanceObj = await props.alchemy.core.getBalance(address);
        const balanceValue = Utils.formatEther(balanceObj.toString(), 'ether');
        setBalance(balanceValue);
        setShowModal(true); 
      } catch (error) {
        console.error('Error retrieving balance:', error);
        setShowModal(false); 
      }
    } else {
      setBalance(null); 
      setShowModal(false); 
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <header>
        <nav id="sidebarMenu" className="collapse d-lg-block sidebar collapse">
          <div className="position-sticky">
            <div className="list-group list-group-flush mx-3 mt-4 ">
              <Link
                to="/"
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-tachometer-alt fa-fw me-3"></i>
                <span>Home</span>
              </Link>
              <Link
                to="/block-details"
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-chart-area fa-fw me-3"></i>
                <span>Block Details</span>
              </Link>
              <Link
                to="/latest-transactions"
                className="list-group-item list-group-item-action py-2 ripple"
              >
                <i className="fas fa-lock fa-fw me-3"></i>
                <span>Latest Transactions</span>
              </Link>
            </div>
          </div>
        </nav>

        <nav id="main-navbar" className="navbar navbar-expand-lg navbar-light fixed-top">
          <div className="container-fluid">
            <button
              className="navbar-toggler"
              type="button"
              data-mdb-toggle="collapse"
              data-mdb-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <i className="fas fa-bars"></i>
            </button>

            <a className="navbar-brand" style={{color: 'white'}} href="#">
              Ethereum <strong>Explorer</strong>
            </a>

            <form className="d-none d-md-flex input-group w-auto my-auto" onSubmit={handleSearch}>
              <input
                autoComplete="off"
                type="search"
                className="form-control rounded"
                placeholder="Address...."
                style={{ width: '225px' }}
                value={searchValue || ''}
                onChange={(event) => setSearchValue(event.target.value)}
              />
              <button type="submit" className="btn btn-primary" onClick={() => setShowModal(true)}>Search</button>
            </form>
          </div>
        </nav>
      </header>

      {/* Bootstrap Modal */}
      <div className={`modal fade ${showModal ? 'show' : ''}`} id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden={!showModal} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Balance Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}></button>
            </div>
            <div className="modal-body">
              {balance !== null ? (
                <p>Balance: {balance} ETH</p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
