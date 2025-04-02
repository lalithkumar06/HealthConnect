import { motion } from "framer-motion";
import "../styles/ContactUs.css"; 
const ContactUs = () => {
  return (
    <div className="contact-container">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Contact Us - IIIT Allahabad Health Center
      </motion.h2>

      <motion.div
        className="contact-details"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        <p>
          <strong>Address:</strong> Health Center, IIIT Allahabad, Uttar
          Pradesh, India
        </p>
        <p>
          <strong>Phone:</strong> +91-12345-67890
        </p>
        <p>
          <strong>Email:</strong> healthcenter@iiita.ac.in
        </p>
        <p>
          <strong>Timings:</strong> Mon-Sat: 9 AM - 5 PM
        </p>
      </motion.div>

      <motion.form
        className="contact-form"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <input type="text" placeholder="Your Name" required />
        <input type="email" placeholder="Your Email" required />
        <textarea placeholder="Your Message" required></textarea>
        <button type="submit">Send Message</button>
      </motion.form>
    </div>
  );
};

export default ContactUs;
