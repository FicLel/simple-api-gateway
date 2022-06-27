import connection from './db.js';
import bcrypt from 'bcrypt'; 
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();



const controller = {
  async insertData(req, res) {
    const {email, pass} = req.body;
    try {

      const conn = await connection.getConnection();

      const salt = bcrypt.genSaltSync(10, "a");
      const encryptedPassword = await bcrypt.hash(pass, salt);

      const response = await conn.query("insert into users values (null, ?, ?)", [email, encryptedPassword]);
      // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
      if (conn) conn.release(); //release to pool
      if (response.affectedRows > 0) res.status(201).json({user: email});
      else res.status(400).send('bad data');
      

    } catch (exception) {
      console.log(exception);
      res.status(500).send('CANNONT ADD USER');
    }
  },
  async login(req, res) {
    const {email, pass} = req.body;
    try {

      const conn = await connection.getConnection();

      const [response] = await conn.query("select * from users where email = ?", [email]);
      const validate = await bcrypt.compare(pass, response.password)
      // res: { affectedRows: 1, insertId: 1, warningStatus: 0 }
      if (conn) conn.release(); //release to pool
      if (validate) {
        const {password, ...toSend} = response;
        const token = jwt.sign({
          data: 'foobar'
        }, 'secret', { expiresIn: '5h' }); 
        res.status(200).json({...toSend, token}); 
      } else {
        res.status(401).send('NOT VALID LOGIN');
      }

    } catch (exception) {
      console.log(exception);
      res.status(500).send('CANNONT LOGIN');
    }
  }
};

export const allMightyController = (router) => {
    router.post('/signup', controller.insertData); 
    router.post('/login', controller.login);
}
