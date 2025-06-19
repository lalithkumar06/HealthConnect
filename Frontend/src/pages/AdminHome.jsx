import React, { useEffect, useState } from "react";
import HomeTop from "../Components/HomeTop";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import { handleError } from "../utils";
import DataTable from "react-data-table-component";
import { ToastContainer } from "react-toastify";
import api from "../api";
import "../styles/adminhome.css";

const AdminHome = ({ data }) => {
  document.title = "HealthConnect | Admin Home";
  const [slotData, setSlotData] = useState([]);

  useEffect(() => {
    const getSlotData = async () => {
      try {
        const doctor = data?.user.name;
        const res = await api.post("/getdoctorslots", { doctor });
        if (!res.data.success || !res.data.slots) {
          handleError("No slots found");
          setSlotData([]);
        } else {
          setSlotData(res.data.slots);
        }
      } catch (err) {
        handleError("Error fetching slot data");
        setSlotData([]);
      }
    };

    getSlotData();
  }, [data]);

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
          return <p className="status-label unbooked">No Slot Booked</p>;
        } else if (row.meetingType === "online") {
          return <p className="status-label online">Online Slot</p>;
        } else {
          return <p className="status-label offline">Offline Slot</p>;
        }
      },
    },
  ];

  const customStyles = {
    rows: {
      style: {
        fontSize: "14px",
        minHeight: "60px",
      },
    },
    headCells: {
      style: {
        backgroundColor: "#e9f4ff",
        color: "#1a1a1a",
        fontWeight: 600,
        fontSize: "15px",
        textTransform: "uppercase",
        padding: "10px 16px",
        borderBottom: "1px solid #ccc",
      },
    },
    cells: {
      style: {
        padding: "10px 16px",
      },
    },
  };

  return (
    <>
      <HomeTop data={data} />
      <AdminNavbar />

      <div className="slots">
        <DataTable
          columns={columns}
          data={slotData}
          pagination
          customStyles={customStyles}
          highlightOnHover
          responsive
        />
      </div>

      <Footer />
      <ToastContainer />
    </>
  );
};

export default AdminHome;
