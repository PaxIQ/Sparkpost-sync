const axios = require("axios");
const Joi = require("joi");

const templateSchema = Joi.object().keys({
  name: Joi.string(),
  id: Joi.string(),
  description: Joi.string().allow(''),
  published: Joi.bool(),
  has_draft: Joi.bool(),
  has_published: Joi.bool(),
  shared_with_subaccounts: Joi.bool(),
  content: Joi.object().required().keys({
    from: Joi.object().keys({
      email: Joi.string().email(),
      name: Joi.string()
    }),
    subject: Joi.string(),
    reply_to: Joi.string(),
    text: Joi.string(),
    html: Joi.string()
  })
});


// const newTemplate = async () => {
//   try {
//     const response = await api.post("templates", payload);
//     console.log(response.status);
//   } catch (err) {
//     console.log(err);
//   }
// };

const getTemplate = async (templateId, apiKey) => {
  const api = axios.create({
    baseURL: "https://api.sparkpost.com/api/v1",
    timeout: 8000,
    headers: { Authorization: apiKey }
  });
  try {
    const { data } = await api.get(`templates/${templateId}`);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

const syncAll = (templates, apiKey) => {
  for (let i = 0; i < templates.length; i++) {
    const { error } = Joi.validate(templates[i], templateSchema);
    if (error) {
      console.log("Invalid template :: " + error);
      return error;
    }
  }
  const api = axios.create({
    baseURL: "https://api.sparkpost.com/api/v1",
    timeout: 8000,
    headers: { Authorization: apiKey }
  });
  return Promise.all(
    templates.map(template => {
      return api.put(`templates/${template.id}`, template);
    })
  ).catch(err => console.log(err));
};

module.exports = {syncAll, getTemplate}