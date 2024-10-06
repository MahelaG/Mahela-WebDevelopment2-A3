document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3020/api/fundraisers')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('fundraisers-container');
            data.forEach(fundraiser => {
                const fundraiserDiv = document.createElement('div');
                fundraiserDiv.classList.add('fundraiser');

                fundraiserDiv.innerHTML = `
                    <h3>${fundraiser.CAPTION}</h3>
                    <p>Organizer: ${fundraiser.ORGANIZER}</p>
                    <p>Target Funding: $${fundraiser.TARGET_FUNDING}</p>
                    <p>Current Funding: $${fundraiser.CURRENT_FUNDING}</p>
                    <p>City: ${fundraiser.CITY}</p>
                    <p>Category: ${fundraiser.CATEGORY_ID}</p>
                    <a href="/fundraiser?id=${fundraiser.FUNDRAISER_ID}">View Details</a>
                `;
                container.appendChild(fundraiserDiv);
            });
        })
        .catch(error => console.error('Error fetching fundraisers:', error));
});
