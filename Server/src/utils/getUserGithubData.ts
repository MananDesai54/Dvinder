import FormData from "form-data";
import fetch from "node-fetch";

export const getUserGithubData = async (code: string) => {
  const data = new FormData();

  data.append("client_id", process.env.GITHUB_CLIENT_ID);
  data.append("client_secret", process.env.GITHUB_CLIENT_SECRET);
  data.append("code", code);
  data.append("redirect_uri", process.env.GITHUB_REDIRECT_URI);

  const accessResponse = await fetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: "POST",
      body: data,
    }
  );
  const paramsString = await accessResponse.text();
  let params = new URLSearchParams(paramsString);
  const access_token = params.get("access_token");
  const userProfileResponse = await fetch(`https://api.github.com/user`, {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  const userProfile = await userProfileResponse.json();
  const emailResponse = await fetch(`https://api.github.com/user/emails`, {
    headers: {
      Authorization: `token ${access_token}`,
    },
  });
  const emails = await emailResponse.json();
  const email = emails.find((email: any) => email.primary);
  return {
    username: userProfile.login,
    email: email.email,
    profileUrl: userProfile.avatar_url,
    id: userProfile.id,
  };
};
