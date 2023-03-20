const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
console.log(battleZonesData)



canvas.width = 1024;
canvas.height = 576;

const collisionsMap = []
for (let i = 0; i < collisions.length; i += 70){
    collisionsMap.push(collisions.slice(i,70 + i))

}

const battleZonesMap = []
for (let i = 0; i < battleZonesData.length; i += 70){
    battleZonesMap.push(battleZonesData.slice(i,70 + i))

}

const charactersMap = []
for (let i = 0; i < charactersMapData.length; i += 70){
    charactersMap.push(charactersMapData.slice(i,70 + i))

}


console.log(battleZonesMap)

const boundaries = []
const offset = {
    x: -977,
    y: -600
}

collisionsMap.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        if (symbol === 1025){
        boundaries.push(
            new Boundary({
            position:{
                x:j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y

            }

        }))
    }
    })
})

console.log(boundaries)

const battleZones = []

battleZonesMap.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        if (symbol === 1025){
        battleZones.push(
            new Boundary({
            position:{
                x:j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y

            }

        }))
    }
    })
})
const characters = []
const villagerImg = new Image()
villagerImg.src = './img/villager/Idle.png'
const redNinjaImg = new Image()
redNinjaImg.src = './img/redNinja/Idle.png'
charactersMap.forEach((row, i) =>{
    row.forEach((symbol, j) =>{
        if (symbol === 1026){
            boundaries.push(
                new Boundary({
                    position:{
                        x:j * Boundary.width + offset.x,
                        y: i * Boundary.height + offset.y
        
                    }
        
                })
            )
        characters.push(
            new Character({
            position:{
                x:j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y

            },
            image:villagerImg,
            frames: {
                max:4,
                hold:10
            },
            scale:3,
            animate:true,
            dialogue:['...', 'Hey mister, have you seen my cosmog???']

        }))

        //1031 === red ninja
    }else if (symbol === 1031){
        boundaries.push(
            new Boundary({
                position:{
                    x:j * Boundary.width + offset.x,
                    y: i * Boundary.height + offset.y
    
                }
    
            })
        )
        characters.push(
            new Character({
            position:{
                x:j * Boundary.width + offset.x,
                y: i * Boundary.height + offset.y

            },
            image:redNinjaImg,
            frames: {
                max:4,
                hold:10
            },
            scale:3,
            animate:true,
            dialogue:['im tired']

        }))
    }
    })
})

console.log(battleZones )

const image = new Image();
image.src = './img/gamemap.png';

const foregroundImage = new Image();
foregroundImage.src = './img/foregroundObjects.png';


const playerDownImage = new Image();
playerDownImage.src = './img/playerDown.png';

const playerUpImage = new Image();
playerUpImage.src = './img/playerUp.png';
const playerLeftImage = new Image();
playerLeftImage.src = './img/playerLeft.png';
const playerRightImage = new Image();
playerRightImage.src = './img/playerRight.png';

 //image.onload = () =>{
  //   c.drawImage(image, -977, -600);
  //   c.drawImage(
  //       playerImage,
  //        0,
  //        0,
  //        playerImage.width / 4,
  //        playerImage.height,
  //        canvas.width / 2 - (playerImage.width / 4) / 2,
  //        canvas.height / 2 - playerImage.height / 2,
  //        playerImage.width / 4,
  //        playerImage.height);
 //}




const player = new Sprite({ 
    position:{
        x:canvas.width / 2 - 192 / 4 / 2,
        y:canvas.height / 2 - 68 / 2
    },
    image: playerDownImage,
    frames: {
        max:4,
        hold:10
    },
    sprites:{
        up: playerUpImage,
        left: playerLeftImage,
        down: playerDownImage,
        right: playerRightImage,
    }
})
console.log(player)


const background = new Sprite({
    position:{
        x: -977,
        y:-600
    }, 
    image: image
})

const foreground = new Sprite({
    position:{
        x: -977,
        y:-600
    }, 
    image: foregroundImage
})

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}



const movables = [background,...boundaries, foreground, ...battleZones, ...characters]
const renderables = [background, ...boundaries, ...battleZones, ...characters, player,foreground]


const battle = {
    initiated : false,

}

