app.factory('indexFactory', [()=>{ 
    const connectSocket = (url,options)=>{
        return new Promise((resolve,reject)=>{ //bu method kendi içerisinde bir promise return eiyor
            const socket = io.connect(url,options);//socket baglantısını burada yaptım
        
            socket.on('connect', ()=>{ //baglandıysa evente tetiklenecek
                resolve(socket);
            });
            
            socket.on('connect_error', ()=>{
                reject(new Error('connect_error')); //hata olursa da reject edecek
            });
        });
    };
    return {
        connectSocket //burada bir obje return ettik
    }
}]);