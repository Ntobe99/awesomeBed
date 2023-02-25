//database connection  import  from config
let db=require('../config');
//import bcrypt modules
let {hash,compare,hashSync}= require('bcrypt');
// 
let {createToken}=require('../middleware/AuthenticatedUser');
//user class
class User{
    login(req,res){
        const {emailAdd,userPass}=req.body
        const qry =
        `
        SELECT userID,firstname ,lastname,gender,emailAdd,userPass,userRole,userProfile FROM users
        WHERE emailAdd=${emailAdd};
        `;

        db.query(qry,async(err,data)=>{
            if (err) throw err;
            if((!data) || (data == null)) {
                res.status(401).json({err:
                    "You provided the wrong email address"})
            }
            else{
                await compare(userPass,
                    data[0].userPass,
                    (cErr,cResult)=>{
                         if(cErr) throw cErr;
                         //create token 
                         const jwtoken=
                         createToken({
                            userPass,
                            emailAdd
                         });
        //save tok
               res.cookie('LegitUser',
                  jwtoken,{
                  maxAge:3600000,
                  httpOnly

                  })
                  if(cResult){
                    res.status(200).json(
                        {
                            msg:'logged in ',
                            jwtoken,
                            result:data[0]
                        }
                    )
                  }else{
                    res.status(401).json({
                        err:'you entered an invalid password or did not register' })}
                    })}
        })}
    fetchUsers(req,res){
        const qry=
        `
        SELECT  userID,firstname ,lastname,gender,emailAdd,userRole,userProfile  FROM users;
        `
    
    db.query(qry,(err,data)=>
    {
        if(err) throw err;
        else res.status(200).json({results:data})

    })
}
    fetchUser(req,res){
        const qry=
        `
        SELECT  userID,firstname ,lastname,gender,emailAdd,userRole,userProfile  FROM users 
        WHERE userID = ?;
        `
    
    db.query(qry,[req.params.id],(err,data)=>
    {
        if(err) throw err;
        else res.status(200).json({result:data})

    })
    }
    async createUser(req, res) {
        // Payload
        let detail = req.body;
        // Hashing user password
        detail.userPass = await 
        hash(detail.userPass, 15);
        // This information will be used for authentication.
        let user = {
            emailAdd: detail.emailAdd,
            userPass: detail.userPass
        }
        // sql query
        const strQry =
        `INSERT INTO Users
        SET ?;`;
        db.query(strQry, [detail], (err)=> {
            if(err) {
                res.status(401).json({err});
            }else {
                // Create a token
                const jwToken = createToken(user);
                // This token will be saved in the cookie. 
                // The duration is in milliseconds.
                res.cookie("LegitUser", jwToken, {
                    maxAge: 3600000,
                    httpOnly: true
                });
                res.status(200).json({msg: "A user record was saved."})
            }
        })    
    }
    updateUser(req, res) {
        let data = req.body;
        if(data.userPass !== null || 
            data.userPass !== undefined)
            data.userPass = hashSync(data.userPass, 15);
        const strQry = 
        `
        UPDATE Users
        SET ?
        WHERE userID = ?;
        `;
        //db
        db.query(strQry,[data, req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A row was affected"} );
        })    
    }
    deleteUser(req, res) {
        const strQry = 
        `
        DELETE FROM Users
        WHERE userID = ?;
        `;
        //db
        db.query(strQry,[req.params.id], 
            (err)=>{
            if(err) throw err;
            res.status(200).json( {msg: 
                "A record was removed from a database"} );
        })    
    }
    
}

//product
class Product {
    fetchProducts(req, res) {
        const strQry = `SELECT id, prodName, prodDescription, category, price, prodQuantity, imgURL
        FROM products;`;
        db.query(strQry, (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });
    }
    fetchProduct(req, res) {
        const strQry = `SELECT id, prodName, prodDescription, category, price, prodQuantity, imgURL
        FROM products
        WHERE id = ?;`;
        db.query(strQry, [req.params.id], (err, results)=> {
            if(err) throw err;
            res.status(200).json({results: results})
        });

    }
    addProduct(req, res) {
        const strQry = 
        `
        INSERT INTO Products
        SET ?;
        `;
        db.query(strQry,[req.body],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to insert a new record."});
                }else {
                    res.status(200).json({msg: "Product saved"});
                }
            }
        );    

    }
    updateProduct(req, res) {
        const strQry = 
        `
        UPDATE Products
        SET ?
        WHERE id = ?
        `;
        db.query(strQry,[req.body, req.params.id],
            (err)=> {
                if(err){
                    res.status(400).json({err: "Unable to update a record."});
                }else {
                    res.status(200).json({msg: "Product updated"});
                }
            }
        );    

    }
    deleteProduct(req, res) {
        const strQry = 
        `
        DELETE FROM Products
        WHERE id = ?;
        `;
        db.query(strQry,[req.params.id], (err)=> {
            if(err) res.status(400).json({err: "The record was not found."});
            res.status(200).json({msg: "A product was deleted."});
        })
    }

}
// Export User class
module.exports = {
    User, 
    Product
}
