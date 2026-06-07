const UPLOAD_SLEEP_MS = 2000;
const DISABLE_MS = 20000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function uploadImageSet(imageNum) {
  const holder = document.querySelector("#imagefileHolder");
  const originalFile = holder.files[imageNum];

  const uploadFile = await processImage(originalFile);

  const list = new DataTransfer();
  list.items.add(uploadFile);

  const imagefile = document.querySelector("#imagefile");
  imagefile.files = list.files;

  is_image_valid(originalFile);
  uploadImage();
}

async function uploadImages() {
  const holder = document.querySelector("#imagefileHolder");
  const fl = holder && holder.files ? holder.files.length : 0;
  disableButton(DISABLE_MS);
  for (let i = 0; i < fl; i++) {
    await uploadImageSet(i);
    await sleep(UPLOAD_SLEEP_MS);
  }
}

const is_image_valid = (file) => {
  const s = file.size / 1024 / 1024;
  const reader = new FileReader(); // create a file reader instance.

  reader.onload = function (e) {
    let img = new Image();
    img.src = e.target.result;

    img.onload = function () {
      const w = this.width;
      const h = this.height;
      if (h > MAX_DIMENSION || w > MAX_DIMENSION || s > MAX_IMAGE_MB) {
        invalidImageLister(file, h, w, s);
      }
    };
  };
  reader.readAsDataURL(file);
};

function invalidImageLister(file, height, width, size) {
  if (!document.getElementById("invalidImageList")) {
    var title = document.createElement("p");
    title.innerText =
      "Invalid images\n(must be under 8mb and 8000x8000px)\n[Below may be resized or compressed then uploaded if possible, otherwise they will be skipped]:";
    title.style.textDecorationLine = "underline";
    title.style.padding = "20px 20px 0 20px";
    title.id = "invalidImageList";
    document.querySelector("#uploadimagesbutton").after(title);

    var list = document.createElement("ul");
    list.id = "invalidList";
    document.querySelector("#invalidImageList").after(list);
  }
  size = String(size).slice(0, 5);
  let heightHtml = height;
  let widthHtml = width;
  let sizeHtml = size;
  if (height > MAX_DIMENSION) {
    heightHtml = `<span style="color: red;">${height}</span>`;
  }
  if (width > MAX_DIMENSION) {
    widthHtml = `<span style="color: red;">${width}</span>`;
  }
  if (size > MAX_IMAGE_MB) {
    sizeHtml = `<span style="color: red;">${size}mb</span>`;
  }
  const invalidFileListing = `<li style="padding: 5px 20px;">${file.name}: ${heightHtml}x${widthHtml} ${sizeHtml}</li>`;
  const invalidListEl = document.querySelector("#invalidList");
  if (invalidListEl) invalidListEl.innerHTML += invalidFileListing;
}

async function disableButton(ms) {
  const btn = document.getElementById("uploadimagesbutton");
  if (!btn) return;
  btn.disabled = true;
  await sleep(ms);
  btn.disabled = false;
}

function initializeUploadUI() {
  const characterSection = document.querySelector("#CharacterAddImageSection");
  if (!characterSection) return false;

  characterSection.innerHTML = `
<label for="imagefile" style="padding: 0 15px;">Select multiple files</label>
<input id="imagefileHolder" type="file" multiple accept="image/jpeg, image/png, image/jpg, image/gif">
<input type="file" id="imagefile" disabled hidden>
<input id="addimagebutton" type="button" onclick="uploadImage(); return false;" value="Add Image" disabled hidden>
<input id="uploadimagesbutton" type="button" value="Upload Images">
`;

  const uploadBtn = document.querySelector("#uploadimagesbutton");
  if (uploadBtn) {
    uploadBtn.addEventListener("click", function () {
      uploadImages();
    });
  }

  return true;
}

if (!initializeUploadUI()) {
  const observer = new MutationObserver(() => {
    if (initializeUploadUI()) {
      observer.disconnect();
    }
  });
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}
