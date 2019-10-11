import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textval'
})
export class TextvalPipe implements PipeTransform {

  transform(items: any[], args: any): any {
    return items.length? items.find(item => item.value === args) : [];
  }

}
