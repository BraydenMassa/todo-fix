import validator from "validator";

const validateEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email field required" });
  }
  if (!validator.isEmail(email)) {
    return res.status(400).json({
      error: "Invalid email",
    });
  }
  next();
};

export default validateEmail;
