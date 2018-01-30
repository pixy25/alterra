(function () {
  var questions = [];
  var MessageComponent = {
    template: '' +
    '<div class="alterra-chat-message-content alterra-clearfix">\n' +
    '  <p class="alterra-message-text"></p>\n' +
    '</div>\n',
    create: function (from, msg) {
      var messageElem = document.createElement('div');
      messageElem.innerHTML = this.template;
      messageElem.className += ('alterra-chat-message clearfix');
      messageElem.getElementsByClassName('alterra-chat-message-content')[0].className += ' alterra-message-from-' + from;
      messageElem
        .getElementsByClassName('alterra-message-text')[0]
        .appendChild(document.createTextNode(msg));
      return messageElem;
    },
  };
  var PromptButton = {
    template: '' +
    '  <svg x="0px" y="0px" viewBox="0 0 27 21.9" aria-labelledby="title desc" role="img">\n' +
    '    <title>Chat Icon</title>\n' +
    '    <desc>three small dots to indicate that an agent is available to chat</desc>\n' +
    '    <path fill="#ffffff"\n' +
    '          d="M23.2,0L2.6,1.7C1,1.9,0,3.2,0,4.9v8c0,1.6,0.8,3,2.4,3.1l5.3,0.5c0,0,1,1.6,0.3,3.2C7.2,21.3,6,21.9,6,21.9 c4.2,0,6.6-3.1,7.8-4.9l9.4,0.7c1.8,0.2,3.8-1.3,3.8-3.1V3.1C27,1.3,25-0.1,23.2,0z M6.4,10.1c-0.9,0-1.7-0.7-1.7-1.7 c0-0.9,0.7-1.7,1.7-1.7C7.3,6.8,8,7.5,8,8.5C8,9.4,7.3,10.1,6.4,10.1z M13.2,10.1c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7 c0.9,0,1.7,0.7,1.7,1.7C14.8,9.4,14.1,10.1,13.2,10.1z M19.9,10.1c-0.9,0-1.7-0.7-1.7-1.7c0-0.9,0.7-1.7,1.7-1.7 c0.9,0,1.7,0.7,1.7,1.7C21.6,9.4,20.9,10.1,19.9,10.1z">\n' +
    '    </path>\n' +
    '  </svg>\n' +
    '  <p class="alterra-chat-button-text">Ask our bot</p>',
    render: function () {
      var body = document.getElementsByTagName('body')[0];
      var widget = document.createElement('a');
      widget.id = "alterra-chat-button";
      widget.setAttribute('href', '#');
      widget.innerHTML = this.template;
      this.widget = widget;
      body.appendChild(widget);
    },
    hide: function () {
      this.widget.style.display = 'none';
    },
    show: function () {
      this.widget.style.display = 'block';
    }
  };
  var AnswerSubmitPrompt = {
    template: '' +
    '  <header class="alterra-clearfix">\n' +
    '    <a href="#" class="alterra-chat-close" id="alterra-chat-close">x</a>\n' +
    '    <p class="alterra-chat-title">Chat with us</p>\n' +
    '  </header>\n' +
    '  <div class="alterra-chat">\n' +
    '    <div class="alterra-chat-history">\n' +
    '    </div>' +
    '    <div class="alterra-actions">' +
    '    <form id="alterra-chat-bot-form">\n' +
    '      <fieldset class="alterra-chat-bot-input-wrapper">\n' +
    '        <input id="alterra-chat-bot-input" type="text" placeholder="Type your message…" autofocus>\n' +
    '        <input type="hidden">\n' +
    '      </fieldset>\n' +
    '    </form>\n' +
    '    <div class="alterra-button-wrapper">\n' +
    '      <button class="alterra-chat-action-button" id="alterra-button-ok">OK</button>\n' +
    '      <button class="alterra-chat-action-button" id="alterra-back-to-default">Chat with human</button>\n' +
    '    </div>\n' +
    '    </div>' +
    '  </div>\n',
    render: function () {
      var body = document.getElementsByTagName('body')[0],
          widget = document.createElement('div'),
          styleElem = document.createElement('link');
      styleElem.setAttribute('rel', 'stylesheet');
      styleElem.setAttribute('href', 'https://next.alterra.ai/dev/outpost/static/alterra-widgit.css');
      widget.id = 'alterra-live-chat';
      widget.innerHTML = this.template;
      body.appendChild(styleElem);
      body.appendChild(widget);
      this.widget = widget;
      this.hide();
      this.addMessage('bot', 'Hi! I\'ll be happy to answer your questions');
    },
    addMessage: function (from, msg) {
      var msgComponent = MessageComponent.create(from, msg);
      var wrapper = document.getElementsByClassName('alterra-chat-history')[0];
      wrapper.appendChild(msgComponent);
      wrapper.scrollTop = wrapper.scrollHeight;
    },
    hide: function () {
      this.widget.style.display = 'none';
    },
    show: function () {
      this.widget.style.display = 'block';
    }
  };
  var API = api();

  function api() {
    var IFRAME_ID = randomString(32),
        DOMAIN = 'https://demo.alterra.ai',
        API_URL = DOMAIN + '/dev/outpost/static/apiBindingFrame.html',
        alterraFaqElem = document.getElementById('alterra-faq'),
        authorization = alterraFaqElem.dataset.productId || '58ff4db3a1c03200016465f5208e6097108f4a5777d4979d311316bb';
    return {
      connection: function () {
        return window.frames[IFRAME_ID]
      },
      postQuestion: function (question) {
        this.connection().postMessage(
          JSON.stringify({
            question: question,
            authorization: authorization
          }),
          API_URL
        )
      },
      createConnection: function () {
        var body = document.getElementsByTagName('body')[0];
        var frame = document.createElement('iframe');
        frame.setAttribute('src', API_URL);
        frame.setAttribute('name', IFRAME_ID);
        frame.style.display = "none";
        body.appendChild(frame);
      }
    };
  }

  function receiveMessage (msg) {
    if (msg.origin !== API.DOMAIN) return;
    var answer = msg.data || 'Sorry, I can\'t answer your question';
    AnswerSubmitPrompt.addMessage('bot', answer);
  }

  function init () {
    API.createConnection();
    AnswerSubmitPrompt.render();
    PromptButton.render();
  }

  function getForm () {
    var alterraFaqElem = document.getElementById('alterra-faq');
    return alterraFaqElem.parentNode;
  }

  function getTextbox() {
    var formElem = getForm (),
        textAreas = formElem.getElementsByTagName('textarea');
    return textAreas[0];
  }

  function getQuestion () {
    return getTextbox().value;
  }

  function randomString (len) {
    return Array
      .from(new Array(Math.floor(len / 10) + 1).keys())
      .map(function () {return Math.random().toString(36).slice(2)})
      .join()
      .slice(0, len)
  }

  function onSubmit (e) {
    e.preventDefault();
    var question = getQuestion();
    getTextbox().value = '';
    questions.push(question);
    PromptButton.hide();
    AnswerSubmitPrompt.addMessage('me', question);
    AnswerSubmitPrompt.show();
    API.postQuestion(question);
    return false
  }

  function dynamicBindEvent (event, id, callback) {
    document.addEventListener(event, function(e) {
      if (e.target && e.target.id === id) {
        callback(e)
      }
    })
  }

  document.addEventListener("DOMContentLoaded",
    function () {
      init();
      var formElem = getForm();
      document.getElementById('alterra-chat-button').addEventListener('click', function (e) {
        e.preventDefault();
        PromptButton.hide();
        AnswerSubmitPrompt.show();
        formElem.addEventListener('submit', onSubmit, true)
      });
      dynamicBindEvent('click', 'alterra-back-to-default', function(e) {
        e.preventDefault();
        AnswerSubmitPrompt.hide();
        PromptButton.show();
        getTextbox().value = questions.join('\n');
        formElem.removeEventListener('submit', onSubmit, true);
        setTimeout(function () {formElem.dispatchEvent(new Event('submit'));});
      });
      dynamicBindEvent('click', 'alterra-chat-close', function (e) {
        e.preventDefault();
        AnswerSubmitPrompt.hide();
        PromptButton.show();
      });
      dynamicBindEvent('submit', 'alterra-chat-bot-form', function (e) {
        e.preventDefault();
        var input = document.getElementById('alterra-chat-bot-input');
        var question = input.value;
        AnswerSubmitPrompt.addMessage('me', question);
        API.postQuestion(question);
        input.value = '';
      });
      window.addEventListener('message', receiveMessage);
      formElem.addEventListener('submit', onSubmit, true);
    });
})();