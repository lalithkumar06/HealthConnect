import React, { useState, useEffect } from "react";
import "../styles/bookslot.css";
import Navbar from "../Components/Navbar";
import HomeTop from "../Components/HomeTop";
import Footer from "../Components/Footer";
import { handleSuccess, handleError } from "../utils";
import { ToastContainer } from "react-toastify";
import api from "../api";
import DataTable from "react-data-table-component";

const BookSlot = ({ data }) => {
  const [slotData, setSlotData] = useState([]);
  const [selectedOption, setSelectedOption] = useState("Dr. Ramesh Kumar");

  useEffect(() => {
    const getSlotData = async () => {
      try {
        const res = await api.post("/getslots", { selectedOption });
        if (!res.data.success || !res.data.slots || !res.data.slots.slot) {
          handleError("No slots found");
          setSlotData([]);
        } else {
          setSlotData(res.data.slots.slot);
        }
      } catch (err) {
        handleError("Error fetching slot data");
        setSlotData([]);
      }
    };

    getSlotData();
  }, [selectedOption]);

  const handleClick = async (type, time) => {
    const slotTime = time;
    const doctor = selectedOption;
    const meetingType = type;

    try {
      const result = await api.post("/bookslot", {
        slotTime,
        doctor,
        meetingType,
      });

      if (!result.data.success) {
        handleError(result.data.message);
      } else {
        handleSuccess("Slot Booked successfully");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      handleError("Booking failed");
    }
  };

  const handleCancel = async (time) => {
    const slotTime = time;
    const doctor = selectedOption;

    try {
      const result = await api.post("/cancelslot", {
        slotTime,
        doctor,
      });

      if (!result.data.success) {
        handleError(result.data.message || "Failed to cancel slot");
      } else {
        handleSuccess("Slot cancelled successfully");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (err) {
      handleError("Cancellation failed");
    }
  };

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const columns = [
    {
      name: "Slot Duration",
      cell: (row) => {
        const timeStr = row.time.trim();
        const cleaned = timeStr.replace(/\s+/g, "");
        const match = cleaned.match(/(\d{1,2}):(\d{2})(AM|PM)/i);

        if (!match) return "Invalid Time";

        let [_, hourStr, minuteStr, period] = match;
        let hour = parseInt(hourStr);
        const minute = parseInt(minuteStr);

        if (period.toUpperCase() === "PM" && hour !== 12) hour += 12;
        if (period.toUpperCase() === "AM" && hour === 12) hour = 0;

        const start = new Date();
        start.setHours(hour, minute, 0, 0);

        const end = new Date(start.getTime() + 15 * 60000);

        const formatTime = (date) =>
          `${date.getHours().toString().padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

        return `${formatTime(start)} - ${formatTime(end)}`;
      },
    },
    {
      name: "Book a Slot",
      cell: (row) => {
        if (row.status === "unbooked") {
          return (
            <>
              <button
                style={{
                  backgroundColor: "#4CAF50",
                  color: "white",
                  height: 30,
                  marginRight: 10,
                  cursor: "pointer",
                }}
                onClick={() => handleClick("online", row.time)}
              >
                Book Online Slot
              </button>
              <button
                style={{
                  backgroundColor: "#4CAF50",
                  cursor: "pointer",
                  color: "white",
                  height: 30,
                }}
                onClick={() => handleClick("offline", row.time)}
              >
                Book Offline Slot
              </button>
            </>
          );
        } else if (row.id === data.user?._id) {
          return (
            <>
              <p
                style={{
                  fontSize: "1.2rem",
                  paddingTop: "3px",
                  background: "aquamarine",
                  width: 110,
                  height: 30,
                  textAlign: "center",
                  alignSelf: "center",
                  marginRight: 15,
                }}
              >
                {row.meetingType}
              </p>
              <button
                style={{
                  backgroundColor: "red",
                  cursor: "pointer",
                  color: "white",
                  height: 30,
                  width: "7rem",
                }}
                onClick={() => handleCancel(row.time)}
              >
                Cancel Slot
              </button>
            </>
          );
        } else {
          return (
            <p
              style={{
                fontSize: "1.2rem",
                paddingTop: "3px",
                background: "aquamarine",
                width: 110,
                height: 30,
                textAlign: "center",
                alignSelf: "center",
                marginRight: 15,
              }}
            >
              Booked
            </p>
          );
        }
      },
    },
  ];

  return (
    <>
      <HomeTop data={data} />
      <Navbar />

      <select id="options" value={selectedOption} onChange={handleChange}>
        <option value="Dr. Ramesh Kumar">Dr. Ramesh Kumar</option>
        <option value="Dr. Arvind Desai">Dr. Arvind Desai</option>
        <option value="Dr. Manish Verma">Dr. Manish Verma</option>
        <option value="Dr. Suresh Iyer">Dr. Suresh Iyer</option>
        <option value="Dr. Anjali Verma">Dr. Anjali Verma</option>
        <option value="Dr. Priya Nair">Dr. Priya Nair</option>
      </select>

      <div className="slotsbooking">
        <DataTable
          columns={columns}
          data={slotData}
          pagination
          highlightOnHover
          responsive
        />
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default BookSlot;
