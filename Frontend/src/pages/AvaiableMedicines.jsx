import React, { useEffect, useState } from 'react'
import '../styles/availablemedicines.css'
import HomeTop from '../Components/HomeTop'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import { ToastContainer } from 'react-toastify'
import {Bandage} from 'lucide-react'
import { BriefcaseMedical } from 'lucide-react'
import { Syringe } from 'lucide-react'
import { Pill } from 'lucide-react'
import { Microscope } from 'lucide-react'
import { Stethoscope } from 'lucide-react'
import api from '../api'
import { handleError } from '../utils'
import DataTable from "react-data-table-component";
const AvaiableMedicines = ({data}) => {
    const [search ,setSearch] = useState('');
    const [medicines , setMedicines] = useState(null);
    const [meddata , setMedData] = useState(null);
    const handleChange=(e)=>{
      setSearch(e.target.value);
      const newMedicines = medicines.filter((medicine)=>medicine.name.toLowerCase().includes(e.target.value.toLowerCase()));
      setMedData(newMedicines);
    }
    useEffect(()=>{
        const getMedicines = async()=>{
            const response  = await api.get('/available-medicines' );
            console.log(response);
            if(!response.data.success || !response.data.medicines){
              handleError(response.data.message);
            }
            if(response.data.success && response.data.medicines){
              await setMedicines(response.data.medicines);
              await setMedData(response.data.medicines);
              console.log(medicines);
            }


        }

        getMedicines();
    }, [])

    const columns = [
      {
        name : 'Name',
        selector : row =>row.name,
      },
      {
        name : 'Used for ',
        selector : row =>row.use,
      },
      {
        name : 'Quantity',
        selector : row =>row.quantity,
      }
    ];
    const customStyles = {
      rows: {
        style: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#f9f9f9",
          },
          "&:nth-of-type(even)": {
            backgroundColor: "#ffffff",
          },
          "&:hover": {
            backgroundColor: "#e6f7ff",
            transition: "background-color 0.2s ease",
          },
          fontSize: "14px",
        },
      },
      headCells: {
        style: {
          backgroundColor: "#f0f0f0",
          fontWeight: "bold",
          fontSize: "15px",
        },
      },
    };
  return (
    <>
      <HomeTop data={data} />
      <Navbar />

      <div className="equipment">
        <div className="quantity">
          <Bandage color="black" size={40} />
          <p>Bandages : 120</p>
        </div>
        <div className="quantity">
          <BriefcaseMedical color="black" size={40} />
          <p>First adi Kits : 4</p>
        </div>
        <div className="quantity">
          <Syringe color="black" size={40} />
          <p>Syringes : 30</p>
        </div>
        <div className="quantity">
          <Pill color="black" size={40} />
          <p>Painkillers : 40</p>
        </div>
        <div className="quantity">
          <Microscope color="black" size={40} />
          <p>Microscopes : 2</p>
        </div>
        <div className="quantity">
          <Stethoscope color="black" size={40} />
          <p>Technician :3</p>
        </div>
      </div>

      <div className="medicines">
        <div className="utils">
          <h3>Available medicines</h3>
          <input
            type="text"
            value={search}
            onChange={(e) => {
              handleChange(e);
            }}
            placeholder="search for a medicine"
          />
        </div>
        <DataTable
          columns={columns}
          pagination
          data={meddata ? meddata : []}
          customStyles={customStyles}
        />
      </div>

      <div className="request-medicine">
        <h3 id="request">Request for a medicine</h3>
        <form onSubmit={(e) => handleSubmit(e)} id="requestform">
          <label htmlFor="name">Name :</label>
          <input type="text" id="name" name="name" />
          <label htmlFor="quantity">Quantity :</label>
          <input type="text" id="quantity" name="quantity" />
          <button type="submit" id="requestbtn">
            Submit
          </button>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default AvaiableMedicines
