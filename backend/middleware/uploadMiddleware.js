import multer from "multer"
import path from "path"

// storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname
    cb(null, uniqueName)
  }
})

// ✅ FILE FILTER (IMPORTANT)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error("Only image files allowed"), false)
  }
}

const upload = multer({
  storage,
  fileFilter, // ✅ added
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})

export default upload