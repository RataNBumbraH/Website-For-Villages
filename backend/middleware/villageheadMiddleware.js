const villageHeadOnly = (req,res,next)=>{

if(req.user && req.user.role==="villagehead"){
next()
}else{
res.status(403).json({message:"Only Village Head allowed"})
}

}

export default villageHeadOnly