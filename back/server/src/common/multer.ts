import * as multer from 'multer';

import * as path from 'path';

import * as fs from 'fs';

import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { HttpException, HttpStatus } from '@nestjs/common';

const createFolder = (folder: string) => {
  try {
    console.log('๐พ Create a root uploads folder...');

    fs.mkdirSync(path.join(__dirname, '..', `uploads`)); //ํด๋๋ฅผ ๋ง๋๋ ๋ช๋ น์ด
  } catch (error) {
    console.log('The folder already exists...');
  }

  try {
    console.log(`๐พ Create a ${folder} uploads folder...`);

    fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`)); //ํด๋ ์์ฑ
  } catch (error) {
    console.log(`The ${folder} folder already exists...`);
  }
};

const storage = (folder: string): multer.StorageEngine => {
	createFolder(folder); // ํด๋ ๋ง๋ค๊ณ 
	return multer.diskStorage({
		//์ต์์ ์จ์ค๋ค.
		destination(req, file, cb) {
		const folderName = path.join(__dirname, '..', `uploads/${folder}`);
		cb(null, folderName); //callback์ ๋๋ฒ์งธ ์ธ์๊ฐ ์ด๋์ ์ ์ฅํ ์ง๋ค.
		},

		filename(req, file, cb) {
		const ext = path.extname(file.originalname); //ํ์ผ์ ์ฌ๋ ค์ ํ์ฅ์๋ฅผ ์ถ์ถํ๋ค.

		let ts = Date.now();
		let data_ob = new Date(ts);
		let year = data_ob.getFullYear();
		let month = data_ob.getMonth();
		let date = data_ob.getDate();
		let hour = data_ob.getHours()
		let min = data_ob.getMinutes();
		let sec = data_ob.getSeconds();
		const fileName = `${path.basename(
			file.originalname,

			ext,
		)}${year}${month}${date}${hour}${min}${sec}${ext}`;

		cb(null, fileName);
		},
	});
};

// multerOptions์ ์ปจํธ๋กค๋ฌ์์ ์ฌ์ฉํด์ ์๋ก๋ ํ๋ค.
export const multerOptions = (folder: string) => {
	const result: MulterOptions = {
		fileFilter: (request, file, callback) => {
			if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
				// ์ด๋ฏธ์ง ํ์์ jpg, jpeg, png๋ง ํ์ฉํฉ๋๋ค.
				callback(null, true);
			}
			else {
				callback(new HttpException('Invalid image extension', HttpStatus.BAD_REQUEST), false);
			}
		},
		
		storage: storage(folder),
	};

  return result;
};
