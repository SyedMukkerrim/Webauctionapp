import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import Item from "./components/Items";
import itemService from "./services/items";
import loginService from "./services/login";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import AuctionForm from "./components/AuctionForm";
import AuctionList from "./auction/AuctionList";

import "./css/app.css";
import Header from "./auction/Header";
import CreditCardForm from "./components/CreditCardForm";
import { ToastContainer, toast } from "react-toastify";
import { Shipment } from "./auction/Shipment";
import { TrackingOrder } from "./auction/TrackingOrder";
import { OrderList } from "./auction/OrderList";
import { CreateAuction } from "./auction/CreateAuction";

const Home = () => {
  return <div>Home Page</div>;
};

const Listings = ({ items }) => {
  return (
    <div>
      <h2>Items</h2>
      {items.map((item) => (
        <Link key={item.id} to={`/bid/${item.id}`}>
          <Item item={item} />
        </Link>
      ))}
    </div>
  );
};

const Bidding = () => {
  return <div>Bid Page</div>;
};

const CreditCard = () => {
  return (
    <div>
      <CreditCardForm />{" "}
    </div>
  );
};

const App = () => {
  const [items, setItems] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    itemService
      .getAll()
      .then((items) => {
        if (items && items.length > 0) setItems(items);
      })
      .catch((error) => console.log("err", error));
  }, []);

  const loggedUserJSON = window.localStorage.getItem("loggedappUser");
  useEffect(() => {
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      itemService.setToken(user.token);
    }
  }, [loggedUserJSON]);

  const handleLogin = async (event) => {
    const user = await loginService.login({ username, password });

    window.localStorage.setItem("loggedappUser", JSON.stringify(user));
    itemService.setToken(user.token);
    setUser(user);
    setUsername("");
    setPassword("");
  };

  const handleLogout = (event) => {
    event.preventDefault();
    window.localStorage.clear();
    setUser(null);
  };

  const handleLoginSuccess = () => {
    window.location.href = "/";
  };

  const handleRegister = async (userData) => {
    try {
      const response = await fetch("/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      toast.success("Register successfully!");
      window.location.href = "/login";
    } catch (error) {
      alert(error);
    }
  };

  const handleCreateAuction = async (
    itemName,
    category,
    description,
    startingBid,
    startTime,
    startDate
  ) => {
    const auction = await itemService.create({
      itemName,
      category,
      description,
      startingBid,
      startTime,
      startDate,
    });

    setItems(items.concat(auction));
  };

  if (user) {
    return (
      <Router>
        <Header />
        <br />
        <div>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route path="/" element={<AuctionList />} />
            <Route path="/create" element={<CreateAuction />} />
            <Route path="/listing" element={<AuctionList />} />
            <Route path="/listing/:id" element={<AuctionList />} />
            <Route path="/shipment" element={<Shipment />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/tracking/:id" element={<TrackingOrder />} />
            <Route path="/items" element={<Listings items={items} />} />
            <Route path="/items" element={<CreditCard items={CreditCard} />} />
            <Route path="/bid/:id" element={<Bidding />} />
          </Routes>
        </div>
      </Router>
    );
  } else {
    return (
      <Router>
        <Header />
        <br />
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <LoginForm
                  handleLogin={handleLogin}
                  username={username}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  password={password}
                  onLoginSuccess={handleLoginSuccess}
                />
              }
            />
            <Route
              path="/login"
              element={
                <LoginForm
                  handleLogin={handleLogin}
                  username={username}
                  setUsername={setUsername}
                  setPassword={setPassword}
                  password={password}
                  onLoginSuccess={handleLoginSuccess}
                />
              }
            />
            <Route
              path="/register"
              element={<RegisterForm handleRegister={handleRegister} />}
            />
          </Routes>
        </div>
      </Router>
    );
  }
};

export default App;
