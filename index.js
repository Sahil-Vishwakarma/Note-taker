const express = require('express')
const app = express();
const path = require('path')
const fs = require('fs');

app.use(express.json());
app.use(express.urlencoded({extended : true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine' , 'ejs');

app.get('/', (req, res) => {
    fs.readdir('./files', (err, files) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading files');
        }
       res.render('index', { files: files });
    });
})

app.post('/create', (req, res) => {
    if (!req.body.title || !req.body.details) {
        return res.status(400).send('Title and details are required');
    }
    const fileName = req.body.title.trim()
                        .split(' ')
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join('');
    fs.writeFile(`./files/${fileName}.txt`, req.body.details.trim(), (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error creating file');
        }
        res.redirect('/');
    })
})

app.get('/file/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }
        res.render('info', { content: data, filename: req.params.filename });
    })  
})

app.get('/edit/:filename', (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading file');
        }
        const fileName = req.params.filename.split('.')[0];
        res.render('edit', { content: data, filename: fileName });
    })  
})

app.post('/edit/done/:filename', (req, res) => {
    if( !req.body.title || !req.body.details) {
        return res.status(400).send('Title and details are required');
    }

    const existingFileName = path.join('./files', req.params.filename + '.txt');
    const newFileName = path.join('./files', req.body.title.trim()
                        .split(' ')
                        .map((word) => word[0].toUpperCase() + word.slice(1))
                        .join('') + '.txt');

    fs.rename(existingFileName, newFileName, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error renaming file');
        }

        fs.writeFile(newFileName, req.body.details.trim(), (err) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Error writing file');
            }
            res.redirect('/');
        });
    });
});

app.listen(3000);