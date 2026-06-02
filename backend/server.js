import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import authroutes from './routes/authroutes.js'
import adminroutes from './routes/adminRoutes.js'
import villageheadroutes from './routes/villageheadRoutes.js'
import campRoutes from './routes/campRoutes.js'
import adminCampRoute from './routes/adminCampRoute.js'

dotenv.config()

//db connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Mongodb Connected Successfully")
})
.catch((error)=>{
    console.log("MongoDB Connection Failed",error.message)
    process.exit(1)
})

const app = express();

app.use(cors(
    {
        origin:"http://localhost:3000",
        methods:['GET','POST','PUT','DELETE'],
        allowedHeaders:['Content-Type','Authorization'],
        credentials:true
    }
));
app.use(express.json())
app.use(authroutes)
app.use(adminroutes)
app.use(villageheadroutes)
app.use('/uploads',express.static('uploads'))
app.use(campRoutes)
app.use(adminCampRoute)

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
});