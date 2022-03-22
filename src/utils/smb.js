import SMB2 from "@marsaud/smb2";
import config from "../../config/smb" assert { type: "json" };
let smb = null;
const create_smb = () =>
  new SMB2({
    share: "\\\\newct\\Luxbase",
    domain: config.domain,
    username: config.username,
    password: config.password,
  });
export default () => {
  if (smb) {
    return smb;
  } else {
    smb = create_smb();
    return smb;
  }
};
