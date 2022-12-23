import { getCurrentTab } from "./helpers/utils.js";

export default {
  icon: `http://bugmenot.com/favicon.ico`,
  name: {
    en: "Find shared login",
    vi: "Tìm tài khoản miễn phí",
  },
  description: {
    en: "Get free shared account on internet",
    vi: "Tìm tài khoản được chia sẻ trên mạng cho trang web hiện tại",
  },
  runInExtensionContext: true,

  func: async function () {
    const providers = [
      {
        name: "bugmenot.com",
        getLink: (hostname) => "http://www.bugmenot.com/view/" + hostname,
      },
      {
        name: "login2.me",
        getLink: (hostname) => `https://login2.me/#${hostname}`,
      },
      {
        name: "password-login.com",
        getLink: (hostname) =>
          `https://password-login.com/passwords/${hostname}/`,
      },
    ];

    let providersText = providers.map((_, i) => `${i}: ${_.name}`).join("\n");
    let choice = prompt(`Choose provider:\n\n${providersText} `, 0);

    if (choice >= 0 && choice < providers.length) {
      let tab = await getCurrentTab();
      if (!tab.url) {
        alert("Lỗi: Không tìm thấy url trang web.");
        return;
      }
      var url = providers[choice].getLink(escape(tab.url));
      w = open(
        url,
        "w",
        "location=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,width=700,height=400,modal=yes,dependent=yes"
      );
    }
  },
};
