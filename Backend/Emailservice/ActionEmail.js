exports.ActionEmail = (email) => {
  return `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background-color:#efeef1;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:580px;margin:30px auto;background-color:#ffffff"
    >
      <tbody>
        <tr style="width:100%">
          <td>
      
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:5px 20px 10px 20px"
            >
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      Hi <!-- User Name -->,
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      We wanted to inform you that there has been a restriction placed on your Doi Tung account. 
                      This could be due to a violation of our community guidelines or other security reasons. 
                      As a result, some features may be limited until further notice.
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      If this restriction was applied in error or if you would like to inquire further about the reason behind this action, 
                      please <a href="#" style="color:#067df7;text-decoration-line:none;text-decoration:underline" target="_blank">contact DoiTung Support</a>.
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      We appreciate your understanding and cooperation as we ensure the safety and integrity of the DoiTung community.
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      Thanks,<br />DoiTung Support Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:580px;margin:0 auto"
    >
      <tbody>
        <tr>
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
            >
              <tbody style="width:100%">
                <tr style="width:100%">
                  <td
                    align="right"
                    data-id="__react-email-column"
                    style="width:50%;padding-right:8px"
                  >
                    <img
                      src="https://react-email-demo-gpxbuymeh-resend.vercel.app/static/twitch-icon-twitter.png"
                      style="display:block;outline:none;border:none;text-decoration:none"
                    />
                  </td>
                  <td
                    align="left"
                    data-id="__react-email-column"
                    style="width:50%;padding-left:8px"
                  >
                    <img
                      src="https://react-email-demo-gpxbuymeh-resend.vercel.app/static/twitch-icon-facebook.png"
                      style="display:block;outline:none;border:none;text-decoration:none"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
            >
              <tbody style="width:100%">
                <tr style="width:100%">
                  <p
                    style="font-size:14px;line-height:24px;margin:16px 0;text-align:center;color:#706a7b"
                  >
                   Doi Tung Development Project
Mae Fah Luang, Chiang Rai 57240, Thailand
                  </p>
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

exports.activeEmail = () => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
  </head>
  <body style="background-color:#efeef1;font-family:HelveticaNeue,Helvetica,Arial,sans-serif">
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:580px;margin:30px auto;background-color:#ffffff"
    >
      <tbody>
        <tr style="width:100%">
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="padding:5px 20px 10px 20px"
            >
              <tbody>
                <tr>
                  <td>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      Hi <!-- User Name -->,
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      We're pleased to inform you that your Doi Tung account has been successfully reactivated. You now have full access to all features and services once again.
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      If you have any questions or concerns regarding this update, please feel free to <a href="#" style="color:#067df7;text-decoration-line:none;text-decoration:underline" target="_blank">contact DoiTung Support</a>. We're happy to assist you.
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      Thank you for being a valued member of the DoiTung community. We appreciate your trust and support.
                    </p>
                    <p style="font-size:14px;line-height:1.5;margin:16px 0">
                      Best Regards,<br />DoiTung Support Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <table
      align="center"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="max-width:580px;margin:0 auto"
    >
      <tbody>
        <tr>
          <td>
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
            >
              <tbody style="width:100%">
                <tr style="width:100%">
                  <td
                    align="right"
                    data-id="__react-email-column"
                    style="width:50%;padding-right:8px"
                  >
                    <img
                      src="https://react-email-demo-gpxbuymeh-resend.vercel.app/static/twitch-icon-twitter.png"
                      style="display:block;outline:none;border:none;text-decoration:none"
                    />
                  </td>
                  <td
                    align="left"
                    data-id="__react-email-column"
`;
};
