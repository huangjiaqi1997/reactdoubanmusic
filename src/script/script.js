
// getThemeColor('https://img1.doubanio.com/view/site/large/public/3a2c39f61bde3db.jpg')
//   .then((r) => console.log(r)
//   )


export function getThemeColor (URL) {

  const image = new Image()
  image.width = image.height = 50;
  image.crossOrigin = 'anonymous';// 处理 getImageData 跨域
  image.src = URL;

  
  return new Promise((resolve, reject) => {
    image.onload = function(){
      const themeColor = init(image);    
      resolve(themeColor)
    }
  })
  
   

  

    


  function init (image) {
    const imagedata_rgb_arr = get_imagedata_rgb_arr(image)
    const hslArr = get_hslobj_arr(imagedata_rgb_arr);
    const hslArrSort = get_hslobj_arr_sort(hslArr)
    const arrContainer = get_hslobj_arr_container(hslArrSort)
    const arrContainerSort = get_hslobj_arr_container_sort(arrContainer)
    const resultArr = get_result_arr(arrContainerSort)

    const firstColor = resultArr[0]

    const firstNumH = Number(firstColor.h)
    const firstNumL = Number(firstColor.l)

    
    const secondColor = get_second_color(resultArr, firstNumH, firstColor)
    const secondNumH = Number(secondColor.h)
    const thirdColor = get_third_color(resultArr, firstNumH,secondNumH, firstNumL, secondColor)
    
    

    // 子键下的字符串数字 -> 数字
    const to = (obj) => {
      const keys = Object.keys(obj)
      for (let i = 0; i< keys.length; i++) {
        obj[keys[i]] = Number(obj[keys[i]])
      }
      return obj
    }
    // console.log({
    //   color1: to(firstColor),
    //   color2: to(secondColor),
    //   color3: to(thirdColor)
    // });
    
    return {
      color1: to(firstColor),
      color2: to(secondColor),
      color3: to(thirdColor)
    }
  }

  // getImageData
  function get_imagedata_rgb_arr (image)  {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0)
    
    const imageData = context.getImageData(0, 0, image.width, image.height);
    
    return imageData.data;
  }

  function get_hslobj_arr (imgDataArr) {
    // 得到 rgb对象 的数组
    const rgbArr = [];
    for (let i = 0, len = imgDataArr.length; i < len; i+=4) {
      rgbArr.push({
        r: imgDataArr[i],
        g: imgDataArr[i + 1],
        b: imgDataArr[i + 2]
      })
    }

    // 得到 hsl对象 的数组
    const hslArr = []
    for (let i = 0, len = rgbArr.length; i < len; i++) {
      const rgb = rgbArr[i]
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b)
      // hslArr.push(`${hsl.h}${hsl.s}${hsl.l}`)
      hslArr.push({
        h: hsl.h,
        s: hsl.s,
        l: hsl.l
      })  
    }

    return hslArr
  }

  //  将 hslArr 重排序
  //  得到
  //  [{0,0,0},
  //   {0,0,1},
  //   {1,1,0},
  //   {1,1,0}
  //   ...    ]
  // 的形式
  function get_hslobj_arr_sort (hslArr) {
    return hslArr.sort((a,b)=> {
      const numA = Number(`${a.h}${a.s}${a.l}`.replace(/\./g, ''))
      const numB = Number(`${b.h}${b.s}${b.l}`.replace(/\./g, ''))
      return numA - numB
    })
  }

  //  将相等的项 push 进一个新数组
  //  新数组全部push 进 arrContainer
  //  有一项的，就代表 有两项是相同的
  function get_hslobj_arr_container (hslArrSort, ar) {    
    let flag = false;
    const arrContainer = [];
    for (let i = 0, len = hslArrSort.length; i < len; i++) {
        if (hslArrSort[i+1]) {
          const item = hslArrSort[i];
          const nextItem = hslArrSort[i + 1]
          let condition;
          if (ar !== 1) {
            condition= 
            Math.abs(item.h - nextItem.h) <= 10 &&
            Math.abs(item.s - nextItem.s) <= 0.3&&
            Math.abs(item.l - nextItem.l) <=0.1
          } else {
            condition =
              item.h === nextItem.h &&
              item.s === nextItem.s &&
              item.l === nextItem.l
          }
          // 这里 不要全等，应该相近
          if (condition) {
            // 若 上一项 与 这一项 也相等
            // 不创建新数组，push进上一个数组
            if (flag === true) {
              arrContainer[arrContainer.length-1].push(hslArrSort[i])
            } else {
              const arr = [];
              arr.push(hslArrSort[i])
              arrContainer.push(arr)
            }

          flag = true
        } else {
          flag = false
        }
      }
    }

    return arrContainer;
  }


  // 将 result 按所含数组项的 length 重排序
  // [[1], [2,2,2], [3,3].... ]
  // 得到
  // [
  //   [{hsl_1}, {hsl_1}, {hsl_1}, {hsl_1}], 
  //   [{hsl_2}, {hsl_2}, {hsl_2}],
  //   [{hsl_3}, {hsl_3}],
  //   ...
  // ] 的形式
  function get_hslobj_arr_container_sort (arrContainer){
    return arrContainer.sort((a,b)=> {
      if(a.length > b.length) {
        return -1
      } else if (a.length < b.length) {
        return 1
      } else {
        return 0
      }
    })
  }


  // 将 resultSort 简化：
  // [
  //   [{hsl_1}, {hsl}, {hsl}, {hsl}]
  //   {hsl_2},
  //   {hsl_3}
  // ]
  function get_result_arr (arrContainerSort)  {        
    const resultArr = []    
    for (let i = 0, len = arrContainerSort.length; i < len; i++) {      
      // 取每一个 subArr 里相同的项 最多的那一项   
      // const subArr = arrContainerSort[i];      
      // const subArrSort = get_hslobj_arr_sort (subArr)      
      // const containArrSort = get_hslobj_arr_container(subArrSort, 1)
      // const lenSort = get_hslobj_arr_container_sort(containArrSort)   
      // if (lenSort.length === 0) break;
      // resultArr.push(lenSort[0][0])

      // 取平均
      let hsum=0, ssum=0,lsum=0
      const subArr = arrContainerSort[i]
      for (let j=0;j<subArr.length;j++) {
        hsum += parseFloat(subArr[j].h);
        ssum += parseFloat(subArr[j].s);
        lsum += parseFloat(subArr[j].l);
      }
      
      const h = (hsum/subArr.length).toFixed(2);
      const s = (ssum/subArr.length).toFixed(2);
      const l = (lsum/subArr.length).toFixed(2);
      resultArr.push({h,s,l})
      
    }
    
    return resultArr;
  }


 
  function get_second_color(resultArr, firstNumH, firstColor) {
    let firstWithoutL;
    const firstNumL = firstColor.l
    let secondColor;
    // 重复色彩 有时会 < 300 个，
    // 设置遍历次数 maxFor
    const maxFor = resultArr.length < 700 ? resultArr.length : 700
    for ( let i = 0;  i< maxFor; i++) {
      const numH = resultArr[i].h;
      const numL = resultArr[i].l;

      const condition = 
(Math.abs(numH - firstNumH) >= 50 && (numL > 0.5 || firstNumL > 0.5) ) &&
(numL <= 0.6 || firstNumL <= 0.6)
 || Math.abs(numL - firstNumL) > 0.3
      if (condition) {
        console.log('second condition');
        
        
          // !firstWithoutL && (firstWithoutL = resultArr[i])

          
          // if(l -firstNumL < 0.4 || l -firstNumL > -0.4) {
          //   // first 暗色
          //   if(firstNumL <= 0.5) {
          //     return {...resultArr[i], l:(l+0.5).toFixed(2)}
          //   } else {
          //     // first 亮色
          //     return {...resultArr[i], l:(l-0.5).toFixed(2)}
          //   }
          // } else {
          //   return resultArr[i]
          // }
          return resultArr[i]
          


          // if (numL > 0.05 && numL < 0.95) {
            // console.log('getL'+resultArr[i]);

            // return resultArr[i];
          // }
        // }
      }
    }
    // return firstWithoutL

    if (firstNumL <= 0.5) {
      return {...firstColor, l:Number(firstColor.l)+0.5}
    } else {
      return {...firstColor, l:Number(firstColor.l)-0.5}
    }
  }


  function get_third_color(resultArr, firstNumH,secondNumH, firstNumL, secondColor) {
    let firstWithoutL;
    
    const maxFor = resultArr.length < 500 ? resultArr.length : 500
    for (let i = 0; i < maxFor; i++) {      
      const numH = Number(resultArr[i].h);
      const numL = Number(resultArr[i].l);
      const condition1 = 
(Math.abs(numH - firstNumH) >= 50 && (numL > 0.5 || firstNumL > 0.5) ) &&
      (numL <= 0.6 || firstNumL <= 0.6)
      || Math.abs(numL - firstNumL) > 0.3

const condition2 = Math.abs(numH - secondNumH) >= 50
      if (condition1 && condition2) {
        console.log('third condition');
        return resultArr[i]
      // if(numH - firstNumH > 30 || numH - firstNumH < -30) {         
      //   if (numH - secondNumH > 30 || numH - secondNumH < -30) {
      //     // if (numL - firstNumL >= 0.4 || numL - firstNumL <= -0.4){

      //       const l = Number(resultArr[i].l);
      //       if(l -firstNumL < 0.4 || l -firstNumH > -0.4) {
      //         // first 暗色
      //         if(firstNumL <= 0.5) {
      //           return {...resultArr[i], l:(l+0.4).toFixed(2)}
      //         } else {
      //           // first 亮色
      //           return {...resultArr[i], l:(l-0.4).toFixed(2)}
      //         }
      //       } else {
      //         return resultArr[i]
      //       }
      //     // }
      //   }
      // }
      } 
    }
    
    // return firstWithoutL
    if (firstNumL <= 0.5) {
      return {...secondColor, l:Number(secondColor.l)-0.2}
    } else {
      return {...secondColor, l:Number(secondColor.l)+0.2}
    }
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min){ 
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
      h: (h*360).toFixed(0),
      s: s.toFixed(2),
      l: l.toFixed(2)
    };
  }

  
}
