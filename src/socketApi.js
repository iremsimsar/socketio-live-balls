const socketio = require('socket.io');
const io = socketio();

const socketApi = { };
socketApi.io = io; 

const users = { };

//helpers

const randomColor = require('../helpers/randomColor');

io.on('connection', (socket)=>{
    console.log("user connected");

    socket.on('newUser', (data)=>{ //EMİTİ KARŞILADIM
        const defaultData = {
            id: socket.id,
            position:{
                x:0,
                y:0 //burada id posistiondatayı ve name in hepsini bir data altından gönderdim
            },
            color:randomColor()
        }

        const userData = Object.assign(data, defaultData);
        //users.push(userData);//burada ise tüm userları ekledim
        users[socket.id] = userData;
        console.log(users);
        socket.broadcast.emit('newUser', users[socket.id]);
        socket.emit('initPlayers', users);
    });
    
    socket.on('disconnect',()=>{
        socket.broadcast.emit('disUser',users[socket.id]);
    }); //kim cıktıysa onla ilgili datayı aldım

    socket.on('animate', (data)=>{
        try {
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;

            socket.broadcast.emit('animate',{
            socketId:socket.id,
            x:data.x,
            y:data.y
            });
      
        } catch (error) {
            console.log(error);
        }
        
    socket.on('newMessage',data=>{
        const messageData = Object.assign({socketId: socket.id},data);
        socket.broadcast.emit('newMessage',messageData);
    })
});
});

module.exports = socketApi;