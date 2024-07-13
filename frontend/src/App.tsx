import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from 'react-hot-toast';
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home/Home";
import Signup from "./components/Signup/Signup";
import Signin from "./components/Signin/Signin";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Events from "./pages/Events/Events";
import FullEvent from "./pages/FullEvent/FullEvent";
import CreateEvent from "./components/CreateEvent/CreateEvent";
import ManageEvents from "./pages/MangeEvents/ManageEvents";
import UpdateEvent from "./components/UpdateEvent/UpdateEvent";
import Purchases from "./pages/Purchases/Purchases";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />
      <Toaster/>
      <div className="container min-w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/events" element={<Events />} />
          <Route path="/event/:id" element={<FullEvent />} />
          <Route path="/createEvent" element={<CreateEvent />} />
          <Route path="/manageEvents" element={<ManageEvents />} />
          <Route path="/purchases" element={<Purchases />} />
          <Route path="/updateEvent/:id" element={<UpdateEvent />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
