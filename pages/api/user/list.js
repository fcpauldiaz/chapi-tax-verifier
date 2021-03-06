import withSession from "@/lib/session";
import organizationModel from "@/models/organization.model";
import User from "@/models/user.model";
import httpStatus from "http-status";
import dbConnect from "@/lib/dbConnect";

export default withSession(async (req, res) => {
  try {
    await dbConnect();
    const user = req.session.get("user");
    // get users from db by org
    const users = await User.list({ organization: user.organization.id });
    console.log(users);
    return res.json({ users });
  } catch (error) {
    console.log(error);
    const { response: fetchResponse } = error;
    res
      .status(fetchResponse?.status || httpStatus.INTERNAL_SERVER_ERROR)
      .json(error.data);
  }
});
