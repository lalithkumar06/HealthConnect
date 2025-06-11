import React, { useEffect, useState } from "react";
import HomeTop from "../Components/HomeTop";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import '../styles/updatemedicines.css'
import api from "../api";
import UpdaterNavbar from "../Components/UpdaterNavbar";
import "../styles/adminhome.css";

//updater should have the following for medicines
//1.Add medicines
//2.Remove medicines
//3.Update medicine quantity
document.title = "HealthConnect | Update Medicines";
const UpdateMedicines = ({ data }) => {
  const [addmed, setAddMed] = useState({
    name: "",
    use: "",
    quantity: "",
    medicineCode: "",
  });
  const [remmed, setRemMed] = useState({ medicineCode: "" });
  const [updateMed, setUpdateMed] = useState({
    medicineCode: "",
    quantity: "",
  });

  const handleAdd = (e) => {
    setAddMed((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRemove = (e) => {
    setRemMed((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = (e) => {
    setUpdateMed((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const resadd = await api.post("/addmedicine", addmed);
      if (!resadd.data.success) {
        handleError(resadd.data.message);
      } else {
        handleSuccess(resadd.data.message);
        setAddMed({ name: "", use: "", quantity: "", medicineCode: "" });
      }
    } catch (error) {
      handleError("Error adding medicine");
      console.error(error);
    }
  };

  const handleSubmitRemove = async (e) => {
    e.preventDefault();
    try {
      const resremove = await api.delete("/removemedicine", {
        data: { medicineCode: remmed.medicineCode },
      });
      if (!resremove.data.success) {
        handleError(resremove.data.message);
      } else {
        handleSuccess(resremove.data.message);
        setRemMed({ medicineCode: "" });
      }
    } catch (error) {
      handleError("Error removing medicine");
      console.error(error);
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    try {
      const resupdate = await api.put("/updatemedicine", updateMed);
      if (!resupdate.data.success) {
        handleError(resupdate.data.message);
      } else {
        handleSuccess(resupdate.data.message);
        
        setUpdateMed({ medicineCode: "", quantity: "" });
      }
    } catch (error) {
      handleError("Error updating medicine");
      console.error(error);
    }
  };

  return (
    <>
      <HomeTop data={data} />
      <UpdaterNavbar />

      <div className="medicine-management">
        <h2>Add Medicine</h2>
        <div className="add-medicine">
          <form onSubmit={handleSubmitAdd}>
            <label htmlFor="name">Name:</label>
            <input
              name="name"
              type="text"
              placeholder="Medicine name"
              value={addmed.name}
              onChange={handleAdd}
              required
            />

            <label htmlFor="use">Use:</label>
            <input
              name="use"
              type="text"
              placeholder="Medicine use"
              value={addmed.use}
              onChange={handleAdd}
              required
            />

            <label htmlFor="quantity">Quantity:</label>
            <input
              name="quantity"
              type="number"
              placeholder="Available quantity"
              value={addmed.quantity}
              onChange={handleAdd}
              required
            />

            <label htmlFor="medicineCode">Medicine Code:</label>
            <input
              name="medicineCode"
              type="text"
              placeholder="Unique medicine code"
              value={addmed.medicineCode}
              onChange={handleAdd}
              required
            />

            <button type="submit">Add Medicine</button>
          </form>
        </div>

        <h2>Remove Medicine</h2>
        <div className="remove-medicine">
          <form onSubmit={handleSubmitRemove}>
            <label htmlFor="medicineCode">Medicine Code:</label>
            <input
              name="medicineCode"
              type="text"
              placeholder="Enter medicine code to remove"
              value={remmed.medicineCode}
              onChange={handleRemove}
              required
            />

            <button type="submit">Remove Medicine</button>
          </form>
        </div>

        <h2>Update Medicine Quantity</h2>
        <div className="update-medicine">
          <form onSubmit={handleSubmitUpdate}>
            <label htmlFor="medicineCode">Medicine Code:</label>
            <input
              name="medicineCode"
              type="text"
              placeholder="Enter medicine code to update"
              value={updateMed.medicineCode}
              onChange={handleUpdate}
              required
            />

            <label htmlFor="quantity">New Quantity:</label>
            <input
              name="quantity"
              type="number"
              placeholder="Enter new quantity"
              value={updateMed.quantity}
              onChange={handleUpdate}
              required
            />

            <button type="submit">Update Quantity</button>
          </form>
        </div>
      </div>

      <Footer />
      <ToastContainer/>
    </>
  );
};

export default UpdateMedicines;
