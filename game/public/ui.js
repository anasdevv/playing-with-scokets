let wHeight = $(window).height();
let wWidth = $(window).width();
let player = {};
let orbs = [];
let players = [];

let canvas = document.querySelector('#the-canvas ');

let context = canvas.getContext('2d');
canvas.width = wWidth;
canvas.height = wHeight;

$(window).on('load', () => {
  console.log('here');
  $('#loginModal').modal('show');
});
$('.name-form').submit((event) => {
  event.preventDefault();
  console.log('submitted');
  player.name = document.querySelector('#name-input').value;
  $('#loginModal').modal('hide');
  $('#spawnModal').modal('show');
  document.querySelector('.player-name').innerHTML = player.name;
});

$('.start-game').click((event) => {
  $('.modal').modal('hide');
  $('.hiddenOnStart').removeAttr('hidden');
  init();
});
