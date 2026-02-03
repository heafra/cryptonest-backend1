const pool = require("../db");



const [email, balanceStr] = process.argv.slice(2);

const balance = Number(balanceStr);



if (!email || isNaN(balance)) {

  console.error("Usage: node setBalance.js <email> <balance>");

  process.exit(1);

}



(async () => {

  try {

    const result = await pool.query(

      "UPDATE users SET balance = $1 WHERE email = $2 RETURNING email, balance",

      [balance, email]

    );



    if (result.rows.length === 0) {

      console.log(`User ${email} not found`);

    } else {

      console.log("Balance updated:", result.rows[0]);

    }



    process.exit(0);

  } catch (err) {

    console.error("Error updating balance:", err);

    process.exit(1);

  }

})();