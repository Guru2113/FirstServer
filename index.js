const express=require("express");
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));



var mysql =  require('mysql2');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "demo"
  });

  app.listen(2000, () => {
    console.log(`Server is running on port ${2000}`);
  });

  con.connect((err) => {
    if (err) {
      throw err;
    }
    console.log("MySql Connected");
  });

  //insert
app.post("/api/insert",async(req,res)=>{
    let data=req.body;
    let qry="INSERT INTO first SET?";
    let res1=con.query(qry,data,(err)=>{
        if (err) {
            throw err;
          }
          res.send("Employee 1 added");
    })
})

app.get("/api/select",async(req,res)=>{
    let data=req.body;
    let qry="SELECT * FROM first";
    let res1=con.query(qry,(err,result1)=>{
        if (err) {
            throw err;
          }
          res.status(200).json(
            {
                "msg":result1,
            }
          );
    })
})



// Handle POST request for login
app.post('/api/login', async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  try {
    console.log(email);
    

    const [studentResults] = await con.promise().execute('SELECT * FROM students WHERE email = ? AND pass = ?', [email, pass]);

    if (studentResults.length > 0) {
      // Student login successful
      const user = studentResults[0];
      res.status(200).json({ role: 'student', user, message: 'Login successful as student' });
      return;
    }

    const [classInchargeResults] = await con.promise().execute('SELECT * FROM classincharge WHERE email = ? AND pass = ?', [email, pass]);

    if (classInchargeResults.length > 0) {
      // Class incharge login successful
      const user = classInchargeResults[0];
      res.status(200).json({ role: 'class_incharge', user, message: 'Login successful as class Incharge' });
      return;
    }

    // Invalid credentials
    res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('Error executing query: ' + err.stack);
    res.status(500).send('Error executing query');
  }
});

