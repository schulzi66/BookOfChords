export class Exercise {
  id: string;
  uid: string;
  name: string;
  description: string;
  currentBpm: number;
  nextBpm: number;
  pictures: string[];
  pdfs: string[];
  sound: string;

  constructor() {
    this.pictures = [];
    this.pdfs = [];
  }
}
