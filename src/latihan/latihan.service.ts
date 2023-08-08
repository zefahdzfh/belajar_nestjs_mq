import { Injectable } from '@nestjs/common';

@Injectable()
export class LatihanService {
  hello() {
    return 'hello world';
  }

  tes() {
    return 'testing testing 123';
  }
}
