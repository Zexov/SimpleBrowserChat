// eslint-disable-next-line no-undef
const socket = io();

const chatCont = document.getElementById('chatBox');

function newChatMessage(payload) {
  const parent = document.createElement('div');
  parent.classList.add('columns');

  const nameCont = document.createElement('span');
  // nameCont.classList.add('column');
  nameCont.classList.add(
    'column',
    'is-1',
    'center-align',
    'chat-name',
    'is-gapless'
  );
  nameCont.style.color = payload.color;
  nameCont.textContent = `${payload.username}:`;

  const messageCont = document.createElement('div');
  messageCont.classList.add('column', 'chat-msg', 'center-align');
  messageCont.innerHTML = payload.content;

  parent.appendChild(nameCont);
  parent.appendChild(messageCont);

  return parent;
}

socket.on('payload', (payload) => {
  const newChatEle = newChatMessage(payload);
  chatCont.appendChild(newChatEle);
});

socket.on('allEmoteNames', (allEmoteNames) => {
  console.log(allEmoteNames);
});
