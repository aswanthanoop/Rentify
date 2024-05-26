// Function to load properties with pagination
async function loadProperties(page = 1, limit = 10) {
    try {
        const response = await fetch(`http://localhost:5000/api/properties?page=${page}&limit=${limit}`);
        const { properties, currentPage, totalPages } = await response.json();
        const propertiesList = document.getElementById('properties-list');
        propertiesList.innerHTML = '';
        properties.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.classList.add('property-card');
            propertyCard.innerHTML = `
                <h3>${property.place}</h3>
                <p>Area: ${property.area} sq ft</p>
                <p>Bedrooms: ${property.bedrooms}</p>
                <p>Bathrooms: ${property.bathrooms}</p>
                <p>Nearby Hospitals: ${property.nearbyHospitals}</p>
                <p>Nearby Colleges: ${property.nearbyColleges}</p>
                <p>${property.description}</p>
                <button onclick="showContactDetails('${property.contactDetails}')">I'm Interested</button>
                <button id="like-button-${property._id}" onclick="likeProperty('${property._id}')">Like</button>
                <span id="like-count-${property._id}">${property.likes}</span>
            `;
            propertiesList.appendChild(propertyCard);
        });

        // Pagination
        const paginationSection = document.getElementById('pagination');
        paginationSection.innerHTML = '';
        if (totalPages > 1) {
            for (let i = 1; i <= totalPages; i++) {
                const pageButton = document.createElement('button');
                pageButton.textContent = i;
                pageButton.addEventListener('click', () => {
                    loadProperties(i);
                });
                paginationSection.appendChild(pageButton);
            }
        }
// Function to handle buyer interest
async function registerInterest(propertyId, buyerName, buyerEmail) {
    try {
        const response = await fetch(`http://localhost:5000/api/properties/interest/${propertyId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ buyerName, buyerEmail })
        });
        alert('Interest registered successfully. Seller contact details sent to your email.');
    } catch (error) {
        console.error('Error registering interest:', error);
    }
}

    } catch (error) {
        console.error('Error loading properties:', error);
    }
}
