const express = require('express');
const path = require('path');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for demo
const users = [];

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Validation rules
const registrationValidation = [
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').isMobilePhone().withMessage('Valid phone number is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('gender').notEmpty().withMessage('Gender is required'),
    body('terms').equals('true').withMessage('You must accept the terms and conditions')
];

// Registration endpoint
app.post('/api/register', registrationValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false, 
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        const { firstName, lastName, email, phone, age, gender, address, country, state, city, password } = req.body;

        // Check if user already exists
        const existingUser = users.find(user => user.email === email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user object
        const user = {
            id: Date.now().toString(),
            firstName,
            lastName,
            email,
            phone,
            age: age || null,
            gender,
            address: address || '',
            country: country || '',
            state: state || '',
            city: city || '',
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        // Save user
        users.push(user);

        console.log(`✅ New user registered: ${email}`);

        // Return success response
        res.json({ 
            success: true, 
            message: 'Registration successful! Your profile has been submitted successfully.',
            data: {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again.'
        });
    }
});

// Get all users endpoint
app.get('/api/users', (req, res) => {
    res.json({
        success: true,
        data: users.map(user => ({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt
        }))
    });
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log('🚀 Intelligent Registration System Started!');
    console.log(`📍 Server running on http://localhost:${PORT}`);
    console.log(`📧 API available at http://localhost:${PORT}/api/register`);
    console.log(`👥 Users list at http://localhost:${PORT}/api/users`);
    console.log('─────────────────────────────────────────────');
});