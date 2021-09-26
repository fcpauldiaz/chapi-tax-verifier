import withSession from "@/lib/session";
import User from "@/models/user.model";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import dbConnect from "@/lib/dbConnect";

export default withSession(async (req, res) => {
  const { email, password } = await req.body;
  try {
    await dbConnect();
    // get user from db
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // password not valid
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "User does not exist" });
    }
    // compare hashed password
    const valid = await bcrypt.compare(password, user.password);
    // if the password is a match
    if (valid === true) {
      req.session.set("user", {
        id: user._id,
        email: user.email,
        role: user.role,
        organization: user.organization,
      });
      await req.session.save();
      return res.json(user);
    } else {
      // password not valid
      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.log(error);
    const { response: fetchResponse } = error;
    res.status(fetchResponse?.status || 500).json(error.data);
  }
});
