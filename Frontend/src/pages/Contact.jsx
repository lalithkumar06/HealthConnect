import React, { useState } from "react";
import HomeTop from "../Components/HomeTop";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils";
import { handleError } from "../utils";
import api from "../api";
import "../styles/contact.css";
import { motion } from "framer-motion";

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
        handleError(response.data.message);
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

      <motion.div
        className="contact-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Contact Us
        </motion.h2>

        <div className="contact-container">
          {/* Query Form */}
          <motion.div
            className="query-form"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3>Send us a Message</h3>
            <form id="queryform" onSubmit={(e) => handleSubmit(e)}>
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
              <label htmlFor="query">Your Query :</label>
              <textarea
                id="query"
                name="query"
                placeholder="Enter your query"
                value={formDetails.query}
                onChange={(e) => {
                  handleChange(e);
                }}
              ></textarea>
              <motion.button
                id="query-btn"
                type="submit"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                Submit
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Details */}
          <motion.div
            className="contact-details"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
          >
            <h3>Health Center Contact Details</h3>
            <p>
              <strong>Address:</strong> IIIT Allahabad, Health Center, Campus
            </p>
            <p>
              <strong>Phone:</strong> +91-12345-67890
            </p>
            <p>
              <strong>Email:</strong> healthcenter@iiita.ac.in
            </p>
            <p>
              <strong>Working Hours:</strong> Mon-Fri, 10:00 AM - 5:00 PM
            </p>
          </motion.div>
        </div>
      </motion.div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default Contact;
