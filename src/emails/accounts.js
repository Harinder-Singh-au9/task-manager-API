const sgMail = require("@sendgrid/mail");
const { ConnectionStates } = require("mongoose");
sgMail.setApiKey(process.env.SENDGRID_API)

// try {
//     sgMail.send({
//         to: 'hershindsingh1994@gmail.com',
//         from: 'hershindsingh1994@gmail.com',
//         subject: "this is fist mail sdfsdfs sdfsdfsd",
//         text:"hope this is working sdfsdf sdfasdf "
//     })

// } catch (error) {
//     console.log(error)
// }

const welcomeMail= (to,name) => {
  try {
    sgMail.send({
      to,
      from: "hershindsingh1994@gmail.com",
      subject: "Welcome Mail",
      text: `Welcome ${name} to ShopCar.com !`,
    }, (error, response) => {
        if (error) throw new Error()
    });
  } catch (error) {
    console.log(error);
  }
};

const goodByeMail= (to,name) => {

    try {
      sgMail.send({
        to,
        from: "hershindsingh1994@gmail.com",
        subject: "Good Bye ! Will Miss You",
        text: `Good Bye ! ${name} from ShopCar.com !`,
      }, (err, res) => {
          if (err) throw err;
          console.log(res)
      });
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {welcomeMail,goodByeMail}
