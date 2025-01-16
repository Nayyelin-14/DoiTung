// VerifyEmail.js
exports.htmlContent = (username, verificationLink) => {
  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <link
      rel="preload"
      as="image"
      href="https://react-email-demo-hich02t6q-resend.vercel.app/static/github.png"
    />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body
    style='background-color:#ffffff;color:#24292e;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"'
  >
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:480px;margin:0 auto;padding:20px 0 48px"
    >
      <tbody>
        <tr style="width:100%">
          <td>
            <img
              alt="Github"
              height="32"
              src="https://react-email-demo-hich02t6q-resend.vercel.app/static/github.png"
              style="display:block;outline:none;border:none;text-decoration:none"
              width="32"
            />
            <p style="font-size:24px;line-height:1.25;margin:16px 0">
              <strong>@${username}</strong>, a personal verification was created on your account.
            </p>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:24px;border:solid 1px #dedede;border-radius:5px;text-align:center"
            >
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:14px;line-height:24px;margin:0 0 10px 0;text-align:left">
                      Hey <strong>${username}</strong>!
                    </p>
                    <p style="font-size:14px;line-height:24px;margin:0 0 10px 0;text-align:left">
                      A fine-grained personal verification access was recently added to your account.
                    </p>
                    <a
                      href=${verificationLink}
                      style="line-height:1.5;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;font-size:14px;background-color:#28a745;color:#fff;border-radius:0.5em;padding:12px 24px"
                      target="_blank"
                    >
                      Verify your email
                    </a>
                  </td>
                
                </tr>
                <tr>
                      <td>
                   <p style="font-size:14px;line-height:24px;margin-top:12px;text-align:center">
                     Happy learning - DoiTung!!!
                    </p>
                  </td>
                  </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>
`;
};
