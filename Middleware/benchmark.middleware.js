exports.benchmark = (req, res, next) => {
    const startTime = new Date().getTime
    res.on("finish" , function (event) {
        const elapsed = (new Date() - startTime)/1000;
        console.log("Its took " + elapsed + " seconds");
    });
    next();
    const elapsed = (new Date().getTime() - startTime)/1000;
    res.set('X-pref-Time', elapsed);
}