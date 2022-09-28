import { promises as fsPromises } from 'fs';
import { join } from 'path';

export class FileOperations{

  public static async asyncReadFileAsString(filename: string,path:string) {
    try {
      const result = await fsPromises.readFile(
        join(path, filename),
        'utf-8',
      );
  
      console.log(result); // 👉️ "hello world hello world ..."
  
      return result;
    } catch (err) {
      console.log(err);
      return '';
    }
  }

}