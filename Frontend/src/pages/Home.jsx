import React from "react";
import { useNavigate } from "react-router-dom";
import { handleSuccess } from "../utils";
import api from "../api";
import { ToastContainer } from "react-toastify";
import { useState , useEffect} from "react";
import '../styles/home.css';
import Navbar from "../Components/Navbar";
import HomeTop from "../Components/HomeTop";
import Carousel from "../Components/Carausel";
import Footer from "../Components/Footer";
function Home({data}) {
  const [visitData, setVisitData] = useState({ visits: [] }); 
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      try {

          const visitResponse = await api.post("/visitHistory", {
            user: data,
          })

          if (visitResponse.data && visitResponse.data.history) {
            setVisitData(visitResponse.data.history);
          } else {
            setVisitData({ visits: [] }); 
          }
        
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    getData();
  }, []);


  return (
    <>
      <HomeTop data={data} />
      <Navbar />
      <Carousel />
      <h2 id="patient-history">Patient Histroy</h2>
      <div className="visit-history">
        <table className="visit-display">
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Issue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {visitData.visits.map((history, index) => (
              <tr key={index}>
                <td>{history.date?history.date : "NA"}</td>
                <td>{history.time?history.time : "NA"}</td>
                <td>{history.issue?history.issue:"NA"}</td>
                <td>{history.status?history.status : "NA"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h1 id="facility">Facilities</h1>
      <div className="facilities-container">
        <div className="facilities">
          <img src="/img/fac-1.png" alt="facilitty" />
          <p className="facility-info">Wheel Chair</p>
        </div>
        <div className="facilities">
          <img src="/img/fac-2.png" alt="facilitty" />
          <p className="facility-info">Ambulance</p>
        </div>
        <div className="facilities">
          <img src="/img/fac-3.png" alt="facilitty" />
          <p className="facility-info">ECG </p>
        </div>
        <div className="facilities">
          <img src="/img/fac-4.png" alt="facilitty" />
          <p className="facility-info">Oxygen Cylinders</p>
        </div>
        <div className="facilities">
          <img src="/img/fac-5.png" alt="facilitty" />
          <p className="facility-info">24 x 7 drivers</p>
        </div>
        <div className="facilities">
          <img src="/img/fac-6.png" alt="facilitty" />
          <p className="facility-info">First aid </p>
        </div>
      </div>
      <div className="offers-container">
        <div className="offers">
          <img src="/img/dc-1.png" alt="what we offer" />
          <h3>Doctor Consultation</h3>
          <p>"Book appointments with expert doctors for your health needs."</p>
        </div>
        <div className="offers">
          <img src="/img/dc-2.png" alt="what we offer" />
          <h3>Emergency Services</h3>
          <p>
            "Quick access to emergency medical support when you need it most."
          </p>
        </div>
        <div className="offers">
          <img src="/img/dc-3.png" alt="what we offer" />
          <h3>Pharmacy and medicines</h3>
          <p>"Get prescribed medicines easily from our in-house pharmacy."</p>
        </div>
      </div>
      <div className="departments-container">
        <div className="departments">
          <h2>Gynecologist</h2>
          <p>
            Provides specialized care for female students, offering
            consultations on reproductive health, menstrual issues, and overall
            well-being.
          </p>
        </div>
        <div className="departments">
          <h2>Orthopedician</h2>
          <p>
            Helps students with bone, joint, and muscle-related problems,
            treating sports injuries, fractures, and posture-related concerns.
          </p>
        </div>
        <div className="departments">
          <h2>Homeoppathic doctor</h2>
          <p>
            Offers alternative medicine solutions for common ailments,
            allergies, and chronic conditions using natural remedies.
          </p>
        </div>
        <div className="departments">
          <h2>Pharmacists</h2>
          <p>
            Dispense prescribed medicines, guide students on proper medication
            usage, and provide over-the-counter remedies for minor health
            issues.
          </p>
        </div>

        <div className="departments">
          <h2>Physiotherapists</h2>
          <p>
            Supports students recovering from injuries, muscle strains, and
            postural issues through therapeutic exercises and rehabilitation.
          </p>
        </div>
        <div className="departments">
          <h2>Lab Technician</h2>
          <p>
            Conducts diagnostic tests, including blood work and screenings, to
            assist doctors in diagnosing and monitoring health conditions.
          </p>
        </div>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
  
}

export default Home;
