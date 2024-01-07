import IRoute from '../types/IRoute';
import {Router} from 'express';
import {compareSync, hashSync} from 'bcrypt';
import {attachSession} from '../middleware/auth';
import {sequelize, Session, User} from '../services/db';
import {randomBytes} from 'crypto';
import * as sqlite3 from 'sqlite3';
import {join, resolve} from 'path';

const path = (resolve(join(__dirname, '../../../../school_database.db')));
console.log(path);
const schoolDb = new sqlite3.Database((resolve(join(__dirname, '../../../../school_database.db'))));
/*
schoolDb.serialize(() => {
  console.log('Connected to the SQLite database');
  // ... other database operations
// Fetch all rows from the 'NAMM_Email' table

schoolDb.all('SELECT * FROM NAMM', (err, rows) => {
  if (err) {
    console.error('Error fetching data from NAMM_Email:', err);
  } else {
    console.log('Fetched data from NAMM_Email:', rows);
  }
});
});
*/
const AuthRouter: IRoute = {
  route: '/auth',
  router() {
    const router = Router();
    router.use(attachSession);

    // If we're authenticated, return basic user data.
    router.get('/', (req, res) => {
      if (req.session?.token?.id) {
        const {
          token: {token, ...session},
          user: {password, ...user},
        } = req.session;
        return res.json({
          success: true,
          message: 'Authenticated',
          data: {
            session,
            user,
          },
        });
      } else {
        return res.json({
          success: false,
          message: 'Not Authenticated',
        });
      }
    });

    // Attempt to log in
    router.post('/login', async (req, res) => {
      const {
        username,
        password,
      } = req.body;
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing username/password.',
        });
      }

      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username),
        ),
      }).catch(err => console.error('User lookup failed.', err));

      // Ensure the user exists. If not, return an error.
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // Ensure the password is correct. If not, return an error.
      if (!compareSync(password, user.dataValues.password)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid username/password.',
        });
      }

      // We now know the user is valid so it's time to mint a new session token.
      const sessionToken = randomBytes(32).toString('hex');
      let session;
      try {
        // Persist the token to the database.
          session = await Session.create({
          token: sessionToken,
          user: user.dataValues.id,
        });
      } catch (e) {
        return passError('Failed to create session.', e, res);
      }

      if (!session) {
        // Something broke on the database side. Not much we can do.
        return passError('Returned session was nullish.', null, res);
      }

      // We set the cookie on the response so that browser sessions will
      // be able to use it.
      res.cookie('SESSION_TOKEN', sessionToken, {
        sameSite: 'none',
        secure: false,  // Make sure to set this to true for HTTPS
        expires: new Date(Date.now() + (3600 * 24 * 7 * 1000)), // +7 days
        httpOnly: true,
        path: '/',
      });

      // We return the cookie to the consumer so that non-browser
      // contexts can utilize it easily. This is a convenience for the
      // take-home so you don't have to try and extract the cookie from
      // the response headers etc. Just know that this is a-standard
      // in non-oauth flows :)
      return res.json({
        success: true,
        message: 'Authenticated Successfully.',
        data: {
          token: sessionToken,
        },
      });
    });



    // Attempt to register
    router.post('/register', async (req, res) => {
      // TODO
      const {username, password} = req.body;

      // if username and password empty, show error
      if(!username || !password){
        res.status(400).json({
          success: false,
          message: "You forget to enter username/password !"
        });
      }

      // check if user already registered
      const user = await User.findOne({
        where: sequelize.where(
          sequelize.fn('lower', sequelize.col('username')),
          sequelize.fn('lower', username),
        ),
      }).catch(err => console.error('User lookup failed.', err));

      // if user exists, show error
      if(user){
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }
      
      //create new user on database
        const newUser = await User.create({
          registered:new Date(),
          username: username,
          password: hashSync(password, 12),
          displayName: username,
        }).catch(err => {return err.message});


      return res.json({
        success: true,
        message: "User created successfully.",
        newUser
      });

    });



    //search
    router.post('/search', async(req, res) => {
        try{
          // get the search text
          const {searchBar, cityElementSelected, stateElementSelected} = req.body;
          console.log(searchBar, cityElementSelected, stateElementSelected);
          if(!searchBar && !cityElementSelected && !stateElementSelected){
            res.status(400).json({
              success: false,
              message: 'You forget to enter information !'
            });
          }

          if(searchBar){
            await schoolDb.all('select * from NAMM where Email Like ?', [`%${searchBar}%`], (err, row)=>{
              if(err) return res.json({ 
                success: false,
                message: 'Please enter the correct information!',
                error: err
              })
              else{
                console.log(`Here are the results: ${row}`);
                res.json({
                  success: true,
                  message: 'Successfully find the data',
                  data: row
                })
              }
            })
          }

          if (cityElementSelected) {
            await schoolDb.all('SELECT * FROM NAMM WHERE City LIKE ?', [`%${cityElementSelected}%`], (err, row) => {
              if (err) {
                return res.json({
                  success: false,
                  message: 'Please enter the correct information!',
                  error: err
                });
              } else {
                console.log(`Here are the results: ${row}`);
                res.json({
                  success: true,
                  message: 'Successfully find the data',
                  data: row
                });
              }
            });
          }
          
          if (stateElementSelected) {
            await schoolDb.all('SELECT * FROM NAMM WHERE state LIKE ?', [`%${stateElementSelected}%`], (err, row) => {
              if (err) {
                return res.json({
                  success: false,
                  message: 'Please enter the correct information!',
                  error: err
                });
              } else {
                console.log(`Here are the results: ${row}`);
                res.json({
                  success: true,
                  message: 'Successfully find the data',
                  data: row
                });
              }
            });
          }



        }catch(err){
          console.log(err);
        }

          /*
          if(!searchBar){
            res.status(400).json({
              success: false,
              message: "You forget to enter information !"
            });
          }

        
            await schoolDb.all('select * from NAMM where Email like?',[`%${searchBar}`], (err, row)=>{
            if(err){
              console.log('Invalid query, please try again', err);
            }else{
              console.log('Here are the results. ', row);
              return res.json({
                success: true,
                message: 'Sucessfully find the results',
                data: row
              })
            }
          })

        }catch(err) {
          console.error(err.message);
        }
*/
    })



    router.get('/displayState', async (req, res) => {
      try {
         await schoolDb.all('SELECT Distinct State FROM NAMM', (err, rows) => {
          if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({
              success: false,
              message: 'Error retrieving data from the database',
            });
          }
   
          console.log(rows); // Log the results
          return res.json({
            success: true,
            message: 'Successfully retrieved data from the database',
            data: rows,
          });
        });
      } catch (error) {
        return passError('Failed to retrieve data from the database.', error, res);
      }
   });


   router.get('/displayCity', async (req, res) => {
    try{
        await schoolDb.all('SELECT Distinct City FROM NAMM', (err, rows) => {
        if(err){
          console.error('Error executing query:', err);
          return res.status(500).json({
            success: false,
            message: 'Error retrieving data from the database',
          });
        }

        console.log(rows); // Log the results
          return res.json({
            success: true,
            message: 'Successfully retrieved data from the database',
            data: rows,
          });

      });
    }catch(error) {
      return passError('Failed to retrieve data from the database.', error, res);
    }
   })


    
    // Log out
    router.post('/logout', async(req,res) => {
        await res.clearCookie('token', {path: "/", sameSite: 'none', secure: true });
        res.json({ 
        success: true,
        message: 'Logged out successfully' });
    });

    return router;
  },


};




export default AuthRouter;

function passError(message, error, response) {
  console.error(message, error);
  return response.status(500).json({
    success: false,
    message: `Internal: ${message}`,
  });
}
