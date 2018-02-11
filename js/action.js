var gradients = [
  { start: [251,202,203], stop: [247,150,151] },
  // { start: [244,214,195], stop: [235,173,135] },
  { start: [244,224,191], stop: [233,193,129] },
  { start: [190,218,207], stop: [124,180,159] },
  { start: [197,222,229], stop: [141,190,205] }
];

var transition_time = 2;
var currentIndex = 0;
var nextIndex = 1;
var steps_count = 0;
var steps_total = Math.round(transition_time*60);

var rgb_steps = {
  start: [0,0,0],
  stop: [0,0,0]
};
var rgb_values = {
  start: [0,0,0],
  stop: [0,0,0]
};
var div_style = document.body.style;
var prefixes = ["-webkit-","-moz-","-o-","-ms-",""];
var color1, color2;

function set_next(num) {
  return (num + 1 < gradients.length) ? num + 1 : 0;
}
function calc_step_size(a,b) {
  return (a - b) / steps_total;
}
function calc_steps() {
  for (var key in rgb_values) {
    if (rgb_values.hasOwnProperty(key)) {
      for(var i = 0; i < 3; i++) {
        rgb_values[key][i] = gradients[currentIndex][key][i];
        rgb_steps[key][i] = calc_step_size(gradients[nextIndex][key][i],rgb_values[key][i]);
      }
    }
  }
}

function updateGradient(){
  for (var key in rgb_values) {
    if (rgb_values.hasOwnProperty(key)) {
      for(var i = 0; i < 3; i++) {
        rgb_values[key][i] += rgb_steps[key][i];
      }
    }
  }

  var t_color1 = "rgb("+(rgb_values.start[0] | 0)+","+(rgb_values.start[1] | 0)+","+(rgb_values.start[2] | 0)+")";
  var t_color2 = "rgb("+(rgb_values.stop[0] | 0)+","+(rgb_values.stop[1] | 0)+","+(rgb_values.stop[2] | 0)+")";

  if (t_color1 != color1 || t_color2 != color2) {

    // update cols strings
    color1 = t_color1;
    color2 = t_color2;

    div_style.background="linear-gradient(to bottom, "+color1+" 0%,"+color2+" 100%)";
    for (var i = 0; i < 4; i++) {
      div_style.backgroundImage = prefixes[i]+"linear-gradient(to bottom, "+color1+" 0%,"+color2+" 100%)";
    }
  }
    steps_count++;
    if (steps_count > steps_total) {
      return;
  }

    if (div_style.backgroundImage.indexOf("gradient") != -1) {
    window.requestAnimationFrame(updateGradient)
  }
}


function nextpage(){
  document.getElementById("buttons").style.opacity="0.8";
  steps_count = 0;
  currentIndex = parseInt(document.getElementById("buttons").getAttribute("data-page"));
  nextIndex = currentIndex+1;
  document.getElementById("buttons").setAttribute("data-page",nextIndex);
  calc_steps();
  console.log(currentIndex);
  switch (currentIndex) {
    case 0:{
      lottie.destroy();
      window.requestAnimationFrame(updateGradient);
      document.getElementById("pageOne").style.display="block";
      document.getElementById("pageOne").style.opacity="1";
      $(function () {
        setTimeout(function () {
            document.getElementById("row").style.opacity="1";
            document.getElementById("row").style.visibility="visible";
        }, 2500);
      })
      break;
    }
    case 1:{
      document.getElementById("pageOne").style.opacity="0";
      $(function () {
        setTimeout(function () {
          document.getElementById("pageOne").style.display="none";
          window.requestAnimationFrame(updateGradient);
          document.getElementById("pageTwo").style.display="block";
          document.getElementById("pageTwo").style.opacity="1";
          $(function () {
            setTimeout(function () {
              document.getElementById("wrap").style.opacity="1";
              document.getElementById("wrap").style.visibility="visible";
            }, 2500);
          })
        }, 1000);
      })
      // document.getElementById("pageOne").style.display="none";
      break;
    }
    case 2:{
      document.getElementById("pageTwo").style.opacity="0";
      $(function () {
        setTimeout(function () {
          document.getElementById("pageTwo").style.display="none";
          window.requestAnimationFrame(updateGradient);
          document.getElementById("pageThree").style.display="block";
          document.getElementById("pageThree").style.opacity="1";
          $(function () {
            setTimeout(function () {
              document.getElementById("row-sleep").style.opacity="1";
              document.getElementById("row-sleep").style.visibility="visible";
            }, 2500);
          })
        }, 1000);
      })
      break;
    }
    case 3:{
      break;
    }
    default:
      break;
  }
}
  // document.getElementById("row").style.opacity="1";


function skippart(){

}

document.body.addEventListener("mousemove", function(event) {
    moveCursor(event);
});
var svgCursor = document.getElementById('svg-cursor');
function moveCursor(e) {
  if ((e.clientY>=document.body.clientHeight-30) || (e.clientX>=document.body.clientWidth-30)){
    return;
  }
    var x = e.clientX - 30,
        y = e.clientY - 30;
    svgCursor.setAttribute('style', 'left: ' + x + 'px; top: ' + y + 'px');
    if(e.target.className.animVal!=undefined){
      return;
    }
    if (e.target.className.indexOf('custom-cursor') > -1) {
        switch (e.target.className) {
            case 'custom-cursor custom-cursor--action':
                svgCursor.setAttribute('class', 'svg-cursor svg-cursor__action')
                break;
            case 'custom-cursor custom-cursor--close':
                svgCursor.setAttribute('class', 'svg-cursor svg-cursor__close')
                break;
        }
    } else {
        svgCursor.setAttribute('class', 'svg-cursor');
    }
}


sheep
var sheepHead = document.getElementById('sheep-eating-head');

TweenMax.to(
  sheepHead,
  3.8,
  {
    y: '45px',
    x: '-7px',
    rotation: -40,
    transformOrigin: 'center center',
    yoyo: true,
    ease: Power1.easeInOut,
    repeat: -1
  }
)


// page two


var sleep = document.getElementById('sleep-1');
var sleep2 = document.getElementById('sleep-2');
var sleep3 = document.getElementById('sleep-3');
var sheepHead = document.getElementById('sheep-head');

var timeline = new TimelineMax({
  onComplete: function() {
    this.restart();
  }
});

var from = {
             rotation: '-20',
             transformOrigin: '50% 50%',
             ease: Power1.easeInOut
           };

var to =  {
            rotation: '20',
            transformOrigin: '50% 50%',
            repeat: -1,
            yoyo: true,
            ease: Power1.easeInOut
          }

TweenMax.fromTo(sheepHead, 1.3, from, to);

timeline
       .to(sleep, 2.5, { scale: 1.3, y: '-50px', ease: Power1.easeOut })
       .to(sleep, 0.8, { opacity: 0, ease: Power1.easeInOut }, '-=2')
       .to(sleep2, 3, { scale: 1.4, y: '-70px', ease: Power1.easeOut }, '-=2.1')
       .to(sleep2, 0.7, { opacity: 0, ease: Power1.easeInOut }, '-=2.5')
       .to(sleep3, 3, { scale: 1.5, y: '-80px', ease: Power1.easeOut }, '-=2.8')
       .to(sleep3, 0.6, { opacity: 0, ease: Power1.easeInOut }, '-=2.4' )
