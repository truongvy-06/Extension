import { showLoading } from "./helpers/utils.js";

export default {
  name: {
    en: "Get avatar from fb user id",
    vi: "Tải avatar từ fb user id",
  },
  description: {
    en: "Get avatar from list user ids",
    vi: "Tải danh sách avatar từ danh sách user id",
  },
  runInExtensionContext: true,

  func: async function () {
    let accessToken = prompt("Nhập facebook access token: ");
    if (!accessToken) return;
    let uids = prompt("Nhập danh sách uid, Mỗi uid 1 dòng:");
    if (!uids) return;

    const { closeLoading, setLoadingText } = showLoading();
    try {
      uids = uids.split("\n");
      let urls = [];
      for (let uid of uids) {
        setLoadingText("Đang lấy avatar của " + uid + "...");
        let url = `https://graph.facebook.com/${uid}/picture?type=large&access_token=${accessToken}`;
        let data = await fetch(url);
        if (data?.url) {
          urls.push(data?.url);
        }
      }
    } catch (e) {
      alert("ERROR: " + e);
    } finally {
      closeLoading();
    }

    if (urls.length === 0) alert("Không tìm được avatar nào!");
    else if (urls.length === 1) window.open(urls[0]);
    else download(urls.join("\n"), `uid-${new Date().toLocaleString()}.txt`);

    function download(data, filename, type) {
      var file = new Blob([data], { type: type });
      if (window.navigator.msSaveOrOpenBlob)
        window.navigator.msSaveOrOpenBlob(file, filename);
      else {
        var a = document.createElement("a"),
          url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
      }
    }
  },
};
