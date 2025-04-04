import validator from "validator";

const validatePassword = (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: "Password field required" });
  }
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({
      error:
        "Password must contain 8 characters, an uppercase letter, a number, and a symbol",
    });
  }
  next();
};

export default validatePassword;
