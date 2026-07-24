-- Users table
CREATE TABLE
    users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer',
        ziea_number VARCHAR(50),
        verified BOOLEAN DEFAULT false,
        agency VARCHAR(150),
        bio TEXT,
        location VARCHAR(100),
        phone VARCHAR(30),
        photo_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW ()
    );

-- Listings table
CREATE TABLE
    listings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        price VARCHAR(50) NOT NULL,
        location VARCHAR(100) NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        property_type VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        agent_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW ()
    );

-- Inquiries table
CREATE TABLE
    inquiries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
        listing_id INTEGER REFERENCES listings (id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW ()
    );

-- Favorites table
CREATE TABLE
    favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
        listing_id INTEGER REFERENCES listings (id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW ()
    );

-- Reports table
CREATE TABLE
    reports (
        id SERIAL PRIMARY KEY,
        reporter_id INTEGER REFERENCES users (id) ON DELETE CASCADE,
        listing_id INTEGER REFERENCES listings (id) ON DELETE SET NULL,
        agent_id INTEGER REFERENCES users (id) ON DELETE SET NULL,
        reason TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW ()
    );