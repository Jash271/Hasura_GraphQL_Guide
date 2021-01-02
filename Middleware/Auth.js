const jwt = require('jsonwebtoken');

var axios = require('axios');
const config_1 = require('config');

exports.auth_permission = async (req, res, next) => {
  //Get the token from the header

  const token = req.header('x-auth-token');

  //Check if not token

  if (!token) {
    return res.status(401).json({ msg: 'No token ,authorization denied' });
  }
  const decoded = jwt.verify(token, config_1.get('jwtSecret'));
  console.log(decoded);
  req.user_id = decoded.user.id;

  console.log('author_flag');

  console.log(decoded);
  req.user_id = decoded.user.id;
  var data = JSON.stringify({
    query: `query MyQuery($id:Int!) {
    users_by_pk(id:$id ) {
      Is_Author
      Name
      id
    }
  }`,
    variables: { id: decoded.user.id },
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
  console.log(response.data.data.users_by_pk.Is_Author);
  if (!response.data.data.users_by_pk.Is_Author) {
    return res.status(401).json({ msg: 'Denied Permission' });
  }
  next();
};

exports.get_user = async (req, res, next) => {
  const token = req.header('x-auth-token');

  //Check if not token

  if (!token) {
    return res.status(401).json({ msg: 'No token ,authorization denied' });
  }
  const decoded = jwt.verify(token, config_1.get('jwtSecret'));
  console.log(decoded);
  req.user_id = decoded.user.id;
  next();
};
