import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const VerifyEmail = ({ email, user_name, EmailLink }) => (
  <Html>
    <Head />
    <Preview>Email comfirmation - Doi_Tung</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Img
                src={`${baseUrl}/static/github.png`}
                width="32"
                height="32"
                alt="Github"
              /> */}

        <Text style={title}>
          <strong>@{user_name}</strong>, a personal access was created on your
          account.
        </Text>

        <Section style={section}>
          <Text style={text}>
            Hey <strong>{user_name}</strong>!
          </Text>
          <Text style={text}>
            We recieved an account verification request with this email address
          </Text>

          <Button style={button} href={EmailLink}>
            Confirm activate account
          </Button>
        </Section>
        {/* <Text style={links}>
                <Link style={link}>Your security audit log</Link> ・{" "}
                <Link style={link}>Contact support</Link>
              </Text> */}
        <Text style={text}>Happy learning!!!</Text>
        {/* <Text style={footer}>
                GitHub, Inc. ・88 Colin P Kelly Jr Street ・San Francisco, CA 94107
              </Text> */}
      </Container>
    </Body>
  </Html>
);

export default VerifyEmail;

const main = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container = {
  maxWidth: "480px",
  margin: "0 auto",
  padding: "20px 0 48px",
};

const title = {
  fontSize: "24px",
  lineHeight: 1.25,
};

const section = {
  padding: "24px",
  border: "solid 1px #dedede",
  borderRadius: "5px",
  textAlign: "center",
};

const text = {
  margin: "0 0 10px 0",
  textAlign: "left",
};

const button = {
  fontSize: "14px",
  backgroundColor: "#28a745",
  color: "#fff",
  lineHeight: 1.5,
  borderRadius: "0.5em",
  padding: "12px 24px",
};

// const links = {
//   textAlign: "center",
// };

// const link = {
//   color: "#0366d6",
//   fontSize: "12px",
// };

// const footer = {
//   color: "#6a737d",
//   fontSize: "12px",
//   textAlign: "center",
//   marginTop: "60px",
// };
