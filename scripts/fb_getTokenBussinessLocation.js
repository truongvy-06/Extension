import { showLoading } from "./helpers/utils.js";

export default {
  icon: `<i class="fa-solid fa-key"></i>`,
  name: {
    en: "Get fb token EAAG (business_locations)",
    vi: "Lấy fb token EAAG (business_locations)",
  },
  description: {
    en: "Get fb token EAAG from business.facebook.com",
    vi: "Lấy fb token EAAG từ business.facebook.com",
  },
  blackList: [],
  runInExtensionContext: true,

  func: function () {
    // Get token using cookies https://github.com/dz-id/fb_get_token_from_cookie/blob/main/main.py

    const { closeLoading } = showLoading("Đang lấy access token...");
    fetch("https://business.facebook.com/business_locations")
      .then((res) => res.text())
      .then((htmlText) => {
        let regex = htmlText.match(/(EAAG\w+)/);
        if (null !== regex) {
          let accesstoken = regex[1];
          prompt("Access Token: ", accesstoken);
        } else {
          prompt(
            "Không thấy token. Hãy chắc rằng bạn đã đăng nhập vào",
            "https://business.facebook.com/business_locations"
          );
        }
      })
      .catch((e) => alert("Error: " + e))
      .finally(closeLoading);
  },
};

// {
//   method: "GET",
//   credentials: "include",
//   headers: {
//     "user-agent":
//       "Mozilla/5.0 (Linux; Android 8.1.0; MI 8 Build/OPM1.171019.011) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.86 Mobile Safari/537.36", // don't change this user agent.
//     referer: "https://www.facebook.com/",
//     host: "business.facebook.com",
//     origin: "https://business.facebook.com",
//     "upgrade-insecure-requests": "1",
//     "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
//     "cache-control": "max-age=0",
//     accept:
//       "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
//     "content-type": "text/html; charset=utf-8",
//   },
// }

// if (-1 == htmlText.search("EAA")) {
//   alert("Token not found");
//   return;
// }
// var o = htmlText.match(/EAAGNO.*?\"/);
// prompt("Token", o[0] ? o[0].replace(/\W/g, "") : "");
