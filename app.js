//Modules
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const express = require('express')

const app = express()

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))

//Mongo setup
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true})

//Schemas and models
const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = mongoose.model('Article', articleSchema)

app.route('/articles')
    .get((req, res)=>{
        Article.find((err, results)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send(results)
            }
        });
    })

    .post((req, res)=>{
        const newArticle = new Article ({
            title: req.body.title,
            content: req.body.content
        })
        newArticle.save((err)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send('Article added sucessfully!')
            }
        });
    })

    .delete((req, res)=>{
        Article.deleteMany({}, (err)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send('Articles deleted succesfully!')
            }
        })
    })

app.route('/articles/:title')
    .get((req, res)=>{
        Article.findOne({title: req.params.title}, (err, result)=>{
            if(err){
                res.send(err)
            }
            else{
                res.send(result)
            }
        })
    })

    .put((req, res)=>{
        Article.replaceOne(
            {title: req.params.title},
            {title: req.body.title, content: req.body.content},
            (err)=>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send('Sucesfully replaced an article!')
                }
            }
        )
    })

    .patch((req, res)=>{
        Article.updateOne(
            {title: req.params.title},
            {$set: req.body},
            (err)=>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send('Sucesfully updated an article!')
                }
            }
        )
    })
    
    .delete((req, res)=>{
        Article.deleteOne(
            {title: req.body.title},
            (err)=>{
                if(err){
                    res.send(err)
                }
                else{
                    res.send('Sucesfully deleted an article!')
                }
            }
        )
    })

//Server start
app.listen(3000, ()=>{
    console.log('Server started on port 3000')
})