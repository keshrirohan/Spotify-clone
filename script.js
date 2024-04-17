// async function main(){
// let a=await fetch("http://127.0.0.1:5500/music/");
// console.log(a);
// let response=await a.text();
// console.log(response);
// let div=document.createElement("div");
// div.innerHTML= response;
// let lis=div.getElementsByTagName("li");
// console.log(lis);
// let songs=[];
// for(let index=0;index<lis.length;index++){
//     const element=lis[index];
//     console.log(element.href)
// }
// // console.log(songs);
// }
// main();x     

let currentsong = new Audio();
async function getsong() {
  let a = await fetch("http://127.0.0.1:5500/music/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  console.log(response);
  let lis = div.getElementsByTagName("a");
  let song = [];
  for (let i = 0; i < lis.length; i++) {
    const element = lis[i];
    // Clone the element to ensure href attribute remains unchanged
    if (element.href.endsWith(".mp3")) {
      song.push(element.href);
    }
  }
  return song;
}
const playsong = (song) => {
  document.querySelector(".songinfo").innerText = song;
  currentsong.src = "/music/" + song;
  currentsong.play();
  document.querySelector("#playpause").classList.replace("fa-play", "fa-pause");
  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".duration").innerText = `${sectomin(
      currentsong.currentTime
    )} / ${sectomin(currentsong.duration)}`;
    // console.log((currentsong.currentTime/currentsong.duration)*99 + "%");
    document.querySelector(".dot").style.left = (currentsong.currentTime/currentsong.duration)*98.7 + "%";
  });
};

let sectomin = (data) => {
  let minutes = Math.floor(data / 60);
  let second = Math.floor(data % 60);
  if(minutes<10 || second<10){
    if(minutes<10){
      value = `0${minutes}:${second}`;
    }
    if(second<10){
      value = `${minutes}:0${second}`;
    }
    if(minutes<10 && second<10){
      value = `0${minutes}:0${second}`;
    }
  }
  return value;
};

async function showsong() {
  let songs = await getsong();
  console.log(songs);
  let songlist = document.querySelectorAll(".songlist")[0];
  for (const song of songs) {
    songlist.innerHTML =
      songlist.innerHTML +
      ` <div class="song-detail  flex "><i class="fa-solid fa-music"></i><div class="song-name">${song
        .slice(28)
        .replaceAll("%20", " ")}</div><i class="fa-solid fa-play"></i></div>`;
  }

  songlist.querySelectorAll(".song-detail").forEach((e) => {
    e.addEventListener("click", () => {
      let playingsong = e.querySelector(".song-name");
      playsong(e.querySelector(".song-name").textContent.trim());
    });
  });

  //play pause song
  document.querySelector("#playpause").addEventListener("click", () => {
    console.log("hi");
    if (currentsong.paused) {
      currentsong.play();
      document
        .querySelector("#playpause")
        .classList.replace("fa-play", "fa-pause");
    } else {
      currentsong.pause();
      console.log("ny chal");
      document
        .querySelector("#playpause")
        .classList.replace("fa-pause", "fa-play");
    }
  });


  //seekbar
  document.querySelector(".playing-bar").addEventListener("click",e=>{
    console.log(e.offsetX,e.target.getBoundingClientRect().width);
    let target=(e.offsetX/e.target.getBoundingClientRect().width)*98.7;
    console.log(target +"%");
    document.querySelector(".dot").style.left= target + "%";
    console.log(document.querySelector(".dot").style.left);
    console.log((target * currentsong.duration)/99)
    currentsong.currentTime= (target * currentsong.duration)/99;
  })

}
showsong();
