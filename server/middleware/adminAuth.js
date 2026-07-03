// Simple shared-secret check used to protect the internal dashboard endpoint.
// The realtor registration endpoints stay public since realtors need to be
// able to sign up without any credentials.
const adminAuth = (req, res, next) => {
  const key = req.header("x-admin-key");

  if (!key || key !== process.env.ADMIN_KEY) {
    return res
      .status(401)
      .json({
        message:
          "Unauthorized. A valid admin key is required to view this data.",
      });
  }

  next();
};

export default adminAuth;
