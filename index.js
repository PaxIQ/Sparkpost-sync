const axios = require("axios");
const Joi = require("joi");

const templateSchema = Joi.object().keys({
  name: Joi.string().allow(""),
  id: Joi.string().required(),
  description: Joi.string().allow(""),
  published: Joi.bool(),
  has_draft: Joi.bool(),
  has_published: Joi.bool(),
  shared_with_subaccounts: Joi.bool(),
  options: Joi.object().keys({
    open_tracking: Joi.bool(),
    transactional: Joi.bool(),
    click_tracking: Joi.bool()
  }),
  content: Joi.object()
    .required()
    .keys({
      from: Joi.alternatives()
        .try(
          Joi.object().keys({
            email: Joi.string().email(),
            name: Joi.string().allow("")
          }),
          Joi.string()
        )
        .required(),
      subject: Joi.string().required(),
      reply_to: Joi.string().allow(""),
      text: Joi.string().allow(""),
      html: Joi.string().allow(""),
      amp_html: Joi.string().allow(""),
      headers: Joi.object()
    }),
  changed: Joi.bool()
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
    templates
      .filter(template => template.changed === true)
      .map(template => {
        return api.put(`templates/${template.id}`, template);
      })
  ).catch(err => console.log(err));
};

module.exports = {syncAll, getTemplate}