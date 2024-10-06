var dbcon = require("../database");
var connection = dbcon.getconnection();
connection.connect();
var express = require('express');
var router = express.Router();


// 1. Get all active fundraisers including the category
router.get('/fundraisers', (req, res) => {
    var query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = TRUE;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving fundraisers:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(results);
    });
});

// 2. Get all categories
router.get('/categories', (req, res) => {
    var query = 'SELECT * FROM CATEGORY;';
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error retrieving categories:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(results);
    });
});

// 3. Search fundraisers based on category name
router.get('/search', (req, res) => {
    var { name, category } = req.query;
    var query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.ACTIVE = TRUE`;
    
    var queryParams = [];
    
        if (name) {
            query += ' AND f.ORGANIZER LIKE ?';
            queryParams.push(`%${name}%`);
        }

    if (category) {
        query += ' AND c.NAME = ?';
        queryParams.push(category);
    }

    connection.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Error searching fundraisers:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send(results);
    });
});

// 4. Get fundraiser details by ID
router.get('/fundraiser/:id', (req, res) => {
    var { id } = req.params;
    var query = `
        SELECT f.FUNDRAISER_ID, f.ORGANIZER, f.CAPTION, f.TARGET_FUNDING, f.CURRENT_FUNDING, f.CITY, f.ACTIVE, c.NAME AS CATEGORY
        FROM FUNDRAISER f
        JOIN CATEGORY c ON f.CATEGORY_ID = c.CATEGORY_ID
        WHERE f.FUNDRAISER_ID = ?;`;
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error retrieving fundraiser details:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length === 0) {
            res.status(404).send('Fundraiser not found');
            return;
        }
        res.send(results[0]);
    });
});

// 5. Add a donation
router.post('/donate', (req, res) => {
    var { fundraiserId, amount, donorName } = req.body;
    var query = `
        INSERT INTO DONATION (FUNDRAISER_ID, AMOUNT, DONOR_NAME, DONATION_DATE)
        VALUES (?, ?, ?, NOW());
    `;
    connection.query(query, [fundraiserId, amount, donorName], (err, results) => {
        if (err) {
            console.error('Error processing donation:', err);
            res.status(500).send({error: err.message});
            return;
        }

        var updateQuary = `
                UPDATE FUNDRAISER
                SET CURRENT_FUNDING = CURRENT_FUNDING + ?
                WHERE FUNDRAISER_ID = ?;
    `;
        connection.query(updateQuary, [amount, fundraiserId], (err, results) => {
            if (err) {
                console.error('Error updating funding:', err);
                res.status(500).send({error: err.message});
                return;
            }
            res.send({ success: true, message: 'Donation successful' });
        });   
    });   
    
});
// 6. Add a new category
router.post('/categories', (req, res) => {
    var { name } = req.body;
    var query = `INSERT INTO CATEGORY (NAME) VALUES (?)`;
    connection.query(query, [name], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Category added', id: result.insertId });

    });
});


// 7. Update a category by ID
router.put('/categories/:id', (req, res) => {
    var { id } = req.params;
    var { name } = req.body;
    var query = 'UPDATE CATEGORY SET NAME = ? WHERE CATEGORY_ID = ?';
    connection.query(query, [name, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Category updated' });
    });
});

// 8. Delete a category by ID
router.delete('/categories/:id', (req, res) => {
    var { id } = req.params;
    var query = 'DELETE FROM CATEGORY WHERE CATEGORY_ID = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Category deleted' });
    });
});

// 9. Add a new fundraiser
router.post('/fundraisers', (req, res) => {
    var { caption, organizer, target, current, city, category } = req.body;
    var query = `INSERT INTO FUNDRAISER (CAPTION, ORGANIZER, TARGET_FUNDING, CURRENT_FUNDING, CITY, CATEGORY_ID) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    connection.query(query, [caption, organizer, target, current, city, category], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Fundraiser added', id: result.insertId });
    });
});

// 10. Update a fundraiser by ID
router.put('/fundraiser/:id', (req, res) => {
    var { id } = req.params;
    var { caption, organizer, target, current, city, category } = req.body;
    var query = `UPDATE fundraiser 
                   SET CAPTION = ?, ORGANIZER = ?, TARGET_FUNDING = ?, CURRENT_FUNDING = ?, CITY = ?, CATEGORY_ID = ? 
                   WHERE FUNDRAISER_ID = ?`;
    connection.query(query, [caption, organizer, target, current, city, category, id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Fundraiser updated' });
    });
});

// 11. Delete a fundraiser by ID
router.delete('/fundraiser/:id', (req, res) => {
    var { id } = req.params;
    var query = 'DELETE FROM fundraiser WHERE FUNDRAISER_ID = ?';
    connection.query(query, [id], (err, result) => {
        if (err) throw err;
        res.json({ message: 'Fundraiser deleted' });
    });
});

module.exports = router;