function animate(){
   const animationId =  window.requestAnimationFrame(animate)
   
    //console.log('animate')
    //c.drawImage(image, -977, -600);
   


    
    renderables.forEach(renderable => {

        renderable.draw()

      
    })
    
 
    let moving = true
    player.animate = false
    //console.log(animationId)
    if(battle.initiated) return

    //activate the battle
  if(keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed){
    for(let i = 0; i < battleZones.length; i++){
        const battleZone = battleZones[i]
        const overlappingArea = (Math.min(player.position.x + player.width, battleZone.position.x + battleZone.width ) - Math.max(player.position.x, battleZone.position.x)) * (Math.min(player.position.y + player.height, battleZone.position.y + battleZone.height) - Math.max(player.position.y, battleZone.position.y))
        if(
            rectangularCollision({
                rectangle1:player,
                rectangle2: battleZone
            }) &&
            overlappingArea > (player.width * player.height) / 2
            && Math.random() < 0.05
        ){
            console.log("activate battle")
             //activate current animation loop
             window.cancelAnimationFrame(animationId)

             audio.Map.stop()
             audio.initBattle.play()
             audio.battle.play()
            battle.initiated = true
            gsap.to('#overlappingDiv', {
                opacity: 1,
                repeat:3,
                yoyo: true,
                duration:0.4,
                onComplete(){
                    gsap.to('#overlappingDiv', {
                        opacity: 1,
                        duration:0.4,
                        onComplete(){
                            //activate a new animation loop
                            initBattle()
                    animateBattle()
                    gsap.to('#overlappingDiv', {
                        opacity: 0,
                        duration:0.4,
                       
                    })
                        }
                    })

                    
                    
                   
                }
            })
            break
        }
    }
  }


        
 
         if(keys.w.pressed && lastKey === 'w') {
            player.animate = true
            player.image = player.sprites.up



            checkForCharacterCollision({characters:characters, player:player, characterOffset: {x:0,y:3}})
            
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1:player,
                        rectangle2:{...boundary, position:{
                            x: boundary.position.x, 
                            y: boundary.position.y + 3
                        }}
                    })
                ){
                    //console.log('colliding')
                    moving = false
                    break
                }
            }

           

            if (moving)
                movables.forEach(movable =>{movable.position.y += 3})
            
         }else if(keys.a.pressed  && lastKey === 'a'){
            player.animate = true
            player.image = player.sprites.left


            checkForCharacterCollision({characters:characters, player:player, characterOffset: {x:3,y:0}})
           

            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1:player,
                        rectangle2:{...boundary, position:{
                            x: boundary.position.x + 3, 
                            y: boundary.position.y
                        }}
                    })
                ){
                    //console.log('colliding')
                    moving = false
                    break
                }
            }

            if (moving)
                movables.forEach(movable =>{movable.position.x += 3})
            
         }else if(keys.s.pressed  && lastKey === 's'){
            player.animate = true
            player.image = player.sprites.down


            checkForCharacterCollision({characters:characters, player:player, characterOffset: {x:0,y:-3}})

            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1:player,
                        rectangle2:{...boundary, position:{
                            x: boundary.position.x, 
                            y: boundary.position.y - 3
                        }}
                    })
                ){
                   // console.log('colliding')
                    moving = false
                    break
                }
            }

            if (moving)
            movables.forEach(movable =>{movable.position.y -= 3})
         }else if(keys.d.pressed  && lastKey === 'd'){
            player.animate = true
            player.image = player.sprites.right

            checkForCharacterCollision({characters:characters, player:player, characterOffset: {x:-3,y:0}})
            for(let i = 0; i < boundaries.length; i++){
                const boundary = boundaries[i]
                if(
                    rectangularCollision({
                        rectangle1:player,
                        rectangle2:{...boundary, position:{
                            x: boundary.position.x - 3, 
                            y: boundary.position.y
                        }}
                    })
                ){
                   // console.log('colliding')
                    moving = false
                    break
                }
            }

            if (moving)
            movables.forEach(movable =>{movable.position.x -= 3})
         }
}
//animate();





let lastKey = ''

window.addEventListener('keydown', (e) =>{
    if(player.isInteracting){
        switch(e.key){
            case ' ':
                player.interactionAsset.dialogueIndex++
                const {dialogueIndex, dialogue} = player.interactionAsset   
                if (dialogueIndex <= dialogue.length - 1){
                    console.log()
                    document.querySelector('#characterDialogueBox').innerHTML = player.interactionAsset.dialogue[player.interactionAsset.dialogueIndex]
                    return

                }
                player.isInteracting = false
                player.interactionAsset.dialogueIndex = 0
                document.querySelector('#characterDialogueBox').style.display = 'none'

                
                
                break
        }
       
        return
    }
    
    switch (e.key){
        case ' ':
            if(!player.interactionAsset) return
            const firstMessage = player.interactionAsset.dialogue[0]
            console.log(firstMessage)
            document.querySelector('#characterDialogueBox').innerHTML = firstMessage
            document.querySelector('#characterDialogueBox').style.display = 'flex'
            player.isInteracting = true
            console.log("space")

           
            break



case 'w' :{
           keys.w.pressed = true
           lastKey = 'w'
           break
    }
case 'a' :{
        keys.a.pressed  = true
        lastKey = 'a'
        break
}
case 's' :{
   keys.s.pressed  = true
   lastKey = 's'
   break
}
case 'd' :{
    keys.d.pressed  = true
    lastKey = 'd'
    break
}

}
console.log(keys)})

window.addEventListener('keyup', (e) =>{
   
    switch (e.key){

      

case 'w' :{
           keys.w.pressed = false
           break
    }
case 'a' :{
        keys.a.pressed  = false
        break
}
case 's' :{
   keys.s.pressed  = false
   break
}
case 'd' :{
    keys.d.pressed  = false
    break
}

}
console.log(keys)})
let clicked = false
addEventListener('click', () =>{
    if(!clicked){  audio.Map.play()
    clicked = true}
  
})