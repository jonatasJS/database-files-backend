const SES = require("aws-sdk/clients/ses");

function sendEmail({ to, user }) {
  const params = {
    Source: "soaresjonatas398@gmail.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <style type="text/css">
              a:hover {
                text-decoration: underline !important;
              }
            </style>
            
            <div marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
              <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8" style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                <tr>
                  <td>
                    <table style="background-color: #f2f3f8; max-width:670px; margin:0 auto;" width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="height:80px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align:center;">
                          <a href="https://database.jonatas.app/" title="Batabase" target="_blank">
                            <img width="60" src="https://database.jonatas.app/database.png" title="Database logo" alt="Database logo">
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td>
                          <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0" style="max-width:670px; background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                            <tr>
                              <td style="height:40px;">&nbsp;</td>
                            </tr>
                            <tr>
                              <td style="padding:0 35px;">
                                <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Redefina sua senha</h1>
                                <p style="font-size:15px; color:#455056; margin:8px 0 0; line-height:24px;">Clique no link a baixo para redefinir sua senha.<br><strong>Não repasse esse link a ninguém!</strong></p>
                                <span style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                <p style="color:#455056; font-size:18px;line-height:20px; margin:0; font-weight: 500;">
                                  <strong style="display: block;font-size: 13px; margin: 0 0 4px; color:rgba(0,0,0,.64); font-weight:normal;">Username</strong>${user.username}
                                </p>
            
                                <a href="https://database.jonatas.app/reset/${user._id}" style="background:#20e277;text-decoration:none !important; display:inline-block; font-weight:500; margin-top:24px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset Pass</a>
                              </td>
                            </tr>
                            <tr>
                              <td style="height:40px;">&nbsp;</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="height:20px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="text-align:center;">
                          <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>database.jonatas.app</strong> </p>
                        </td>
                      </tr>
                      <tr>
                        <td style="height:80px;">&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </div>`
          // Data: "Olá, você solicitou a redefinição de senha. Para redefinir sua senha, clique no link abaixo: http://localhost:3000/resetpassword/" + user._id,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Redefinição de senha",
      },
    },
  };

  const sendPromise = new SES({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-1",
  })
    .sendEmail(params)
    .promise();

  return sendPromise;
}

module.exports = sendEmail;

