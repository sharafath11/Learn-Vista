router.post("/api/login",auth, () => {
    
})
function auth(req,res,next) {
    const tocken = req.cookies.tocken;
    const refreshTocken = req.cookies.refreshTocken
    const veryfyTocken = JWT.verfy(tocken);
    const verfyRefreshTocen = JWT.veryf(refreshTocken);
    
    if (!veryfyTocken) {
        if (refreshTocken) {
            res.json
        }
    }
        
    
}

//db.collectionName.updateMany({mark:5})
