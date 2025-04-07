import React from 'react'
import '../styles/bookslot.css'
import Navbar from '../Components/Navbar'
import HomeTop from '../Components/HomeTop'
import Footer from '../Components/Footer'
import { handleSuccess } from '../utils'
import { handleError } from '../utils'
import { ToastContainer } from 'react-toastify'
import {useState , useEffect} from 'react';
import api from '../api'
const BookSlot = ({data}) => {

  const [slotData, setSlotData] = useState(null);
  const [doctor , setDoctor] = useState("Dr. Ramesh Kumar");
  useEffect(()=>{
    const getSlotData = async()=>{
      const res = api.post("/getslots", doctor);
      if(!res.data.success || !res.data.slots){
        handleError(res.data.message);
      }
      else{
        setSlotData(res.data.slots);
      }
      console.log(slotData);
    }
    getSlotData();
  }, [doctor])
  return (
    <>
        <HomeTop data={data}/>
        <Navbar />



        <Footer />
        <ToastContainer />
    </>
  )
}

export default BookSlot
