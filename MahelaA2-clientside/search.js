document.getElementById('search-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const category = document.getElementById('category').value;
            
            const url = `http://localhost:3020/api/search?name=${encodeURIComponent(name)}&category=${encodeURIComponent(category)}`;
            
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    const resultsContainer = document.getElementById('search-results');
                    resultsContainer.innerHTML = ''; // Clear previous results
                    
                    if (data.length === 0) {
                        resultsContainer.innerHTML = '<p>No fundraisers found.</p>';
                        return;
                    }

                    data.forEach(fundraiser => {
                        const div = document.createElement('div');
                        div.innerHTML = `
                            <h2><a href="/fundraiser?id=${fundraiser.FUNDRAISER_ID}">${fundraiser.CAPTION}</a></h2>
                            <p>Organizer: ${fundraiser.ORGANIZER}</p>
                            <p>Category: ${fundraiser.CATEGORY}</p>
                            <p>City: ${fundraiser.CITY}</p>
                        `;
                        resultsContainer.appendChild(div);
                    });
                })
                .catch(error => console.error('Error searching fundraisers:', error));
        });