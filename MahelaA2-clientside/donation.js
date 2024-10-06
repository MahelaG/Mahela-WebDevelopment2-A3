// Extract 'id' from the query string
const urlParams = new URLSearchParams(window.location.search);
const fundraiserId = urlParams.get('id');

// Elements to display fundraiser details
const captionElement = document.getElementById('donation-fundraiser-caption');
const organizerElement = document.getElementById('donation-fundraiser-organizer');
const targetElement = document.getElementById('donation-target');
const currentElement = document.getElementById('donation-current');

// Fetch the fundraiser details
if (fundraiserId) {
    fetch(`http://localhost:3020/api/fundraiser/${fundraiserId}`)
        .then(response => response.json())
        .then(fundraiser => {
            captionElement.textContent = fundraiser.CAPTION;
            organizerElement.textContent = fundraiser.ORGANIZER;
            targetElement.textContent = fundraiser.TARGET_FUNDING;
            currentElement.textContent = fundraiser.CURRENT_FUNDING;
        })
        .catch(error => {
            console.error('Error fetching fundraiser details:', error);
            showMessage('Failed to load fundraiser details.', 'error');
        });
} else {
    showMessage('No fundraiser selected.', 'error');
}

// Handle donation form submission
document.getElementById('donation-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = parseFloat(document.getElementById('amount').value);
    const donorName = document.getElementById('donor-name').value;

    if (amount <= 0) {
        showMessage('Please enter a valid donation amount.', 'error');
        return;
    }

    fetch('/api/donate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            fundraiserId: fundraiserId,
            amount: amount,
            donorName: donorName
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage('Thank you for your donation!', 'success');
            // Optionally, redirect to the fundraiser page or clear the form
        } else {
            showMessage(data.message || 'Failed to process donation.', 'error');
        }
    })
    .catch(error => {
        console.error('Error processing donation:', error);
        showMessage('Failed to process donation.', 'error');
    });
});

// Function to show messages
function showMessage(message, type) {
    const messageContainer = document.getElementById('donation-message');
    messageContainer.textContent = message;
    messageContainer.className = type; 
}
