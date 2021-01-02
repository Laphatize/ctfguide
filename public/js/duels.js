/*
  Copyright Pranav Ramesh 2020
*/

function fadeOutEffect() {
    var fadeTarget = document.getElementById("loader");
    var fadeEffect = setInterval(function () {
        if (!fadeTarget.style.opacity) {
            fadeTarget.style.opacity = 1;
        }
        if (fadeTarget.style.opacity > 0) {
            fadeTarget.style.opacity -= 0.1;
        } else {
            clearInterval(fadeEffect);
        }
    }, 100)
 
   
}   



setTimeout(function() {
    document.getElementById("rules").style.display = "block";   

    fadeOutEffect()
    showRules() 
}, 3000)
