document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadFundraisers();

    document.getElementById('fundraiser-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('fundraiser-id').value;
        const caption = document.getElementById('fundraiser-caption').value;
        const organizer = document.getElementById('fundraiser-organizer').value;
        const target = document.getElementById('fundraiser-target').value;
        const current = document.getElementById('fundraiser-current').value;
        const city = document.getElementById('fundraiser-city').value;
        const category = document.getElementById('fundraiser-category').value;

        if (id) {
            // Update fundraiser
            fetch(`http://localhost:3020/api/fundraiser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ caption, organizer, target, current, city, category }),
            })
            .then(response => response.json())
            .then(() => {
                loadFundraisers();
                resetFundraiserForm();
            })
            .catch(error => console.error('Error updating fundraiser:', error));
        } else {
            // Add new fundraiser
            fetch('http://localhost:3020/api/fundraisers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ caption, organizer, target, current, city, category }),
            })
            .then(response => response.json())
            .then(() => {
                loadFundraisers();
                resetFundraiserForm();
            })
            .catch(error => console.error('Error adding fundraiser:', error));
        }
    });

    document.getElementById('category-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const id = document.getElementById('category-id').value;
        const name = document.getElementById('category-name').value;

        if (id) {
            // Update category
            fetch(`http://localhost:3020/api/categories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            })
            .then(response => response.json())
            .then(() => {
                loadCategories();
                resetCategoryForm();
            })
            .catch(error => console.error('Error updating category:', error));
        } else {
            // Add new category
            fetch('http://localhost:3020/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            })
            .then(response => response.json())
            .then(() => {
                loadCategories();
                resetCategoryForm();
            })
            .catch(error => console.error('Error adding category:', error));
        }
    });
});

function loadCategories() {
    fetch('http://localhost:3020/api/categories')
        .then(response => response.json())
        .then(categories => {
            const select = document.getElementById('fundraiser-category');
            select.innerHTML = '';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.CATEGORY_ID;
                option.textContent = category.NAME;
                select.appendChild(option);
            });

            const categoriesList = document.getElementById('categories-list');
            categoriesList.innerHTML = categories.map(cat => `
                <div>
                    <span>${cat.NAME}</span>
                    <button onclick="editCategory(${cat.CATEGORY_ID}, '${cat.NAME}')">Edit</button>
                    <button onclick="deleteCategory(${cat.CATEGORY_ID})">Delete</button>
                </div>
            `).join('');
        });
}

function loadFundraisers() {
    fetch('http://localhost:3020/api/fundraisers')
        .then(response => response.json())
        .then(fundraisers => {
            const fundraisersList = document.getElementById('fundraisers-list');
            fundraisersList.innerHTML = fundraisers.map(fundraiser => `
                <div>
                    <span>${fundraiser.CAPTION}</span>
                    <button onclick="editFundraiser(${fundraiser.FUNDRAISER_ID})">Edit</button>
                    <button onclick="deleteFundraiser(${fundraiser.FUNDRAISER_ID})">Delete</button>
                </div>
            `).join('');
        });
}

function editCategory(id, name) {
    document.getElementById('category-id').value = id;
    document.getElementById('category-name').value = name;
}

function deleteCategory(id) {
    fetch(`http://localhost:3020/api/categories/${id}`, {
        method: 'DELETE',
    })
    .then(() => loadCategories())
    .catch(error => console.error('Error deleting category:', error));
}

function editFundraiser(id) {
    fetch(`http://localhost:3020/api/fundraiser/${id}`)
        .then(response => response.json())
        .then(fundraiser => {
            document.getElementById('fundraiser-id').value = fundraiser.FUNDRAISER_ID;
            document.getElementById('fundraiser-caption').value = fundraiser.CAPTION;
            document.getElementById('fundraiser-organizer').value = fundraiser.ORGANIZER;
            document.getElementById('fundraiser-target').value = fundraiser.TARGET_FUNDING;
            document.getElementById('fundraiser-current').value = fundraiser.CURRENT_FUNDING;
            document.getElementById('fundraiser-city').value = fundraiser.CITY;
            document.getElementById('fundraiser-category').value = fundraiser.CATEGORY_ID;
        })
        .catch(error => console.error('Error fetching fundraiser details:', error));
}

function deleteFundraiser(id) {
    fetch(`http://localhost:3020/api/fundraiser/${id}`, {
        method: 'DELETE',
    })
    .then(() => loadFundraisers())
    .catch(error => console.error('Error deleting fundraiser:', error));
}

function resetFundraiserForm() {
    document.getElementById('fundraiser-form').reset();
    document.getElementById('fundraiser-id').value = '';
}

function resetCategoryForm() {
    document.getElementById('category-form').reset();
    document.getElementById('category-id').value = '';
}
