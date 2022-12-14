import config from "../../config.js";
import { t } from "./lang.js";

const versionSpan = document.querySelector("#version");
const updateBtn = document.querySelector("#update-btn");

export async function checkForUpdate() {
  try {
    const currentVer = (await chrome.runtime.getManifest()).version;
    versionSpan.innerHTML = "v" + currentVer;

    const { version_check, source_code } = config;
    const lastestVer = (await (await fetch(version_check)).json()).version;
    if (lastestVer > currentVer) {
      updateBtn.style.display = "inline-block";
      updateBtn.innerHTML = t({
        vi: "cập nhật v" + lastestVer,
        en: "update v" + lastestVer,
      });
      updateBtn.onclick = () => {
        window.open(source_code);
      };
    } else {
      updateBtn.style.display = "none";
      versionSpan.innerHTML += t({ vi: " (mới nhất)", en: " (lastest)" });
    }
  } catch (e) {
    console.warn("Check for update failed", e);
  }
}
