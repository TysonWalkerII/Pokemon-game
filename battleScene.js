const battleBackgroundImage = new Image()
battleBackgroundImage.src = "./img/battleBackground.png"
const battleBackground = new Sprite({position: {
    x:0,
    y:0,
}, image: battleBackgroundImage})


let draggle 


let emby = new Monster(monsters.Emby)

let renderedSprites


let battleAnimationId
let queue

function initBattle(){
    document.querySelector('#userInterface').style.display  = 'block'
    document.querySelector('#dialogueBox').style.display  = 'none'
    document.querySelector('#enemyHealthBar').style.width  = '100%'
    document.querySelector('#playerHealthBar').style.width  = '100%'
    document.querySelector('#playerHealthBar').style.display  = 'block'
    document.querySelector('#attacksBox').replaceChildren()
    draggle = new Monster(monsters.Draggle)
    console.log(draggle.position.y)
    
    emby = new Monster(monsters.Emby)
    renderedSprites = [draggle, emby]
    queue = []

    emby.attacks.forEach((attack) =>{
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    

    //event listeners for the buttons
//console.log(
    document.querySelectorAll("button").forEach((button) =>{
        button.addEventListener("click", (e) =>{
            const selectedAttack = attacks[e.currentTarget.innerHTML]
           // console.log(e.currentTarget.innerHTML)
            
            emby.attack({
              attack: selectedAttack ,
                recipient: draggle,
                renderedSprites
            })
            if(draggle.health <= 0) {
                queue.push(() => {
                   draggle.faint()
                })
                queue.push(() => {
                    gsap.to('#overlappingDiv', {
                        opacity:1,
                        onComplete:() => {
                            window.cancelAnimationFrame(battleAnimationId)
                            animate()
                            document.querySelector('#userInterface').style.display = 'none'
                            gsap.to('#overlappingDiv', {
                                opacity:0
                            })
                            battle.initiated = false
                            audio.Map.play()
                        }
                    })
                 })
            }
            //draggle or enemy attacks
            const randomAttack = draggle.attacks[Math.floor(Math.random() * draggle.attacks.length)]

            queue.push(() => {
                draggle.attack({
                    attack: randomAttack ,
                      recipient: emby,
                      renderedSprites
                  })
                  if(emby.health <= 0) {
                    queue.push(() => {
                       emby.faint()
                    })
                    queue.push(() => {
                        gsap.to('#overlappingDiv', {
                            opacity:1,
                            onComplete:() => {
                                window.cancelAnimationFrame(battleAnimationId)
                                animate()
                                document.querySelector('#userInterface').style.display = 'none'
                                gsap.to('#overlappingDiv', {
                                    opacity:0
                                })
                                battle.initiated = false
                                audio.Map.play()
                            }
                        })
                     })

                }
            })
            
        })
        button.addEventListener('mouseenter', (e) =>{
            const selectedAttack = attacks[e.currentTarget.innerHTML]
            document.querySelector('#attackType').innerHTML = selectedAttack.type
            document.querySelector('#attackType').style.color = selectedAttack.color
           // console.log('go')
        })
    })
//)
}

function animateBattle(){
 battleAnimationId = window.requestAnimationFrame(animateBattle)
    
    battleBackground.draw()

    //console.log(battleAnimationId)
    
    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
    
    //console.log("animating battle   ")
}
animate()
//initBattle()
//animateBattle()




document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if(queue.length>0){
        queue[0]()
            queue.shift()
        
    }else{
        e.currentTarget.style.display = 'none'
    }
    
    //console.log("clicked dialogue")
})