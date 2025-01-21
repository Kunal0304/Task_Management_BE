import db from "../../models/index.js";

// Get all contacts
const getAllContactDetails = async (req, res) => {
  try {
    const contacts = await db.ContactDetail.findAll(); // Sare contacts fetch karte hain
    res.status(200).json(contacts); // Response me JSON data bhejte hain
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new contact
const createContactDetail = async (req, res) => {
  try {
    const { username, mobile_no, email, message } = req.body; // Request body se data lete hain
    const contact = await db.ContactDetail.create({
      username,
      mobile_no,
      email,
      message,
    }); // Contact create karte hain
    res.status(201).json(contact); // Response me created contact bhejte hain
  } catch (error) {
    res.status(500).json({ message: "Error creating contact", error });
  }
};

export { getAllContactDetails, createContactDetail };
