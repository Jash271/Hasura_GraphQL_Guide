const bcrypt = require('bcryptjs');
var axios = require('axios');
const config_1 = require('config');
const jwt = require('jsonwebtoken');

exports.SignUp = async (req, res, next) => {
  const bcrypt = require('bcryptjs');
  var axios = require('axios');
  const config_1 = require('config');
  const jwt = require('jsonwebtoken');
  const { name, role, email, password } = req.body;
  var data = JSON.stringify({
    query: `query CheckUserExists($email: String) {
        users(where: {email: {_eq: $email}}) {
          account_ID
          Name
          id
        }
      }`,
    variables: { email: email },
  });
  var config = {
    method: 'post',
    url: 'https://next-hermit-41.hasura.app/v1/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };
  var response = await axios(config);
  console.log(response.data.data.users);
  console.log(response.data.data.users.length);
  if (response.data.data.users.length !== 0) {
    console.log('User Exist');
    return res.status(400).json({
      success: false,
      msg: 'User Already Exists',
    });
  }
  const salt = await bcrypt.genSalt(10);
  const pass = await bcrypt.hash(password, salt);
  var data = JSON.stringify({
    query: `mutation CreateNewUser($email: String, $name: String, $role: Boolean, $password: String) {
    insert_users(objects: {Is_Author: $role, Name: $name, email: $email, password: $password}) {
      affected_rows
      returning {
        Is_Author
        Name
        account_ID
        email
        id
      }
    }
  }`,
    variables: { email: email, role: role, name: name, password: pass },
  });

  var config = {
    method: 'post',
    url: 'https://next-hermit-41.hasura.app/v1/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: data,
  };

  var response = await axios(config);
  console.log(response.data);
  const payload = {
    user: {
      id: response.data.data.insert_users.returning[0].id,
    },
  };
  jwt.sign(
    payload,
    config_1.get('jwtSecret'),
    {
      expiresIn: 360000,
    },
    (err, token) => {
      if (err) throw err;
      return res.status(200).json({
        success: true,
        data: response.data.data.insert_users.returning[0],
        token,
      });
    }
  );

  try {
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'There was some error',
    });
  }
};

exports.SignIn = async (req, res, next) => {
  const bcrypt = require('bcryptjs');
  var axios = require('axios');
  const config_1 = require('config');
  const jwt = require('jsonwebtoken');
  try {
    console.log(1);
    const { email, password } = req.body;
    console.log(2);
    const salt = await bcrypt.genSalt(10);
    const pass = await bcrypt.hash(password, salt);
    var data = JSON.stringify({
      query: `query SignIn($email: String) {
      users(where: {email: {_eq: $email}}) {
        Is_Author
        Name
        account_ID
        email
        id
        password
      }
    }`,
      variables: { email: email },
    });

    var config = {
      method: 'post',
      url: 'https://next-hermit-41.hasura.app/v1/graphql',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    var response = await axios(config);
    console.log(response.data.data.users[0].id);
    if (response.data.data.users.length === 0) {
      return res.status(404).json({
        success: false,
        msg: 'Invalid Credentials',
      });
    }
    var pass_1 = response.data.data.users[0].password;
    const isMatch = await bcrypt.compare(
      password,
      response.data.data.users[0].password
    );
    if (!isMatch) {
      return res.status(400).json({
        msg: 'Incorrect Credentials',
      });
    }
    const payload = {
      user: {
        id: response.data.data.users[0].id,
      },
    };
    jwt.sign(
      payload,
      config_1.get('jwtSecret'),
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        return res.status(200).json({
          success: true,
          data: response.data.data.users[0],
          token,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      success: false,
      msg: 'There was some error',
    });
  }
};
