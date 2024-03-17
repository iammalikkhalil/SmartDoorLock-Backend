import multer from "multer";

const image = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split('.').pop();
    console.log(file.originalname);
    cb(null, req.body.username + '.' + fileExtension);
  },
});

const upload = multer({ storage: image }).single("avatar");

export default (req, res, next) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(500).json({ error: "File upload failed" });
    } else if (err) {
      console.error(err);
      return res.status(500).json({ error: "An error occurred" });
    }
    next();
  });
};