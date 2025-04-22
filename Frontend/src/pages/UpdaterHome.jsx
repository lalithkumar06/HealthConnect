import React, { useEffect, useState } from "react";
import HomeTop from "../Components/HomeTop";
import AdminNavbar from "../Components/AdminNavbar";
import Footer from "../Components/Footer";
import { handleError, handleSuccess } from "../utils";
import DataTable from "react-data-table-component";
import axios from "axios";
import api from "../api";
import UpdaterNavbar from "../Components/UpdaterNavbar";
import "../styles/updaterHome.css";
const UpdaterHome = ({ data }) => {
  const [medicineRequest, setMedicineRequest] = useState(null);
  const [queries, setQueries] = useState(null);
  const [queryReplies, setQueryReplies] = useState({});
  const handleAccept = async (id) => {
    try {
      const res = await api.post("/acceptrequest", { id });
      if (!res.data.success) {
        handleError(res.data.message);
      } else {
        handleSuccess(res.data.message);
        window.location.reload();
      }
    } catch (err) {
      handleError("Failed to handle change");
    }
  };
  const handleReject = async (id) => {
    try {
      const res = await api.post("/rejectrequest", { id });
      if (!res.data.success) {
        handleError(res.data.message);
      } else {
        handleSuccess(res.data.message);
      }
    } catch (err) {
      handleError("Failed to handle change");
    }
  };
  const handleReply = async (id, replyText, email) => {
    try {
      const res = await api.post("/sendReply", { id, replyText, email });
      if (!res.data.success) {
        handleError(res.data.message);
      } else {
        handleSuccess("Reply Sent Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      handleError("Error sending Reply");
    }
    setQueryReplies((prev) => ({ ...prev, [id]: "" }));
  };
  useEffect(() => {
    const getmedData = async () => {
      try {
        const res = await api.get("/getmedicineRequest");
        if (!res.data.success) {
          handleError(res.data.message);
        } else {
          setMedicineRequest(res.data?.requests);
        }
      } catch (err) {
        console.log(err);
        handleError("Error fetching medicine details");
      }
    };
    const getQueryData = async () => {
      try {
        const result = await api.get("/getQueries");
        if (!result.data.success) {
          handleError(result.data.message);
        } else {
          setQueries(result.data.queries);
        }
      } catch (err) {
        handleError("Unble to get Queries");
      }
    };
    getmedData();
    getQueryData();
  }, []);
  const [visitHistory, setVisitHistory] = useState({
    email: "",
    issue: "",
    status: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setVisitHistory((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/updateHistory", visitHistory);
      if (!res.data.success) {
        handleError(res.data.message);
      } else {
        handleSuccess("History Updated Successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (err) {
      handleError("Error updating history");
    }
  };
  return (
    <>
      <HomeTop data={data} />
      <UpdaterNavbar />

      <div className="query-container">
        <p id="req-head">Queries</p>
        {queries && queries.length > 0 ? (
          <>
            {queries.map((query) => (
              <div className="query-cont" key={query._id}>
                <div className="query-details">
                  <p>
                    {" "}
                    <strong>User Name :</strong> {query.name}
                  </p>
                  <p>
                    <strong>Email : :</strong> {query.email}
                  </p>
                  <p>
                    <strong>Query :</strong> {query.query}
                  </p>
                </div>
                <div className="reply-cont">
                  <input
                    id="reply"
                    placeholder="Reply"
                    value={queryReplies[query._id] || ""}
                    onChange={(e) =>
                      setQueryReplies({
                        ...queryReplies,
                        [query._id]: e.target.value,
                      })
                    }
                  />
                  <button
                    className="reply-btn"
                    onClick={() =>
                      handleReply(
                        query._id,
                        queryReplies[query._id],
                        query.email
                      )
                    }
                  >
                    Send
                  </button>
                </div>
              </div>
            ))}
          </>
        ) : (
          <p>No Current Queries</p>
        )}
      </div>

      <div className="medicine-requests">
        <p id="req-head">Medicine Requests</p>
        {medicineRequest && medicineRequest.length > 0 ? (
          <>
            <div className="request-cont">
              <p>
                <strong>User Name</strong>
              </p>
              <p>
                <strong>Medicine Requested</strong>
              </p>
              <p>
                <strong>Quantity</strong>
              </p>
            </div>
            {medicineRequest.map((request) => (
              <div className="request-cont" key={request._id}>
                <p>{request.user}</p>
                <p>{request.name}</p>
                <p>{request.quantity}</p>
                <button
                  id="accept-btn"
                  onClick={() => handleAccept(request._id)}
                >
                  Accept
                </button>
                <button
                  id="reject-btn"
                  onClick={() => handleReject(request._id)}
                >
                  Reject
                </button>
              </div>
            ))}
          </>
        ) : (
          <p>No Current Requests</p>
        )}
      </div>

      <div className="historyupdater">
        <h2>Update Patient History</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email :</label>
          <input
            type="email"
            id="email"
            placeholder="Enter Email"
            required
            value={visitHistory.email}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="issue">Issue :</label>
          <input
            type="text"
            id="issue"
            placeholder="Enter Issue"
            required
            value={visitHistory.issue}
            onChange={(e) => handleChange(e)}
          />
          <label htmlFor="status">Status :</label>
          <input
            type="text"
            id="status"
            placeholder="Enter Status"
            value={visitHistory.status}
            onChange={(e) => handleChange(e)}
          />
          <button id="update-hist-btn" type="submit">
            Update History
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default UpdaterHome;
