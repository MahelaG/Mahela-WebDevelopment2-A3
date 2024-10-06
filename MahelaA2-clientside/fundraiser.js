// Extract 'id' from query string
const urlParams = new URLSearchParams(window.location.search);
const fundraiserId = urlParams.get('id');

// Elements where fundraiser details will be displayed
const captionElement = document.getElementById('fundraiser-caption');
const organizerElement = document.getElementById('fundraiser-organizer');
const cityElement = document.getElementById('fundraiser-city');
const categoryElement = document.getElementById('fundraiser-category');
const targetElement = document.getElementById('fundraiser-target');
const currentElement = document.getElementById('fundraiser-current');

// Fetch the fundraiser details from the server using the id from query string
if (fundraiserId) {
    fetch(`/api/fundraiser/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            // Populate the HTML with fundraiser data
            captionElement.textContent = fundraiser.CAPTION;
            organizerElement.textContent = fundraiser.ORGANIZER;
            cityElement.textContent = fundraiser.CITY;
            categoryElement.textContent = fundraiser.CATEGORY;
            targetElement.textContent = fundraiser.TARGET_FUNDING;
            currentElement.textContent = fundraiser.CURRENT_FUNDING;
			
			// Update the progress bar
            updateProgressBar(fundraiser.TARGET_FUNDING, fundraiser.CURRENT_FUNDING);
        })
        .catch(error => {
            console.error('Error fetching fundraiser details:', error);
            alert('Failed to load fundraiser details.');
        });
} else {
    alert('No fundraiser selected.');
}

function updateProgressBar(target, current) {
    const progressPercentage = (current / target) * 100;
    document.getElementById('progress').style.width = `${progressPercentage}%`;
}

// Add event listener to "Donate" button
document.getElementById('donate-btn').addEventListener('click', () => {
    window.location.href = `donation?id=${fundraiserId}`;
});

