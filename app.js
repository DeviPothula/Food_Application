var express=require("express")
var fs=require("fs");
var path=require("path");
var multer=require("multer");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser=require("body-parser");
var app = express();
app.set("view engine","pug");
app.set("views","./views")
app.use(cookieParser());
app.use(session({secret: "its a secret code"}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(express.static(__dirname+"/public"));
app.use(express.static(__dirname+"/myuploads"));
var rf=0;
const storage=multer.diskStorage(
    {
        destination:function(req,file,cb)
        {
            cb(null,'C:/Users/devik/Desktop/Node_Js_wal/Food/myuploads')
        }
    }
)
var abc=multer({storage:storage})
app.get("/",function(req,res)
{
    res.send("welcome");
})
app.post("/register",function(req,res)
{
     var obj=JSON.parse(JSON.stringify(req.body));
     console.log(obj);
     var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
     var item = JSON.parse(r);  
     item.user.push(obj);
     fs.writeFileSync("trail_food.json",JSON.stringify(item),'utf-8');
     res.redirect("/login");
})
app.get("/login",function(req,res)
{
   res.sendFile(__dirname+"/login.html")
})
app.post("/loginform",(req,res)=>
{
    var f=0;
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);  
     var users=item.user;
    users.forEach(function(a,i)
    {
       // console.log(a.username);
     //  console.log(req.body.username);
        if(a.username===req.body.username && a.password===req.body.password)
        {
            f=1;
            console.log("details matched");
            // console.log(req.body.username)
         
        }
    })
    if(f==1)
    {   
        rf=1;
      req.session.user=req.body;
      res.redirect("/home");
     }
     else{
        res.sendFile(__dirname+"/register.html")
        
     }
})
app.use(function(req,res,next)
{
    if(rf==1)
    {
        next();
    }
    else{
        console.log("cookie is not there");
        res.redirect("/login");
    }
})
app.get("/logout",function(req,res)
{
    res.redirect("/login");
})
app.get("/home",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    res.render("homelinks.pug",{data:food_details});
})
app.get("/addfood",function(req,res)
{
    res.sendFile(__dirname+"/addfood.html");
})
app.post("/addfood_data",abc.array("filename"),function(req,res)
{
    var obj=JSON.parse(JSON.stringify(req.body));
    var arr=req.files;
   console.log(req.files)
    var a=[];
    arr.forEach(function(p,i)
    {
        a.push(p.filename);
    })
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);  
    obj.filename=a;
    var c=item.f.length;
    obj.id=c+1;
    obj.chefname=req.session.user.username;
     item.f.push(obj);
     var food_details=item.f;
     fs.writeFileSync("trail_food.json",JSON.stringify(item),'utf-8');
    console.log(food_details)
    res.redirect("/home");
})
app.get("/getfood",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    var locations=[];
    food_details.forEach(function(a,b)
    {
        locations.push(a.location);
    })
    // console.log(locations);
    res.render("getfood.pug",{data:locations});
})
app.get("/details/:id",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    food_details.forEach(function(a,i)
    {
        if(req.params.id==i)
        {
            res.render("details.pug",{data:food_details,id:i})
        }
    })
})
app.get("/placedorders/:id",function(req,res)
{
    // console.log("your product is"+ req.params.id);
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    var obj={};
    food_details.forEach(function(a,b)
    {
        if(a.id==req.params.id)
        {
           obj=a;
        }
    })
    var user_details=item.user;
    var product_details=item.product;
    obj.bname=req.session.user.username;
    // obj.food_name=req.params.id;
    // console.log(obj);
    item.product.push(obj);
    console.log(item.product);
    fs.writeFileSync("trail_food.json",JSON.stringify(item),'utf-8')
    //res.send("orderplaced successfully");
    res.redirect("/home");
})
app.post("/display",function(req,res)
{
    var result=req.body.mylocation;
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    if(result=="all")
    {
        res.render("output.pug",{data:food_details});
    }
    else{
    food_items=[];
    food_details.forEach(function(a,b)
    {
        if(a.location==result)
        {
            food_items.push(a);
        }
    })
    // console.log(food_items);
    res.render("output.pug",{data:food_items,location:result});}
    //  console.log(food_items);
    // res.send(result);
})
app.get("/myorders",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var orders=item.product;
    var myproducts=[];
    orders.forEach(function(a,b)
    {
        if(req.session.user.username===a.bname)
        {
            myproducts.push(a);
        }
    })
   // console.log(myproducts);
    res.render("myproducts.pug",{myproducts:myproducts,name:req.session.user.username})
})
app.get("/recivedorders",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var orders=item.product;
    var myproducts=[];
    orders.forEach(function(a,b)
    {
        if(req.session.user.username!==a.bname)
        {
            myproducts.push(a);
        }
    })
     console.log(myproducts);
    res.render("recivedproducts.pug",{myproducts:myproducts,name:req.session.user.username})
})
app.get("/getedit/:id",function(req,res)
{
    var result;
    var f=0;
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    food_details.forEach(function(a,i)
    {
        if(a.id==req.params.id)
        {
            result=i;
        }
    })
    if(req.session.user.username==food_details[result].chefname)
    {
        f=1
        res.render("editform",{product:food_details[result],id:req.params.id})
    }
    else
    {
        res.render("note.pug",{name:req.session.user.username,ow:food_details[result].chefname});
    }
   
})
app.put("/updateproduct/:id",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    var fn;
    var d;
    food_details.forEach(function(a,i)
    {
        if(a.id==req.params.id)
        {
            result=i;
            d=a.id;
            fn=a.filename;
        }
    })
    food_details[result]=req.body;
    food_details[result].filename=fn;
    food_details[result].id=d;
    console.log(food_details[result]);
    fs.writeFileSync("trail_food.json",JSON.stringify(item),'utf-8')
    res.redirect("/home");
})
app.get("/deleteproduct/:id",function(req,res)
{
    var r = fs.readFileSync(path.resolve(__dirname, 'trail_food.json'));
    var item = JSON.parse(r);
    var food_details=item.f;
    food_details.forEach(function(a,i)
    {
        if(a.id==req.params.id)
        {
            result=i;
        }
    })
    if(req.session.user.username==food_details[result].chefname)
    {
        f=1
       food_details.splice(result,1);
    fs.writeFileSync("trail_food.json",JSON.stringify(item),'utf-8')
    res.redirect("/home");
    }
    else
    {
        res.render("note.pug",{name:req.session.user.username,ow:food_details[result].chefname});
    }
    // food_details.forEach(function(a,i)
    // {
    //     if(a.id==req.params.id)
    //     {
    //         result=i;
    //     }
    // })
    
    
})
app.listen(process.env.PORT);