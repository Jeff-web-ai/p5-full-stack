import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cd) {
    cd(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export default upload;
