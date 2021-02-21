import jwt from "jsonwebtoken";

function auth(req, res, next) {
  try {
    //gets token from cookies using cookies parser
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ errorMessage: "Unauthorized" });
    //returns id of user thats verified
    const verifiedToken = jwt.verify(token, "mySecretkey");
    //putting user in request from verifiedToken for future use in UserRouter
    req.user = verifiedToken.user;
    console.log(verifiedToken);
    //using next so that we can go to async method in customer router
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ errorMessage: "Unauthorized" });
  }
}

export default auth;
