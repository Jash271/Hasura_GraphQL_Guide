const bcrypt = require('bcryptjs');
var axios = require('axios');
const config_1 = require('config');
const jwt = require('jsonwebtoken');

exports.Create_Post = async (req, res, next) => {
  try {
    const { desc, title } = req.body;
    var data = JSON.stringify({
      query: `mutation CreatePost($description: String, $title: String, $author: Int!) {
        insert_Posts_one(object: {Description: $description, Title: $title, author: $author}) {
          Title
          Description
          author
          created_at
          id
        }
      }`,
      variables: { description: desc, title: title, author: req.user_id },
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
    console.log(response.data.data.insert_Posts_one);
    return res.status(200).json({
      success: true,
      data: response.data.data.insert_Posts_one,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: 'User Already Exists',
    });
  }
};
