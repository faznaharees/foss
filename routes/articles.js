const express = require('express');
const router = express.Router();

//Bring in Article models
let Article = require('../models/article');
const {check,validationResult}=require('express-validator/check');




//Add route
router.get('/add',function(req,res){

  res.render('add_article',{
    title:'Add Placement'
  });
});



//Add submit post route
router.post('/add',[
  check('title',).not().isEmpty().withMessage('Company name is required'),
  check('author','Company ID is required').not().isEmpty(),
  check('body','Company description is required').not().isEmpty(),
  check('salary','Average Salary is required').not().isEmpty(), 
  check('skill','This form is required').not().isEmpty()

], function(req,res){

  //Get Error
  let errors= req.validationErrors();

  if(errors){
    res.render('add_article',{
      title:'Add Events',
      errors:errors
    });

  } else{
    let article =new Article();
    article.title =req.body.title;
    article.author=req.body.author;
    article.body=req.body.body;
    article.salary=req.body.salary;
    article.skill=req.body.skill;

    article.save(function(err){
      if(err){
        console.log(err);
        return;
      }
      else{
        req.flash('success','Article Added');
        res.redirect('/');
      }
    });

  }

});

//Load Edit form
router.get('/edit/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});

//Update submit post route
router.post('/edit/:id',function(req,res){
  let article ={};
  article.title =req.body.title;
  article.author=req.body.author;
  article.body=req.body.body;
  article.salary=req.body.salary;
  article.skill=req.body.skill;

  let query ={_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
      return;
    }
    else{
      req.flash('success','Article Updated')
      res.redirect('/');
    }
  });
});

//Delete Article
router.delete('/:id', function(req,res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//Get Single article
router.get('/:id',function(req,res){
  Article.findById(req.params.id,function(err,article){
    res.render('article',{
      article:article
    });
  });
});
//aa

/*

function ensureAuthenticated(req,res,next){
  if(req.isAuthenticated(){
    return next();
  }else{
    req.flash('danger','Please login');
    res.redirect('/users/login');
  })
}

*/
module.exports= router;