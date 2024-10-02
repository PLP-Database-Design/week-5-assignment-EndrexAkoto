const express = require('express')
const mysql = require('mysql2') // Import MySQL2 module
require('dotenv').config() // Load environment variables from .env file

const app = express()

// Create a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,      // Database host
    user: process.env.DB_USERNAME,  // Database username
    password: process.env.DB_PASSWORD, // Database password
    database: process.env.DB_NAME    // Database name
})

// Connect to the database
connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.stack)
        return
    }
    console.log('Connected to the database.')
})

// 1. Create a GET endpoint to retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients' // SQL query to select patient data

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while retrieving patients.' })
        }
        res.json(results) // Send the retrieved data as JSON
    })
})

// 2. Retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers' // SQL query to select provider data

    connection.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while retrieving providers.' })
        }
        res.json(results) // Send the retrieved data as JSON
    })
})

// 3. Filter patients by First Name
app.get('/patients/first-name/:firstName', (req, res) => {
    const firstName = req.params.firstName // Get the first name from the request parameters
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?' // SQL query to filter patients

    connection.query(query, [firstName], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while retrieving patients by first name.' })
        }
        res.json(results) // Send the retrieved data as JSON
    })
})

// 4. Retrieve all providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
    const specialty = req.params.specialty // Get the specialty from the request parameters
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?' // SQL query to filter providers

    connection.query(query, [specialty], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'An error occurred while retrieving providers by specialty.' })
        }
        res.json(results) // Send the retrieved data as JSON
    })
})

// Listen to the server
const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})
