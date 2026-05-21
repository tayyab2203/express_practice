const roleMiddleware = (...allowedRoles) => {

  return (req, res, next) => {

    // req.user auth middleware se aa raha hai
    const userRole = req.user.role;

    // check role included hai ya nahi
    if (!allowedRoles.includes(userRole)) {

      return res.status(403).json({
        message: "Access Denied"
      });

    }

    next();
  };
};

module.exports = roleMiddleware;