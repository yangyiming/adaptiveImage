window.onload = async function(){
    const allImg = ['img/1.jpg','img/2.jpg','img/3.jpg','img/4.jpg','img/5.jpg','img/6.jpg','img/7.jpg','img/8.jpg','img/9.jpg','img/10.jpg','img/11.jpg','img/12.jpg','img/13.jpg']
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
        const imgRandom = parseInt(Math.random()*13)
        imgs.push(allImg[imgRandom])
    }

    

    let pw = 500
    let ph = 500
    // 原图宽高集合
    let imgRect = []
    const promiseArr = imgs.map(getImageRect);

    await Promise.all(promiseArr).then((result)=>{
        imgRect = result
    })
    
    // 缩放后的图片宽高
    let changeImgRect = []

    // 1张图片缩放
    if(imgs.length === 1){

        if(isH(imgRect[0])){
            const wh =  oneHRect(imgRect[0])
            changeImgRect.push(wh)
        }else{
            const wh =  oneVRect(imgRect[0])
            changeImgRect.push(wh)
        }
    }

    // 2张图片缩放
    if(imgs.length === 2){
        if(isH(imgRect[0])){
            changeImgRect = twoVRect(imgRect[0],imgRect[1])
        }else{
            changeImgRect = twoHRect(imgRect[0],imgRect[1])
        }
        
    }

    // 2张图片缩放
    if(imgs.length === 3){
        if(isH(imgRect[0])){
            changeImgRect = threeVRect(imgRect[0],imgRect[1],imgRect[2])
        }else{
            changeImgRect = threeHRect(imgRect[0],imgRect[1],imgRect[2])
        }
    }

    if(imgs.length === 4){
        changeImgRect = fourHRect(imgRect[0],imgRect[1],imgRect[2],imgRect[3])
    }



    renderImg(changeImgRect)



    // 1张横图缩放 h 横图缩写 v 竖图缩写 单张横图 图片的宽等于容器的宽
    function oneHRect(wh){
        const w1 = wh.width
        const h1 = wh.height
        // 缩放比例
        let scale = pw/w1;
        // 缩放后的宽度
        let x1;
        // 缩放后的高度
        let y1;
        x1 = pw = w1*scale
        y1 = h1*scale

        return {
            width:x1,
            height:y1
        }
    }

    // 1张竖图缩放 单张竖图 图片的高等于容器的高
    function oneVRect(wh){
        const w1 = wh.width
        const h1 = wh.height
        // 缩放比例
        let scale = ph/h1;
        // 缩放后的宽度
        let x1;
        // 缩放后的高度
        let y1;
        x1 = pw = w1*scale
        y1 = h1*scale

        return {
            width:x1,
            height:y1
        }
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

        const w1 = wh1.width
        const h1 = wh1.height
        const w2 = wh2.width
        const h2 = wh2.height
           // 第一张图片的缩放因子
        let x1 = pw/(w1+w2*h1/h2)
        // 第二章图片的缩放因子
        let x2 = h1*x1/h2
        // 第一张图片缩放后的宽高
        let cwh1 = {width:w1*x1,height:h1*x1}
        // 第二张图片缩放后的宽高
        let cwh2 = {width:w2*x2,height:h2*x2}

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
        let cwh1 = {width:w1*x1,height:h1*x1}
        // 第二张图片缩放后的宽高
        let cwh2 = {width:w2*x2,height:h2*x2}
        // 第一张图片的高度超过容器的80% 移除第二张图片
        if(cwh1.height >= ph * 0.8){
            imgs.splice(1,1)
            return [cwh1]
        }else{
            return [cwh1,cwh2]
        }
        
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
    function threeHRect(wh1,wh2,wh3){
        const w1 = wh1.width
        const h1 = wh1.height
        const w2 = wh2.width
        const h2 = wh2.height
        const w3 = wh3.width
        const h3 = wh3.height
        
        // 第一张图片的缩放因子
        let x1 = pw/(w1+w2*h1/h2+w3*h1/h3)
        // 第二张图片缩放后的宽高
        let x2 = pw/(w1*h2/h1+w2+w3*h2/h3)
        // 第三张图片缩放后的宽高
        let x3 = pw/(w1*h3/h1+w2*h3/h2+w3)
        let cwh1 = {width:w1*x1,height:h1*x1}
        let cwh2 = {width:w2*x2,height:h2*x2}
        let cwh3 = {width:w3*x3,height:h3*x3}
         return [cwh1,cwh2,cwh3]
    }


    // 3张图 首张横图 垂直排列
    // w1*x1 = pw
    // w2*x2 = pw 
    // w3*x3 = pw 
    function threeVRect(wh1,wh2,wh3){
        const w1 = wh1.width
        const h1 = wh1.height
        const w2 = wh2.width
        const h2 = wh2.height
        const w3 = wh3.width
        const h3 = wh3.height
        
        // 第一张图片的缩放因子
        let x1 = pw/w1
        // 第二张图片缩放后的宽高
        let x2 = pw/w2
        // 第三张图片缩放后的宽高
        let x3 = pw/w3
        let cwh1 = {width:w1*x1,height:h1*x1}
        let cwh2 = {width:w2*x2,height:h2*x2}
        let cwh3 = {width:w3*x3,height:h3*x3}

        // 第一张图高度大于80% 第二和第三张图片移除
        if(cwh1.height>(ph*0.8)){
            imgs.splice(1,1)
            imgs.splice(2,1)
            return [cwh1]
            // 第一张加第二章的高度大于80% 移除第三张
        }else if((cwh1.height+cwh2.height)>(ph*0.8)){
            imgs.splice(2,1)
            return [cwh1,cwh2]
        }else{
            return [cwh1,cwh2,cwh3]
        }
        
    }


    // 4张图 两两水平排列
    function fourHRect(wh1,wh2,wh3,wh4){
        const w1 = wh1.width
        const h1 = wh1.height
        const w2 = wh2.width
        const h2 = wh2.height
        const w3 = wh3.width
        const h3 = wh3.height
        const w4 = wh4.width
        const h4 = wh4.height
        const wh12 = twoHRect(wh1,wh2)
        if(wh12[0].height > ph*0.8){
            return wh12
        }else{
            const wh34 = twoHRect(wh3,wh4)
            return  wh12.concat(wh34)
        }
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
                // 打印
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

    // 渲染图像
    function renderImg(){
        const box = document.getElementById('imgBox')
        let str = ' '
        imgs.forEach((obj,index)=>{
            str += `<img src="${obj}" style="width:${changeImgRect[index].width}px;height:${changeImgRect[index].height}px;"/>`
        })
        box.innerHTML = str
    }

}