"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
const os = __importStar(require("os"));
const fs = __importStar(require("fs"));
const Storage = __importStar(require("@google-cloud/storage"));
const date_fns_timezone_1 = require("date-fns-timezone");
// import { firebaseConfig } from 'firebase-functions';
const next_1 = __importDefault(require("next"));
const sharp_1 = __importDefault(require("sharp"));
const exifreader = require('exif-reader');
const fraction_js_1 = __importDefault(require("fraction.js"));
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({
    dev: dev,
    conf: { distDir: `${path.relative(process.cwd(), __dirname)}/next` }
});
const handle = app.getRequestHandler();
exports.nextApp = functions.https.onRequest((req, res) => {
    console.log('File: ' + req.originalUrl);
    return app.prepare().then(() => handle(req, res));
});
exports.createExif = functions.region('asia-northeast1').storage.object().onFinalize(async (object) => {
    var _a;
    const filePath = object.name;
    const [city, filename] = filePath.split('/');
    console.debug(`${city}: ${filename}`);
    const randomFileName = crypto.randomBytes(20).toString('hex') + path.extname(filePath);
    const tempLocalFile = path.join(os.tmpdir(), randomFileName);
    if (!((_a = object.contentType) === null || _a === void 0 ? void 0 : _a.startsWith('image/'))) {
        console.error('This is not an image.');
        return null;
    }
    const storage = new Storage.Storage();
    const bucket = storage.bucket(object.bucket);
    await bucket.file(filePath).download({ destination: tempLocalFile });
    // Make download url
    const url = `https://firebasestorage.googleapis.com/v0/b/${object.bucket}/o/${encodeURIComponent(filePath)}?alt=media`;
    // Get Exif
    const exif = await sharp_1.default(tempLocalFile)
        .metadata()
        .then((meta) => {
        const ex = exifreader(meta.exif);
        ex.exif.DateTimeOriginal = date_fns_timezone_1.convertToLocalTime(ex.exif.DateTimeOriginal, { timeZone: 'Asia/Tokyo' });
        ex.exif.DateTimeDigitized = date_fns_timezone_1.convertToLocalTime(ex.exif.DateTimeDigitized, { timeZone: 'Asia/Tokyo' });
        ex.image.ModifyDate = date_fns_timezone_1.convertToLocalTime(ex.image.ModifyDate, { timeZone: 'Asia/Tokyo' });
        ex.exif.ExposureTime = new fraction_js_1.default(ex.exif.ExposureTime).toFraction();
        ex.exif.ApertureValue = new fraction_js_1.default(ex.exif.ApertureValue).toFraction();
        ex.exif.ShutterSpeedValue = new fraction_js_1.default(ex.exif.ShutterSpeedValue).toFraction();
        if (meta.size && meta.size > 1048576) {
            const tempLocalResizedFile = path.join(os.tmpdir(), "resized", randomFileName);
            const resized = sharp_1.default(tempLocalFile)
                .resize({ width: meta.width / 2 })
                .toFile(tempLocalResizedFile)
                .then((file) => {
                bucket.upload(filePath, { destination: tempLocalResizedFile }).then((res) => {
                    console.log('resized: ' + res[0].name);
                }).catch((err) => {
                    console.error(err);
                });
            }).catch((err) => {
                console.error(err);
            });
        }
        return ex;
    });
    // console.debug(exif)
    // Save Exif
    const metadata = Object.assign(Object.assign({}, exif), { filePath: filePath, filename: filename, url: url, city: city });
    // console.debug({ metadata: metadata })
    await admin.firestore().collection('pics').doc(`${city}-${filename}`).set(metadata);
    console.log('Wrote to:', filePath, 'data:', { metadata });
    fs.unlinkSync(tempLocalFile);
    console.log(`finished!`);
    return null;
});
exports.deleteExif = functions.region('asia-northeast1').storage.object().onDelete(async (object) => {
    const filePath = object.name;
    await admin.firestore().collection('pics').where('filePath', '==', filePath)
        .get()
        .then(function (querySnapshot) {
        querySnapshot.forEach(function (doc) {
            doc.ref.delete().then(() => {
                console.log(`Deleted: ${filePath}: ${doc.ref.id}`);
            })
                .catch((error) => console.error(error));
        });
    })
        .catch((error) => console.error(error));
});
//# sourceMappingURL=index.js.map