export type ClothingCategory = 'shirt' | 'pants' | 'shoes' | 'hair';

export interface Clothing {
  id: string;
  name: string;
  src: string;
  type: ClothingCategory;
}
