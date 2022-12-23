import { showLoading } from "./helpers/utils.js";

export default {
  icon: "https://lh3.googleusercontent.com/xwarvPJ490JDNBNlB4_nVOE3KEs-A6xI07luVNP--iQ7kipstjiSHf-S1rofE-ji9E0clqa_vkivURh42UOA3uXsmHw=w128-h128-e365-rj-sc0x00ffffff",
  name: {
    en: "Unshorten link",
    vi: "Giải mã link rút gọn",
  },
  description: {
    en: "Get origin URL of shortened url",
    vi: "Lấy link gốc của link rút gọn",
  },
  runInExtensionContext: true,

  func: async function () {
    // Để script này hoạt động được, cần thêm rule modify header referer
    // Chi tiết xem trong file rules.json

    // https://unshorten.it/
    const unshortenIt = {
      async getToken() {
        let res = await fetch("https://unshorten.it/");
        let text = await res.text();
        let token = /name='csrfmiddlewaretoken' value='(.*)'/.exec(text)?.[1];
        return token;
      },
      async getLongUrl(shortURL) {
        let token = await unshortenIt.getToken();

        let formData = new FormData();
        formData.append("short-url", shortURL);
        formData.append("csrfmiddlewaretoken", token);

        let res = await fetch("https://unshorten.it/main/get_long_url", {
          method: "POST",
          body: formData,
        });
        let json = await res.json();
        if (json?.success) {
          return json.long_url;
        } else {
          alert(json.message);
          return null;
        }
      },
    };

    // https://linkunshorten.com/
    const linkunshorten = {
      async getLongUrl(shortURL) {
        let res = await fetch(
          "https://linkunshorten.com/api/link?url=" + shortURL
        );
        let text = await res.text();
        return JSON.parse(text || "");
      },
    };

    let short_url = prompt("Nhập URL đã rút gọn: ");
    if (short_url) {
      // faster way: open unshorten.it page
      // return window.open(
      //   "http://unshorten.it/extensionloading.php?shortURL=" +
      //     shortenURL +
      //     "&source=chromeextension"
      // );

      const { closeLoading, setLoadingText } = showLoading("Đang lấy token...");
      try {
        setLoadingText(
          "Đang giải mã link rút gọn...<br/>Sử dụng linkunshorten.com"
        );
        let long_url = await linkunshorten.getLongUrl(short_url);
        if (!long_url || long_url == short_url) {
          setLoadingText(
            "Đang giải mã link rút gọn...<br/>Sử dụng unshorten.it"
          );
          long_url = await unshortenIt.getLongUrl(short_url);
        }

        long_url
          ? prompt("Link gốc của " + short_url, long_url)
          : alert("Không tìm thấy link gốc");
      } catch (e) {
        prompt(
          "Lỗi: " + e + "\n\nBạn có thể mở trang web bên dưới để thử lại:",
          "https://unshorten.it/"
        );
      } finally {
        closeLoading();
      }
    }
  },
};

// modify header referer in manifest v3
// https://stackoverflow.com/a/72739149/11898496

// manifest v2 only, background script only
// https://stackoverflow.com/a/31003808/11898496
// https://stackoverflow.com/a/56141157/11898496
// chrome.webRequest.onBeforeSendHeaders.addListener(
//   function (details) {
//     let headers = details.requestHeaders;
//     headers.push({
//       name: "Referer",
//       value: "https://unshorten.it/",
//     });
//     console.log(headers);
//     return { requestHeaders: headers };
//   },
//   { urls: ["https://unshorten.it/main/get_long_url"] },
//   ["blocking", "requestHeaders", "extraHeaders"]
// );
