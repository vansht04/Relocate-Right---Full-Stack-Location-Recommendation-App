# Relocate Right - Location Recommendation Application

## Overview
Relocate Right is a web application that helps users find suitable areas to live based on their current location and personalized preferences. The application analyzes user preferences and recommends the top 3 matching areas with detailed information and interactive map visualization. Users can authenticate via Internet Identity to save their preferences and access personalized recommendations.

## Authentication
- Internet Identity integration for secure user authentication
- Login/logout functionality
- Personalized greeting displaying the user's Principal ID after login
- Anonymous users can still use the basic recommendation features

## Core Features

### User Input Interface
- Input field for current location (city/address)
- Preference selection interface with the following criteria:
  - Proximity to hospitals
  - Proximity to schools
  - Proximity to parks
  - Safety level requirements
  - Proximity to community centers
- Weight/importance controls (sliders or dropdowns) for each preference to allow users to prioritize what matters most to them

### Backend Data Storage and Processing
The backend stores predefined regional data for multiple areas including:
- Area name and coordinates
- Hospital proximity score
- School proximity and quality rating
- Park availability score
- Safety/crime rating
- Community center accessibility score
- Demographic information (population estimate, mayor name, lifestyle description, fun history fact)

The backend also stores user-specific data for authenticated users:
- User preference settings (criteria weights and importance levels)
- Last recommendation results for quick access
- User Principal ID for data association

The backend processes user inputs by:
- Computing weighted match scores for each region based on user preferences and importance weights
- Returning the top 3 recommended areas with match percentages (formatted to one decimal place)
- Providing detailed explanations for why each area was selected
- Saving user preferences and recommendations for authenticated users
- Retrieving saved preferences and last recommendations for returning authenticated users

### Results Display
Display the top 3 recommended areas with:
- Area name and match score percentage
- Lifestyle summary and key highlights
- Detailed explanation of why the area matches user preferences
- Additional information including population, mayor name, and historical trivia

### Interactive Map Visualization
- Integration with OpenStreetMap for real map data
- Display user's current location with a marker
- Show the 3 recommended areas with distinct markers
- Support for pan and zoom interactions
- Responsive map that works on both desktop and mobile

### User Interface
- Clean, intuitive interface branded as "Relocate Right"
- Responsive design optimized for both desktop and mobile screens
- Attractive form layout for preference input
- Well-designed recommendation display cards
- Login/logout buttons and personalized greeting area
- Page title and metadata set as "Relocate Right"
- English language content throughout the application
