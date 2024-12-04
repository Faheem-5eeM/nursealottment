const express=require('express')
const mongoose= require('mongoose')
const path= require('path')
const port=3019;
const app =express();
app.use(express.static(__dirname));


app.use(express.urlencoded({extended:true}))

// mongoose.connect('mongodb://localhost:27017/patients')
const db=mongoose.connection;
db.once('open',()=>{
    console.log("Mongodb connection successful")
})

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    contact: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    adhaar: { type: Number, required: true },
    gender: { type: String, required: true }
});
const Users=mongoose.model("data", userSchema)
app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'form.html'))
})
// app.post('/post', async (req,res)=>{
//     const {name,contact,email,adhaar,gender} =req.body
//     const user= new Users({
//         name,
//         contact,
//         email,
//         adhaar,
//         gender
//     } )
//     await user.save()
//     console.log(user)
//     res.send("Form Submission Successful")
// })

app.post('/post', async (req, res) => {
    const { name, contact, email, adhaar, gender } = req.body;

    if (!name || !contact || !email || !adhaar || !gender) {
        return res.status(400).send("All fields are required");
    }

    try {
        const user = new Users({
            name,
            contact,
            email,
            adhaar,
            gender
        });

        await user.save();
        console.log(user);
        res.send("Form Submission Successful");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});