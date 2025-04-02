import React, { useState } from "react";
import HomeTop from "../Components/HomeTop";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils";
import { handleError } from "../utils";
import api from "../api";
import ContactUs from "../Components/ContactDetails"
import "../styles/contact.css";
const Contact = ({ data }) => {
  const [formDetails, setFormDetails] = useState({
    name: "",
    email: "",
    query: "",
  });
  const handleChange = (e) => {
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [e.target.name]: e.target.value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/submitquery", formDetails);
      setFormDetails({ name: "", email: "", query: "" });
      if (response.status === 200) {
        setTimeout(() => {
          handleSuccess("Query Submitted");
        }, 1000);
      } else {
        setTimeout(() => {
          handleError(response.data.message);
        }, 1000);
      }
    } catch (err) {
      console.log(err);
      handleError("Internal Server Error");
    }
  };
  return (
    <>
      <HomeTop data={data} />
      <Navbar />
      <form id="queryform" onSubmit={(e) => handleSubmit(e)}>
        <div className="querycontainer">
          <label htmlFor="name">Name :</label>
          <input
            id="name"
            type="text"
            name="name"
            value={formDetails.name}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <label htmlFor="email">Email :</label>
          <input
            id="email"
            type="email"
            name="email"
            value={formDetails.email}
            onChange={(e) => {
              handleChange(e);
            }}
          />
        </div>
        <input
          id="query"
          type="textarea"
          name="query"
          placeholder="Enter your query"
          value={formDetails.query}
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <button id="query-btn" type="submit">
          submit
        </button>
      </form>

      <ContactUs></ContactUs>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default Contact;
