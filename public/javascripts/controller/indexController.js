app.controller('indexController', ['$scope','indexFactory', ($scope,indexFactory) =>{
    $scope.messages = [];
    $scope.players = { }; //bralarda obje oluşturuyorum
    $scope.init = () =>{
        const username = prompt ('please enter username');
        
        if(username)//username girilmişse
            initSocket(username);
        else
            return false;
    }; //kullanıcıdan degerleri alıp diğer serverlarda göstermeyi sağlayacagız
    
    function scrollTop() {        
        setTimeout(() => {
            const element = document.getElementById('chat-area');
            element.scrollTop = element.scrollHeight;
            });
        };

    function showBuble(id, message) {
        $('#'+id).find('.message').show().html(message);
        setTimeout(() => {
            $('#'+id).find('.message').hide();
        }, 2000);
    };

    async function initSocket(username) {
        const connectionsOptions={
            reconnectionAttempts:3,
            reconnectionDelay:600
        };
        try{
            const socket = await indexFactory.connectSocket('http://localhost:3000', connectionsOptions);
            socket.emit('newUser',{username});
            //console.log('baglanti gerçekleşti',socket); //burada yaptıgımız şey bir servis yazıp socket baglantısını service araclgıyla gerçeleştirdik
            socket.on('initPlayers',(players)=>{
                $scope.players = players;
                $scope.$apply(); //kodun ön taraaf yansımas için 
            });
            
            socket.on('newUser',(data)=>{
                const messageData= {
                    type:{
                        code:0, //seerver yada user mesajı
                        message:1 //login or disconnect messsage
                    }, //sunucu tarafından gönderilen mesaj oldugunu belirtmek için
                    username: data.username,   
                };
                $scope.messages.push(messageData);
                $scope.players[data.id]= data;
                scrollTop();
                $scope.$apply();
            });


                socket.on('disUser', (data)=>{
                    const messageData= {
                        type:{
                            code:0, //seerver yada user mesajı
                            message:0 //login or disconnect messsage
                        }, //sunucu tarafından gönderilen mesaj oldugunu belirtmek için
                        username: data.username,   
                    };
                    $scope.messages.push(messageData);
                    delete $scope.players[data.id];
                    scrollTop();
                    $scope.$apply();
                });


                socket.on('animate',data=>{
                    console.log(data);
                    $('#'+data.socketId).animate({'left':data.x,'top':data.y},()=>{
                        animate=false;
                    });
                });


                socket.on('newMessage',message =>{
                    $scope.messages.push(message);
                    $scope.$apply(); 
                    showBuble(message.socketId,message.text)
                    scrollTop();
                });
                let animate = false;
                $scope.onClickPlayer = ($event) =>{
                    if(!animate)
                    {

                        let x =$event.offsetX;
                        let y = $event.offsetY;

                        socket.emit('animate', {x,y});

                        animate=true;
                        $('#'+socket.id).animate({'left':x,'top':y},()=>{
                            animate=false;
                        });
                    }
                };



                $scope.newMessage = () =>{
                    let message = $scope.message;
                    console.log(message);
                    const messageData= {
                        type:{
                            code:1, //seerver yada user mesajı
                        }, //sunucu tarafından gönderilen mesaj oldugunu belirtmek için
                        username:username,   
                        text:message
                    };

                    $scope.messages.push(messageData);
                    $scope.message = '';
                    socket.emit('newMessage',messageData);
                    showBuble(socket.id,message);
                    scrollTop();
                    
                };
            }catch(err)
            {
                console.log(err);
            }
    
        }
}]);
