export default {
  icon: `<i class="fa-solid fa-music"></i>`,
  name: {
    en: "Show all audio in website",
    vi: "Hiển thị mọi audio trong trang web",
  },
  description: {
    en: "Will display all audio in website, easy to download/get link.",
    vi: "Hiển thị tất cả tag audio/âm thanh trong trang web, giúp dễ dàng tải xuống/lấy link.",
  },
  blackList: [],
  whiteList: [],

  func: function () {
    let audios = Array.from(document.querySelectorAll("audio") || []);
    audios = audios?.filter((_) => !!_.src);

    if (!audios?.length) {
      alert(
        "Audio src not found.\n\nKhông tìm thấy âm thanh audio nào có thể tải trong trang web."
      );
    } else {
      let div = document.createElement("div");
      div.innerHTML = `
      <div style="position:fixed;bottom:0;left:0;bottom:0;background:#000d;padding:10px;z-index:999999999;">
        <button onclick="this.parentElement.remove()" style="position:absolute;top:-20px;right:-20px;padding:5px 10px;background:red;cursor:pointer;color:white;">
          Close
        </button>

        <div style="overflow:auto;max-height:90vh;">
       ${audios
         .map((audio) => {
           return `<audio controls src="${audio.src}"></audio><br/>
          <a href="${audio.src}" target="_blank" style="color:#ddd">Open in new tab</a>`;
         })
         .join("<br/>")}
        </div>

      </div>
      `;
      document.body.appendChild(div);
    }
  },
};
