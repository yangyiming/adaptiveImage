window.onload = async function(){
    const allImg = ['img/16.png','img/17.png','img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg','img/11.jpg','img/12.jpg','img/13.jpg']
    // const imgs = ['img/1.jpg'] //横 
    // const imgs = ['img/3.jpg'] //竖

    //  const imgs = ['img/1.jpg','img/1.jpg'] //2横
    // const imgs = ['img/3.jpg','img/3.jpg'] //2竖
    // const imgs = ['img/1.jpg','img/3.jpg'] //1横1竖

    // const imgs = ['img/1.jpg','img/3.jpg','img/3.jpg'] // 1横2竖
    //const imgs = ['img/3.jpg','img/1.jpg','img/1.jpg'] // 2横1竖
    // const imgs = ['img/1.jpg','img/1.jpg','img/1.jpg'] // 3横
    // const imgs = ['img/3.jpg','img/1.jpg','img/3.jpg'] // 3竖

    const imgs = [] // 3竖
    const random = parseInt(Math.random()*4)
    for(var x = 0;x<=random;x++){
        const imgRandom = parseInt(Math.random()*15)
        imgs.push(allImg[imgRandom])
    }

    // const imgs = ['img/16.png','img/17.png','img/17.png','img/16.png'] //展示的图片

    // 剩余空间不能容纳图片的0.5区域  则图片不需要排列
        
    

    let pw = 500
    let ph = 500
    // 图片间距
    let distance = 40
    // 原图宽高集合
    let imgRect = []
    // 最小图片显示区域占比
    let minScale = 0.6
    // 图片可见空间占比
    let imgInScale = 0.5
    const promiseArr = imgs.map(getImageRect);

    await Promise.all(promiseArr).then((result)=>{
        imgRect = result
    })
    
    // 缩放后的图片宽高
    let changeImgRect = []

    // 图片处理 获取图片排版属性
    filterImgObj(changeImgRect)
    
    // 图片裁切居中
    cropImages(changeImgRect)

    // 图片居中
    setImgCenter(changeImgRect)

 


    renderImg(changeImgRect)




     // 渲染图像
     function renderImg(){
        const box = document.getElementById('imgBox')
        let str = ' '
       
        imgs.forEach((obj,index)=>{
            let imgObj = changeImgRect[index]
            str += `<div style="width:${imgObj.cWidth}px;height:${imgObj.cHeight}px;overflow:hidden;display:inline-block;position:absolute;left:${imgObj.x}px;top:${imgObj.y}px"><img src="${obj}" style="width:${imgObj.width}px;height:${imgObj.height}px;position:absolute;left:${imgObj.left}px;top:${imgObj.top}px;"/></div>`
        })
        box.innerHTML = str
    }

    // 图片处理 获取图片排版属性
    function filterImgObj(){
        
        // 1张图片缩放
        if(imgRect.length === 1){

            if(isH(imgRect[0])){
                const wh =  oneHRect(imgRect[0])
                changeImgRect.push(wh)
            }else{
                const wh =  oneVRect(imgRect[0])
                changeImgRect.push(wh)
            }
        }

        // 2张图片缩放
        if(imgRect.length === 2){
            if(isH(imgRect[0])){
                changeImgRect = twoVRect(imgRect[0],imgRect[1])
            }else{
                changeImgRect = twoHRect(imgRect[0],imgRect[1])
            }
        }

        // 3张图片缩放
        if(imgRect.length === 3){
            if(isH(imgRect[0])){
                changeImgRect = threeVRect(imgRect[0],imgRect[1],imgRect[2])
            }else{
                changeImgRect = threeHRect(imgRect[0],imgRect[1],imgRect[2])
            }
        }

        if(imgRect.length === 4){
            changeImgRect = fourHRect(imgRect[0],imgRect[1],imgRect[2],imgRect[3])
        }
    }   


    // 图片裁切
    function cropImages(imgObj){
        for(const obj of imgObj){
            obj.left = -(obj.width - obj.cWidth)/2
            obj.top = -(obj.height - obj.cHeight)/2
        }
    }

    // 图片居中方法
    function setImgCenter(imgRectObj){
        // 水平居中
        // 剩余可见容器宽度
        let residueWidth = pw - imgRectObj[0].cWidth
        if(imgRectObj.length === 2){
            // 横图
            if(isH(imgRectObj[0])){
                residueWidth = pw - imgRectObj[0].cWidth
            }else{
                residueWidth = pw - imgRectObj[0].cWidth - imgRectObj[1].cWidth 
            }
        }
        if(imgRectObj.length > 2){
            residueWidth = pw - imgRectObj[0].cWidth - imgRectObj[1].cWidth 
        }
        // 剩余可见容器高度
        let residueHeight = ph - imgRectObj[0].cHeight
        if(imgRectObj.length === 2){
            // 横图
            if(isH(imgRectObj[0])){
                residueHeight = ph - imgRectObj[0].cHeight - imgRectObj[1].cHeight 
            }
        }
        if(imgRectObj.length >= 3){
            residueHeight = ph - imgRectObj[0].cHeight - imgRectObj[2].cHeight 
        }

        // 居中算法
        for(const value of imgRectObj){
            if(residueWidth>0){
                value.x+=(residueWidth/2)
            }
            if(residueHeight>0){
                value.y+=(residueHeight/2)
            }
        }
        
    }   

    // 对象属性扩展
    function extendObj(option){
        let current =  {
            width: option.width || '',
            height: option.height || '',
            left: option.left || 0,
            top: option.top || 0,
            cWidth: option.cWidth || option.width || '',
            cHeight: option.cHeight || option.height || '',
            x:option.x || 0,
            y:option.y || 0
        }
        return current
    }


    // 过滤可排列的图片对象
    function filterRealReactObj(rects,index,residue){
        let realRect = JSON.parse(JSON.stringify(rects))
        let vFactor = residue/realRect[index].height
        // 剩余空间小于图片的0.5区域 则删除
        if(vFactor < 0.5){
            realRect.splice(index,1)
            imgs.splice(index,1)
        }
        return realRect
    }   


    // 计算图片大小和可视区域
    // wh 图片对象  vwh 可视宽高  type 垂直或者水平
    function calculationRect(wh,vwh,type){

        // 垂直方向剩余空间
        let scale =  1
        if(type === 'v'){
            if(vwh < ph * minScale){
                wh.cHeight = ph * minScale
                scale =  wh.cHeight/wh.height
            }else if(vwh > ph){
                wh.cHeight = ph
            }
            // 水平方向剩余空间
        }else if(type === 'h'){
            if(vwh < pw * minScale){
                wh.cWidth = pw * minScale
                scale = wh.cWidth/wh.width
            }else if(vwh > pw){
                wh.cWidth = pw
            }
        }
        wh.width =  wh.width*scale
        wh.height =  wh.height*scale

    }

    // 计算图片可视容器宽高
    function calculationContainer(wh,residue){
        if(wh.height/residue < imgInScale){
            wh.cWidth = 0
            wh.cHeight = 0
        }else if(wh.height/residue>1){
            wh.cHeight = residue
        }
    }

    // 两张图片水平排列方法
    function arrangeImg(wh1,wh2){
        const w1 = wh1.width
        const h1 = wh1.height
        const w2 = wh2.width
        const h2 = wh2.height
    
        // 第一张图片的缩放因子
        let x1 = pw/(w1+w2*h1/h2)
        // 第二章图片的缩放因子
        let x2 = h1*x1/h2
        // 第一张图片缩放后的宽高
        let cwh1 = extendObj({
            width:w1*x1,
            height:h1*x1
        })
        // 第二张图片缩放后的宽高
        let cwh2 = extendObj({
            width:w2*x2,
            height:h2*x2,
            x:cwh1.cWidth
        })
        return [cwh1,cwh2]
    }


    // 1张横图缩放 h 横图缩写 v 竖图缩写 单张横图 图片的宽等于容器的宽
    function oneHRect(wh1){
        const w1 = wh1.width
        const h1 = wh1.height
        // 缩放比例
        let scale = pw/w1;
        let wh = extendObj({
            width: w1*scale,
            height: h1*scale
        })
        calculationRect(wh,wh.height,'v')        
        return wh
    }

    // 1张竖图缩放 单张竖图 图片的高等于容器的高
    function oneVRect(wh1){
        const w1 = wh1.width
        const h1 = wh1.height
        // 缩放比例
        let scale = ph/h1;
        let wh = extendObj({
            width:w1*scale,
            height: h1*scale,
        })
        calculationRect(wh,wh.width,'h')      
        // cropSingleImg(wh,{width:pw,height:ph})
        return wh
    }

    // 2张图 第一张是竖图
    // 先对原始图片进行计算
    // 2张图片的宽度之和等于容器的宽度 
    // w1*x+w2*y = pw
    // 图片高度相等
    // h1*x = h2*y
    // 计算出2张图片各自的缩放因子
    // y = h1*x/h2
    // w1*x+w2*(h1*x/h2) = pw
    // x(w1+w2*h1/h2) = pw
    // x= pw/(w1+w2*h1/h2)
    // y = h1*x/h2
    function twoHRect(wh1,wh2){

      
        let obj = arrangeImg(wh1,wh2)
        let cwh1 = obj[0]
        let cwh2 = obj[1]
        calculationRect(cwh1,cwh1.height,'v')   
        calculationRect(cwh2,cwh2.height,'v')   


        return [cwh1,cwh2]
    }


    // 2张图 第一张是横图
    // 先对原始图片进行计算
    // 图片宽度相等
    // w1*x1 = w2*x2
    // 单张图片的宽度等于容器的宽度
    // w1*x1 = pw
    // w2*x2 = pw
    // 计算出2张图片各自的缩放因子
    // x1 = pw/w1
    // x2 = pw/w2
    function twoVRect(wh1,wh2){
    
        const w1 = wh1.width
        const h1 = wh1.height
        const w2 = wh2.width
        const h2 = wh2.height
           // 第一张图片的缩放因子
        let x1 = pw/w1
        // 第二章图片的缩放因子
        let x2 = pw/w2
        // 第一张图片缩放后的宽高
        let cwh1 = extendObj({
            width:w1*x1,
            height:h1*x1,
        })
        // 第二张图片缩放后的宽高
        let cwh2 = extendObj({
            width:w2*x2,
            height:h2*x2
        })
        calculationContainer(cwh2,ph-cwh1.height)
        if(cwh2.cHeight === 0){
            calculationRect(cwh1,cwh1.height,'v')        
        }else{
            cwh2.y+= cwh1.cHeight
        }
        return  [cwh1,cwh2]
        // 可排版的数据对象
        // let realRect = [cwh1,cwh2]

        // 剩余空间
        // let residue = ph-cwh1.height
        // /// 判断第二张是不是可排列对象 并返回全部
        // let filterRealRect = filterRealReactObj(realRect,1,residue)
        // if(filterRealRect.length === 2){
        //     filterRealRect[1].y+= filterRealRect[0].cHeight
        // }
        // return filterRealRect

    }

    // 3张图  首张竖图 水平排列
    // 先对原始图片进行计算
    // 3张图片的宽度之和等于容器的宽度 
    // w1*x1+w2*x2+w3*x3 = pw
    // 图片高度相等
    // h1*x1 = h2*x2 = h3*x3
    // 计算出3张图片各自的缩放因子
    
    // 计算x1
    // x2 = h1*x1/h2
    // x3 = h1*x1/h3
    // w1*x1+w2*h1*x1/h2+w3*h1*x1/h3 = pw
    // x1*(w1+w2*h1/h2+w3*h1/h3) = pw
    // x1 = pw/(w1+w2*h1/h2+w3*h1/h3)

    // 计算x2
    // x2 = pw/(w1*h2/h1+w2+w3*h2/h3)
    // 计算x3
    // x3 = pw/(w1*h3/h1+w2*h3/h2+w3)
    // 修改方案： 首张竖图 先横排再竖排
    // 
    function threeHRect(wh1,wh2,wh3){
        // const w1 = wh1.width
        // const h1 = wh1.height
        // const w2 = wh2.width
        // const h2 = wh2.height
        const w3 = wh3.width
        const h3 = wh3.height

        // 取前两张图排列，并返回排列对象
         let realRect = arrangeImg(wh1, wh2)

         // 第三张图片的缩放因子
        let x3 = pw/w3
        let cwh3 = extendObj({
            width:w3*x3,
            height:h3*x3
        })
        realRect.push(cwh3)

        calculationContainer(cwh3,ph-realRect[0].cHeight)
        if(cwh3.cHeight === 0){
            calculationRect(realRect[0],realRect[0].height,'v')   
            calculationRect(realRect[1],realRect[1].height,'v')   
        }else{
            realRect[2].y+=realRect[0].cHeight
        }
        return realRect
         /// 判断第三张是不是可排列对象,并返回全部
        //  let filterRealRect = filterRealReactObj(realRect,2,residue)
        //  if(filterRealRect.length === 3){
        //     filterRealRect[2].y+=filterRealRect[0].cHeight
        //  }else{
        //      calculationRect(filterRealRect[0],filterRealRect[0].height,'v')
        //      calculationRect(filterRealRect[1],filterRealRect[1].height,'v')
        //     // scaleMaxArea(filterRealRect[0],filterRealRect[1])
        //  }
         
        // return filterRealRect


        // // 第一张图片的缩放因子
        // let x1 = pw/(w1+w2*h1/h2+w3*h1/h3)
        // // 第二张图片缩放后的宽高
        // let x2 = pw/(w1*h2/h1+w2+w3*h2/h3)
        // // 第三张图片缩放后的宽高
        // let x3 = pw/(w1*h3/h1+w2*h3/h2+w3)
        // let cwh1 = {width:w1*x1,height:h1*x1}
        // let cwh2 = {width:w2*x2,height:h2*x2}
        // let cwh3 = {width:w3*x3,height:h3*x3}
        //  return [cwh1,cwh2,cwh3]
    }


    // 3张图 首张横图 垂直排列
    // w1*x1 = pw
    // w2*x2 = pw 
    // w3*x3 = pw 
    // 变更方案：首张横图 先横排再竖排
    // 
    function threeVRect(wh1,wh2,wh3){
        const w1 = wh1.width
        const h1 = wh1.height

        let realRect = []

        // 第一张图片的缩放因子
        let x1 = pw/w1
        let cwh1 = extendObj({
            width:w1*x1,
            height:h1*x1,
        })
        realRect.push(cwh1)

        // 两张图排列，并返回排列对象
        let rect = twoHRect(wh2, wh3)
        realRect = realRect.concat(rect)

        // 剩余空间
        let residue = ph-realRect[0].height
    
        calculationContainer(realRect[1],residue)
        calculationContainer(realRect[2],residue)

        if(realRect[1].cHeight === 0){
            calculationRect(realRect[0],realRect[0].height,'v')
        }else{
            realRect[1].y += realRect[0].cHeight
            realRect[2].y += realRect[0].cHeight
        }
        return realRect
       
       return filterRealRect


        
    }


    // 4张图 两两水平排列
    function fourHRect(wh1,wh2,wh3,wh4){

        const wh12 = arrangeImg(wh1,wh2)
        const wh34 = arrangeImg(wh3,wh4)
        let realRect = wh12.concat(wh34)

        // 剩余空间
        let residue = ph-realRect[0].height
        calculationContainer(realRect[2],residue)
        calculationContainer(realRect[3],residue)
        if(realRect[2].cHeight === 0){
            if(isH(wh1)){
                let obj = twoVRect(wh1,wh2)
                realRect[0] = obj[0]
                realRect[1] = obj[1]
            }else {
                let obj = twoHRect(wh1,wh2)
                realRect[0] = obj[0]
                realRect[1] = obj[1]
            } 
        }else{
            realRect[2].y += realRect[0].cHeight
            realRect[3].y += realRect[0].cHeight
        }
        return realRect



    }


    // 获取图片的真实宽高
    function getImageRect(url){

        return new Promise(function(resolve,reject){
                // 图片地址
            var img_url = url;
            
            // 创建对象
            var img = new Image();
            
            // 改变图片的src
            img.src = img_url;
            
            // 判断是否有缓存
            if(img.complete){
                // width height 图片的原始宽高
                // cWidth cHeight 图片容器的宽高
                resolve({
                    width:img.width,
                    height:img.height
                })
            }else{
                // 加载完成执行
                img.onload = function(){
                    resolve({
                        width:img.width,
                        height:img.height
                    })
                };
            }
        })
    }

    // 判断是横图还是竖图
    function isH(obj){
        if(obj.width > obj.height){
            return true
        }else{
            return false
        }
    }

   

}