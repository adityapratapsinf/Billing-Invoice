import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./billing.css";

function Billing() {
  const [rows, setRows] = useState([]);
  const [totalColArr, setTotalColArr] = useState([]);
  const [totalBill, setTotalBill] = useState(0);
  const [selected, setSelected] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [shopName, setShopName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedRows = JSON.parse(localStorage.getItem("rows_value")) || [];
    const storedTotalColArr =
      JSON.parse(localStorage.getItem("totalColArr")) || [];
    const storedTotalBill = JSON.parse(localStorage.getItem("total_bill")) || 0;
    const storedSelected =
      JSON.parse(localStorage.getItem("selected")) || false;

    setRows(storedRows);
    setTotalColArr(storedTotalColArr);
    setTotalBill(storedTotalBill);
    setSelected(storedSelected);

    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    localStorage.setItem("rows_value", JSON.stringify(rows));
    localStorage.setItem("totalColArr", JSON.stringify(totalColArr));
    localStorage.setItem("total_bill", JSON.stringify(totalBill));
    localStorage.setItem("selected", JSON.stringify(selected));
  }, [rows, totalColArr, totalBill, selected]);

  const patternCheck = (value) => {
    const regex = /^[a-zA-Z0-9\s]*$/;
    return regex.test(value);
  };

  const handleAddItem = () => {
    setRows([...rows, { itemName: "", price: 0, quantity: 0, totalPrice: 0 }]);
  };

  const handleSelectItem = () => {
    setSelected(!selected);
  };

  const handleDeleteItem = () => {
    if (selected) {
      setRows(rows.filter((row) => !row.selected));
    } else {
      setRows(rows.slice(0, -1));
    }
  };

  const handleClear = () => {
    localStorage.clear();
    setRows([]);
    setTotalColArr([]);
    setTotalBill(0);
    setSelected(false);
    setCustomerName("");
    setShopName("");
  };

  const handlePrintBill = () => {
    const d = new Date();
    const month = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let time = d.getHours() + ":" + d.getMinutes();
    let dateTime =
      d.getDate() +
      " " +
      month[d.getMonth()] +
      " " +
      d.getFullYear() +
      " " +
      time;

    if (!customerName) {
      window.alert("Please write the customer name");
      return;
    }

    if (!shopName) {
      window.alert("Please write the shop name");
      return;
    }

    if (rows.length === 0) {
      window.alert("Please add some Item before");
      return;
    }

    let tableInnerStr = `
      <tr>
        <th>Items</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Total Price</th>
      </tr>`;

    for (let i = 0; i < rows.length; i++) {
      if (!rows[i].itemName || rows[i].price === 0 || rows[i].quantity === 0) {
        window.alert("Please fill all the fields");
        return;
      }

      tableInnerStr += `
        <tr>
          <td>${rows[i].itemName}</td>
          <td>${rows[i].price}</td>
          <td>${rows[i].quantity}</td>
          <td>${rows[i].totalPrice}</td>
        </tr>`;
    }

    const win = window.open("", "", "height=650, width=960");
    win.document.write(`
      <html>
      <head>
        <title>${customerName} ${dateTime}</title>
        <style>
          @page { size: auto;  margin: 0mm; }
          * {    
            -webkit-print-color-adjust: exact !important; 
            color-adjust: exact !important; 
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          :root {
            --primary: #1d3c45;
            --secondary: #303134;
            --primaryFont: 'Source Sans Pro', sans-serif;
            --secFont: 'Nunito', sans-serif;
          }
          html, body {
            height: 100%;
            width: 100%;
          }
          body {
            padding: 2rem;
          }
          .hero {
            background-color: var(--primary);
            padding: 1rem 2rem;
          }
          header {
            width: 100%;    
            padding: 1rem 0rem;    
          }
          h1 {
            color: #d2601a;
            font-family: var(--primaryFont);
          }
          .detail {
            display: grid;
            grid-template-columns: auto auto auto;
            column-gap: 1rem;
            align-items: center;
            padding: 2rem 0rem;
          }
          .detail p {
            color: white;
            text-align: center;
            font-family: var(--secFont);
          }
          table {
            width: 100%;
            text-align: center;
            margin: 1rem 0rem;
          }
          td, th {
            padding: 0.5rem 1rem;
            font-family: var(--secFont);
            font-size: 1.25rem;
          }
          #bill-summary {
            width: 50%;
            border-collapse: collapse;
          }
          #bill-summary td {
            border: 1px solid black;
            font-weight: bold;
            font-size: 1.5rem;
            font-family: var(--primaryFont);
          }
        </style>
      </head> 
      <body>
        <div class="hero">
          <header>
            <h1>Billing Made Easy</h1>
          </header>
          <div class="detail">
            <p>${customerName}</p>
            <p>${shopName}</p>
            <p>${dateTime}</p>
          </div>
        </div>
        <table>
          ${tableInnerStr}
        </table> 
        <h1>Bill Summary:</h1>
        <table id="bill-summary">
          <tr>
            <td>Total Items</td>
            <td>${rows.length}</td>
          </tr>
          <tr>
            <td>Total Bill</td>
            <td>${totalBill}</td>
          </tr>
        </table>
      </body>
      </html>`);

    win.document.close();
    win.print();
    win.focus();
  };

  const handleInputChange = (index, field, value) => {
    if (!patternCheck(value)) {
      alert("Please Enter alphanumeric ('a-z', 'A-Z', '0-9') key only");
      return;
    }

    const newRows = [...rows];
    newRows[index][field] = value;

    if (field === "price" || field === "quantity") {
      newRows[index].totalPrice =
        newRows[index].price * newRows[index].quantity;
      const newTotalColArr = newRows.map((row) => row.totalPrice);
      setTotalColArr(newTotalColArr);
      setTotalBill(newTotalColArr.reduce((acc, curr) => acc + curr, 0));
    }

    setRows(newRows);
  };

  const handleCheckboxChange = (index) => {
    const newRows = [...rows];
    newRows[index].selected = !newRows[index].selected;
    setRows(newRows);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location = "/login";
  };

  return (
    <div id="wholebody">
      <div className="hero">
        <div className="head-container">
          <header>
            <h1>Billing Made Easy</h1>
            {isLoggedIn ? (
              <button id="login-button" onClick={handleLogout} >
                Logout
              </button>
            ) : (
              <Link to="/login">
                <button id="login-button">Login</button>
              </Link>
            )}
          </header>
          <div className="detail">
            <input
              type="text"
              id="customer-name"
              placeholder="customer name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
            <input
              type="text"
              id="shop-name"
              placeholder="shop name"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
            
          </div>
        </div>
      </div>
      <div className="container">
        <div className="left">
          <div className="table-body ">
            <table id="items" className="">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="text"
                        className="border border-black"
                        value={row.itemName}
                        onChange={(e) =>
                          handleInputChange(index, "itemName", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                         className="border border-black"
                        value={row.price}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "price",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                         className="border border-black"
                        value={row.quantity}
                        onChange={(e) =>
                          handleInputChange(
                            index,
                            "quantity",
                            parseInt(e.target.value)
                          )
                        }
                      />
                    </td>
                    <td>{row.totalPrice}</td>
                    <td>
                      <input
                        type="checkbox"
                         className="border border-black"
                        checked={row.selected || false}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div id="btn-container">
            <button id="add-item" onClick={handleAddItem} className="bg-orange-400 font-semibold">
              Add Item
            </button>
            <button id="delete-item" onClick={handleDeleteItem} className="bg-orange-400 font-semibold">
              Delete Item
            </button>
            <button id="clear-data" onClick={handleClear} className="bg-orange-400 font-semibold">
              Clear Data
            </button>
            <button id="print-bill" onClick={handlePrintBill} className="bg-orange-400 font-semibold">
              Print Bill
            </button>
          </div>
        </div>
        <div className="right">
          <div className="table-body">
            <table id="bill-summary">
              <thead>
                <tr>
                  <th>Total Items</th>
                  <th>Total Bill</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{rows.length}</td>
                  <td>{totalBill}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="clear-btn">
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Billing;
