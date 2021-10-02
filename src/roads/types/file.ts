export interface MulterFile extends Express.Multer.File {
  key: string;
}
