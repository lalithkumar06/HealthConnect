const bcrypt = require('bcryptjs');
const pass = "234567";
const HashP = async()=>{
    const hashpass = await bcrypt.hash(pass , 10);
    console.log(hashpass);
}
HashP();
