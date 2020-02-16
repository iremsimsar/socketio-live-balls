const colors = ['blue','green','red'];

const randomColor = () =>{
    return colors[Math.floor(Math.random()*colors.length)];//randoom bir sayı ürettim 
};


module.exports = randomColor;
